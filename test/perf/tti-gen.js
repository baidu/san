const fs = require('fs');
const path = require('path');
const san = require('../../dist/san.ssr');
const TTIComponent = require('./tti-component');

let componentCode = fs.readFileSync(path.resolve(__dirname, 'tti-component.js'), 'UTF-8')
    .replace('const san', '//')
    .replace('exports ', '//');
let htmlTpl = fs.readFileSync(path.resolve(__dirname, 'tti.tpl.html'), 'UTF-8');

let renderer = san.compileToRenderer(TTIComponent);
var items = [];
for (var i = 0; i < 1000; i++) {
    items.push(i)
}
let data = {items};

let html = htmlTpl
    .replace('// cmpt', componentCode)
    .replace('<!--html-->', renderer(data));

fs.writeFileSync(path.resolve(__dirname, 'tti.html'), html, 'UTF-8');
