var fs = require('fs');
var path = require('path');



var fileContent = fs.readFileSync(
    path.resolve(__dirname, '..', 'dist', 'san.source.js'),
    'utf8'
);
var lines = fileContent.split( /\r?\n/ );
var ignoreState = 0;
for (var i = 0, len = lines.length; i < len; i++) {
    var line = lines[i];

    if (ignoreState) {
        if (/\/\/\s*#end-ignore/.test(line)) {
            ignoreState = 0;
        }
        else {
            lines[i] = '//' + line;
        }
    }
    else if (/\/\/\s*#begin-ignore/.test(line)) {
        ignoreState = 1;
    }
}

fs.writeFileSync(
    path.resolve(__dirname, '..', 'dist', 'san.release.js'),
    lines.join('\n'),
    'utf8'
);
