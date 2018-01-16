/**
 * @file build test file
 * @author zhoumin
 */


const san = require('../../dist/san.ssr');
const fs = require('fs');
const path = require('path');

let htmlTpl = fs.readFileSync(path.resolve(__dirname, '../index-ssr.html.tpl'), 'UTF-8');
let html = '';
let specTpls = '';

// generate html
let genHtml = function ({componentClass, componentSource, compontentData, specTpl, dirName, result}) {
    let renderer = san.compileToRenderer(componentClass);
    let id = dirName;

    // in no inject mark, add it
    if (!/\/\/\s*\[inject\]/.test(specTpl)) {
        specTpl = specTpl.replace(/function\s*\([a-z0-9_,$\s]*\)\s*\{/, function ($0) {
            return $0 + '\n// [inject] init';
        });
    }

    let injectHtml = result ? result : renderer(compontentData);

    html += '<div id="' + id + '">'
        + injectHtml
        + '</div>\n\n';

    let preCode = `
        ${componentSource}
        var wrap = document.getElementById('${id}');
        var myComponent = new MyComponent({
            el: wrap.firstChild
        });
    `;
    specTpl = specTpl.replace(/\/\/\s*\[inject\]\s* init/, preCode);
    specTpls += specTpl;
};

let buildFile = function (filePath) {
    let files = fs.readdirSync(filePath);
    let componentClass;
    let componentSource;
    let specTpl;
    let compontentData;
    let dirName;
    let result;
    let sourceFile = '';

    if (!files.length) {
        return;
    }

    files.forEach(filename => {
        // absolute path
        let abFilePath = path.join(filePath, filename);
        let stats = fs.statSync(abFilePath);
        let isFile = stats.isFile();
        let isDir = stats.isDirectory();

        // if it's a file, init some data
        if (isFile) {
            // component file
            if (filename === 'component.js') {
                componentClass = require(abFilePath);
                componentSource = fs.readFileSync(path.resolve(abFilePath), 'UTF-8')
                    .split('\n')
                    .map(line => {
                        if (/(\.|\s)exports\s*=/.test(line)
                            || /san\s*=\s*require\(/.test(line)
                        ) {
                            return '';
                        }

                        return line;
                    })
                    .join('\n');
                sourceFile = filename;
            }
            if (filename === 'spec.js') {
                specTpl = fs.readFileSync(path.resolve(abFilePath), 'UTF-8');
            }
            if (filename === 'data.js') {
                compontentData = require(abFilePath);
            }
            if (filename === 'result.html') {
                result = fs.readFileSync(path.resolve(abFilePath), 'UTF-8').replace('\n', '');
            }
        }

        // iterate
        if (isDir) {
            buildFile(abFilePath);
        }
    });

    let match = filePath.match(/\/([a-z0-9_,$\-]*)$/);
    // dirName is the identity of each component
    dirName = match[1];
    // generate html when it has source file
    if (sourceFile) {
        genHtml({
            componentClass,
            componentSource,
            compontentData,
            specTpl,
            dirName,
            result
        });
    }
};

let writeHtml = function ({htmlTpl, html, specTpls}) {
    let karmaHtml = fs.readFileSync(path.resolve(__dirname, '../karma-context.html.tpl'), 'UTF-8');
    fs.writeFileSync(
        path.resolve(__dirname, '../karma-context.html'),
        karmaHtml.replace('##ssr-elements##', html),
        'UTF-8'
    );

    fs.writeFileSync(
        path.resolve(__dirname, '../index-ssr.html'),
        htmlTpl.replace('##ssr-elements##', html),
        'UTF-8'
    );

    fs.writeFileSync(
        path.resolve(__dirname, 'ssr.spec.js'),
        specTpls,
        'UTF-8'
    );
};

buildFile(path.resolve(__dirname, './'));
// write into html file
writeHtml({htmlTpl, html, specTpls});
