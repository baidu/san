/**
 * @file 在下一个时间周期运行任务
 * @author errorrik(errorrik@gmail.com)
 */

var bind = require('./bind');
var each = require('./each');

/**
 * 下一个周期要执行的任务列表
 *
 * @inner
 * @type {Array}
 */
var nextTasks = [];

/**
 * 执行下一个周期任务的函数
 *
 * @inner
 * @type {Function}
 */
var nextHandler;

/**
 * 在下一个时间周期运行任务
 *
 * @inner
 * @param {Function} fn 要运行的任务函数
 * @param {Object=} thisArg this指向对象
 */
function nextTick(fn, thisArg) {
    if (thisArg) {
        fn = bind(fn, thisArg);
    }
    nextTasks.push(fn);

    if (nextHandler) {
        return;
    }

    nextHandler = function () {
        var tasks = nextTasks.slice(0);
        nextTasks = [];
        nextHandler = null;

        each(tasks, function (task) {
            task();
        });
    };

    if (typeof setImmediate === 'function') {
        setImmediate(nextHandler);
    }
    else if (typeof MessageChannel === 'function') {
        var channel = new MessageChannel();
        var port = channel.port2;
        channel.port1.onmessage = nextHandler;
        port.postMessage(1);
    }
    else {
        setTimeout(nextHandler, 0);
    }
}

exports = module.exports = nextTick;
