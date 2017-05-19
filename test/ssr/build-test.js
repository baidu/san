const san = require('../../dist/san.all');
const fs = require('fs');
const path = require('path');


let componentDatas = [
    {
        email: 'errorrik@gmail.com',
        name: 'errorrik'
    },
    {
        email: 'errorrik@gmail.com',
        name: 'errorrik'
    },
    {
        jokeName: 'airike',
        name: 'errorrik',
        school: 'none',
        company: 'bidu'
    },
    {
        jokeName: 'airike',
        name: 'errorrik',
        school: 'none',
        company: 'bidu'
    },
    {
        company: 'bidu'
    },
    {
        persons: []
    },
    {
        persons: [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        ]
    },
    {
        persons: [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        ]
    },
    {
        persons: [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        ]
    },
    {
        cond: true,
        name: 'errorrik'
    },
    {
        cond: false,
        name: 'errorrik'
    },
    {
        'cond': false,
        'name': 'errorrik',
        name2: 'otakustay'
    },
    {
        'cond': true,
        'name': 'errorrik',
        name2: 'otakustay'
    },
    {
        tabText: 'tab',
        text: 'one',
        title: '1'
    },
    {
        tabText: 'tab',
        text: 'one',
        title: '1',
        tTitle: '5',
        tText: 'five'
    },
    {
        name: 'errorrik'
    },
    {
        name: 'errorrik'
    },
    {
        cond: true,
        jokeName: 'airike',
        name: 'errorrik',
        school: 'none',
        company: 'bidu'
    },
    {
        cond: false,
        jokeName: 'airike',
        name: 'errorrik',
        school: 'none',
        company: 'bidu'
    },
    {
        cond: true,
        jokeName: 'airike',
        name: 'errorrik',
        school: 'none',
        company: 'bidu'
    },
    {
        list: [
            {title: '1', text: 'one'},
            {title: '2', text: 'two'}
        ]
    },
    {
        list: [
            {title: '1', text: 'one'},
            {title: '2', text: 'two'}
        ]
    },
    {
        cond: true,
        persons: [
            {
                name: 'erik',
                tels: [
                    '12345678',
                    '123456789',
                ]
            },
            {
                name: 'firede',
                tels: [
                    '2345678',
                    '23456789',
                ]
            }
        ]
    }
];




let htmlTpl = fs.readFileSync(path.resolve(__dirname, '../index-ssr.html.tpl'), 'UTF-8');
let specTpl = fs.readFileSync(path.resolve(__dirname, 'ssr.spec.js.tpl'), 'UTF-8');

let html = '';

for (let i = 0; i < componentDatas.length; i++) {
    let index = i + 1;
    let ComponentClass = require('./cmpt' + index);
    let renderer = san.compileToRenderer(ComponentClass);
    html += '<div id="wrap-cmpt' + index + '">'
        + renderer(componentDatas[i])
        + '</div>\n\n';

    let componentFile = path.resolve(__dirname, 'cmpt' + index + '.js');
    let componentSource = fs.readFileSync(componentFile, 'UTF-8')
        .split('\n')
        .map(line => {
            if (/(\.|\s)exports\s*=/.test(line)
                || /san\s*=\s*require\(/.test(line)
            ) {
                return ''
            }

            return line;
        })
        .join('\n');
    let preCode = `
        ${componentSource}
        var wrap = document.getElementById('wrap-cmpt${index}');
    `;
    specTpl = specTpl.replace('##cmpt' + index + '##', preCode);

}

fs.writeFileSync(
    path.resolve(__dirname, '../index-ssr.html'),
    htmlTpl.replace('##ssr-elements##', html),
    'UTF-8'
);

fs.writeFileSync(
    path.resolve(__dirname, 'ssr.spec.js'),
    specTpl,
    'UTF-8'
);
