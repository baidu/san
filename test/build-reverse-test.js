/**
 * @file build test file
 * @author zhoumin
 */


const fs = require('fs');
const path = require('path');

let htmlTpl = fs.readFileSync(path.resolve(__dirname, 'index-reverse.html.tpl'), 'UTF-8');
let html = '';
let specTpls = '';

// generate html
function genContent({ componentClass, componentSource, compontentData, componentDataLiteral, specTpl, dirName, result}) {
    let id = dirName;
    let noDataOutput = /-ndo$/.test(dirName);
    let noInject = false;

    // if no inject mark, add it
    if (!/\/\/\s*\[inject\]/.test(specTpl)) {
        specTpl = specTpl.replace(/function\s*\([a-z0-9_,$\s]*\)\s*\{/, function ($0) {
            return $0 + '\n// [inject] init';
        });
        noInject = true;
    }

    html += `<div id="${id}">${result}</div>\n\n`;

    let preCode = `
        ${componentSource}
    `;
    if (!noInject) {
        preCode += `        
        var wrap = document.getElementById('${id}');
        var myComponent = new MyComponent({
            el: wrap.firstChild
            `;
        if (noDataOutput) {
            preCode += ',data:' + componentDataLiteral
        }
        preCode += '        });'
    }

    specTpl = specTpl.replace(/\/\/\s*\[inject\]\s* init/, preCode);
    specTpls += specTpl;
};

function buildFile(filePath) {
    let files = fs.readdirSync(filePath);
    let componentClass;
    let componentSource;
    let specTpl;
    let compontentData;
    let componentDataLiteral;
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

        // if it's a file, init data
        if (isFile) {
            switch (filename) {
                case 'component.js':
                    componentClass = require(abFilePath);
                    componentSource = fs.readFileSync(path.resolve(abFilePath), 'UTF-8')
                        .split('\n')
                        .map(line => {
                            if (/(\.|\s)exports\s*=/.test(line)
                                || /san\s*=\s*require\(/.test(line)
                            ) {
                                return '';
                            }

                            if (/^\s*console.log/.test(line)) {
                                return '//' + line;
                            }

                            return line;
                        })
                        .join('\n');
                    sourceFile = filename;
                    break;

                case 'spec.js':
                    specTpl = fs.readFileSync(path.resolve(abFilePath), 'UTF-8').replace('console.log', '//console.log');
                    break;

                case 'data.js':
                    compontentData = require(abFilePath);
                    componentDataLiteral = fs.readFileSync(abFilePath, 'UTF-8');
                    componentDataLiteral = componentDataLiteral
                        .slice(componentDataLiteral.indexOf('{'))
                        .replace(/;\s*$/, '');
                    break;

                case 'data.json':
                    compontentData = require(abFilePath);
                    componentDataLiteral = fs.readFileSync(abFilePath, 'UTF-8');
                    break;

                case 'expected.html':
                    result = fs.readFileSync(path.resolve(abFilePath), 'UTF-8').replace('\n', '');
                    break;
            }

        }

        // iterate
        if (isDir) {
            console.log(`[Build Reverse Spec] ${filename}`);
            buildFile(abFilePath);
        }
    });

    let match = filePath.match(/[\/\\]([a-zA-Z0-9_,$\-]*)$/);
    // dirName is the identity of each component
    dirName = match[1];
    // generate html when it has source file
    if (sourceFile && specTpl) {
        genContent({
            componentClass,
            componentSource,
            compontentData,
            componentDataLiteral,
            specTpl,
            dirName,
            result
        });
    }
};

function writeIn({htmlTpl, html, specTpls}) {
    let karmaHtml = fs.readFileSync(path.resolve(__dirname, 'karma-context.html.tpl'), 'UTF-8');
    fs.writeFileSync(
        path.resolve(__dirname, 'karma-context.html'),
        karmaHtml.replace('##rendered-elements##', html),
        'UTF-8'
    );

    fs.writeFileSync(
        path.resolve(__dirname, 'index-reverse.html'),
        htmlTpl.replace('##rendered-elements##', html),
        'UTF-8'
    );

    fs.writeFileSync(
        path.resolve(__dirname, 'reverse.spec.js'),
        specTpls,
        'UTF-8'
    );
};

console.log();
console.log('----- Build Reverse Specs -----');


buildFile(path.join(__dirname, '../node_modules/san-html-cases/src'));
// write into file
writeIn({htmlTpl, html, specTpls});

console.log();
