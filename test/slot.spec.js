describe("Slot", function () {



    it("default", function (done) {
        var Panel = san.defineComponent({
            template: '<div>'
                +   '<div class="head" on-click="toggle">{{title}}</div>'
                +   '<p style="{{fold | yesToBe(\'display:none\')}}"><slot></slot></p>'
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
                +   '<p style="{{fold | yesToBe(\'display:none\')}}"><slot></slot></p>'
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

    it("components owner", function (done) {
        var Panel = san.defineComponent({
            template: '<div>'
                +   '<div class="head" title="{{title}}" on-click="toggle">{{title}}</div>'
                +   '<p style="{{fold | yesToBe(\'display:none\')}}"><slot></slot></p>'
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
});
