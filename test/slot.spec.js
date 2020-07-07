describe("Slot", function () {

    it("text only", function (done) {

        var Block = san.defineComponent({
            template: '<u class="x-block"><slot/></u>'
        });

        var MyComponent = san.defineComponent({
            components: {
              'x-block': Block
            },

            template: ''
                + '<div>'
                  + '<x-block>{{foo}}</x-block>'
                + '</div>'
        });


        var myComponent = new MyComponent({
            data: {
                foo: 'foo'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('u').length).toBe(1);
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toContain('foo');

        myComponent.data.set('foo', 'errorrik');
        san.nextTick(function () {
            expect(wrap.getElementsByTagName('u').length).toBe(1);
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toContain('errorrik');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });


    it("default", function (done) {
        var Panel = san.defineComponent({
            template: '<div>'
                +   '<div class="head" on-click="toggle">{{title}}</div>'
                +   '<p style="{{fold ? \'display:none\' : \'\'}}"><slot></slot></p>'
                + '</div>',

            toggle: function () {
                this.data.set('fold', !this.data.get('fold'));
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-panel': Panel
            },

            template: '<div><ui-panel>'
                + '<a>1</a><a>2</a><a>3</a>'
                + '</ui-panel></div>'
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        san.nextTick(function () {
            var p = wrap.getElementsByTagName('p')[0]
            var aList = p.getElementsByTagName('a');
            expect(aList.length).toBe(3);
            expect(p.previousSibling.className).toBe('head');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });



    it("named", function (done) {
        var Tab = san.defineComponent({
            template: '<div>'
                +   '<div class="head"><slot name="title"></slot></div>'
                +   '<div>content</div>'
                + '</div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-tab': Tab
            },

            template: '<div><ui-tab>'
                + '<h3 slot="title" title="1">1</h3>'
                + '</ui-tab></div>'
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        san.nextTick(function () {
            var head = wrap.firstChild.firstChild.firstChild;
            var main = head.nextSibling;

            var h3 = head.getElementsByTagName('h3')[0];

            expect(h3.title).toBe('1');

            if (typeof window === 'object') {
                expect(window.name).not.toBe('title');
            }

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });


    it("default and named", function (done) {
        var Tab = san.defineComponent({
            template: '<div>'
                +   '<div class="head"><slot name="title"></slot></div>'
                +   '<div><slot></slot></div>'
                + '</div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-tab': Tab
            },

            template: '<div><ui-tab>'
                + '<h3 slot="title" title="1">1</h3><h3 slot="title" title="2">2</h3><h3 slot="title" title="3">3</h3>'
                + '<p title="1">one</p><p title="2">two</p><p title="3">three</p>'
                + '</ui-tab></div>'
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        san.nextTick(function () {
            var head = wrap.firstChild.firstChild.firstChild;
            var main = head.nextSibling;

            var h3s = head.getElementsByTagName('h3');
            var ps = main.getElementsByTagName('p');
            expect(h3s.length).toBe(3);
            expect(ps.length).toBe(3);

            expect(h3s[0].title).toBe('1');
            expect(ps[0].title).toBe('1');
            expect(h3s[1].title).toBe('2');
            expect(ps[1].title).toBe('2');
            expect(h3s[2].title).toBe('3');
            expect(ps[2].title).toBe('3');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });


    it("default and named sort is insensitive", function (done) {
        var Tab = san.defineComponent({
            template: '<div>'
                +   '<div class="head"><slot name="title"></slot></div>'
                +   '<div><slot></slot></div>'
                + '</div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-tab': Tab
            },

            template: '<div><ui-tab>'
                + '<h3 slot="title" title="1">1</h3><p title="1">one</p>'
                + '<h3 slot="title" title="2">2</h3><p title="2">two</p>'
                + '<h3 slot="title" title="3">3</h3><p title="3">three</p>'
                + '</ui-tab></div>'
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        san.nextTick(function () {
            var head = wrap.firstChild.firstChild.firstChild;
            var main = head.nextSibling;

            var h3s = head.getElementsByTagName('h3');
            var ps = main.getElementsByTagName('p');
            expect(h3s.length).toBe(3);
            expect(ps.length).toBe(3);

            expect(h3s[0].title).toBe('1');
            expect(ps[0].title).toBe('1');
            expect(h3s[1].title).toBe('2');
            expect(ps[1].title).toBe('2');
            expect(h3s[2].title).toBe('3');
            expect(ps[2].title).toBe('3');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("literal owner", function (done) {
        var Panel = san.defineComponent({
            template: '<div>'
                +   '<div class="head" title="{{title}}" on-click="toggle">{{title}}</div>'
                +   '<p style="{{fold ? \'display:none\' : \'\'}}"><slot></slot></p>'
                + '</div>',

            initData: function () {
                return {
                    title: 'inner title',
                    content: 'inner'
                };
            },

            toggle: function () {
                this.data.set('fold', !this.data.get('fold'));
            },

            attached: function () {
                this.data.set('content', 'inner content');
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-panel': Panel
            },

            template: '<div><ui-panel outercontent="{{content}}">'
                + '<a title="{{content}}">{{content}}</a>'
                + '</ui-panel></div>',

            initData: function () {
                return {
                    title: 'outer title',
                    content: 'outer'
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        san.nextTick(function () {
            var p = wrap.getElementsByTagName('p')[0]
            var a = p.getElementsByTagName('a')[0];
            var head = p.previousSibling;

            expect(a.title).toBe('outer');
            expect(head.title).toBe('inner title');

            myComponent.data.set('content', 'outer title');

            san.nextTick(function () {
                expect(a.title).toBe('outer title');

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        })
    });

    it("use default content when new component manually", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                    name: 'erik'
                };
            },
            template: '<span title="{{name}}"><slot>Hello {{name}}</slot></span>'
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');

            expect(spans[0].innerHTML.indexOf('Hello erik') >= 0).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });


    it("use default content when no given content", function (done) {
        var Hello = san.defineComponent({
            template: '<span title="{{name}}"><slot>Hello {{name}}</slot></span>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-hello': Hello
            },

            template: '<div><ui-hello name="{{who}}"></ui-hello></div>',

            initData: function () {
                return {
                    who: 'erik',
                    name: 'errorrik'
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');

            expect(spans[0].innerHTML.indexOf('Hello erik') >= 0).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("use given content", function (done) {
        var Hello = san.defineComponent({
            template: '<span title="{{name}}"><slot>Hello {{name}}</slot></span>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-hello': Hello
            },

            template: '<div><ui-hello name="{{who}}">I am {{name}}</ui-hello></div>',

            initData: function () {
                return {
                    who: 'erik',
                    name: 'errorrik'
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');

            expect(spans[0].innerHTML.indexOf('I am errorrik') >= 0).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("components owner", function (done) {
        var Panel = san.defineComponent({
            template: '<div>'
                +   '<div class="head" title="{{title}}" on-click="toggle">{{title}}</div>'
                +   '<p style="{{fold ? \'display:none\' : \'\'}}"><slot></slot></p>'
                + '</div>',

            toggle: function () {
                this.data.set('fold', !this.data.get('fold'));
            }
        });

        var Label = san.defineComponent({
            template: '<span title="{{text}}">{{text}}</span>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-panel': Panel,
                'ui-label': Label
            },

            template: '<div><ui-panel title="{{name}}">'
                + '<ui-label text="{{name}}"></ui-label>'
                + '</ui-panel></div>',

            initData: function () {
                return {
                    name: 'errorrik'
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        san.nextTick(function () {
            var p = wrap.getElementsByTagName('p')[0]
            var spans = p.getElementsByTagName('span');

            expect(spans.length).toBe(1);
            expect(spans[0].title).toBe('errorrik');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("ref component in slot", function () {
        var Panel = san.defineComponent({
            template: '<div>'
                +   '<div class="head" title="{{title}}" on-click="toggle">{{title}}</div>'
                +   '<p style="{{fold ? \'display:none\' : \'\'}}"><slot></slot></p>'
                + '</div>',

            toggle: function () {
                this.data.set('fold', !this.data.get('fold'));
            }
        });

        var Label = san.defineComponent({
            template: '<span title="{{text}}">{{text}}</span>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-panel': Panel,
                'ui-label': Label
            },

            template: '<div><ui-panel title="{{name}}">'
                + '<ui-label text="{{name}}" san-ref="mylabel"></ui-label>'
                + '</ui-panel></div>',

            initData: function () {
                return {
                    name: 'errorrik'
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(myComponent.ref('mylabel') instanceof Label).toBe(true);

        var p = wrap.getElementsByTagName('p')[0]
        var spans = p.getElementsByTagName('span');

        expect(spans.length).toBe(1);
        expect(spans[0].title).toBe('errorrik');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("for in slot", function (done) {
        var Tab = san.defineComponent({
            template: '<div>'
                +   '<div class="head"><slot name="title"></slot></div>'
                +   '<div><slot></slot></div>'
                + '</div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-tab': Tab
            },

            initData: function () {
                return {
                    items: [
                        {title: '1', content: 'one'},
                        {title: '2', content: 'two'}
                    ]
                };
            },

            template: '<div><ui-tab>'
                + '<ul slot="title"><li san-for="item in items" title="{{item.title}}">{{item.title}}</li></ul>'
                + '<p san-for="item in items" title="{{item.content}}">{{item.content}}</p>'
                + '</ui-tab></div>'
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        san.nextTick(function () {
            var head = wrap.firstChild.firstChild.firstChild;
            var main = head.nextSibling;

            var lis = head.getElementsByTagName('li');
            var ps = main.getElementsByTagName('p');
            expect(lis.length).toBe(2);
            expect(ps.length).toBe(2);

            expect(lis[0].title).toBe('1');
            expect(ps[0].title).toBe('one');
            expect(lis[1].title).toBe('2');
            expect(ps[1].title).toBe('two');

            myComponent.data.push('items', {title: '3', content: 'three'})
            san.nextTick(function () {
                var lis = head.getElementsByTagName('li');
                var ps = main.getElementsByTagName('p');

                expect(lis.length).toBe(3);
                expect(ps.length).toBe(3);

                expect(lis[0].title).toBe('1');
                expect(ps[0].title).toBe('one');
                expect(lis[1].title).toBe('2');
                expect(ps[1].title).toBe('two');
                expect(lis[2].title).toBe('3');
                expect(ps[2].title).toBe('three');

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        })
    });

    it("component in for", function (done) {
        var Link = san.defineComponent({
            template: '<a href="{{to}}"><slot></slot></a>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-link': Link
            },

            initData: function () {
                return {
                    items: [
                        {title: 'website', url: 'http://ecomfe.github.io/san/'},
                        {title: 'github', url: 'https://github.com/ecomfe/san'}
                    ]
                };
            },

            template: '<div><ul>'
                + '<li san-for="item in items" title="{{item.title}}">{{item.title}}<ui-link to="{{item.url}}"><b title="{{item.title}}">{{item.title}}</b></ui-link></li>'
                + '</ul></div>'
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        var lis = wrap.getElementsByTagName('li');

        var a1 = lis[0].getElementsByTagName('a')[0];
        var b1 = a1.getElementsByTagName('b')[0];
        expect(a1.href).toBe('http://ecomfe.github.io/san/')
        expect(b1.title).toBe('website');

        var a2 = lis[1].getElementsByTagName('a')[0];
        var b2 = a2.getElementsByTagName('b')[0];
        expect(a2.href).toBe('https://github.com/ecomfe/san')
        expect(b2.title).toBe('github');

        myComponent.data.push('items', {title: 'cdn', url: 'https://unpkg.com/san@latest'})

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');

            var a1 = lis[0].getElementsByTagName('a')[0];
            var b1 = a1.getElementsByTagName('b')[0];
            expect(a1.href).toBe('http://ecomfe.github.io/san/')
            expect(b1.title).toBe('website');

            var a2 = lis[1].getElementsByTagName('a')[0];
            var b2 = a2.getElementsByTagName('b')[0];
            expect(a2.href).toBe('https://github.com/ecomfe/san')
            expect(b2.title).toBe('github');

            var a3 = lis[2].getElementsByTagName('a')[0];
            var b3 = a3.getElementsByTagName('b')[0];
            expect(a3.href).toBe('https://unpkg.com/san@latest')
            expect(b3.title).toBe('cdn');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("complex for", function (done) {
        var Issue = san.defineComponent({
            template: '<div><slot/></div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-issue': Issue
            },

            template: ''
                + '<ul><li s-for="item, index in items">'
                    + '<h4>{{item.label}}</h4>'
                    + '<x-issue>'
                        + '<button on-click="addText(index)">Add</button>'
                        + '<p s-for="o in item.datasource" title="{{o.label}}">{{o.label}}</p>'
                    + '</x-issue>'
                + '</li></ul>',

            addText: function (index) {
                this.data.push('items[' + index + '].datasource', {label: 'newone'});
            }
        });

        var myComponent = new MyComponent({
            data: {
                items: [
                    {
                        label: 'A',
                        datasource: [{label: 'oldone'}]
                    }
                ]
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        var ps = wrap.getElementsByTagName('p');
        expect(ps.length).toBe(1);
        expect(ps[0].title).toBe('oldone');

        var buttons = wrap.getElementsByTagName('button');
        triggerEvent(buttons[0], 'click');

        setTimeout(function () {
            var ps = wrap.getElementsByTagName('p');
            expect(ps.length).toBe(2);
            expect(ps[0].title).toBe('oldone');
            expect(ps[1].title).toBe('newone');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        }, 400);
    });

    it("component in for directly", function (done) {
        var Link = san.defineComponent({
            template: '<a href="{{to}}"><slot></slot></a>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-link': Link
            },

            initData: function () {
                return {
                    items: [
                        {title: 'website', url: 'http://ecomfe.github.io/san/'},
                        {title: 'github', url: 'https://github.com/ecomfe/san'}
                    ]
                };
            },

            template: '<div>'
                + '<ui-link san-for="item in items" to="{{item.url}}"><b title="{{item.title}}">{{item.title}}</b></ui-link>'
                + '</div>'
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var aEls = wrap.getElementsByTagName('a');

        var a1 = aEls[0];
        var b1 = a1.getElementsByTagName('b')[0];
        expect(a1.href).toBe('http://ecomfe.github.io/san/')
        expect(b1.title).toBe('website');

        var a2 = aEls[1];
        var b2 = a2.getElementsByTagName('b')[0];
        expect(a2.href).toBe('https://github.com/ecomfe/san')
        expect(b2.title).toBe('github');

        myComponent.data.push('items', {title: 'cdn', url: 'https://unpkg.com/san@latest'})

        san.nextTick(function () {
            var aEls = wrap.getElementsByTagName('a');

            var a1 = aEls[0];
            var b1 = a1.getElementsByTagName('b')[0];
            expect(a1.href).toBe('http://ecomfe.github.io/san/')
            expect(b1.title).toBe('website');

            var a2 = aEls[1];
            var b2 = a2.getElementsByTagName('b')[0];
            expect(a2.href).toBe('https://github.com/ecomfe/san')
            expect(b2.title).toBe('github');

            var a3 = aEls[2];
            var b3 = a3.getElementsByTagName('b')[0];
            expect(a3.href).toBe('https://unpkg.com/san@latest')
            expect(b3.title).toBe('cdn');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("component in for directly, other component in slot", function (done) {
        var BoxGroup = san.defineComponent({
            template: '<ul class="box-group">'
                + '<li san-for="item in datasource">'
                + '<label><input type="checkbox" value="{{item.value}}" checked="{=value=}" /><span>{{item.text}}</span></label>'
                + '</li>'
                + '</ul>'
        });

        var Issue = san.defineComponent({
            template: '<div><slot/></div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-boxgroup': BoxGroup,
                'x-issue': Issue
            },
            filters: {
                jo: function (source) {
                    return source.join('|')
                }
            },
            template: '<div>'
              + '<button on-click="onClick">Clear</button><hr/>'
              + '<x-issue san-for="p in groups">'
                + '<u title="{{p.value|jo}}">value: {{p.value}}</u>'
                + '<ui-boxgroup datasource="{{p.datasource}}" value="{=p.value=}" /><hr/>'
              + '</x-issue>'
              + '</div>',

            onClick: function() {
                this.data.set('groups[0].value', []);
                this.data.set('groups[1].value', []);
            }
        });

        var myComponent = new MyComponent({
            data: {
                groups: [
                    {
                        datasource: [
                            {text: 'foo', value: 'foo'},
                            {text: 'bar', value: 'bar'}
                        ],
                        value: ['foo', 'bar']
                    },
                    {
                        datasource: [
                            {text: 'abc', value: 'abc'},
                            {text: '123', value: '123'}
                        ],
                        value: ['abc']
                    }
                ]
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        var us = wrap.getElementsByTagName('u');
        expect(us[0].title.indexOf('foo') >= 0).toBeTruthy();
        expect(us[0].title.indexOf('bar') >= 0).toBeTruthy();
        expect(us[1].title.indexOf('abc') >= 0).toBeTruthy();
        expect(us[1].title.indexOf('123') >= 0).toBeFalsy();

        var button = wrap.getElementsByTagName('button')[0];
        triggerEvent(button, 'click');


        setTimeout(function () {
            expect(us[0].title).toBe('');
            expect(us[1].title).toBe('');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        }, 400)
    });

    it("component in if", function (done) {
        var Link = san.defineComponent({
            template: '<a href="{{to}}"><slot></slot></a>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-link': Link
            },

            initData: function () {
                return {
                };
            },

            template: '<div><ui-link san-if="link" to="{{link.url}}"><b title="{{link.title}}">{{link.title}}</b></ui-link></div>'
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('a').length).toBe(0);

        myComponent.data.set('link', {title: 'link', url: 'http://ecomfe.github.io/san/'});
        san.nextTick(function () {
            var a = wrap.getElementsByTagName('a')[0];
            expect(a.href).toBe('http://ecomfe.github.io/san/');
            expect(a.getElementsByTagName('b')[0].title).toBe('link');
            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("component in if directly", function (done) {
        var Block = san.defineComponent({
            template: '<u class="x-block"><slot/></u>'
        });

        var MyComponent = san.defineComponent({
            components: {
              'x-block': Block
            },

            template: ''
                + '<div>'
                  + '<x-block san-if="f">{{foo}}</x-block>'
                  + '<x-block san-else>{{bar}}</x-block>'
                + '</div>'
        });


        var myComponent = new MyComponent({
            data: {
                f: false,
                foo: 'foo',
                bar: 'bar'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('u').length).toBe(1);
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toContain('bar');

        myComponent.data.set('bar', 'san');
        san.nextTick(function () {
            expect(wrap.getElementsByTagName('u').length).toBe(1);
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toContain('san');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("description apply if, init false", function (done) {
        var Folder = san.defineComponent({
            template: '<div><h3 on-click="toggle"><slot name="title"/></h3><slot s-if="!hidden"/></div>',
            toggle: function () {
                var hidden = this.data.get('hidden');
                this.data.set('hidden', !hidden);
            }
        });

        var MyComponent = san.defineComponent({
            components: {
              'x-folder': Folder
            },

            template: ''
                + '<div>'
                  + '<x-folder hidden="{{folderHidden}}"><b slot="title">{{name}}</b><p>{{desc}}</p></x-folder>'
                + '</div>'
        });


        var myComponent = new MyComponent({
            data: {
                folderHidden: true,
                desc: 'MVVM component framework',
                name: 'San'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('p').length).toBe(0);
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('San');

        myComponent.data.set('folderHidden', false);
        san.nextTick(function () {
            expect(wrap.getElementsByTagName('p').length).toBe(1);
            expect(wrap.getElementsByTagName('p')[0].innerHTML).toBe('MVVM component framework');
            expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('San');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("description apply if, init true", function (done) {
        var Folder = san.defineComponent({
            template: '<div><h3 on-click="toggle"><slot name="title"/></h3><slot s-if="!hidden"/></div>',
            toggle: function () {
                var hidden = this.data.get('hidden');
                this.data.set('hidden', !hidden);
            }
        });

        var MyComponent = san.defineComponent({
            components: {
              'x-folder': Folder
            },

            template: ''
                + '<div>'
                  + '<x-folder hidden="{{folderHidden}}" s-ref="folder"><b slot="title">{{name}}</b><p>{{desc}}</p></x-folder>'
                + '</div>'
        });


        var myComponent = new MyComponent({
            data: {
                desc: 'MVVM component framework',
                name: 'San'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        expect(wrap.getElementsByTagName('p').length).toBe(1);
        expect(wrap.getElementsByTagName('p')[0].innerHTML).toBe('MVVM component framework');
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('San');

        var contentSlots = myComponent.ref('folder').slot();
        expect(contentSlots.length).toBe(1);

        myComponent.data.set('folderHidden', true);
        san.nextTick(function () {
            expect(wrap.getElementsByTagName('p').length).toBe(0);
            expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('San');

            var contentSlots = myComponent.ref('folder').slot();
            expect(contentSlots.length).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("description apply for, init true", function (done) {
        var Folder = san.defineComponent({
            template: '<div><h3 on-click="toggle"><slot name="title"/></h3><slot s-if="!hidden" s-for="i in repeat"/></div>',
            toggle: function () {
                var hidden = this.data.get('hidden');
                this.data.set('hidden', !hidden);
            },
            initData: function () {
                return {repeat: [1,2]}
            }
        });

        var MyComponent = san.defineComponent({
            components: {
              'x-folder': Folder
            },

            template: ''
                + '<div>'
                  + '<x-folder hidden="{{folderHidden}}"><b slot="title">{{name}}</b><p>{{desc}}</p></x-folder>'
                + '</div>'
        });


        var myComponent = new MyComponent({
            data: {
                desc: 'MVVM component framework',
                name: 'San'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        expect(wrap.getElementsByTagName('p').length).toBe(2);
        expect(wrap.getElementsByTagName('p')[0].innerHTML).toBe('MVVM component framework');
        expect(wrap.getElementsByTagName('p')[1].innerHTML).toBe('MVVM component framework');
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('San');

        myComponent.data.set('folderHidden', true);
        san.nextTick(function () {
            expect(wrap.getElementsByTagName('p').length).toBe(0);
            expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('San');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("insert element apply for", function (done) {
        var Folder = san.defineComponent({
            template: '<div><h3 on-click="toggle"><slot name="title"/></h3><slot/></div>',
            toggle: function () {
                var hidden = this.data.get('hidden');
                this.data.set('hidden', !hidden);
            }
        });

        var MyComponent = san.defineComponent({
            components: {
              'x-folder': Folder
            },

            template: ''
                + '<div>'
                  + '<x-folder hidden="{{folderHidden}}" s-ref="folder"><b slot="title">{{name}}</b><div san-for="p,i in persons"><h4>{{p.name}}</h4><p>{{p.email}}</p></div></x-folder>'
                + '</div>'
        });


        var myComponent = new MyComponent({
            data: {
                desc: 'MVVM component framework',
                name: 'San',
                persons: [
                    {name: 'otakustay', email: 'otakustay@gmail.com'},
                    {name: 'errorrik', email: 'errorrik@gmail.com'}
                ]
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var h4s = wrap.getElementsByTagName('h4');
        var ps = wrap.getElementsByTagName('p');

        expect(h4s.length).toBe(2);
        expect(ps.length).toBe(2);

        expect(h4s[0].innerHTML).toBe('otakustay');
        expect(ps[0].innerHTML).toBe('otakustay@gmail.com');
        expect(h4s[1].innerHTML).toBe('errorrik');
        expect(ps[1].innerHTML).toBe('errorrik@gmail.com');


        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('San');

        var contentSlot = myComponent.ref('folder').slot();
        expect(contentSlot.length).toBe(1);
        expect(contentSlot[0].children[0].children.length).toBe(2);
        expect(contentSlot[0].children[0].nodeType).toBe(san.NodeType.FOR);

        myComponent.data.pop('persons');
        san.nextTick(function () {
            var h4s = wrap.getElementsByTagName('h4');
            var ps = wrap.getElementsByTagName('p');
            expect(h4s.length).toBe(1);
            expect(ps.length).toBe(1);


            expect(h4s[0].innerHTML).toBe('otakustay');
            expect(ps[0].innerHTML).toBe('otakustay@gmail.com');

            var contentSlot = myComponent.ref('folder').slot();
            expect(contentSlot.length).toBe(1);
            expect(contentSlot[0].children[0].children.length).toBe(1);
            expect(contentSlot[0].children[0].nodeType).toBe(san.NodeType.FOR);


            myComponent.data.unshift('persons', {name: 'errorrik', email: 'errorrik@gmail.com'});
            san.nextTick(function () {
                var contentSlot = myComponent.ref('folder').slot();
                expect(contentSlot.length).toBe(1);
                expect(contentSlot[0].children[0].children.length).toBe(2);
                expect(contentSlot[0].children[0].nodeType).toBe(san.NodeType.FOR);

                expect(h4s[0].innerHTML).toBe('errorrik');
                expect(ps[0].innerHTML).toBe('errorrik@gmail.com');

                expect(h4s[1].innerHTML).toBe('otakustay');
                expect(ps[1].innerHTML).toBe('otakustay@gmail.com');


                expect(h4s.length).toBe(2);
                expect(ps.length).toBe(2);
                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it('insert element "template" apply for', function (done) {
        var Folder = san.defineComponent({
            template: '<div><h3 on-click="toggle"><slot name="title"/></h3><slot name="content"/></div>',
            toggle: function () {
                var hidden = this.data.get('hidden');
                this.data.set('hidden', !hidden);
            }
        });

        var MyComponent = san.defineComponent({
            components: {
              'x-folder': Folder
            },

            template: ''
                + '<div>'
                  + '<x-folder hidden="{{folderHidden}}"><b slot="title">{{name}}</b><template san-for="p,i in persons" slot="content">  <h4>{{p.name}}</h4><p>{{p.email}}</p>  </template></x-folder>'
                + '</div>'
        });


        var myComponent = new MyComponent({
            data: {
                desc: 'MVVM component framework',
                name: 'San',
                persons: [
                    {name: 'otakustay', email: 'otakustay@gmail.com'},
                    {name: 'errorrik', email: 'errorrik@gmail.com'}
                ]
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var h4s = wrap.getElementsByTagName('h4');
        var ps = wrap.getElementsByTagName('p');

        expect(h4s.length).toBe(2);
        expect(ps.length).toBe(2);

        expect(h4s[0].innerHTML).toBe('otakustay');
        expect(ps[0].innerHTML).toBe('otakustay@gmail.com');
        expect(h4s[1].innerHTML).toBe('errorrik');
        expect(ps[1].innerHTML).toBe('errorrik@gmail.com');


        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('San');

        myComponent.data.pop('persons');
        san.nextTick(function () {
            var h4s = wrap.getElementsByTagName('h4');
            var ps = wrap.getElementsByTagName('p');
            expect(h4s.length).toBe(1);
            expect(ps.length).toBe(1);


            expect(h4s[0].innerHTML).toBe('otakustay');
            expect(ps[0].innerHTML).toBe('otakustay@gmail.com');


            myComponent.data.unshift('persons', {name: 'errorrik', email: 'errorrik@gmail.com'});
            san.nextTick(function () {
                expect(h4s[0].innerHTML).toBe('errorrik');
                expect(ps[0].innerHTML).toBe('errorrik@gmail.com');

                expect(h4s[1].innerHTML).toBe('otakustay');
                expect(ps[1].innerHTML).toBe('otakustay@gmail.com');


                expect(h4s.length).toBe(2);
                expect(ps.length).toBe(2);
                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it('insert element apply if', function (done) {
        var Folder = san.defineComponent({
            template: '<div><h1 on-click="toggle"><slot name="title"/></h1><slot name="content"/></div>',
            toggle: function () {
                var hidden = this.data.get('hidden');
                this.data.set('hidden', !hidden);
            }
        });

        var MyComponent = san.defineComponent({
            components: {
              'x-folder': Folder
            },

            template: ''
                + '<div>'
                  + '<x-folder hidden="{{folderHidden}}" s-ref="folder"><b slot="title">{{name}}</b><span slot="content" s-if="num > 10000" title="biiig">biiig</span>  \n'
            + '<span s-elif="num > 1000" title="biig">biig</span>  \n'
            + '<span s-elif="num > 100" title="big">big</span>  \n'
            + ' <u s-else title="small">small</u></x-folder>'
                + '</div>'
        });


        var myComponent = new MyComponent({
            data: {
                desc: 'MVVM component framework',
                name: 'San',
                num: 300
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);
        expect(spans[0].title).toBe('big');
        expect(wrap.getElementsByTagName('u').length).toBe(0);

        var contentSlot = myComponent.ref('folder').slot('content');
        expect(contentSlot.length).toBe(1);

        myComponent.data.set('num', 30000);

        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);
            expect(spans[0].title).toBe('biiig');
            expect(wrap.getElementsByTagName('u').length).toBe(0);

            myComponent.data.set('num', 10);
            san.nextTick(function () {
                var spans = wrap.getElementsByTagName('span');
                expect(spans.length).toBe(0);
                var us = wrap.getElementsByTagName('u');
                expect(us[0].title).toBe('small');

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it('insert element "template" apply if', function (done) {
        var Folder = san.defineComponent({
            template: '<div><h1 on-click="toggle"><slot name="title"/></h1><slot name="content"/></div>',
            toggle: function () {
                var hidden = this.data.get('hidden');
                this.data.set('hidden', !hidden);
            }
        });

        var MyComponent = san.defineComponent({
            components: {
              'x-folder': Folder
            },

            template: ''
                + '<div>'
                  + '<x-folder hidden="{{folderHidden}}"><b slot="title">{{name}}</b><template s-if="num > 10000" slot="content"><h2>biiig</h2><p>{{num}}</p></template>  \n'
                    + '<template s-elif="num > 1000"><h3>biig</h3><p>{{num}}</p></template>  \n'
                    + '<template s-elif="num > 100"><h4>big</h4><p>{{num}}</p></template>  \n'
                    + ' <template s-else><h5>small</h5><p>{{num}}</p></template></x-folder>'
                + '</div>'
        });


        var myComponent = new MyComponent({
            data: {
                desc: 'MVVM component framework',
                name: 'San',
                num: 300
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var ps = wrap.getElementsByTagName('p');
        var h2s = wrap.getElementsByTagName('h2');
        var h3s = wrap.getElementsByTagName('h3');
        var h4s = wrap.getElementsByTagName('h4');
        var h5s = wrap.getElementsByTagName('h5');

        expect(ps[0].innerHTML).toBe('300');
        expect(h2s.length).toBe(0);
        expect(h3s.length).toBe(0);
        expect(h4s.length).toBe(1);
        expect(h5s.length).toBe(0);

        myComponent.data.set('num', 30000);

        san.nextTick(function () {

            expect(ps[0].innerHTML).toBe('30000');
            expect(h2s.length).toBe(1);
            expect(h3s.length).toBe(0);
            expect(h4s.length).toBe(0);
            expect(h5s.length).toBe(0);

            myComponent.data.set('num', 10);
            san.nextTick(function () {

                expect(ps[0].innerHTML).toBe('10');
                expect(h2s.length).toBe(0);
                expect(h3s.length).toBe(0);
                expect(h4s.length).toBe(0);
                expect(h5s.length).toBe(1);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it("scoped by default content", function (done) {
        var Man = san.defineComponent({
            template: '<div><slot var-n="data.name" var-email="data.email" var-sex="data.sex ? \'male\' : \'female\'"><p>{{n}},{{sex}},{{email}}</p></slot></div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-man': Man
            },

            template: '<div><x-man data="{{man}}"/></div>',

            initData: function () {
                return {
                    man: {
                        name: 'errorrik',
                        sex: 1,
                        email: 'errorrik@gmail.com'
                    }
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('p')[0].innerHTML).toBe('errorrik,male,errorrik@gmail.com');
        myComponent.data.set('man.email', 'erik168@163.com');
        san.nextTick(function () {
            expect(wrap.getElementsByTagName('p')[0].innerHTML).toBe('errorrik,male,erik168@163.com');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("scoped by default content which has filter", function (done) {
        var Man = san.defineComponent({
            filters: {
                upper: function (source) {
                    return source.charAt(0).toUpperCase() + source.slice(1);
                }
            },
            template: '<div><slot var-n="data.name" var-email="data.email" var-sex="data.sex ? \'male\' : \'female\'"><p>{{n|upper}},{{sex|upper}},{{email|upper}}</p></slot></div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-man': Man
            },

            filters: {
                upper: function (source) {
                    return source.toUpperCase();
                }
            },

            template: '<div><x-man data="{{man}}"/></div>',

            initData: function () {
                return {
                    man: {
                        name: 'errorrik',
                        sex: 1,
                        email: 'errorrik@gmail.com'
                    }
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('p')[0].innerHTML).toContain('Errorrik,Male,Errorrik@gmail.com');
        myComponent.data.set('man.email', 'erik168@163.com');
        san.nextTick(function () {
            expect(wrap.getElementsByTagName('p')[0].innerHTML).toContain('Errorrik,Male,Erik168@163.com');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("scoped by given content", function (done) {
        var Man = san.defineComponent({
            template: '<div><slot name="test" var-n="data.name" var-email="data.email" var-sex="data.sex ? \'male\' : \'female\'"><p>{{n}},{{sex}},{{email}}</p></slot></div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-man': Man
            },

            template: '<div><x-man data="{{man}}"><h3 slot="test">{{n}}</h3><b slot="test">{{sex}}</b><u slot="test">{{email}}</u></x-man></div>',

            initData: function () {
                return {
                    man: {
                        name: 'errorrik',
                        sex: 1,
                        email: 'errorrik@gmail.com'
                    }
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('errorrik');
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('male');
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('errorrik@gmail.com');
        myComponent.data.set('man.email', 'erik168@163.com');
        san.nextTick(function () {

            expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('errorrik');
            expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('male');
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('erik168@163.com');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("scoped var should auto camel", function (done) {
        var Man = san.defineComponent({
            template: '<div><slot name="test" var-p-name="data.name" var-p-email="data.email" var-p-sex="data.sex ? \'male\' : \'female\'"><p>{{pName}},{{pSex}},{{pEmail}}</p></slot></div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-man': Man
            },

            template: '<div><x-man data="{{man}}"><h3 slot="test">{{pName}}</h3><b slot="test">{{pSex}}</b><u slot="test">{{pEmail}}</u></x-man></div>',

            initData: function () {
                return {
                    man: {
                        name: 'errorrik',
                        sex: 1,
                        email: 'errorrik@gmail.com'
                    }
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('errorrik');
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('male');
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('errorrik@gmail.com');
        myComponent.data.set('man.email', 'erik168@163.com');
        san.nextTick(function () {

            expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('errorrik');
            expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('male');
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('erik168@163.com');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("scoped by given content which has filter", function (done) {
        var Man = san.defineComponent({
            filters: {
                upper: function (source) {
                    return source.charAt(0).toUpperCase() + source.slice(1);
                }
            },

            template: '<div><slot name="test" var-n="data.name" var-email="data.email" var-sex="data.sex ? \'male\' : \'female\'"><p>{{n}},{{sex}},{{email}}</p></slot></div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-man': Man
            },

            filters: {
                upper: function (source) {
                    return source.toUpperCase();
                }
            },

            template: '<div><x-man data="{{man}}"><h3 slot="test">{{n|upper}}</h3><b slot="test">{{sex|upper}}</b><u slot="test">{{email|upper}}</u></x-man></div>',

            initData: function () {
                return {
                    man: {
                        name: 'errorrik',
                        sex: 1,
                        email: 'errorrik@gmail.com'
                    }
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('h3')[0].innerHTML).toContain('ERRORRIK');
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toContain('MALE');
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toContain('ERRORRIK@GMAIL.COM');
        myComponent.data.set('man.email', 'erik168@163.com');
        san.nextTick(function () {

            expect(wrap.getElementsByTagName('h3')[0].innerHTML).toContain('ERRORRIK');
            expect(wrap.getElementsByTagName('b')[0].innerHTML).toContain('MALE');
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toContain('ERIK168@163.COM');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });


    it("scoped apply s-for by default, has init data", function (done) {
        var Mans = san.defineComponent({
            template: '<div><slot/><slot name="test" var-n="item.name" var-email="item.email" var-sex="item.sex ? \'male\' : \'female\'" s-for="item in data"><p>{{n}},{{sex}},{{email}}</p></slot></div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-mans': Mans
            },

            template: '<div><x-mans data="{{mans}}" s-ref="mans"><h2>{{title}}</h2></x-mans></div>',

            initData: function () {
                return {
                    title: 'contributors',
                    mans: [
                        {name: 'errorrik', sex: 1, email: 'errorrik@gmail.com'},
                        {name: 'varsha', sex: 0, email: 'wangshuonpu@163.com'},
                        {name: 'otakustay', email: 'otakustay@gmail.com', sex: 1}
                    ]
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('h2')[0].innerHTML).toBe('contributors');
        var ps = wrap.getElementsByTagName('p');

        expect(ps.length).toBe(3);

        expect(ps[0].innerHTML).toBe('errorrik,male,errorrik@gmail.com');
        expect(ps[1].innerHTML).toBe('varsha,female,wangshuonpu@163.com');
        expect(ps[2].innerHTML).toBe('otakustay,male,otakustay@gmail.com');

        var mans = myComponent.ref('mans');
        var testSlots = mans.slot('test');
        expect(testSlots.length).toBe(3);

        expect(testSlots[0].isScoped).toBeTruthy();
        expect(testSlots[0].isInserted).toBeFalsy();


        myComponent.data.pop('mans');
        myComponent.data.set('mans[0].email', 'erik168@163.com');
        san.nextTick(function () {

            var mans = myComponent.ref('mans');
            var testSlots = mans.slot('test');
            expect(testSlots.length).toBe(2);

            expect(ps.length).toBe(2);

            expect(ps[0].innerHTML).toBe('errorrik,male,erik168@163.com');
            expect(ps[1].innerHTML).toBe('varsha,female,wangshuonpu@163.com');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("scoped apply s-for by default, has no init data", function (done) {
        var Mans = san.defineComponent({
            template: '<div><slot/><slot name="test" var-n="{{item.name}}" var-email="{{item.email}}" var-sex="{{item.sex ? \'male\' : \'female\'}}" s-for="item in data"><p>{{n}},{{sex}},{{email}}</p></slot></div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-mans': Mans
            },

            template: '<div><x-mans data="{{mans}}" s-ref="mans"><h2>{{title}}</h2><h3 slot="test">{{n}}</h3><b slot="test">{{sex}}</b><u slot="test">{{email}}</u></x-mans></div>',

            initData: function () {
                return {
                    title: 'contributors'
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        expect(wrap.getElementsByTagName('h2')[0].innerHTML).toBe('contributors');
        var h3s = wrap.getElementsByTagName('h3');
        expect(h3s.length).toBe(0);

        var mans = myComponent.ref('mans');
        var testSlots = mans.slot('test');
        expect(testSlots.length).toBe(0);


        myComponent.data.set('mans', [
            {name: 'errorrik', sex: 1, email: 'errorrik@gmail.com'},
            {name: 'varsha', sex: 0, email: 'wangshuonpu@163.com'},
            {name: 'otakustay', email: 'otakustay@gmail.com', sex: 1}
        ]);
        myComponent.data.set('title', 'members');

        san.nextTick(function () {
            expect(wrap.getElementsByTagName('h2')[0].innerHTML).toBe('members');
            var h3s = wrap.getElementsByTagName('h3');
            var us = wrap.getElementsByTagName('u');
            var bs = wrap.getElementsByTagName('b');

            expect(h3s.length).toBe(3);
            expect(h3s[0].innerHTML).toBe('errorrik');
            expect(h3s[1].innerHTML).toBe('varsha');
            expect(h3s[2].innerHTML).toBe('otakustay');
            expect(us[0].innerHTML).toBe('errorrik@gmail.com');
            expect(us[1].innerHTML).toBe('wangshuonpu@163.com');
            expect(us[2].innerHTML).toBe('otakustay@gmail.com');
            expect(bs[0].innerHTML).toBe('male');
            expect(bs[1].innerHTML).toBe('female');
            expect(bs[2].innerHTML).toBe('male');

            var mans = myComponent.ref('mans');
            var testSlots = mans.slot('test');
            expect(testSlots.length).toBe(3);
            expect(testSlots[0].isScoped).toBeTruthy();
            expect(testSlots[0].isInserted).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("scoped by default content has event listen", function (done) {
        var clickInfo = {};
        var Man = san.defineComponent({
            template: '<div><slot name="test" var-n="{{data.name}}" var-email="{{data.email}}" var-sex="{{data.sex ? \'male\' : \'female\'}}"><p on-click="emailClick(email)">{{n}},{{sex}},{{email}}</p></slot></div>',
            emailClick: function (email) {
                clickInfo.email = email;
                clickInfo.outer = false;
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-man': Man
            },

            template: '<div><x-man data="{{man}}"></x-man></div>',

            initData: function () {
                return {
                    man: {
                        name: 'errorrik',
                        sex: 1,
                        email: 'errorrik@gmail.com'
                    }
                };
            },

            emailClick: function (email) {
                clickInfo.email = 'fail';
                clickInfo.outer = true;
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('p')[0].innerHTML).toBe('errorrik,male,errorrik@gmail.com');
        myComponent.data.set('man.email', 'erik168@163.com');
        san.nextTick(function () {
            expect(wrap.getElementsByTagName('p')[0].innerHTML).toBe('errorrik,male,erik168@163.com');

            triggerEvent(wrap.getElementsByTagName('p')[0], 'click');
            setTimeout(function () {
                expect(clickInfo.email).toBe('erik168@163.com');
                expect(clickInfo.outer).toBeFalsy();

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            }, 500);
        })
    });

    it("scoped by given content has event listen", function (done) {
        var clickInfo = {};
        var Man = san.defineComponent({
            template: '<div><slot name="test" var-n="data.name" var-email="data.email" var-sex="data.sex ? \'male\' : \'female\'"><p>{{n}},{{sex}},{{email}}</p></slot></div>',
            emailClick: function (email) {
                clickInfo.email = 'fail';
                clickInfo.outer = false;
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-man': Man
            },

            template: '<div><x-man data="{{man}}"><h3 slot="test">{{n}}</h3><b slot="test">{{sex}}</b><u slot="test" on-click="emailClick(email)">{{email}}</u></x-man></div>',

            initData: function () {
                return {
                    man: {
                        name: 'errorrik',
                        sex: 1,
                        email: 'errorrik@gmail.com'
                    }
                };
            },

            emailClick: function (email) {
                clickInfo.email = email;
                clickInfo.outer = true;
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('errorrik');
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('male');
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('errorrik@gmail.com');
        myComponent.data.set('man.email', 'erik168@163.com');
        san.nextTick(function () {

            expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('errorrik');
            expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('male');
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('erik168@163.com');

            triggerEvent(wrap.getElementsByTagName('u')[0], 'click');
            setTimeout(function () {
                expect(clickInfo.email).toBe('erik168@163.com');
                expect(clickInfo.outer).toBeTruthy();

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            }, 500);
        })
    });

    it("scoped by default content with s-bind", function (done) {
        var Man = san.defineComponent({
            template: '<div><slot s-bind="{n:data.name, email: data.email, sex: data.sex ? \'male\' : \'female\'}"><p>{{n}},{{sex}},{{email}}</p></slot></div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-man': Man
            },

            template: '<div><x-man data="{{man}}"/></div>',

            initData: function () {
                return {
                    man: {
                        name: 'errorrik',
                        sex: 1,
                        email: 'errorrik@gmail.com'
                    }
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('p')[0].innerHTML).toBe('errorrik,male,errorrik@gmail.com');
        myComponent.data.set('man.email', 'erik168@163.com');
        san.nextTick(function () {
            expect(wrap.getElementsByTagName('p')[0].innerHTML).toBe('errorrik,male,erik168@163.com');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });


    it("scoped by given content with s-bind and var-", function (done) {
        var Man = san.defineComponent({
            template: '<div><slot name="test" s-bind="{n:data.name, email: \'no@no.com\', sex: \'shemale\'}" var-email="data.email" var-sex="data.sex ? \'male\' : \'female\'"><p>{{n}},{{sex}},{{email}}</p></slot></div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-man': Man
            },

            template: '<div><x-man data="{{man}}"><h3 slot="test">{{n}}</h3><b slot="test">{{sex}}</b><u slot="test">{{email}}</u></x-man></div>',

            initData: function () {
                return {
                    man: {
                        name: 'errorrik',
                        sex: 1,
                        email: 'errorrik@gmail.com'
                    }
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('errorrik');
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('male');
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('errorrik@gmail.com');
        myComponent.data.set('man.email', 'erik168@163.com');
        myComponent.data.set('man.name', 'erik');
        san.nextTick(function () {

            expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('erik');
            expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('male');
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('erik168@163.com');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("scoped by given content with s-bind and var-, both dynamic data ref", function (done) {
        var Man = san.defineComponent({
            template: '<div><slot name="test" s-bind="{n:data.name, email: data.email, sex: \'shemale\'}" var-email="data.email2" var-sex="data.sex ? \'male\' : \'female\'"><p>{{n}},{{sex}},{{email}}</p></slot></div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-man': Man
            },

            template: '<div><x-man data="{{man}}"><h3 slot="test">{{n}}</h3><b slot="test">{{sex}}</b><u slot="test">{{email}}</u></x-man></div>',

            initData: function () {
                return {
                    man: {
                        name: 'errorrik',
                        sex: 1,
                        email: 'errorrik@gmail.com',
                        email2: 'errorrik2@gmail.com'
                    }
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('errorrik');
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('male');
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('errorrik2@gmail.com');
        myComponent.data.set('man.email', 'erik168@163.com');
        myComponent.data.set('man.email2', 'erik1682@163.com');
        san.nextTick(function () {

            expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('errorrik');
            expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('male');
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('erik1682@163.com');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("scoped by given content with var-, splice", function (done) {
        var Man = san.defineComponent({
            template: '<div><slot name="test" var-n="data.name" var-emails="data.emails" var-sex="data.sex ? \'male\' : \'female\'"><p>{{n}},{{sex}},{{email}}</p></slot></div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-man': Man
            },

            template: '<div><x-man data="{{man}}"><h3 slot="test">{{n}}</h3><b slot="test">{{sex}}</b><u slot="test" s-for="email in emails">{{email}}</u></x-man></div>',

            initData: function () {
                return {
                    man: {
                        name: 'errorrik',
                        sex: 1,
                        emails: ['errorrik@gmail.com']
                    }
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('errorrik');
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('male');
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('errorrik@gmail.com');
        myComponent.data.push('man.emails', 'erik168@163.com');
        san.nextTick(function () {

            expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('errorrik');
            expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('male');
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('errorrik@gmail.com');
            expect(wrap.getElementsByTagName('u')[1].innerHTML).toBe('erik168@163.com');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("has s-bind children, and update twice", function (done) {
        var ChildContainer = san.defineComponent({
            template :'<a><slot /></a>'
        });
        var Child = san.defineComponent( {
            template: '<b>{{name}}</b>'
        });

        var MyComponent = san.defineComponent({
            components : {
                'x-c': Child,
                'x-container': ChildContainer
            },
            template : '<div><x-container>'
                + '<x-c s-bind="{{a}}" />'
                + '<x-c s-bind="{{b}}" />'
                + '</x-container></div>'
        });

        var myComponent = new MyComponent({
            data: {
                a: {
                    name: 'a'
                },
                b: {
                    name: 'b'
                }
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var bs = wrap.getElementsByTagName('b');
        expect(bs[0].innerHTML).toBe('a');
        expect(bs[1].innerHTML).toBe('b');

        myComponent.data.set('a.name', 'A');
        myComponent.nextTick(function () {
            var bs = wrap.getElementsByTagName('b');
            expect(bs[0].innerHTML).toBe('A');
            expect(bs[1].innerHTML).toBe('b');

            myComponent.data.set('b.name', 'B');

            myComponent.nextTick(function () {
                var bs = wrap.getElementsByTagName('b');
                expect(bs[0].innerHTML).toBe('A');
                expect(bs[1].innerHTML).toBe('B');

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        })
    });

    it("deep", function (done) {
        var Panel = san.defineComponent({
            template: '<div><slot/></div>'
        });

        var Button = san.defineComponent({
            template: '<div><a><slot/></a></div>'
        });

        var Folder = san.defineComponent({
            template: '<div><h3 on-click="toggle"><slot name="title"/></h3><slot s-if="!hidden"/></div>',
            toggle: function () {
                var hidden = this.data.get('hidden');
                this.data.set('hidden', !hidden);
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-panel': Panel,
                'x-folder': Folder,
                'x-button': Button
            },

            template: '<div>'
                + '<x-folder hidden="{{folderHidden}}" s-ref="folder">'
                + '<b slot="title">{{title}}</b>'
                + '<x-panel><u>{{name}}</u><x-button>{{closeText}}</x-button></x-panel>'
                + '</x-folder>'
                + '</div>',

            initData: function () {
                return {
                    title: 'contributor',
                    name: 'errorrik',
                    closeText: 'X'
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var folder = myComponent.ref('folder');
        expect(folder.slot().length).toBe(1);
        expect(folder.slot('title').length).toBe(1);

        expect(!!folder.slot('title')[0].isInserted).toBeTruthy();
        expect(!!folder.slot('title')[0].isScoped).toBeFalsy();
        expect(!!folder.slot()[0].isInserted).toBeTruthy();
        expect(!!folder.slot()[0].isScoped).toBeFalsy();
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('contributor');
        expect(wrap.getElementsByTagName('a')[0].innerHTML).toContain('X');
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('errorrik');

        myComponent.data.set('closeText', 'close');
        myComponent.data.set('title', 'member');
        myComponent.data.set('name', 'otakustay');

        san.nextTick(function () {

            expect(wrap.getElementsByTagName('b')[0].getAttribute('slot') == null).toBeTruthy();
            expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('member');
            expect(wrap.getElementsByTagName('a')[0].innerHTML).toContain('close');
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('otakustay');


            myComponent.data.set('folderHidden', true);

            san.nextTick(function () {

                expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('member');
                expect(wrap.getElementsByTagName('a').length).toBe(0);
                expect(wrap.getElementsByTagName('u').length).toBe(0);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        })
    });

    it("deep nest slot and slot()", function (done) {
        var Head = san.defineComponent({
            template: '<h3><slot/></h3>'
        });

        var Content = san.defineComponent({
            template: '<p><slot/></p>'
        });

        var Folder = san.defineComponent({
            components: {
                'x-head': Head,
                'x-content': Content
            },

            template:
                '<div>'
                    + '<x-head on-click="native:toggle"><slot name="head">head</slot></x-head>'
                    + '<x-content style="{{isShow ? \'\' : \'display:none\'}}"><slot>content</slot></x-content>'
                    + '<p style="{{isShow ? \'\' : \'display:none\'}}"><slot name="foot">foot</slot></p>'
                + '</div>',

            toggle: function () {
                this.data.set('isShow', !this.data.get('isShow'));
            }

        });

        var MyComponent = san.defineComponent({
            components: {
                'x-folder': Folder
            },
            template:
                '<div>'
                    + '<x-folder isShow="true" s-ref="folder">'
                        + '<b slot="head">{{head}}</b>'
                        + '<strong slot="foot">{{foot}}</strong>'
                        + '<u>{{content}}</u>'
                    + '</x-folder>'
                + '</div>'

        });


        var myComponent = new MyComponent({
            data: {
                head: 'Hello',
                content: 'San',
                foot: 'Bye ER'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var folder = myComponent.ref('folder');
        expect(folder.slot().length).toBe(1);
        expect(folder.slot('head').length).toBe(1);
        expect(folder.slot('foot').length).toBe(1);

        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('Hello');
        expect(wrap.getElementsByTagName('strong')[0].innerHTML).toBe('Bye ER');
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('San');

        myComponent.data.set('head', 'Bye');
        myComponent.data.set('content', 'ER');
        myComponent.data.set('foot', 'Hello San');

        san.nextTick(function () {
            expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('Bye');
            expect(wrap.getElementsByTagName('strong')[0].innerHTML).toBe('Hello San');
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('ER');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("dynamic slot name description", function (done) {
        var Table = san.defineComponent({
            template: ''
                + '<div>'
                + '    <h3 s-for="col in columns">{{col.label}}</h3>'
                + '    <ul s-for="row in datasource">'
                + '      <li s-for="col in columns"><slot name="col-{{col.name}}" var-row="row" var-col="col">{{row[col.name]}}</slot></li>'
                + '    </ul>'
                + '</div>'
          });

        var MyComponent = san.defineComponent({
            components: {
                'x-table': Table
            },
            template:
                '<div>'
                    + '<x-table columns="{{columns}}" datasource="{{list}}">'
                        + '<b slot="col-name">{{row.name}}</b>'
                    + '</x-table>'
                + '</div>'

        });

        var myComponent = new MyComponent({
            data: {
                columns: [
                    {name: 'name', label: '名'},
                    {name: 'email', label: '邮'}
                ],
                list: [
                    {name: 'errorrik', email: 'errorrik@gmail.com'},
                    {name: 'leeight', email: 'leeight@gmail.com'}
                ]
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var bs = wrap.getElementsByTagName('b');
        expect(bs.length).toBe(2);
        expect(bs[0].innerHTML).toBe('errorrik');
        expect(bs[1].innerHTML).toBe('leeight');

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].innerHTML).toContain('errorrik@gmail.com');
        expect(lis[3].innerHTML).toContain('leeight@gmail.com');

        myComponent.data.push('list', {name: 'otakustay', email: 'otakustay@gmail.com'});
        myComponent.data.set('list[0].email', 'erik168@163.com');

        myComponent.nextTick(function () {
            var bs = wrap.getElementsByTagName('b');
            expect(bs.length).toBe(3);
            expect(bs[2].innerHTML).toBe('otakustay');

            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(6);
            expect(lis[1].innerHTML).toContain('erik168@163.com');
            expect(lis[5].innerHTML).toContain('otakustay@gmail.com');

            myComponent.data.set('columns', [
                {name: 'email', label: '邮'},
                {name: 'name', label: '名'}
            ]);

            myComponent.nextTick(function () {
                var bs = wrap.getElementsByTagName('b');
                expect(bs.length).toBe(3);
                expect(bs[0].innerHTML).toBe('errorrik');
                expect(bs[1].innerHTML).toBe('leeight');

                var lis = wrap.getElementsByTagName('li');
                expect(lis.length).toBe(6);
                expect(lis[2].innerHTML).toContain('leeight@gmail.com');
                expect(lis[0].innerHTML).toContain('erik168@163.com');
                expect(lis[4].innerHTML).toContain('otakustay@gmail.com');

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });

        });
    });

    it("a complex spec may cause component _update re-in", function (done) {
        var ColFilter = san.defineComponent({
            template: '<div>'
                + '<a on-click="toggleDisplay(i)" s-for="col,i in cols" class="{{col.hidden ? \'col-hidden\' : \'\'}}">{{col.name}}</a>'
                + '</div>',

            toggleDisplay: function (index) {
                var cols = this.data.get('cols').slice(0);

                for (var i = 0; i < cols.length; i++) {
                    var col = cols[i];
                    this.data.set('cols[' + i + ']', {
                        name: col.name,
                        label: col.label,
                        hidden: i === index ? !col.hidden : !!col.hidden
                    });
                }

            }
        });

        var Man = san.defineComponent({
            template: '<u>{{man.label}}</u>'
        })
        var Table = san.defineComponent({
            components: {
                'x-man': Man
            },
            computed: {
                cols: function () {
                    var result = [];
                    var cols = this.data.get('columns');
                    for (var i = 0; i < cols.length; i++) {
                        if (!cols[i].hidden) {
                            result.push(cols[i]);
                        }
                    }

                    return result;
                }
            },
            template: ''
                + '<div>'
                + '    <div><b s-for="col in cols"><slot name="h-{{col.name}}" var-col="col"><x-man man="{{col}}"/></slot></b></div>'
                + '    <ul s-for="row, i in datasource">'
                + '      <li s-for="col in cols"><slot name="col-{{col.name}}" var-row="row" var-col="col">{{row[col.name]}}</slot></li>'
                + '    </ul>'
                + '</div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-filter': ColFilter,
                'x-p': Table
            },

            computed: {
                columns: function () {
                    var result = [];
                    var cols = this.data.get('list.columns');
                    for (var i = 0; i < cols.length; i++) {
                        if (!cols[i].hidden) {
                            result.push(cols[i]);
                        }
                    }

                    return result;
                }
            },

            template:
                '<div>'
                + '<x-filter cols="{=list.columns=}" s-ref="fi"/>'
                + '<x-p columns="{{list.columns}}" datasource="{{list.data}}" selected="{=list.selectedIndex=}"/>'
                + '</div>'

        });

        var myComponent = new MyComponent({
            data: {
                list: {
                    columns: [
                        { name: 'name', label: '名' },
                        { name: 'email', label: '邮' },
                        { name: 'sex', label: '性' }
                    ],
                    data: [
                        { name: 'errorrik', email: 'errorrik@gmail.com', sex: 1 },
                        { name: 'leeight', email: 'leeight@gmail.com', sex: 1 },
                        { name: 'otakustay', email: 'otakustay@gmail.com', sex: 1 }
                    ]
                }
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var us = wrap.getElementsByTagName('u');
        expect(us.length).toBe(3);
        expect(us[0].innerHTML).toBe('名');
        expect(us[1].innerHTML).toBe('邮');
        expect(us[2].innerHTML).toBe('性');

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(9);
        expect(lis[0].innerHTML).toContain('errorrik');
        expect(lis[1].innerHTML).toContain('errorrik@gmail.com');
        expect(lis[3].innerHTML).toContain('leeight');
        expect(lis[4].innerHTML).toContain('leeight@gmail.com');
        expect(lis[6].innerHTML).toContain('otakustay');
        expect(lis[7].innerHTML).toContain('otakustay@gmail.com');


        myComponent.ref('fi').toggleDisplay(1);

        myComponent.nextTick(function () {
            var us = wrap.getElementsByTagName('u');
            expect(us.length).toBe(2);
            expect(us[0].innerHTML).toBe('名');
            expect(us[1].innerHTML).toBe('性');

            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(6);
            expect(lis[0].innerHTML).toContain('errorrik');
            expect(lis[1].innerHTML).toContain('1');
            expect(lis[2].innerHTML).toContain('leeight');
            expect(lis[3].innerHTML).toContain('1');
            expect(lis[4].innerHTML).toContain('otakustay');
            expect(lis[5].innerHTML).toContain('1');

            myComponent.ref('fi').toggleDisplay(0);

            myComponent.nextTick(function () {
                var us = wrap.getElementsByTagName('u');
                expect(us.length).toBe(1);
                expect(us[0].innerHTML).toBe('性');

                var lis = wrap.getElementsByTagName('li');
                expect(lis.length).toBe(3);
                expect(lis[0].innerHTML).toContain('1');
                expect(lis[1].innerHTML).toContain('1');
                expect(lis[2].innerHTML).toContain('1');

                myComponent.ref('fi').toggleDisplay(1);

                myComponent.nextTick(function () {
                    var us = wrap.getElementsByTagName('u');
                    expect(us.length).toBe(2);
                    expect(us[0].innerHTML).toBe('邮');
                    expect(us[1].innerHTML).toBe('性');

                    var lis = wrap.getElementsByTagName('li');
                    expect(lis.length).toBe(6);
                    expect(lis[0].innerHTML).toContain('errorrik@gmail.com');
                    expect(lis[1].innerHTML).toContain('1');
                    expect(lis[2].innerHTML).toContain('leeight@gmail.com');
                    expect(lis[3].innerHTML).toContain('1');
                    expect(lis[4].innerHTML).toContain('otakustay@gmail.com');
                    expect(lis[5].innerHTML).toContain('1');

                    myComponent.dispose();
                    document.body.removeChild(wrap);
                    done();
                });
            });

        });
    });

    it("dynamic slot name description and dynamic name in given slot element", function (done) {
        var Table = san.defineComponent({
            template: ''
                + '<div>'
                + '    <h3 s-for="col in columns">{{col.label}}</h3>'
                + '    <ul s-for="row in datasource">'
                + '      <li s-for="col in columns"><slot name="col-{{col.name}}" var-row="row" var-col="col">{{row[col.name]}}</slot></li>'
                + '    </ul>'
                + '</div>'
          });

        var MyComponent = san.defineComponent({
            components: {
                'x-table': Table
            },
            template:
                '<div>'
                    + '<x-table columns="{{dep.columns}}" datasource="{{dep.members}}" s-for="dep in deps">'
                        + '<b slot="col-{{dep.strong}}">{{row[col.name]}}</b>'
                    + '</x-table>'
                + '</div>'

        });

        var myComponent = new MyComponent({
            data: {
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
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var bs = wrap.getElementsByTagName('b');
        expect(bs.length).toBe(4);
        expect(bs[0].innerHTML).toBe('Justineo');
        expect(bs[1].innerHTML).toBe('errorrik');
        expect(bs[2].innerHTML).toBe('otakustay@gmail.com');
        expect(bs[3].innerHTML).toBe('leeight@gmail.com');

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(8);
        expect(lis[1].innerHTML).toContain('justineo@gmail.com');
        expect(lis[3].innerHTML).toContain('errorrik@gmail.com');
        expect(lis[4].innerHTML).toContain('otakustay');
        expect(lis[6].innerHTML).toContain('leeight');


        myComponent.data.set('deps[0].strong', 'email');
        myComponent.data.pop('deps[0].members');
        myComponent.data.push('deps[1].members', {name: 'who', email: 'areyou@gmail.com'});

        myComponent.nextTick(function () {
            var bs = wrap.getElementsByTagName('b');
            expect(bs.length).toBe(4);
            expect(bs[0].innerHTML).toBe('justineo@gmail.com');
            expect(bs[1].innerHTML).toBe('otakustay@gmail.com');
            expect(bs[2].innerHTML).toBe('leeight@gmail.com');
            expect(bs[3].innerHTML).toBe('areyou@gmail.com');

            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(8);
            expect(lis[0].innerHTML).toContain('Justineo');
            expect(lis[2].innerHTML).toContain('otakustay');
            expect(lis[4].innerHTML).toContain('leeight');
            expect(lis[6].innerHTML).toContain('who');

            myComponent.data.set('deps[1].columns', [
                {name: 'email', label: '邮'},
                {name: 'name', label: '名'}
            ]);

            myComponent.nextTick(function () {
                var bs = wrap.getElementsByTagName('b');
                expect(bs.length).toBe(4);
                expect(bs[0].innerHTML).toBe('justineo@gmail.com');
                expect(bs[1].innerHTML).toBe('otakustay@gmail.com');
                expect(bs[2].innerHTML).toBe('leeight@gmail.com');
                expect(bs[3].innerHTML).toBe('areyou@gmail.com');

                var lis = wrap.getElementsByTagName('li');
                expect(lis.length).toBe(8);
                expect(lis[0].innerHTML).toContain('Justineo');
                expect(lis[3].innerHTML).toContain('otakustay');
                expect(lis[5].innerHTML).toContain('leeight');
                expect(lis[7].innerHTML).toContain('who');

                myComponent.data.set('deps[1].strong', 'name');

                myComponent.nextTick(function () {
                    var bs = wrap.getElementsByTagName('b');
                    expect(bs.length).toBe(4);
                    expect(bs[0].innerHTML).toBe('justineo@gmail.com');
                    expect(bs[1].innerHTML).toBe('otakustay');
                    expect(bs[2].innerHTML).toBe('leeight');
                    expect(bs[3].innerHTML).toBe('who');

                    myComponent.dispose();
                    document.body.removeChild(wrap);
                    done();
                });
            });
        });
    });

    it("scoped by default content, access inner data", function (done) {
        var Man = san.defineComponent({
            template: '<div><slot var-n="data.name" var-email="data.email" var-sex="data.sex ? \'male\' : \'female\'"><p>{{n}},{{sex}},{{email}} - {{desc}}</p></slot></div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-man': Man
            },

            template: '<div><x-man data="{{man}}" desc="{{tip}}"/></div>',

            initData: function () {
                return {
                    man: {
                        name: 'errorrik',
                        sex: 1,
                        email: 'errorrik@gmail.com'
                    },
                    tip: 'tip'
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('p')[0].innerHTML).toBe('errorrik,male,errorrik@gmail.com - tip');
        myComponent.data.set('man.email', 'erik168@163.com');
        myComponent.data.set('tip', 'sb');
        san.nextTick(function () {
            expect(wrap.getElementsByTagName('p')[0].innerHTML).toBe('errorrik,male,erik168@163.com - sb');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("scoped by given content, access owner data", function (done) {
        var Man = san.defineComponent({
            template: '<div><slot name="test" var-n="data.name" var-email="data.email" var-sex="data.sex ? \'male\' : \'female\'"><p>{{n}},{{sex}},{{email}}</p></slot></div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-man': Man
            },

            template: '<div><x-man data="{{man}}"><h3 slot="test">{{n}}</h3><b slot="test">{{sex}}</b><u slot="test">{{email}}</u><a slot="test">{{desc}}</a></x-man></div>',

            initData: function () {
                return {
                    man: {
                        name: 'errorrik',
                        sex: 1,
                        email: 'errorrik@gmail.com'
                    },
                    desc: 'tip'
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('errorrik');
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('male');
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('errorrik@gmail.com');
        expect(wrap.getElementsByTagName('a')[0].innerHTML).toBe('tip');
        myComponent.data.set('man.email', 'erik168@163.com');
        myComponent.data.set('desc', 'nonono');
        san.nextTick(function () {

            expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('errorrik');
            expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('male');
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('erik168@163.com');
            expect(wrap.getElementsByTagName('a')[0].innerHTML).toBe('nonono');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("text in slot has prev sibling", function (done) {
        var Button = san.defineComponent({
            template: '<a><u s-if="loading">loading</u><slot/></a>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-btn': Button
            },

            template: '<div><x-btn loading="{{loading}}">{{name}}</x-btn></div>'
        });

        var myComponent = new MyComponent({
            data: {
                name: 'HelloSan'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var a = wrap.getElementsByTagName('a')[0];
        expect(wrap.getElementsByTagName('u').length).toBe(0);
        expect(/HelloSan/.test(a.innerHTML)).toBeTruthy();
        myComponent.data.set('name', 'ByeER');
        san.nextTick(function () {

            var a = wrap.getElementsByTagName('a')[0];
            expect(wrap.getElementsByTagName('u').length).toBe(0);
            expect(/HelloSan/.test(a.innerHTML)).toBeFalsy();
            expect(/ByeER/.test(a.innerHTML)).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("scoped slot in for and remove more than once", function (done) {
        var Table = san.defineComponent({
            template: '<ul><li s-for="row, rowIndex in datasource">'
                + '<a s-for="col, colIndex in columns">'
                + '<slot name="c-{{col.name}}" var-row="{{row}}" var-rowIndex="{{rowIndex}}" var-col="{{col}}" var-colIndex="{{colIndex}}"></slot>'
                + '</a>'
                + '</li></ul>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-table': Table
            },

            template: '<div><x-table datasource="{{datasource}}" columns="{{columns}}">'
                + '<u slot="c-name">{{row.name}}</u>'
                + '<u slot="c-age">{{row.age}}</u>'
                + '<u slot="c-eee"><b>del{{rowIndex}}</b></u>'
                + '</x-table></div>'
        });

        var myComponent = new MyComponent({
            data: {
                columns: [
                    { name: 'name' },
                    { name: 'age' },
                    { name: 'eee' }
                ],
                datasource: [
                    { name: 'foo', age: 10 },
                    { name: 'bar', age: 20 }
                ]
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var us = wrap.getElementsByTagName('u');
        expect(us.length).toBe(6);
        expect(us[0].innerHTML).toBe('foo');
        expect(us[1].innerHTML).toBe('10');
        expect(us[3].innerHTML).toBe('bar');
        expect(us[4].innerHTML).toBe('20');

        var bs = wrap.getElementsByTagName('b');
        expect(bs.length).toBe(2);
        expect(bs[0].innerHTML).toBe('del0');
        expect(bs[1].innerHTML).toBe('del1');

        myComponent.data.removeAt('datasource', 0);
        san.nextTick(function () {

            var us = wrap.getElementsByTagName('u');
            expect(us.length).toBe(3);
            expect(us[0].innerHTML).toBe('bar');
            expect(us[1].innerHTML).toBe('20');

            var bs = wrap.getElementsByTagName('b');
            expect(bs.length).toBe(1);
            expect(bs[0].innerHTML).toBe('del0');


            myComponent.data.removeAt('datasource', 0);
            san.nextTick(function () {
                var us = wrap.getElementsByTagName('u');
                expect(us.length).toBe(0);

                var bs = wrap.getElementsByTagName('b');
                expect(bs.length).toBe(0);

                myComponent.data.push('datasource', { name: 'bar', age: 20 });
                myComponent.data.push('datasource', { name: 'foo', age: 10 });

                san.nextTick(function () {
                    var us = wrap.getElementsByTagName('u');
                    expect(us.length).toBe(6);
                    expect(us[3].innerHTML).toBe('foo');
                    expect(us[4].innerHTML).toBe('10');
                    expect(us[0].innerHTML).toBe('bar');
                    expect(us[1].innerHTML).toBe('20');

                    var bs = wrap.getElementsByTagName('b');
                    expect(bs.length).toBe(2);
                    expect(bs[0].innerHTML).toBe('del0');
                    expect(bs[1].innerHTML).toBe('del1');


                    myComponent.data.pop('columns');
                    san.nextTick(function () {
                        var bs = wrap.getElementsByTagName('b');
                        expect(bs.length).toBe(0);

                        myComponent.dispose();
                        document.body.removeChild(wrap);
                        done();
                    });
                });
            });
        })
    });

    it("has text sibling，mix inner text node", function (done) {
        var Panel = san.defineComponent({
            template: '<a>test<slot></slot>dddd</a>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-panel': Panel
            },

            template: '<u><x-panel>{{name}}</x-panel></u>'
        });

        var myComponent = new MyComponent({
            data: {
                name: 'HelloSan'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var a = wrap.getElementsByTagName('a')[0];

        expect(a.innerHTML).toContain('test');
        expect(a.innerHTML).toContain('dddd');
        expect(a.innerHTML).toContain('HelloSan');
        myComponent.data.set('name', 'ByeER');

        san.nextTick(function () {
            expect(a.innerHTML).toContain('ByeER');
            expect(a.innerHTML).toContain('test');
            expect(a.innerHTML).toContain('dddd');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("has text sibling，mix inner text node, init with empty string", function (done) {
        var Panel = san.defineComponent({
            template: '<a>test<slot></slot>dddd</a>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-panel': Panel
            },

            template: '<u><x-panel>{{name}}</x-panel></u>'
        });

        var myComponent = new MyComponent({
            data: {
                name: ''
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var a = wrap.getElementsByTagName('a')[0];

        expect(a.innerHTML).toContain('test');
        expect(a.innerHTML).toContain('dddd');
        myComponent.data.set('name', 'ByeER');

        san.nextTick(function () {
            expect(a.innerHTML).toContain('ByeER');
            expect(a.innerHTML).toContain('test');
            expect(a.innerHTML).toContain('dddd');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("slot prop contains for loop parameters", function (done) {
        var Folder = san.defineComponent({
            template: ''
                +'<div>'
                    + '<p s-for="i in files" class="file-{{i}}"><slot name="slot-{{i}}"/>(<slot name="slot-tip-{{i}}"/>)</p>'
                +'</div>',
            initData: function () {
                return { files: ['error', 'rick'] }
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-folder': Folder
            },

            initData: function () {
                return {
                    files: ['error', 'rick'],
                    tips: {
                        'error': 'bi',
                        'rick': 'du'
                    }
                }
            },

            template: ''
                + '<div>'
                    + '<x-folder>'
                        + '<b s-for="i, j in files" slot="slot-{{i}}">{{ j }}-{{ i }}</b>'
                        + '<span s-for="i in files" slot="slot-tip-{{i}}">{{ tips[i] }}</span>'
                    + '</x-folder>'
                + '</div>'
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var p0 = wrap.getElementsByTagName('p')[0];
        var bs0 = p0.getElementsByTagName('b');
        expect(bs0.length).toBe(1);
        expect(bs0[0].innerHTML).toBe('0-error');
        var span0 = p0.getElementsByTagName('span');
        expect(span0.length).toBe(1);
        expect(span0[0].innerHTML).toBe('bi');

        var p1 = p0.nextSibling;
        bs1 = p1.getElementsByTagName('b');
        expect(bs1.length).toBe(1);
        expect(bs1[0].innerHTML).toBe('1-rick');
        var span1 = p1.getElementsByTagName('span');
        expect(span1.length).toBe(1);
        expect(span1[0].innerHTML).toBe('du');

        done();
    });
});
