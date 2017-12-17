const san = require('../../dist/san.ssr');
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
    },
    {},
    {distate: true},
    {cValue: ['2', '3'], list: ['1', '2', '3']},
    {cValue: '2', list: ['1', '2', '3']},
    {
        persons: ['errorrik', 'firede', 'otakustay'],
        online: 'firede'
    },
    {
        date: new Date(1983, 8, 3)
    },
    {},
    {},
    {distate: true},
    {},
    {html: 'aa<a>bbb</a>cc'},
    {
        title: '1',
        text: 'one'
    },
    {
        title: '1',
        text: 'one'
    },
    {
        title: '1'
    },
    {
        name: 'er<u>erik</u>ik'
    },
    {
        persons: ['errorrik', 'firede']
    },
    {
        online: 'firede',
        persons: ['errorrik', 'firede']
    },
    {},
    {},
    {
        cond1: true,
        cond2: true
    },
    {},
    {num: 300},
    {num: 30000},
    {num: 30},
    {searchValue: 'er'},
    {persons: []},
    {
        cond: false,
        persons: [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]
    },
    {
        persons: [
            {name: 'otakustay', email: 'otakustay@gmail.com'},
            {name: 'errorrik', email: 'errorrik@gmail.com'}
        ]
    },
    {
        num: 300
    },
    {
        title: 'contributor',
        name: 'errorrik',
        closeText: 'X'
    },
    {
        man: {
            name: 'errorrik',
            sex: 1,
            email: 'errorrik@gmail.com'
        }
    },
    {
        man: {
            name: 'errorrik',
            sex: 1,
            email: 'errorrik@gmail.com'
        }
    },
    {
        man: {
            name: 'errorrik',
            sex: 1,
            email: 'errorrik@gmail.com'
        }
    },
    {
        desc: 'MVVM component framework',
        name: 'San',
        persons: [
            {name: 'otakustay', email: 'otakustay@gmail.com'},
            {name: 'errorrik', email: 'errorrik@gmail.com'}
        ]
    },
    {
        desc: 'MVVM component framework',
        name: 'San',
        num: 300
    },
    {
        desc: 'MVVM component framework',
        name: 'San'
    },
    {
        desc: 'MVVM component framework',
        name: 'San'
    },
    {
        man: {
            name: 'errorrik',
            sex: 1,
            email: 'errorrik@gmail.com'
        }
    },
    {
        cates: [
            'foo',
            'bar'
        ],
        forms: {
            foo: [1, 2, 3],
            bar: [4, 5, 6]
        }
    },
    {
        cates: [
            'foo',
            'bar'
        ]
    },
    {
        deps: [
            {
                strong: 'name',
                columns: [
                    {name: 'name', label: '名'},
                    {name: 'email', label: '邮'}
                ],
                members: [
                    {name: 'Justineo', email: 'justineo@gmail.com'},
                    {name: 'errorrik', email: 'errorrik@gmail.com'}
                ]
            },
            {
                strong: 'email',
                columns: [
                    {name: 'name', label: '名'},
                    {name: 'email', label: '邮'}
                ],
                members: [
                    {name: 'otakustay', email: 'otakustay@gmail.com'},
                    {name: 'leeight', email: 'leeight@gmail.com'}
                ]
            }
        ]
    },
    {
        man: {
            name: 'errorrik',
            sex: 1,
            email: 'errorrik@gmail.com'
        },
        tip: 'tip'
    },
    {
        man: {
            name: 'errorrik',
            sex: 1,
            email: 'errorrik@gmail.com'
        },
        desc: 'tip'
    }
];




let htmlTpl = fs.readFileSync(path.resolve(__dirname, '../index-ssr.html.tpl'), 'UTF-8');
let specTpl = fs.readFileSync(path.resolve(__dirname, 'ssr.spec.js.tpl'), 'UTF-8');

let html = '';

for (let i = 0; i < componentDatas.length; i++) {
    let index = i + 1;
    let ComponentClass = require('./cmpt' + index);
    let renderer = san.compileToRenderer(ComponentClass);
    // console.log('===================================')
    // console.log(san.compileToSource(ComponentClass))
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
        var myComponent = new MyComponent({
            el: wrap.firstChild
        });
    `;
    specTpl = specTpl.replace('##cmpt' + index + '##', preCode);

}


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
    specTpl,
    'UTF-8'
);
