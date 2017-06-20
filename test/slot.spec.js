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
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('foo');

        myComponent.data.set('foo', 'san');
        san.nextTick(function () {
            expect(wrap.getElementsByTagName('u').length).toBe(1);
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('san');

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
        var b1 = a1.firstChild;
        expect(a1.href).toBe('http://ecomfe.github.io/san/')
        expect(b1.title).toBe('website');

        var a2 = lis[1].getElementsByTagName('a')[0];
        var b2 = a2.firstChild;
        expect(a2.href).toBe('https://github.com/ecomfe/san')
        expect(b2.title).toBe('github');

        myComponent.data.push('items', {title: 'cdn', url: 'https://unpkg.com/san@latest'})

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');

            var a1 = lis[0].getElementsByTagName('a')[0];
            var b1 = a1.firstChild;
            expect(a1.href).toBe('http://ecomfe.github.io/san/')
            expect(b1.title).toBe('website');

            var a2 = lis[1].getElementsByTagName('a')[0];
            var b2 = a2.firstChild;
            expect(a2.href).toBe('https://github.com/ecomfe/san')
            expect(b2.title).toBe('github');

            var a3 = lis[2].getElementsByTagName('a')[0];
            var b3 = a3.firstChild;
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
        triggerEvent('#' + buttons[0].id, 'click');

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
        var b1 = a1.firstChild;
        expect(a1.href).toBe('http://ecomfe.github.io/san/')
        expect(b1.title).toBe('website');

        var a2 = aEls[1];
        var b2 = a2.firstChild;
        expect(a2.href).toBe('https://github.com/ecomfe/san')
        expect(b2.title).toBe('github');

        myComponent.data.push('items', {title: 'cdn', url: 'https://unpkg.com/san@latest'})

        san.nextTick(function () {
            var aEls = wrap.getElementsByTagName('a');

            var a1 = aEls[0];
            var b1 = a1.firstChild;
            expect(a1.href).toBe('http://ecomfe.github.io/san/')
            expect(b1.title).toBe('website');

            var a2 = aEls[1];
            var b2 = a2.firstChild;
            expect(a2.href).toBe('https://github.com/ecomfe/san')
            expect(b2.title).toBe('github');

            var a3 = aEls[2];
            var b3 = a3.firstChild;
            expect(a3.href).toBe('https://unpkg.com/san@latest')
            expect(b3.title).toBe('cdn');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
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
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('bar');

        myComponent.data.set('bar', 'san');
        san.nextTick(function () {
            expect(wrap.getElementsByTagName('u').length).toBe(1);
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('san');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });
});
