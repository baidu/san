/**
 * @file 测试 runner
 *
 * @description
 *     跑测试前，启动 selenium-standalone start
 *
 * @example
 *
 * 点击:
 *     WDBridge.send('action', 'click:#' + myComponent.id);
 * 输入:
 *     WDBridge.send('action', 'addValue:#' + input.id + '|added1');
 */

var path = require('path');
var httpServer = require('http-server');
var webdriverio = require('webdriverio');

// start server
var server = httpServer.createServer({
    root: path.resolve(__dirname, '../../')
}).listen(8800);

process.on('exit', function() {
    server && server.close();
});

process.on('uncaughtException', function (err) {
    console.log(err);
    process.exit(1);
});

// config webdriverio
var devices = require('./devices').get(process.argv[2]);

// prmisefy tasks
var promiseTasks = Object.keys(devices).map(function(key) {

    return function (results) {

        return Promise.resolve({
            then: function(resolve) {
                process.stdout.write('# ' + key + ' ');
                startWorker(devices[key], function (res) {
                    resolve(results.concat(res));
                });
            }
        });

    };

});

// reduce promises
function runSeries(list) {
    var p = Promise.resolve([]);
    return list.reduce(function(pacc, fn) {
        return pacc = pacc.then(fn);
    }, p);
}

// run tasks
runSeries(promiseTasks).then(function(results) {

    var code = 0;

    // print reslut
    console.log('# Summary');
    Object.keys(devices).forEach(function(key, i) {

        var res = results[i];
        console.log([key, res]);

        if (res > 0) {
            code = res;
        }

    });

    // wait client.end()
    setTimeout(function () {
        process.exit(code);
    }, 200);

});

/**
 * 开启一个测试
 *
 * @param  {Object}   device 设备配置
 * @param  {Function} done   回调
 */
function startWorker (device, done) {

    var client = webdriverio.remote(device);

    // report result
    var reportResultRegEx = /^\d+ specs, (\d+) failure/;
    var reportResult;
    var ignoreMsgRegEx = /ConsoleReporter/;

    /**
     * 桥循环
     *
     * @param  {number} timeout    超时时间
     * @param  {string} timeoutMsg 超时信息
     * @param  {number} interval   循环间隔
     * @return {client}            webdrive client
     */
    function bridgeLoop(timeout, timeoutMsg, interval) {

        interval = interval || 10;
        timeoutMsg = timeoutMsg || '这个测试超时了';

        return client
            // .timeoutsAsyncScript(10)
            .executeAsync(function(done) {

                window.WDBridge.nextTick(done);

            }).then(function(ret) {

                var msg = ret.value.message;

                // 获取结果
                var match = reportResultRegEx.exec(msg);
                if (match) {
                    reportResult = match[1] === '0' ? 0 : 1;
                }

                // 正常结束
                if (/^Finished/.test(msg)) {
                    console.log(msg);
                    client.end();
                    workerEnd(reportResult);
                    return;
                }

                // 超时
                if ((timeout -= interval) < 0) {
                    console.log(timeoutMsg);
                    client.end();
                    workerEnd(1);
                    return;
                }

                // 正常 log
                if (msg && !ignoreMsgRegEx.test(msg)) {
                    process.stdout.write(msg);
                }

                // 正常 action
                var action = ret.value.action;

                if (action) {
                    var act = action.split(':');
                    var actName = act[0].trim();
                    var actParams = act[1].trim().split('|');
                    client[actName].apply(client, actParams);
                }

                // 等下一个天亮
                setTimeout(function() {

                    bridgeLoop(timeout, timeoutMsg, interval);

                }, interval);

            });

    }

    client.addCommand('bridgeLoop', bridgeLoop);

    client
        .init()
        .url('http://127.0.0.1:8800/test/')
        .bridgeLoop(1000 * 30); // 30 秒超时

    function workerEnd (code) {
        console.log('===========================');
        done(code);
    }

}
