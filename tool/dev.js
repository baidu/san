
var os = require('os');
var path = require('path');
var watch = require('watch');
var colors = require('colors');
var opener = require('opener')
var httpServer = require('http-server');

var logger = {
    info: console.log,
    request: function (req, res, error) {
        var date = utc ? new Date().toUTCString() : new Date();
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

var cwd = process.cwd();
var port = 8527;
var host = '0.0.0.0';
var options = {
    root: cwd,
    cache: false,
    showDir: true,
    autoIndex: true
};

var server = httpServer.createServer(options);
server.listen(port, host, function () {
    var canonicalHost = host === '0.0.0.0' ? '127.0.0.1' : host;
    var protocol      = 'http://';

    logger.info(['Starting up http-server, serving '.yellow,
      server.root.cyan,
      '\nAvailable on:'.yellow
    ].join(''));

    var firstFace;
    var ifaces = os.networkInterfaces();
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
    logger.info(('demo - ' + firstFace + '/example/todos-amd/index.html').green);
    logger.info(('perf - ' + firstFace + '/example/todos-amd/index-perf.html').green);

    logger.info('\nHit CTRL-C to stop the server');
    opener(firstFace + '/test/');


    watch.watchTree(
        cwd,
        {
            filter: function (name) {
                var relativePath = path.relative(cwd, name);
                return relativePath.indexOf('src') === 0
                    || relativePath === 'package.json';
            }
        },
        function (f, curr, prev) {
            if (typeof f == "object" && prev === null && curr === null) {
                // Finished walking the tree
            }
            else {
              console.log(f) // f was changed
            }
        }
    );


});
