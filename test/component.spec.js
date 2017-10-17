describe("Component", function () {

    var ColorPicker = san.defineComponent({
        template: '<div><b title="{{value}}">{{value}}</b>'
            + '<ul class="ui-colorpicker">'
            +    '<li '
            +        'san-for="item in datasource" '
            +        'style="background: {{item}}" '
            +        'class="{{item == value ? \'selected\' : \'\'}}" '
            +        'on-click="itemClick(item)"'
            +    '></li>'
            + '</ul></div>',

        initData: {
            datasource: [
                'red', 'blue', 'yellow', 'green'
            ]
        },

        itemClick: function (item) {
            this.data.set('value', item);
        }
    });

    var Label = san.defineComponent({
        template: '<span title="{{text}}">{{text}}</span>'
    });

    it("life cycle", function () {
        var mainInited = 0;
        var mainCreated = 0;
        var mainAttached = 0;
        var mainDetached = 0;
        var mainDisposed = 0;
        var labelInited = 0;
        var labelCreated = 0;
        var labelAttached = 0;
        var labelDetached = 0;
        var labelDisposed = 0;

        var Label = san.defineComponent({
            template: '<span title="{{text}}">{{text}}</span>',

            inited: function () {
                labelInited++;
            },

            created: function () {
                labelCreated++;
            },

            attached: function () {
                labelAttached++;
                labelDetached = 0;
            },

            detached: function () {
                labelDetached++;
                labelAttached = 0;
            },

            disposed: function () {
                labelDisposed++;
            }
        })

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },
            template: '<div title="{{color}}"><ui-label text="{{color}}"/>{{color}}</div>',

            inited: function () {
                mainInited++;
            },

            created: function () {
                mainCreated++;
            },

            attached: function () {
                mainAttached++;
                mainDetached = 0;
            },

            detached: function () {
                mainDetached++;
                mainAttached = 0;
            },

            disposed: function () {
                mainDisposed++;
            }
        });

        var myComponent = new MyComponent();
        expect(!!myComponent.lifeCycle.is('inited')).toBe(true);
        expect(!!myComponent.lifeCycle.is('created')).toBe(false);
        expect(!!myComponent.lifeCycle.is('attached')).toBe(false);
        expect(mainInited).toBe(1);
        expect(mainCreated).toBe(0);
        expect(mainAttached).toBe(0);
        expect(labelInited).toBe(0);

        myComponent.data.set('color', 'green');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);
        expect(!!myComponent.lifeCycle.is('inited')).toBe(true);
        expect(!!myComponent.lifeCycle.is('created')).toBe(true);
        expect(!!myComponent.lifeCycle.is('attached')).toBe(true);
        expect(mainInited).toBe(1);
        expect(mainCreated).toBe(1);
        expect(mainAttached).toBe(1);
        expect(mainDetached).toBe(0);
        expect(labelInited).toBe(1);
        expect(labelCreated).toBe(1);
        expect(labelAttached).toBe(1);
        expect(labelDetached).toBe(0);

        myComponent.detach();
        expect(!!myComponent.lifeCycle.is('created')).toBe(true);
        expect(!!myComponent.lifeCycle.is('attached')).toBe(false);
        expect(!!myComponent.lifeCycle.is('detached')).toBe(true);
        expect(mainCreated).toBe(1);
        expect(mainDetached).toBe(1);
        expect(mainAttached).toBe(0);
        expect(labelInited).toBe(1);
        expect(labelCreated).toBe(1);
        expect(labelAttached).toBe(1);
        expect(labelDetached).toBe(0);

        myComponent.attach(wrap);
        expect(!!myComponent.lifeCycle.is('created')).toBe(true);
        expect(!!myComponent.lifeCycle.is('attached')).toBe(true);
        expect(!!myComponent.lifeCycle.is('detached')).toBe(false);
        expect(mainCreated).toBe(1);
        expect(mainDetached).toBe(0);
        expect(mainAttached).toBe(1);
        expect(labelInited).toBe(1);
        expect(labelCreated).toBe(1);
        expect(labelAttached).toBe(1);
        expect(labelDetached).toBe(0);


        myComponent.dispose();
        expect(!!myComponent.lifeCycle.is('inited')).toBe(false);
        expect(!!myComponent.lifeCycle.is('created')).toBe(false);
        expect(!!myComponent.lifeCycle.is('attached')).toBe(false);
        expect(!!myComponent.lifeCycle.is('detached')).toBe(false);
        expect(!!myComponent.lifeCycle.is('disposed')).toBe(true);
        expect(mainDisposed).toBe(1);
        expect(labelDisposed).toBe(1);
        expect(mainDetached).toBe(1);
        expect(labelDetached).toBe(1);

        document.body.removeChild(wrap);
    });

    it("life cycle and event", function () {
        var phases = {};

        var Label = san.defineComponent({
            template: '<span>test</span>',

            inited: function () {
                this.fire('phase', 'inited');
            },

            created: function () {
                this.fire('phase', 'created');
            },

            attached: function () {
                this.fire('phase', 'attached');
            },

            detached: function () {
                this.fire('phase', 'detached');
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },
            template: '<b><ui-label on-phase="phaser($event)"/></b>',

            phaser: function (e) {
                phases[e] = true;
            }
        });


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);
        expect(phases.inited).toBeTruthy();
        expect(phases.created).toBeTruthy();
        expect(phases.attached).toBeTruthy();
        expect(phases.detached).toBeFalsy();

        myComponent.dispose();
        document.body.removeChild(wrap);
        expect(phases.detached).toBeTruthy();
    });

    it("life cycle updated", function (done) {
        var times = 0;

        var MyComponent = san.defineComponent({
            template: '<a><span title="{{email}}">{{name}}</span></a>',

            updated: function () {
                times++;
            }
        });
        var myComponent = new MyComponent();
        myComponent.data.set('email', 'errorrik@gmail.com');
        myComponent.data.set('name', 'errorrik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(times).toBe(0);

        myComponent.data.set('email', 'erik168@163.com');
        myComponent.data.set('name', 'erik');
        expect(times).toBe(0);

        san.nextTick(function () {
            expect(times).toBe(1);

            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML.indexOf('erik')).toBe(0);
            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })

    });

    it("owner and child component life cycle, and el is ready when attached", function () {
        var uState = {};
        var U = san.defineComponent({
            template: '<u><slot></slot></u>',

            compiled: function () {
                uState.compiled = 1;
            },

            inited: function () {
                uState.inited = 1;
            },

            created: function () {
                expect(this.el.tagName).toBe('U');
                uState.created = 1;
            },

            attached: function () {
                expect(this.el.tagName).toBe('U');
                uState.attached = 1;
            },

            detached: function () {
                uState.detached = 1;
            },

            disposed: function () {
                uState.disposed = 1;
            }
        });

        var mainState = {};
        var MyComponent = san.defineComponent({
            components: {
                'ui-u': U
            },
            template: '<b>hello <ui-u san-ref="u">erik</ui-u></b>',

            compiled: function () {
                mainState.compiled = 1;
            },

            inited: function () {
                mainState.inited = 1;
            },

            created: function () {
                expect(this.el.tagName).toBe('B');
                mainState.created = 1;
            },

            attached: function () {
                expect(this.el.tagName).toBe('B');
                mainState.attached = 1;
            },

            detached: function () {
                mainState.detached = 1;
            },

            disposed: function () {
                mainState.disposed = 1;
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var u = myComponent.ref('u');
        expect(myComponent.el.tagName).toBe('B');
        expect(u.el.tagName).toBe('U');

        expect(uState.inited).toBe(1);
        expect(uState.compiled).toBe(1);
        expect(uState.created).toBe(1);
        expect(uState.attached).toBe(1);
        expect(uState.detached).not.toBe(1);
        expect(uState.disposed).not.toBe(1);

        expect(!!u.lifeCycle.is('inited')).toBeTruthy();
        expect(!!u.lifeCycle.is('compiled')).toBeTruthy();
        expect(!!u.lifeCycle.is('created')).toBeTruthy();
        expect(!!u.lifeCycle.is('attached')).toBeTruthy();
        expect(!!u.lifeCycle.is('detached')).toBeFalsy();
        expect(!!u.lifeCycle.is('disposed')).toBeFalsy();


        expect(mainState.inited).toBe(1);
        expect(mainState.compiled).toBe(1);
        expect(mainState.created).toBe(1);
        expect(mainState.attached).toBe(1);
        expect(mainState.detached).not.toBe(1);
        expect(mainState.disposed).not.toBe(1);

        expect(!!myComponent.lifeCycle.is('inited')).toBeTruthy();
        expect(!!myComponent.lifeCycle.is('compiled')).toBeTruthy();
        expect(!!myComponent.lifeCycle.is('created')).toBeTruthy();
        expect(!!myComponent.lifeCycle.is('attached')).toBeTruthy();
        expect(!!myComponent.lifeCycle.is('detached')).toBeFalsy();
        expect(!!myComponent.lifeCycle.is('disposed')).toBeFalsy();

        myComponent.dispose();


        expect(uState.detached).toBe(1);
        expect(uState.disposed).toBe(1);
        expect(mainState.detached).toBe(1);
        expect(mainState.disposed).toBe(1);


        expect(!!u.lifeCycle.is('inited')).toBeFalsy();
        expect(!!u.lifeCycle.is('compiled')).toBeFalsy();
        expect(!!u.lifeCycle.is('created')).toBeFalsy();
        expect(!!u.lifeCycle.is('attached')).toBeFalsy();
        expect(!!u.lifeCycle.is('detached')).toBeFalsy();
        expect(!!u.lifeCycle.is('disposed')).toBeTruthy();


        expect(!!myComponent.lifeCycle.is('inited')).toBeFalsy();
        expect(!!myComponent.lifeCycle.is('compiled')).toBeFalsy();
        expect(!!myComponent.lifeCycle.is('created')).toBeFalsy();
        expect(!!myComponent.lifeCycle.is('attached')).toBeFalsy();
        expect(!!myComponent.lifeCycle.is('detached')).toBeFalsy();
        expect(!!myComponent.lifeCycle.is('disposed')).toBeTruthy();

        document.body.removeChild(wrap);
    });

    it("data set in inited should not update view", function (done) {
        var up = false;
        var MyComponent = san.defineComponent({

            template: '<a><span title="{{name}}-{{email}}">{{name}}</span></a>',

            inited: function () {
                this.data.set('name', 'errorrik');
            },

            initData: function () {
                return {
                    name: 'erik',
                    email: 'errorrik@gmail.com'
                }
            },

            updated: function () {
                up = true;
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('errorrik-errorrik@gmail.com');
        expect(up).toBeFalsy();

        san.nextTick(function () {
            expect(up).toBeFalsy();
            expect(span.title).toBe('errorrik-errorrik@gmail.com');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("template as static property", function () {
        var MyComponent = san.defineComponent({});
        MyComponent.template = '<span title="{{color}}">{{color}}</span>';
        var myComponent = new MyComponent({data: {color: 'red'}});

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('red');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("template as static property in inherits component", function () {
        var B = san.defineComponent({});
        B.template = '<b title="b">b</b>';

        var MyComponent = function (option) {
            B.call(this, option);
        };
        san.inherits(MyComponent, B);
        MyComponent.template = '<u title="u">u</u>';

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        var b = new B();
        b.attach(wrap);
        expect(wrap.getElementsByTagName('b').length).toBe(1);

        var myComponent = new MyComponent();
        myComponent.attach(wrap);
        expect(wrap.getElementsByTagName('b').length).toBe(1);
        expect(wrap.getElementsByTagName('u').length).toBe(1);

        b.dispose();
        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("template trim whitespace, default none", function () {
        var MyComponent = san.defineComponent({
            template: '<a>  \n    <span>san</span>\n  </a>'
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        // ie会自己干掉第一个空白文本节点，妈蛋
        // 其实它会干掉它认为没意义的节点，包括空白文本节点、注释、空白script
        if (!/msie/i.test(navigator.userAgent)) {
            expect(myComponent.el.firstChild.nodeType).toBe(3);
        }
        expect(myComponent.el.lastChild.nodeType).toBe(3);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("template trim whitespace, trim blank", function () {
        var MyComponent = san.defineComponent({
            template: '<a>  \n    <span>san</span>\n  </a>',
            trimWhitespace: 'blank'
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(myComponent.el.firstChild.nodeType).toBe(1);
        expect(myComponent.el.lastChild).toBe(myComponent.el.firstChild);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("template trim whitespace, trim all", function () {
        var MyComponent = san.defineComponent({
            template: '<a>  begin\n    <span>san</span>\nend  </a>'
        });
        MyComponent.trimWhitespace = 'all';

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(/^begin</.test(myComponent.el.innerHTML)).toBeTruthy();
        expect(/>end$/.test(myComponent.el.innerHTML)).toBeTruthy();

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("filters as static property", function () {
        var MyComponent = san.defineComponent({});

        MyComponent.template = '<span title="{{color|up}}">{{color|up}}</span>';
        MyComponent.filters = {
            up: function (source) {
                return source.toUpperCase();
            }
        };
        var myComponent = new MyComponent({data: {color: 'red'}});

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('RED');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("components as static property", function () {
        var MyComponent = san.defineComponent({});

        MyComponent.template = '<div><ui-label text="erik"></ui-label>';
        MyComponent.components = {
            'ui-label': {
                template: '<span title="{{text}}">{{text}}</span>'
            }
        };
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('erik');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("components in inherits structure", function () {
        var Span = san.defineComponent({});
        Span.template = '<span title="span">span</span>';

        var P = san.defineComponent({});
        P.template = '<p title="p">p</p>';

        var B = san.defineComponent({});
        B.template = '<b title="b">b</b>';
        B.components = {
            'ui-span': Span
        };

        var MyComponent = function (option) {
            B.call(this, option);
        };
        san.inherits(MyComponent, B);
        MyComponent.template = '<u title="u">u<ui-p></ui-p></u>';
        MyComponent.components = {
            'ui-p': P
        };

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        var b = new B();
        b.attach(wrap);
        expect(wrap.getElementsByTagName('b').length).toBe(1);

        var myComponent = new MyComponent();
        myComponent.attach(wrap);
        expect(wrap.getElementsByTagName('b').length).toBe(1);
        expect(wrap.getElementsByTagName('u').length).toBe(1);
        expect(wrap.getElementsByTagName('p').length).toBe(1);

        b.dispose();
        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("initData", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{email}}">{{name}}</span></a>',

            initData: function () {
                return {
                    email: 'errorrik@gmail.com',
                    name: 'errorrik'
                }
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        myComponent.data.set('email', 'erik168@163.com');
        myComponent.data.set('name', 'erik');

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML.indexOf('errorrik')).toBe(0);
        expect(span.title.indexOf('errorrik@gmail.com')).toBe(0);

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML.indexOf('erik')).toBe(0);
            expect(span.title.indexOf('erik168@163.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })

    });

    it("initData merge with option data property", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{email}}">{{name}}</span></a>',

            initData: function () {
                return {
                    email: 'errorrik@gmail.com',
                    name: 'errorrik'
                };
            }
        });

        var myComponent = new MyComponent({
            data: {
                name: 'erik'
            }
        });
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        myComponent.data.set('email', 'erik168@163.com');

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML.indexOf('erik')).toBe(0);
        expect(span.title.indexOf('errorrik@gmail.com')).toBe(0);

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML.indexOf('erik')).toBe(0);
            expect(span.title.indexOf('erik168@163.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })

    });

    it("custom event should not pass DOM Event object, when fire with no arg", function (done) {
        var Label = san.defineComponent({
            template: '<a><span on-click="clicker" id="component-custom-event1" style="cursor:pointer">click here to fire change event with no arg</span></a>',

            clicker: function () {
                this.fire('change');
            }
        });

        var changed = false;

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div><ui-label on-change="labelChange($event)"></ui-label></div>',

            labelChange: function (event) {
                expect(event).toBeUndefined();
                changed = true;
            }
        });


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        function doneSpec() {
            if (changed) {
                done();
                myComponent.dispose();
                document.body.removeChild(wrap);
                return;
            }

            setTimeout(doneSpec, 500);
        }

        triggerEvent('#component-custom-event1', 'click');

        doneSpec();
    });

    it("custom event should not pass DOM Event object, when fire with equal-false value, like 0", function (done) {
        var Label = san.defineComponent({
            template: '<a><span on-click="clicker" id="component-custom-event2" style="cursor:pointer">click here to fire change event with arg 0</span></a>',

            clicker: function () {
                this.fire('change', 0);
            }
        });

        var changed = false;

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div><ui-label on-change="labelChange($event)"></ui-label></div>',

            labelChange: function (event) {
                expect(event).toBe(0);
                changed = true;
            }
        });


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        function doneSpec() {
            if (changed) {
                done();
                myComponent.dispose();
                document.body.removeChild(wrap);
                return;
            }

            setTimeout(doneSpec, 500);
        }

        triggerEvent('#component-custom-event2', 'click');

        doneSpec();
    });

    it("data binding can use filter interp", function () {
        var Label = san.defineComponent({
            template: '<a><span title="{{text}}">{{text}}</span></a>',

            updated: function () {
                subTimes++;
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div><ui-label text="{{name|upper}}"></ui-label></div>',

            initData: function () {
                return {name: 'erik'};
            },

            filters: {
                upper: function (text) {
                    return text.toUpperCase();
                }
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('ERIK');

        myComponent.dispose();
        document.body.removeChild(wrap);

    });

    it("life cycle updated, nested component", function (done) {
        var times = 0;
        var subTimes = 0;

        var Label = san.defineComponent({
            template: '<a><span title="{{title}}">{{text}}</span></a>',

            updated: function () {
                subTimes++;
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div><h5><ui-label title="{{name}}" text="{{jokeName}}"></ui-label></h5>'
                + '<p><a>{{school}}</a><u>{{company}}</u></p></div>',

            updated: function () {
                times++;
            }
        });

        var myComponent = new MyComponent();
        myComponent.data.set('jokeName', 'airike');
        myComponent.data.set('name', 'errorrik');
        myComponent.data.set('school', 'none');
        myComponent.data.set('company', 'bidu');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(times).toBe(0);
        expect(subTimes).toBe(0);

        myComponent.data.set('name', 'erik');
        myComponent.data.set('jokeName', '2b');
        expect(times).toBe(0);
        expect(subTimes).toBe(0);

        san.nextTick(function () {

            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML.indexOf('2b')).toBe(0);
            expect(times).toBe(1);
            expect(subTimes).toBe(1);


            myComponent.data.set('school', 'hainan mid');
            myComponent.data.set('company', 'baidu');

            san.nextTick(function () {
                expect(times).toBe(2);
                expect(subTimes).toBe(1);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });

    });

    it("dynamic create component", function (done) {
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);

        var Panel = san.defineComponent({
            template: '<div>panel</div>',
            attached: function () {
                var layer = new Layer({
                    data: {
                        content: this.data.get('content')
                    }
                });

                this.layer = layer;
                layer.attach(wrap);

                this.watch('content', function (value) {
                    layer.data.set('content', value)
                });
            },

            disposed: function () {
                this.layer.dispose();
                this.layer = null;
            }
        });
        var Layer = san.defineComponent({
            template: '<b>{{content}}</b>',

            updated: function () {
                expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('title');
                expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('subtitle');

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-panel': Panel
            },

            template: '<div><x-panel content="{{layerContent}}"></x-panel><u>{{title}}</u></div>'
        });

        var myComponent = new MyComponent({
            data: {
                layerContent: 'layer',
                title: 'main'
            }
        });

        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('main');
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('layer');

        myComponent.data.set('title', 'title');
        myComponent.data.set('layerContent', 'subtitle');
    });

    it("dispatch should pass message up, util the first component which recieve it", function (done) {
        var Select = san.defineComponent({
            template: '<ul><slot></slot></ul>',

            messages: {
                'UI:select-item-selected': function (arg) {
                    var value = arg.value;
                    this.data.set('value', value);

                    var len = this.items.length;
                    while (len--) {
                        this.items[len].data.set('selectValue', value);
                    }
                },

                'UI:select-item-attached': function (arg) {
                    this.items.push(arg.target);
                    arg.target.data.set('selectValue', this.data.get('value'));
                },

                'UI:select-item-detached': function (arg) {
                    var len = this.items.length;
                    while (len--) {
                        if (this.items[len] === arg.target) {
                            this.items.splice(len, 1);
                        }
                    }
                }
            },

            inited: function () {
                this.items = [];
            }
        });

        var selectValue;
        var itemId;
        var SelectItem = san.defineComponent({
            template: '<li on-click="select" style="{{value === selectValue ? \'border: 1px solid red\' : \'\'}}"><slot></slot></li>',

            select: function () {
                var value = this.data.get('value');
                this.dispatch('UI:select-item-selected', value);
                selectValue = value;
            },

            attached: function () {
                itemId = this.id;
                this.dispatch('UI:select-item-attached');
            },

            detached: function () {
                this.dispatch('UI:select-item-detached');
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-select': Select,
                'ui-selectitem': SelectItem
            },

            template: '<div><ui-select value="{=v=}">'
                + '<ui-selectitem value="1">one</ui-selectitem>'
                + '<ui-selectitem value="2">two</ui-selectitem>'
                + '<ui-selectitem value="3">three</ui-selectitem>'
                + '</ui-select>please click to select a item<b title="{{v}}">{{v}}</b></div>',

            messages: {
                'UI:select-item-selected': function () {
                    expect(false).toBeTruthy();
                },

                'UI:select-item-attached': function () {
                    expect(false).toBeTruthy();
                },

                'UI:select-item-detached': function () {
                    expect(false).toBeTruthy();
                }
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        function detectDone() {
            if (selectValue) {
                expect(wrap.getElementsByTagName('b')[0].title).toBe(selectValue);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
                return;
            }

            setTimeout(detectDone, 500);
        }

        detectDone();
        triggerEvent('#' + itemId, 'click');

    });

    it("messages static property", function (done) {
        var Select = san.defineComponent({
            template: '<ul><slot></slot></ul>',

            inited: function () {
                this.items = [];
            }
        });

        Select.messages = {
            'UI:select-item-selected': function (arg) {
                var value = arg.value;
                this.data.set('value', value);

                var len = this.items.length;
                while (len--) {
                    this.items[len].data.set('selectValue', value);
                }
            },

            'UI:select-item-attached': function (arg) {
                this.items.push(arg.target);
                arg.target.data.set('selectValue', this.data.get('value'));
            },

            'UI:select-item-detached': function (arg) {
                var len = this.items.length;
                while (len--) {
                    if (this.items[len] === arg.target) {
                        this.items.splice(len, 1);
                    }
                }
            }
        };

        var selectValue;
        var itemId;
        var SelectItem = san.defineComponent({
            template: '<li on-click="select" style="{{value === selectValue ? \'border: 1px solid red\' : \'\'}}"><slot></slot></li>',

            select: function () {
                var value = this.data.get('value');
                this.dispatch('UI:select-item-selected', value);
                selectValue = value;
            },

            attached: function () {
                itemId = this.id;
                this.dispatch('UI:select-item-attached');
            },

            detached: function () {
                this.dispatch('UI:select-item-detached');
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-select': Select,
                'ui-selectitem': SelectItem
            },

            template: '<div><ui-select value="{=v=}">'
                + '<ui-selectitem value="1">one</ui-selectitem>'
                + '<ui-selectitem value="2">two</ui-selectitem>'
                + '<ui-selectitem value="3">three</ui-selectitem>'
                + '</ui-select>please click to select a item<b title="{{v}}">{{v}}</b></div>'
        });

        MyComponent.messages = {
            'UI:select-item-selected': function () {
                expect(false).toBeTruthy();
            },

            'UI:select-item-attached': function () {
                expect(false).toBeTruthy();
            },

            'UI:select-item-detached': function () {
                expect(false).toBeTruthy();
            }
        };

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        function detectDone() {
            if (selectValue) {
                expect(wrap.getElementsByTagName('b')[0].title).toBe(selectValue);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
                return;
            }

            setTimeout(detectDone, 500);
        }

        detectDone();
        triggerEvent('#' + itemId, 'click');

    });

    it("dispatch in inited, parent data change, view should change soon", function (done) {
        var Child = san.defineComponent({
            template: '<div>child</div>',
            inited: function () {
                this.dispatch('childInited');
            }
        });

        var Parent = san.defineComponent({
            messages: {
                childInited: function () {
                    this.data.set('xx', true);
                }
            },

            template: '<div><b title="{{xx?\'good\':\'bad\'}}"></b><slot></slot><b title="{{xx?\'good\':\'bad\'}}"></b></div>',

            initData: function () {
                return {
                    xx: false
                };
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'a-child': Child,
                'a-parent': Parent
            },

            template: '<div class="app"><a-parent><a-child /></a-parent></div>'
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var bs = wrap.getElementsByTagName('b');
        expect(bs[0].title).toBe('bad');
        expect(bs[1].title).toBe('good');

        san.nextTick(function () {
            var bs = wrap.getElementsByTagName('b');
            expect(bs[0].title).toBe('good');
            expect(bs[1].title).toBe('good');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("outer bind declaration should not set main element property", function (done) {
        var times = 0;
        var subTimes = 0;

        var Label = san.defineComponent({
            template: '<b><span title="{{title}}">{{text}}</span></b>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div><h5><ui-label title="{{name}}" text="{{jokeName}}"></ui-label></h5>'
                + '<p><a>{{school}}</a><u>{{company}}</u></p></div>'
        });

        var myComponent = new MyComponent();
        myComponent.data.set('jokeName', 'airike');
        myComponent.data.set('name', 'errorrik');
        myComponent.data.set('school', 'none');
        myComponent.data.set('company', 'bidu');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var b = wrap.getElementsByTagName('b')[0];
        expect(b.getAttribute('title')).toBeNull();

        myComponent.data.set('name', 'erik');
        myComponent.data.set('jokeName', '2b');

        san.nextTick(function () {
            var b = wrap.getElementsByTagName('b')[0];
            expect(b.title).toBe('');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("outer bind declaration can use same name as main element property", function (done) {
        var times = 0;
        var subTimes = 0;

        var Label = san.defineComponent({
            template: '<b title="{{title}}"><span title="{{title}}">{{text}}</span></b>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div><h5><ui-label title="{{name}}" text="{{jokeName}}"></ui-label></h5>'
                + '<p><a>{{school}}</a><u>{{company}}</u></p></div>'
        });

        var myComponent = new MyComponent();
        myComponent.data.set('jokeName', 'airike');
        myComponent.data.set('name', 'errorrik');
        myComponent.data.set('school', 'none');
        myComponent.data.set('company', 'bidu');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var b = wrap.getElementsByTagName('b')[0];
        expect(b.getAttribute('title')).toBe('errorrik');

        myComponent.data.set('name', 'erik');
        myComponent.data.set('jokeName', '2b');

        san.nextTick(function () {
            var b = wrap.getElementsByTagName('b')[0];
            expect(b.title).toBe('erik');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("given raw 'self' components config, use itself", function () {
        var MyComponent = san.defineComponent({
            components: {
                'ui-self': 'self'
            },

            initData: function () {
                return {level: 1}
            },

            template: '<u><ui-self level="{{level - 1}}" san-if="level > 0"></ui-self></u>'
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var us = wrap.getElementsByTagName('u');
        expect(us.length).toBe(2);

        myComponent.dispose();
        document.body.removeChild(wrap);

    });

    it("given raw object to components config, auto use it to define component", function (done) {
        var MyComponent = san.defineComponent({
            components: {
                'ui-label': {
                    template: '<a><span title="{{title}}">{{text}}</span></a>'
                }
            },

            template: '<div><h5><ui-label title="{{name}}" text="{{jokeName}}"></ui-label></h5>'
                + '<p><a>{{school}}</a><u>{{company}}</u></p></div>'
        });

        var myComponent = new MyComponent();
        myComponent.data.set('jokeName', 'airike');
        myComponent.data.set('name', 'errorrik');
        myComponent.data.set('school', 'none');
        myComponent.data.set('company', 'bidu');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('errorrik');
            expect(span.innerHTML.indexOf('airike')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("template tag in template", function (done) {
        var Label = san.defineComponent({
            template: '<template class="ui-label" title="{{text}}">{{text}}</template>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },
            template: '<div><ui-label text="{{name}}"></ui-label></div>'
        });


        var myComponent = new MyComponent();
        myComponent.data.set('name', 'erik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var labelEl = wrap.firstChild.firstChild;
        expect(labelEl.className).toBe('ui-label');
        expect(labelEl.title).toBe('erik');

        myComponent.data.set('name', 'ci');

        san.nextTick(function () {
            expect(labelEl.className).toBe('ui-label');
            expect(labelEl.title).toBe('ci');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("bind data update property-grained", function (done) {
        var UserInfo = san.defineComponent({
            template: '<u class="ui-label" title="{{info.name}}-{{info.email}}">{{info.name}}-{{info.email}}</u>',

            attached: function () {
                this.watch('info.name', function () {
                    expect(true).toBeTruthy();
                });
                this.watch('info.email', function () {
                    expect(false).toBeTruthy();
                });
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-user': UserInfo
            },
            template: '<div><ui-user info="{{md.user}}"></ui-user></div>'
        });


        var myComponent = new MyComponent({
            data: {
                md: {
                    user: {
                        name: 'erik',
                        email: 'errorrik@gmail.com'
                    }
                }
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var u = wrap.getElementsByTagName('u')[0];
        expect(u.title).toBe('erik-errorrik@gmail.com');

        myComponent.data.set('md.user.name', 'errorrik');

        san.nextTick(function () {
            var u = wrap.getElementsByTagName('u')[0];
            expect(u.title).toBe('errorrik-errorrik@gmail.com');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("computed", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span title="{{name}}">{{name}}</span></div>',

            initData: function () {
                return {
                    'first': 'first',
                    'last': 'last'
                }
            },

            computed: {
                name: function () {
                    return this.data.get('first') + ' ' + this.data.get('last');
                }
            }
        });


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('first last');

        myComponent.data.set('last', 'xxx')

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('first xxx');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("static computed property", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span title="{{name}}">{{name}}</span></div>',

            initData: function () {
                return {
                    'first': 'first',
                    'last': 'last'
                }
            }
        });

        MyComponent.computed = {
            name: function () {
                return this.data.get('first') + ' ' + this.data.get('last');
            }
        };


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('first last');

        myComponent.data.set('last', 'xxx')

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('first xxx');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("computed has computed dependency, computed item change", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span title="{{msg}}">{{msg}}</span></div>',

            initData: function () {
                return {
                    first: 'first',
                    last: 'last',
                    email: 'name@name.com'
                }
            },

            computed: {
                msg: function () {
                    return this.data.get('name') + '(' + this.data.get('email') + ')'
                },

                name: function () {
                    return this.data.get('first') + ' ' + this.data.get('last');
                }
            }
        });


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('first last(name@name.com)');

        myComponent.data.set('last', 'xxx')

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('first xxx(name@name.com)');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("computed has computed dependency, normal data change", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span title="{{msg}}">{{msg}}</span></div>',

            initData: function () {
                return {
                    first: 'first',
                    last: 'last',
                    email: 'name@name.com'
                }
            },

            computed: {
                msg: function () {
                    return this.data.get('name') + '(' + this.data.get('email') + ')'
                },

                name: function () {
                    return this.data.get('first') + ' ' + this.data.get('last');
                }
            }
        });


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('first last(name@name.com)');

        myComponent.data.set('email', 'san@san.com')

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('first last(san@san.com)');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("custom event listen and fire", function () {
        var receive;

        var Label = san.defineComponent({
            template: '<template class="ui-label" title="{{text}}">{{text}}</template>',

            attached: function () {
                this.fire('haha', this.data.get('text') + 'haha');
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div><ui-label text="{{name}}" on-haha="labelHaha($event)"></ui-label></div>',

            labelHaha: function (e) {
                receive = e;
            }
        });


        var myComponent = new MyComponent();
        myComponent.data.set('name', 'erik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var labelEl = wrap.firstChild.firstChild;
        expect(labelEl.className).toBe('ui-label');
        expect(labelEl.title).toBe('erik');
        expect(receive).toBe('erikhaha');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("ref", function () {
        var MyComponent = san.defineComponent({
            components: {
                'ui-color': ColorPicker
            },
            template: '<div><span title="{{color}}">{{color}}</span> <ui-color value="{= color =}" san-ref="colorPicker"></ui-color></div>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('color', 'green');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(myComponent.ref('colorPicker') instanceof ColorPicker).toBe(true);
        expect(wrap.getElementsByTagName('b')[0].title).toBe('green');


        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("dynamic ref", function () {
        var MyComponent = san.defineComponent({
            components: {
                'ui-color': ColorPicker
            },
            template: '<div><span title="{{color}}">{{color}}</span> <ui-color value="{=color=}" san-ref="{{name}}"></ui-color></div>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('color', 'green');
        myComponent.data.set('name', 'c');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(myComponent.ref('c') instanceof ColorPicker).toBe(true);
        expect(wrap.getElementsByTagName('b')[0].title).toBe('green');


        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("dynamic ref in for", function (done) {
        var MyComponent = san.defineComponent({
            components: {
                'ui-color': ColorPicker
            },
            initData: function () {
                return {
                    colors: ['blue', 'green']
                };
            },
            template: '<div><p san-for="color, index in colors"><ui-color value="{=color=}" san-ref="color-{{index}}"></ui-color></p></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var color0 = myComponent.ref('color-0');
        expect(color0 instanceof ColorPicker).toBe(true);
        expect(color0.data.get('value')).toBe('blue');

        myComponent.data.set('colors', ['red', 'yellow']);

        san.nextTick(function () {
            var color0 = myComponent.ref('color-0');
            var color1 = myComponent.ref('color-1');

            expect(color0 instanceof ColorPicker).toBe(true);
            expect(color0.data.get('value')).toBe('red');
            expect(color1 instanceof ColorPicker).toBe(true);
            expect(color1.data.get('value')).toBe('yellow');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("dynamic ref in for directly", function (done) {
        var MyComponent = san.defineComponent({
            components: {
                'ui-color': ColorPicker
            },
            initData: function () {
                return {
                    colors: ['blue', 'green']
                };
            },
            template: '<div><ui-color san-for="color, index in colors" value="{=color=}" san-ref="color-{{index}}"></ui-color></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var color0 = myComponent.ref('color-0');
        expect(color0 instanceof ColorPicker).toBe(true);
        expect(color0.data.get('value')).toBe('blue');

        myComponent.data.set('colors', ['red', 'yellow']);

        san.nextTick(function () {
            var color0 = myComponent.ref('color-0');
            var color1 = myComponent.ref('color-1');

            expect(color0 instanceof ColorPicker).toBe(true);
            expect(color0.data.get('value')).toBe('red');
            expect(color1 instanceof ColorPicker).toBe(true);
            expect(color1.data.get('value')).toBe('yellow');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("dynamic ref in if", function (done) {
        var MyComponent = san.defineComponent({
            components: {
                'ui-color': ColorPicker
            },
            initData: function () {
                return {
                    name: 'test',
                    color: 'green'
                };
            },
            template: '<div><div san-if="condition"><ui-color value="{=color=}" san-ref="color-{{name}}"></ui-color></div></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var color0 = myComponent.ref('color-test');
        expect(color0 == null).toBeTruthy();

        myComponent.data.set('condition', 1);

        san.nextTick(function () {
            var color0 = myComponent.ref('color-test');

            expect(color0 instanceof ColorPicker).toBe(true);
            expect(color0.data.get('value')).toBe('green');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("dynamic ref in if directly", function (done) {
        var MyComponent = san.defineComponent({
            components: {
                'ui-color': ColorPicker
            },
            initData: function () {
                return {
                    name: 'test',
                    color: 'green'
                };
            },
            template: '<div><ui-color value="{=color=}" san-if="condition" san-ref="color-{{name}}"></ui-color></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var color0 = myComponent.ref('color-test');
        expect(color0 == null).toBeTruthy();

        myComponent.data.set('condition', 1);

        san.nextTick(function () {
            var color0 = myComponent.ref('color-test');

            expect(color0 instanceof ColorPicker).toBe(true);
            expect(color0.data.get('value')).toBe('green');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });


    it("update prop", function (done) {
        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },
            template: '<a><ui-label text="{{name}}"></ui-label></a>'
        });


        var myComponent = new MyComponent();
        myComponent.data.set('name', 'erik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('erik');

        myComponent.data.set('name', 'ci');

        san.nextTick(function () {
            expect(span.title).toBe('ci');
            done();
            myComponent.dispose();
            document.body.removeChild(wrap);
        });
    });

    it("update prop from self attached", function (done) {
        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },
            template: '<a><ui-label text="{{name}}"></ui-label></a>',

            attached: function () {
                this.data.set('name', 'ci');
            }
        });


        var myComponent = new MyComponent();
        myComponent.data.set('name', 'erik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('erik');

        san.nextTick(function () {
            expect(span.title).toBe('ci');
            done();
            myComponent.dispose();
            document.body.removeChild(wrap);
        });
    });

    var TelList = san.defineComponent({
        template: '<ul><li san-for="item in list" title="{{item}}">{{item}}</li></ul>'
    });

    var PersonList = san.defineComponent({
        components: {
            'ui-tel': TelList
        },
        template: '<div><dl san-for="item in list"><dt title="{{item.name}}">{{item.name}}</dt><dd><ui-tel list="{{item.tels}}"></ui-tel></dd></dl></div>'
    });

    it("nested", function (done) {
        var MyComponent = san.defineComponent({
            components: {
                'ui-person': PersonList
            },
            template: '<div><ui-person list="{{persons}}"></ui-person></div>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
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
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);
        var dts = wrap.getElementsByTagName('dt');
        expect(dts[0].title).toBe('erik');
        expect(dts[1].title).toBe('firede');

        var dds = wrap.getElementsByTagName('dd');
        var p1lis = dds[1].getElementsByTagName('li');
        expect(p1lis[0].title).toBe('2345678');
        expect(p1lis[1].title).toBe('23456789');

        myComponent.data.set('persons[1].name', 'leeight');
        myComponent.data.set('persons[1].tels', ['12121212', '16161616', '18181818']);


        san.nextTick(function () {
            var dts = wrap.getElementsByTagName('dt');
            expect(dts[0].title).toBe('erik');
            expect(dts[1].title).toBe('leeight');

            var dds = wrap.getElementsByTagName('dd');
            var p1lis = dds[1].getElementsByTagName('li');
            expect(p1lis[0].title).toBe('12121212');
            expect(p1lis[1].title).toBe('16161616');
            expect(p1lis[2].title).toBe('18181818');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("in for", function (done) {
        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },
            template: '<ul><li san-for="p in persons"><b title="{{p.name}}">{{p.name}}</b><h5 san-for="t in p.tels"><ui-label text="{{t}}"></ui-label></h5></li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
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
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);
        var lis = wrap.getElementsByTagName('li');
        expect(lis[0].getElementsByTagName('b')[0].title).toBe('erik');
        expect(lis[1].getElementsByTagName('b')[0].title).toBe('firede');

        var p1tels = lis[1].getElementsByTagName('span');
        expect(p1tels[0].title).toBe('2345678');
        expect(p1tels[1].title).toBe('23456789');

        myComponent.data.set('persons[1].name', 'leeight');
        myComponent.data.set('persons[1].tels', ['12121212', '16161616', '18181818']);


        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis[0].getElementsByTagName('b')[0].title).toBe('erik');
            expect(lis[1].getElementsByTagName('b')[0].title).toBe('leeight');

            var p1tels = lis[1].getElementsByTagName('span');
            expect(p1tels[0].title).toBe('12121212');
            expect(p1tels[1].title).toBe('16161616');
            expect(p1tels[2].title).toBe('18181818');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("inner el event and outer custom event", function (done) {
        var innerClicked;
        var outerReceive;

        var Label = san.defineComponent({
            template: '<template class="ui-label" on-click="clicker" style="cursor:pointer;text-decoration:underline">here</template>',

            clicker: function () {
                innerClicked = true;
                this.fire('haha', 1);
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div>Click <ui-label on-haha="labelHaha($event)"></ui-label></div>',

            labelHaha: function (e) {
                outerReceive = e;
            }
        });


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        function detect() {
            if (innerClicked || outerReceive) {
                expect(innerClicked).toBe(true);
                expect(outerReceive).toBe(1);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
                return;
            }

            setTimeout(detect, 500);
        }


        triggerEvent('#' + wrap.firstChild.getElementsByTagName('*')[0].id, 'click');

        detect();
    });

    it("watch simple data item", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{email}}">{{name}}</span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('email', 'errorrik@gmail.com');
        myComponent.data.set('name', 'errorrik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var watchTriggerTimes = 0;
        myComponent.watch('email', function (value) {
            expect(value).toBe('erik168@163.com');
            expect(this.data.get('email')).toBe(value);
            watchTriggerTimes++;
        });

        myComponent.data.set('email', 'erik168@163.com');
        myComponent.data.set('name', 'erik');
        expect(watchTriggerTimes).toBe(1);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('errorrik@gmail.com');

        san.nextTick(function () {
            expect(watchTriggerTimes).toBe(1);

            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('erik168@163.com');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })

    });

    it("watch property accessor", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{projects[0].author.email}}">{{projects[0].author.email}}</span></a>',

            initData: function () {
                return {
                    projects: [
                        {
                            name: 'etpl',
                            author: {
                                email: 'errorrik@gmail.com',
                                name: 'errorrik'
                            }
                        }
                    ]

                };
            }
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var watchTriggerTimes = 0;
        myComponent.watch('projects[0].author', function (value) {
            expect(value.email).toBe('erik168@163.com');
            expect(this.data.get('projects[0].author.email')).toBe(value.email);
            watchTriggerTimes++;
        });

        var emailTriggerTimes = 0;
        myComponent.watch('projects[0].author.email', function (value) {
            expect(value).toBe('erik168@163.com');
            expect(this.data.get('projects[0].author.email')).toBe(value);
            emailTriggerTimes++;
        });

        myComponent.data.set('projects[0].author.email', 'erik168@163.com');
        myComponent.data.set('projects[0].author.name', 'erik');
        expect(watchTriggerTimes).toBe(2);
        expect(emailTriggerTimes).toBe(1);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('errorrik@gmail.com');

        san.nextTick(function () {
            expect(watchTriggerTimes).toBe(2);
            expect(emailTriggerTimes).toBe(1);

            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('erik168@163.com');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })

    });


    it("outer event and inner event should not confilct", function (done) {
        var innerClick;
        var outerClick;
        var btnId;
        var Button = san.defineComponent({
            template: '<button on-click="clicker">test</button>',

            clicker: function () {
                innerClick = 1;
                this.fire('click')
            },

            attached: function () {
                btnId = this.id;
            }
        });


        var MyComponent = san.defineComponent({
            components: {
                'ui-button': Button
            },

            template: '<div><ui-button on-click="clicker"></ui-button></div>',

            clicker: function (event) {
                outerClick = 1;
            }
        });


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        function doneSpec() {
            expect(innerClick).toBe(1);
            expect(outerClick).toBe(1);

            done();
            myComponent.dispose();
            document.body.removeChild(wrap);
        }

        triggerEvent('#' + btnId, 'click');

        setTimeout(doneSpec, 500);
    });

    it("merge class property to component root element", function () {
        var Button = san.defineComponent({
            template: '<button class="button">test</button>'
        });


        var MyComponent = san.defineComponent({
            components: {
                'ui-button': Button
            },

            template: '<div><ui-button class="large"></ui-button></div>'
        });


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var btn = wrap.getElementsByTagName('button')[0];
        expect(/(^| )button/.test(btn.className)).toBeTruthy();
        expect(/(^| )large/.test(btn.className)).toBeTruthy();
        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("merge class property to component root element", function () {
        var Button = san.defineComponent({
            template: '<button>test</button>'
        });


        var MyComponent = san.defineComponent({
            components: {
                'ui-button': Button
            },

            template: '<div><ui-button class="large"></ui-button></div>'
        });


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var btn = wrap.getElementsByTagName('button')[0];
        expect(/(^| )large/.test(btn.className)).toBeTruthy();
        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("merge class property to component root element and auto expand", function () {
        var Button = san.defineComponent({
            initData: function () {
                return {classes: ['button', 'normal']}
            },
            template: '<button class="ui {{classes}}">test</button>'
        });


        var MyComponent = san.defineComponent({
            initData: function () {
                return {classes: ['large', 'huge']}
            },

            components: {
                'ui-button': Button
            },

            template: '<div><ui-button class="{{classes}} strong"></ui-button></div>'
        });


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var btn = wrap.getElementsByTagName('button')[0];
        expect(/(^| )button/.test(btn.className)).toBeTruthy();
        expect(/(^| )large/.test(btn.className)).toBeTruthy();
        expect(/(^| )normal/.test(btn.className)).toBeTruthy();
        expect(/(^| )strong/.test(btn.className)).toBeTruthy();
        expect(/(^| )huge/.test(btn.className)).toBeTruthy();
        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("merge style property to component root element", function (done) {
        var Button = san.defineComponent({
            template: '<button style="color: blue">test</button>'
        });


        var MyComponent = san.defineComponent({
            components: {
                'ui-button': Button
            },

            template: '<div><ui-button style="height: {{height}}"></ui-button></div>'
        });


        var myComponent = new MyComponent({
            data: {
                height: '10px'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var btn = wrap.getElementsByTagName('button')[0];
        expect(/color:\s*blue($|;)/i.test(btn.style.cssText)).toBeTruthy();
        expect(/height:\s*10px($|;)/i.test(btn.style.cssText)).toBeTruthy();

        myComponent.data.set('height', '5px');

        san.nextTick(function () {
            expect(/color:\s*blue($|;)/i.test(btn.style.cssText)).toBeTruthy();
            expect(/height:\s*5px($|;)/i.test(btn.style.cssText)).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        })
    });

    it("merge style property to component root element, root element has no style", function (done) {
        var Button = san.defineComponent({
            template: '<button>test</button>'
        });


        var MyComponent = san.defineComponent({
            components: {
                'ui-button': Button
            },

            template: '<div><ui-button style="height: {{height}}"></ui-button></div>'
        });


        var myComponent = new MyComponent({
            data: {
                height: '10px'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var btn = wrap.getElementsByTagName('button')[0];
        expect(/height:\s*10px($|;)/i.test(btn.style.cssText)).toBeTruthy();

        myComponent.data.set('height', '5px');

        san.nextTick(function () {
            expect(/height:\s*5px($|;)/i.test(btn.style.cssText)).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        })
    });

    it("merge style property to component root element, auto expand", function (done) {
        var Button = san.defineComponent({
            template: '<button style="{{myStyle}}">test</button>',

            initData: function () {
                return {
                    display: 'block'
                }
            },

            computed: {
                myStyle: function () {
                    return {
                        display: this.data.get('display')
                    };
                }
            }
        });


        var MyComponent = san.defineComponent({
            components: {
                'ui-button': Button
            },

            computed: {
                btnStyle: function () {
                    return {
                        position: this.data.get('position')
                    };
                }
            },

            template: '<div><ui-button style="height: {{height}}; {{btnStyle}}"></ui-button></div>'
        });


        var myComponent = new MyComponent({
            data: {
                height: '10px',
                position: 'absolute'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var btn = wrap.getElementsByTagName('button')[0];

        expect(/height:\s*10px($|;)/i.test(btn.style.cssText)).toBeTruthy();
        expect(/position:\s*absolute($|;)/i.test(btn.style.cssText)).toBeTruthy();
        expect(/display:\s*block($|;)/i.test(btn.style.cssText)).toBeTruthy();

        myComponent.data.set('height', '5px');
        myComponent.data.set('position', 'relative');

        san.nextTick(function () {
            expect(/height:\s*5px($|;)/i.test(btn.style.cssText)).toBeTruthy();
            expect(/position:\s*relative($|;)/i.test(btn.style.cssText)).toBeTruthy();
            expect(/display:\s*block($|;)/i.test(btn.style.cssText)).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        })
    });

    it("merge style property to component root element, auto expand, root element has no style", function (done) {
        var Button = san.defineComponent({
            template: '<button>test</button>'
        });


        var MyComponent = san.defineComponent({
            components: {
                'ui-button': Button
            },

            computed: {
                btnStyle: function () {
                    return {
                        position: this.data.get('position'),
                        height: this.data.get('height')
                    };
                }
            },

            template: '<div><ui-button style="{{btnStyle}}"></ui-button></div>'
        });


        var myComponent = new MyComponent({
            data: {
                height: '10px',
                position: 'absolute'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var btn = wrap.getElementsByTagName('button')[0];

        expect(/height:\s*10px($|;)/i.test(btn.style.cssText)).toBeTruthy();
        expect(/position:\s*absolute($|;)/i.test(btn.style.cssText)).toBeTruthy();

        myComponent.data.set('height', '5px');
        myComponent.data.set('position', 'relative');

        san.nextTick(function () {
            expect(/height:\s*5px($|;)/i.test(btn.style.cssText)).toBeTruthy();
            expect(/position:\s*relative($|;)/i.test(btn.style.cssText)).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        })
    });

    it("main element default style prop", function (done) {
        var MyComponent = san.defineComponent({
            computed: {
                style: function () {
                    return {
                        position: this.data.get('position'),
                        height: this.data.get('height')
                    };
                }
            },

            template: '<button>test</button>'
        });

        var myComponent = new MyComponent({
            data: {
                height: '10px',
                position: 'absolute'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var btn = wrap.getElementsByTagName('button')[0];

        expect(/height:\s*10px($|;)/i.test(btn.style.cssText)).toBeTruthy();
        expect(/position:\s*absolute($|;)/i.test(btn.style.cssText)).toBeTruthy();

        myComponent.data.set('height', '5px');
        myComponent.data.set('position', 'relative');

        san.nextTick(function () {
            expect(/height:\s*5px($|;)/i.test(btn.style.cssText)).toBeTruthy();
            expect(/position:\s*relative($|;)/i.test(btn.style.cssText)).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        })
    });

    it("data binding name auto camel case", function (done) {
        var Label = san.defineComponent({
            template: '<a><span title="{{dataTitle}}">{{dataText}}</span></a>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div><ui-label data-title="{{title}}" data-text="{{text}}"></ui-label></div>'
        });

        var myComponent = new MyComponent({
            data: {
                title: '1',
                text: 'one'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];

        expect(span.title).toBe('1');
        expect(span.innerHTML.indexOf('one') === 0).toBeTruthy();

        myComponent.data.set('title', '2');
        myComponent.data.set('text', 'two');

        san.nextTick(function () {
            expect(span.title).toBe('2');
            expect(span.innerHTML.indexOf('two') === 0).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        })
    });

    it("data binding no expr, auto true", function (done) {
        var Label = san.defineComponent({
            template: '<a><u s-if="hasu"></u><span title="{{dataTitle}}">{{dataText}}</span></a>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div><ui-label s-ref="l" data-title="{{title}}" data-text="{{text}}" hasu></ui-label></div>'
        });

        var myComponent = new MyComponent({
            data: {
                title: '1',
                text: 'one'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var us = wrap.getElementsByTagName('u');

        expect(us.length).toBe(1);
        expect(myComponent.ref('l').data.get('hasu')).toBeTruthy();

        san.nextTick(function () {
            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        })
    });
});

