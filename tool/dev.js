
const os = require('os');
const path = require('path');
const fs = require('fs');
const colors = require('colors');
const opener = require('opener')
const httpServer = require('http-server');
const { spawn } = require('child_process');

let logger = {
    info: console.log,
    request: function (req, res, error) {
        let date = utc ? new Date().toUTCString() : new Date();
        if (error) {
            logger.info(
                '[%s] "%s %s" Error (%s): "%s"',
                date, req.method.red, req.url.red,
                error.status.toString().red, error.message.red
            );
        }
        else {
            logger.info(
                '[%s] "%s %s" "%s"',
                date, req.method.cyan, req.url.cyan,
                req.headers['user-agent']
            );
        }
    }
};

let cwd = process.cwd();
let port = 8527;
let host = '0.0.0.0';
let options = {
    root: cwd,
    cache: false,
    showDir: true,
    autoIndex: true
};

let srcDir = path.resolve(__dirname, '../src');

let server = httpServer.createServer(options);

let pretest = spawn('npm', ['run', 'pretest']);
pretest.stderr.on('data', data => {
    console.log(`${data}`);
});

pretest.on('close', code => {
    server.listen(port, host, function () {
        let canonicalHost = host === '0.0.0.0' ? '127.0.0.1' : host;
        let protocol      = 'http://';

        logger.info(['Starting up http-server, serving '.yellow,
          server.root.cyan,
          '\nAvailable on:'.yellow
        ].join(''));

        let firstFace;
        let ifaces = os.networkInterfaces();
        Object.keys(ifaces).forEach(function (dev) {
            ifaces[dev].forEach(function (details) {
                if (!firstFace) {
                    firstFace = protocol + details.address + ':' + port;
                }

                if (details.family === 'IPv4') {
                    logger.info(('  ' + protocol + details.address + ':' + port).green);
                }
            });
        });

        logger.info('\nDev pages:'.yellow);
        logger.info(('test - ' + firstFace + '/test/').green);
        logger.info(('test[reverse] - ' + firstFace + '/test/index-reverse.html').green);
        logger.info(('test[min] - ' + firstFace + '/test/index-min.html').green);
        logger.info(('demo - ' + firstFace + '/example/todos-amd/index.html').green);
        logger.info(('perf - ' + firstFace + '/example/todos-amd/index-perf.html').green);

        logger.info('\nWatch src change, build when file changed.');
        logger.info('Hit CTRL-C to stop the server');

        // opener(firstFace + '/test/');

    });

    fs.watch(
        srcDir,
        {
            persistent: true,
            recursive: true
        },
        (eventType, filename) => {
            let now = new Date();
            logger.info(`Build on ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);

            let pretest = spawn('npm', ['run', 'pretest']);

            pretest.stderr.on('data', data => {
                console.log(`${data}`);
            });

            pretest.on('close', code => {
                if (code === 0) {
                    let waste = (new Date) - now;
                    logger.info(`Builded, use ${waste}ms`);
                }
            });
        }
    );
});


