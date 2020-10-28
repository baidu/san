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
        expect(myComponent.lifeCycle.is('inited')).toBeTruthy();
        expect(myComponent.lifeCycle.is('created')).toBeFalsy();
        expect(myComponent.lifeCycle.is('attached')).toBeFalsy();
        expect(mainInited).toBe(1);
        expect(mainCreated).toBe(0);
        expect(mainAttached).toBe(0);
        expect(labelInited).toBe(0);

        myComponent.data.set('color', 'green');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);
        expect(myComponent.lifeCycle.is('inited')).toBeTruthy();
        expect(myComponent.lifeCycle.is('created')).toBeTruthy();
        expect(myComponent.lifeCycle.is('attached')).toBeTruthy();
        expect(mainInited).toBe(1);
        expect(mainCreated).toBe(1);
        expect(mainAttached).toBe(1);
        expect(mainDetached).toBe(0);
        expect(labelInited).toBe(1);
        expect(labelCreated).toBe(1);
        expect(labelAttached).toBe(1);
        expect(labelDetached).toBe(0);

        expect(myComponent.nextTick).toBe(san.nextTick);

        myComponent.detach();
        expect(myComponent.lifeCycle.is('created')).toBeTruthy();
        expect(myComponent.lifeCycle.is('attached')).toBeFalsy();
        expect(myComponent.lifeCycle.is('detached')).toBeTruthy();
        expect(mainCreated).toBe(1);
        expect(mainDetached).toBe(1);
        expect(mainAttached).toBe(0);
        expect(labelInited).toBe(1);
        expect(labelCreated).toBe(1);
        expect(labelAttached).toBe(1);
        expect(labelDetached).toBe(0);

        myComponent.detach();
        expect(myComponent.lifeCycle.is('created')).toBeTruthy();
        expect(myComponent.lifeCycle.is('attached')).toBeFalsy();
        expect(myComponent.lifeCycle.is('detached')).toBeTruthy();
        expect(mainCreated).toBe(1);
        expect(mainDetached).toBe(1);
        expect(mainAttached).toBe(0);
        expect(labelInited).toBe(1);
        expect(labelCreated).toBe(1);
        expect(labelAttached).toBe(1);
        expect(labelDetached).toBe(0);

        myComponent.attach(wrap);
        expect(myComponent.lifeCycle.is('created')).toBeTruthy();
        expect(myComponent.lifeCycle.is('attached')).toBeTruthy();
        expect(myComponent.lifeCycle.is('detached')).toBeFalsy();
        expect(mainCreated).toBe(1);
        expect(mainDetached).toBe(0);
        expect(mainAttached).toBe(1);
        expect(labelInited).toBe(1);
        expect(labelCreated).toBe(1);
        expect(labelAttached).toBe(1);
        expect(labelDetached).toBe(0);


        myComponent.dispose();
        expect(myComponent.lifeCycle.is('inited')).toBeFalsy();
        expect(myComponent.lifeCycle.is('created')).toBeFalsy();
        expect(myComponent.lifeCycle.is('attached')).toBeFalsy();
        expect(myComponent.lifeCycle.is('detached')).toBeFalsy();
        expect(myComponent.lifeCycle.is('disposed')).toBeTruthy();
        expect(mainDisposed).toBe(1);
        expect(labelDisposed).toBe(1);
        expect(mainDetached).toBe(1);
        expect(labelDetached).toBe(1);

        document.body.removeChild(wrap);

        // dispose a unattach component
        var myComponent2 = new MyComponent();
        expect(myComponent2.lifeCycle.is('inited')).toBeTruthy();
        expect(myComponent2.lifeCycle.is('created')).toBeFalsy();
        expect(myComponent2.lifeCycle.is('disposed')).toBeFalsy();
        myComponent2.dispose();

        expect(myComponent2.lifeCycle.is('inited')).toBeFalsy();
        expect(myComponent2.lifeCycle.is('created')).toBeFalsy();
        expect(myComponent2.lifeCycle.is('attached')).toBeFalsy();
        expect(myComponent2.lifeCycle.is('detached')).toBeFalsy();
        expect(myComponent2.lifeCycle.is('disposed')).toBeTruthy();
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

    it("life cycle must correct when call dispose after detach immediately", function () {
        var P = san.defineComponent({
            template: '<p><slot/></p>'
        })
        var MyComponent = san.defineComponent({
            components: {
                'x-p': P
            },

            template: '<div><h3>title</h3><x-p s-ref="p">content</x-p></div>'
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var myP = myComponent.ref('p');

        expect(myComponent.lifeCycle.attached).toBeTruthy();
        expect(myP.lifeCycle.attached).toBeTruthy();

        myComponent.detach();
        myComponent.dispose();

        expect(myComponent.lifeCycle.disposed).toBeTruthy();
        expect(myP.lifeCycle.disposed).toBeTruthy();
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

        myComponent.attach(document.body);
        expect(myComponent.el.parentNode).toBe(wrap);

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

    it("defineComponent with SuperComponent", function (done) {
        var Counter = san.defineComponent({
            template: '<u on-click="add">{{num}}</u>',
            initData: function () {
                return {
                    num: 2
                };
            },
            add: function () {
                this.data.set('num', this.data.get('num') + 1);
            }
        });

        var RealCounter = san.defineComponent({
            add: function () {
                this.data.set('num', this.data.get('num') + 5);
            }
        }, Counter);

        var MyComponent = san.defineComponent({
            components: {
                'x-c': RealCounter
            },
            template: '<div><x-c /></div>'
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var u = wrap.getElementsByTagName('u')[0];
        expect(u.innerHTML).toBe('2');

        triggerEvent(u, 'click');
        san.nextTick(function () {
            expect(u.innerHTML).toBe('7');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });

    it("attach without parentEl, and dispose, got collect life cycle", function () {
        var MyComponent = san.defineComponent({
            template: '<div>hello san</div>'
        });

        var myComponent = new MyComponent();
        myComponent.attach();

        expect(!!myComponent.lifeCycle.is('attached')).toBeTruthy();

        myComponent.dispose();
        expect(!!myComponent.lifeCycle.is('disposed')).toBeTruthy();

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

    it("custom delims", function () {
        var MyComponent = san.defineComponent({
            delimiters: ['{%', '%}'],
            template: '<a><span title="Good {%name%}">Hello {%name%}</span></a>'
        });

        var myComponent = new MyComponent({
            data: {
                name: 'San'
            }
        });
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('Good San');
        expect(span.innerHTML).toContain('Hello San');

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

    it("components as getComponentType", function () {
        var Label = san.defineComponent({
            template: '<span title="{{text}}">{{text}}</span>'
        });
        var MyComponent = san.defineComponent({
            getComponentType: function (aNode) {
                if (aNode.tagName === 'ui-label') {
                    return Label;
                }
            }
        });

        MyComponent.template = '<div><ui-label text="erik"></ui-label></div>';
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

    it("custom event default arg $event", function (done) {
        var Label = san.defineComponent({
            template: '<a><span on-click="clicker" style="cursor:pointer">click here to fire change event with no arg</span></a>',

            clicker: function () {
                this.fire('change', "Hello");
            }
        });

        var changed = false;

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div><ui-label on-change="labelChange"></ui-label></div>',

            labelChange: function (event) {
                expect(event).toBe("Hello");
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

        var span = wrap.getElementsByTagName('span')[0];
        triggerEvent(span, 'click');

        doneSpec();
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

    it("subcomponent data binding", function () {
        var Label = san.defineComponent({
            template: '<a><span title="{{te_xt}}">{{te_xt}}</span></a>',

            updated: function () {
                subTimes++;
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div><ui-label te_xt="{{name}}"></ui-label></div>'
        });

        var myComponent = new MyComponent({
            data: {
                name: 'erik'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('erik');

        myComponent.dispose();
        document.body.removeChild(wrap);

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

    it("dynamic create component, and push to children", function (done) {
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

                layer.attach(wrap);
                this.children.push(layer);

                this.watch('content', function (value) {
                    layer.data.set('content', value);

                    this.nextTick(function () {
                        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('title');
                        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('subtitle');

                        myComponent.dispose();
                        document.body.removeChild(wrap);
                        done();
                    })
                });
            }
        });
        var Layer = san.defineComponent({
            template: '<b>{{content}}</b>'
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

    it("dynamic create component, with on and un method", function () {
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);

        var layerNum = 0;
        function layerNumHandler(num) {
            layerNum = num;
        }
        var panelLayer;
        var Panel = san.defineComponent({
            template: '<div>panel</div>',
            attached: function () {
                var layer = new Layer({
                    data: {
                        content: this.data.get('content')
                    }
                });

                layer.attach(wrap);
                panelLayer = layer;
                layer.on('change', layerNumHandler);
            }
        });
        var Layer = san.defineComponent({
            template: '<b>{{content}}</b>'
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

        expect(layerNum).toBe(0);

        panelLayer.fire('change', 77);
        expect(layerNum).toBe(77);

        panelLayer.un('change', layerNumHandler);
        panelLayer.fire('change', 66);
        expect(layerNum).toBe(77);

        panelLayer.on('change', layerNumHandler);
        panelLayer.fire('change', 88);
        expect(layerNum).toBe(88);

        panelLayer.un('change');
        panelLayer.fire('change', 250);
        expect(layerNum).toBe(88);

        myComponent.dispose();
        document.body.removeChild(wrap);
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
        var item;
        var SelectItem = san.defineComponent({
            template: '<li on-click="select" style="{{value === selectValue ? \'border: 1px solid red\' : \'\'}}"><slot></slot></li>',

            select: function () {
                var value = this.data.get('value');
                this.dispatch('UI:select-item-selected', value);
                selectValue = value;
            },

            attached: function () {
                item = this.el;
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
        triggerEvent(item, 'click');

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
        var item;
        var SelectItem = san.defineComponent({
            template: '<li on-click="select" style="{{value === selectValue ? \'border: 1px solid red\' : \'\'}}"><slot></slot></li>',

            select: function () {
                var value = this.data.get('value');
                this.dispatch('UI:select-item-selected', value);
                selectValue = value;
            },

            attached: function () {
                item = this.el;
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
        triggerEvent(item, 'click');

    });

    it("message * would receive all message", function (done) {
        var selectMessageX;
        var justtestReceived;
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
                },

                '*': function (arg) {
                    selectMessageX = true;
                    expect(arg.name.indexOf('justtest')).toBe(0);
                    if (arg.name.indexOf('stop') === -1) {
                        this.dispatch(arg.name);
                    }
                }
            },

            inited: function () {
                this.items = [];
            }
        });

        var selectValue;
        var item;
        var SelectItem = san.defineComponent({
            template: '<li on-click="select" style="{{value === selectValue ? \'border: 1px solid red\' : \'\'}}"><slot></slot></li>',

            select: function () {
                var value = this.data.get('value');
                this.dispatch('UI:select-item-selected', value);
                this.dispatch('justtest', value);
                selectValue = value;
            },

            attached: function () {
                item = this.el;
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
                },

                'justtest': function () {
                    justtestReceived = true;
                },

                'justteststop': function () {
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
                expect(selectMessageX).toBeTruthy();
                expect(justtestReceived).toBeTruthy();

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
                return;
            }

            setTimeout(detectDone, 500);
        }

        detectDone();
        triggerEvent(item, 'click');

    });

    it("dispatch cross multi parent components", function () {
        var received = 0;
        var Child = san.defineComponent({
            template: '<div>child</div>',
            inited: function () {
                this.dispatch('childInited');
            }
        });

        var Parent = san.defineComponent({
            components: {
                'a-child': Child
            },

            template: '<div><a-child/></div>',

            initData: function () {
                return {
                    xx: false
                };
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'a-parent': Parent
            },
            messages: {
                childInited: function () {
                    received = 1;
                }
            },

            template: '<div class="app"><a-parent/></div>'
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(received).toBe(1);

        myComponent.dispose();
        document.body.removeChild(wrap);
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

    it("computed item compute once when init", function () {
        var nameCount = 0;
        var welcomeCount = 0;
        var MyComponent = san.defineComponent({
            template: '<span>{{text}}</span>',

            initData: function() {
                return {
                    realname: 'san',
                    hello: 'hello'
                };
            },

            computed: {
                name: function () {
                    nameCount++;
                    return 'good' + this.data.get('realname');
                },

                text: function () {
                    return this.data.get('welcome') + this.data.get('name');
                },

                welcome: function () {
                    welcomeCount++;
                    return this.data.get('hello') + ' ';
                }
            }
        })


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML).toBe('hello goodsan');
        expect(nameCount).toBe(1);
        expect(welcomeCount).toBe(1);

        myComponent.dispose();
        document.body.removeChild(wrap);

    });

    san.debug && it("computed method should throw Error when data.get called by empty expr", function () {
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
                return this.data.get();
            }
        };

        expect(function () {
            new MyComponent()
        }).toThrowError(/call get method in computed need argument/);
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

    it("custom event listen, use scope data", function () {
        var sum = 0;
        var receive = [];

        var Label = san.defineComponent({
            template: '<u class="ui-label" title="{{text}}">{{text}}</u>',

            attached: function () {
                this.fire('haha', this.data.get('text') + 'haha');
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div><ui-label s-for="item, index in list" text="{{item}}" on-haha="labelHaha($event, index)"/></div>',

            labelHaha: function (e, index) {
                sum += index;
                receive.push(e);
            }
        });


        var myComponent = new MyComponent({
            data: {
                list: ['one', 'two', 'three']
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var us = wrap.getElementsByTagName('u');
        expect(us[0].innerHTML).toBe('one');
        expect(us[1].innerHTML).toBe('two');
        expect(us[2].innerHTML).toBe('three');

        expect(receive[0]).toBe('onehaha');
        expect(receive[1]).toBe('twohaha');
        expect(receive[2]).toBe('threehaha');

        expect(sum).toBe(3);

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

    it("ref in element", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li s-for="name in list" s-ref="it-{{name}}">{{name}}</li></ul>'
        });
        var myComponent = new MyComponent({
            data: {
                list: ['errorrik', 'leeight']
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(myComponent.ref('it-errorrik').innerHTML).toBe('errorrik');
        expect(myComponent.ref('it-leeight').innerHTML).toBe('leeight');

        myComponent.data.set('list[0]', '2b');

        san.nextTick(function () {
            expect(myComponent.ref('it-errorrik') == null).toBeTruthy();
            expect(myComponent.ref('it-2b').innerHTML).toBe('2b');
            expect(myComponent.ref('it-leeight').innerHTML).toBe('leeight');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("ref when root is component", function (done) {
        var Label = san.defineComponent({
            template: '<a><slot/></a>'
        });
        var MyComponent = san.defineComponent({
            components: {
                'x-a': Label
            },
            template: '<x-a><p>test<b s-ref="b">{{name}}</b>aa</p></x-a>'
        });
        var myComponent = new MyComponent({
            data: {
                name: 'errorrik'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(myComponent.ref('b').innerHTML).toBe('errorrik');

        myComponent.data.set('name', '2b');

        san.nextTick(function () {
            expect(myComponent.ref('b').innerHTML).toBe('2b');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
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

    it("update prop from self attached, root is component", function (done) {
        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },
            template: '<ui-label text="{{name}}"></ui-label>',

            attached: function () {
                this.data.set('name', 'errorrik');
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
            expect(span.title).toBe('errorrik');
            done();
            myComponent.dispose();
            document.body.removeChild(wrap);
        });
    });

    it("update prop from self attached, root is not a HTMLElement", function (done) {
        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },
            template: '<fragment><ui-label text="{{name}}"></ui-label></fragment>',

            attached: function () {
                this.data.set('name', 'errorrik');
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
            expect(span.title).toBe('errorrik');
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


        triggerEvent(wrap.firstChild.getElementsByTagName('*')[0], 'click');

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
        var Button = san.defineComponent({
            template: '<button on-click="clicker">test</button>',

            clicker: function () {
                innerClick = 1;
                this.fire('click')
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

        triggerEvent(wrap.getElementsByTagName('button')[0], 'click');

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

    it("data binding name auto camel case, strongly", function (done) {
        var Label = san.defineComponent({
            template: '<a><span title="{{dataTitle}}">{{dataText2B}}</span></a>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div><ui-label data-title="{{title}}" data-Text-2B="{{text}}"></ui-label></div>'
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

    it("main element not in declare position, need remove when dispose call", function () {
        var Dialog = san.defineComponent({
            template: '<div class="ui-dialog">HI Dialog</div>',
            attached: function() {
                if (this.el.parentNode !== document.body) {
                    document.body.appendChild(this.el);
                }
            },

            detached: function () {
                if (this.el.parentNode === document.body) {
                    document.body.removeChild(this.el);
                }
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-dialog': Dialog
            },

            template: '<div><span>Hi Component</span><x-dialog s-ref="dialog"/></div>'
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        var el = myComponent.el;
        var spanEl = el.firstChild;
        var dialogEl = myComponent.ref('dialog').el;
        expect(dialogEl.parentNode).toBe(document.body);
        expect(spanEl.parentNode).toBe(el);

        myComponent.dispose();

        // ie又变态了，removeChild后element还有parentNode，变成document了。妈蛋的东西
        expect(dialogEl.parentNode == null || dialogEl.parentNode.tagName == null).toBeTruthy();
        expect(el.parentNode == null || el.parentNode.tagName == null).toBeTruthy();
        document.body.removeChild(wrap);
    });

    it('given undefined data dont reset initData', function (done) {
        var U = san.defineComponent({
            template: '<u>{{foo}}</u>',
            initData: function () {
                return {
                    foo: 'foo'
                };
            }
        });

        var MyComponent = san.defineComponent({
            template: '<div><my-u s-ref="uc" foo="{{formData.foo}}" /></div>',
            components: {
                'my-u': U
            },
            initData: function () {
                return {
                    formData: {},
                    foo: 10
                };
            },
            getFooValue: function () {
                return this.ref('uc').data.get('foo');
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(myComponent.getFooValue()).toBe('foo');
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('foo');
        myComponent.data.set('formData', {foo: 'bar'});

        var myComponent2 = new MyComponent({
            data: {
                foo: undefined,
                bar: 20
            }
        });
        expect(myComponent2.data.get('foo')).toBe(10);
        expect(myComponent2.data.get('bar')).toBe(20);

        san.nextTick(function () {
            expect(myComponent.getFooValue()).toBe('bar');
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('bar');


            myComponent2.dispose();
            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("dynamic component attach to inner element", function () {

        var UnderlinePanel = san.defineComponent({
            template: '<div><u><slot></slot></u></div>'
        });

        var Strong = san.defineComponent({
            template: '<strong><slot></slot></strong>'
        });

        var Biz = san.defineComponent({
            components: {
                'x-panel': UnderlinePanel,
                'x-strong': Strong
            },

            template: '<div>'
                + '<x-panel><x-strong item="{{item}}" s-if="strongShow">{{item}}</x-strong></x-panel></div>'
        });

        var MyComponent = san.defineComponent({
            template: '<div><span>hello</span></div>',

            attached: function () {
                this.biz = new Biz({
                    data: {
                        strongShow: true
                    }
                });
                this.biz.attach(this.el);
            },

            disposed: function () {
                this.biz.dispose();
                this.biz = null;
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        var us = wrap.getElementsByTagName('u');
        expect(us.length).toBe(1);

        myComponent.dispose();
        var us = wrap.getElementsByTagName('u');
        expect(us.length).toBe(0);

        document.body.removeChild(wrap);
    });

    it("dynamic component by source, prop data should be auto update", function (done) {
        var Person = san.defineComponent({
            template: '<span><b>{{name}}</b><u>{{email}}</u></span>'
        });

        var MyComponent = san.defineComponent({
            template: '<div><a>hello</a></div>',

            attached: function () {
                this.p = new Person({
                    owner: this,
                    source: '<x-biz name="{{author.name}}" email="{{author.email}}" />'
                });
                this.p.attach(this.el);
            }
        });

        var myComponent = new MyComponent({
            data: {
                author: {
                    name: 'erik',
                    email: 'errorrik@gmail.com'
                }
            }
        });
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        var us = wrap.getElementsByTagName('u');
        expect(us.length).toBe(1);
        expect(us[0].innerHTML).toBe('errorrik@gmail.com');

        var bs = wrap.getElementsByTagName('b');
        expect(bs.length).toBe(1);
        expect(bs[0].innerHTML).toBe('erik');

        myComponent.data.set('author.email', 'erik168@163.com');
        myComponent.nextTick(function () {
            var us = wrap.getElementsByTagName('u');
            expect(us.length).toBe(1);
            expect(us[0].innerHTML).toBe('erik168@163.com');

            var bs = wrap.getElementsByTagName('b');
            expect(bs.length).toBe(1);
            expect(bs[0].innerHTML).toBe('erik');

            myComponent.dispose();

            expect(myComponent.p.lifeCycle.is('disposed')).toBeTruthy();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("dynamic component by source, bindx prop data update owner data", function (done) {
        var Person = san.defineComponent({
            template: '<span><b>{{name}}</b><u>{{email}}</u></span>'
        });

        var MyComponent = san.defineComponent({
            template: '<div><a>{{author.name}}</a></div>',

            attached: function () {
                this.p = new Person({
                    owner: this,
                    source: '<x-p name="{=author.name=}" email="{{author.email}}" />'
                });
                this.p.attach(this.el);
            }
        });

        var myComponent = new MyComponent({
            data: {
                author: {
                    name: 'erik',
                    email: 'errorrik@gmail.com'
                }
            }
        });
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        var us = wrap.getElementsByTagName('u');
        expect(us.length).toBe(1);
        expect(us[0].innerHTML).toBe('errorrik@gmail.com');

        var bs = wrap.getElementsByTagName('b');
        expect(bs.length).toBe(1);
        expect(bs[0].innerHTML).toBe('erik');


        var as = wrap.getElementsByTagName('a');
        expect(as.length).toBe(1);
        expect(as[0].innerHTML).toBe('erik');

        myComponent.p.data.set('name', 'errorrik');
        myComponent.nextTick(function () {
            var us = wrap.getElementsByTagName('u');
            expect(us.length).toBe(1);
            expect(us[0].innerHTML).toBe('errorrik@gmail.com');

            var bs = wrap.getElementsByTagName('b');
            expect(bs.length).toBe(1);
            expect(bs[0].innerHTML).toBe('errorrik');

            var as = wrap.getElementsByTagName('a');
            expect(as.length).toBe(1);
            expect(as[0].innerHTML).toBe('errorrik');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("dynamic component by source, custom slot", function (done) {
        var Dialog = san.defineComponent({
            template: '<span><slot name="title"/><slot/></span>'
        });

        var MyComponent = san.defineComponent({
            template: '<div>test dialog</div>',

            attached: function () {
                if (!this.dialog) {
                    this.dialog = new Dialog({
                        owner: this,
                        source: '<x-dialog><a slot="title">{{title}}</a><b s-if="strongContent">{{content}}</b><u s-else>{{content}}</u></x-dialog>'
                    });
                    this.dialog.attach(this.el);
                }
            }
        });


        var myComponent = new MyComponent({
            data: {
                title: 'my dialog',
                content: 'hello san',
                strongContent: true
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        var us = wrap.getElementsByTagName('u');
        expect(us.length).toBe(0);

        var bs = wrap.getElementsByTagName('b');
        expect(bs.length).toBe(1);
        expect(bs[0].innerHTML).toBe('hello san');


        var as = wrap.getElementsByTagName('a');
        expect(as.length).toBe(1);
        expect(as[0].innerHTML).toBe('my dialog');

        myComponent.data.set('strongContent', false);
        myComponent.data.set('title', 'title changed');
        myComponent.nextTick(function () {
            var us = wrap.getElementsByTagName('u');
            expect(us.length).toBe(1);
            expect(us[0].innerHTML).toBe('hello san');

            var bs = wrap.getElementsByTagName('b');
            expect(bs.length).toBe(0);


            var as = wrap.getElementsByTagName('a');
            expect(as.length).toBe(1);
            expect(as[0].innerHTML).toBe('title changed');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });


    it("dynamic component by owner, fire event to owner", function (done) {
        var Person = san.defineComponent({
            template: '<span><b>{{name}}</b><u>{{email}}</u></span>'
        });

        var newName;
        var oldName;
        var MyComponent = san.defineComponent({
            template: '<div><a>{{author.name}}</a></div>',

            attached: function () {
                this.p = new Person({
                    owner: this,
                    source: '<x-p name="{{author.name}}" email="{{author.email}}" on-namechange="editName($event, author)"/>'
                });
                this.p.attach(this.el);
                oldName = newName = this.data.get('author.name');
            },

            editName: function (e, author) {
                newName = e;
                oldName = author.name;
            }
        });

        var myComponent = new MyComponent({
            data: {
                author: {
                    name: 'erik',
                    email: 'errorrik@gmail.com'
                }
            }
        });
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        var us = wrap.getElementsByTagName('u');
        expect(us.length).toBe(1);
        expect(us[0].innerHTML).toBe('errorrik@gmail.com');

        var bs = wrap.getElementsByTagName('b');
        expect(bs.length).toBe(1);
        expect(bs[0].innerHTML).toBe('erik');


        var as = wrap.getElementsByTagName('a');
        expect(as.length).toBe(1);
        expect(as[0].innerHTML).toBe('erik');


        expect(newName).toBe('erik');
        expect(oldName).toBe('erik');
        myComponent.p.fire('namechange', 'errorrik');
        myComponent.nextTick(function () {
            expect(newName).toBe('errorrik');
            expect(oldName).toBe('erik');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("dynamic component by owner, dispatch event pass to owner", function (done) {
        var Person = san.defineComponent({
            template: '<span><b>{{name}}</b><u>{{email}}</u></span>'
        });

        var dispatchName = 'erik';
        var MyComponent = san.defineComponent({
            template: '<div><a>{{author.name}}</a></div>',

            attached: function () {
                this.p = new Person({
                    owner: this,
                    data: {
                        name: this.data.get('author.name'),
                        email: this.data.get('author.email')
                    }
                });
                this.p.attach(this.el);
            },

            messages: {
                'name-change': function (arg) {
                    this.data.set('author.name', arg.value)
                    dispatchName = arg.value;
                }
            }
        });

        var myComponent = new MyComponent({
            data: {
                author: {
                    name: 'erik',
                    email: 'errorrik@gmail.com'
                }
            }
        });
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        var us = wrap.getElementsByTagName('u');
        expect(us.length).toBe(1);
        expect(us[0].innerHTML).toBe('errorrik@gmail.com');

        var bs = wrap.getElementsByTagName('b');
        expect(bs.length).toBe(1);
        expect(bs[0].innerHTML).toBe('erik');


        var as = wrap.getElementsByTagName('a');
        expect(as.length).toBe(1);
        expect(as[0].innerHTML).toBe('erik');

        myComponent.p.dispatch('name-change', 'errorrik');
        myComponent.nextTick(function () {
            var as = wrap.getElementsByTagName('a');
            expect(as.length).toBe(1);
            expect(as[0].innerHTML).toBe('errorrik');

            expect(dispatchName).toBe('errorrik');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("dynamic component by owner, auto dispose", function () {
        var Person = san.defineComponent({
            template: '<span><b>{{name}}</b><u>{{email}}</u></span>'
        });

        var dispatchName = 'erik';
        var MyComponent = san.defineComponent({
            template: '<div><a>{{author.name}}</a></div>',

            attached: function () {
                this.p = new Person({
                    owner: this,
                    data: {
                        name: this.data.get('author.name'),
                        email: this.data.get('author.email')
                    }
                });
                this.p.attach(document.body);
            }
        });

        var myComponent = new MyComponent({
            data: {
                author: {
                    name: 'erik',
                    email: 'errorrik@gmail.com'
                }
            }
        });
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var pEl = myComponent.p.el;
        expect(pEl.parentNode).not.toBe(null);

        var us = pEl.getElementsByTagName('u');
        expect(us.length).toBe(1);
        expect(us[0].innerHTML).toBe('errorrik@gmail.com');

        var bs = pEl.getElementsByTagName('b');
        expect(bs.length).toBe(1);
        expect(bs[0].innerHTML).toBe('erik');


        var as = wrap.getElementsByTagName('a');
        expect(as.length).toBe(1);
        expect(as[0].innerHTML).toBe('erik');

        myComponent.dispose();
        document.body.removeChild(wrap);
        expect(!pEl.parentNode || !pEl.parentNode.tagName).toBeTruthy();
        expect(myComponent.p.el).toBe(null);
        expect(myComponent.p.lifeCycle.is('disposed')).toBeTruthy();

    });

    it("pre compile template to aNode", function (done) {
        var Man = san.defineComponent({
            filters: {
                upper: function (source) {
                    return source.charAt(0).toUpperCase() + source.slice(1);
                }
            },

            aNode: san.parseTemplate('<div><slot name="test" var-n="data.name" var-email="data.email" var-sex="data.sex ? \'male\' : \'female\'"><p>{{n}},{{sex}},{{email}}</p></slot></div>').children[0]
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

            aNode: san.parseTemplate('<div><x-man data="{{man}}"><h3 slot="test">{{n|upper}}</h3><b slot="test">{{sex|upper}}</b><u slot="test">{{email|upper}}</u></x-man></div>').children[0],

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

    it("compile template to aNode, aNode is JSON stringifible", function (done) {
        var stringifier = {
            obj: function (source) {
                var prefixComma;
                var result = '{';

                for (var key in source) {
                    if (!source.hasOwnProperty(key) || typeof source[key] === 'undefined') {
                        continue;
                    }

                    if (prefixComma) {
                        result += ',';
                    }
                    prefixComma = 1;

                    result += stringifier.str(key) + ':' + stringifier.any(source[key]);
                }

                return result + '}';
            },

            arr: function (source) {
                var prefixComma;
                var result = '[';

                for (var i = 0; i < source.length; i++) {
                    value = source[i];
                    if (prefixComma) {
                        result += ',';
                    }
                    prefixComma = 1;

                    result += stringifier.any(value);
                }

                return result + ']';
            },

            str: function (source) {
                return '"'
                    + source
                        .replace(/\x5C/g, '\\\\')
                        .replace(/"/g, '\\"')
                        .replace(/\x0A/g, '\\n')
                        .replace(/\x09/g, '\\t')
                        .replace(/\x0D/g, '\\r')
                    // .replace( /\x08/g, '\\b' )
                    // .replace( /\x0C/g, '\\f' )
                    + '"';
            },

            any: function (source) {
                switch (typeof source) {
                    case 'string':
                        return stringifier.str(source);

                    case 'number':
                        return '' + source;

                    case 'boolean':
                        return source ? 'true' : 'false';

                    case 'object':
                        if (!source) {
                            return null;
                        }

                        if (source instanceof Array) {
                            return stringifier.arr(source);
                        }

                        if (source instanceof Date) {
                            return stringifier.date(source);
                        }

                        return stringifier.obj(source);
                }

                throw new Error('Cannot Stringify:' + source);
            }
        };
        var aNode = san.parseTemplate('<a><span>aaa</span>hello {{name|raw}}!<b>bbb</b></a>').children[0];
        var MyComponent = eval('san.defineComponent({aNode: '
            + stringifier.any(aNode)
            + '})')
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'er<u>erik</u>ik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var a = wrap.getElementsByTagName('a')[0];
        var b = wrap.getElementsByTagName('b')[0];
        expect(/hello er<u>erik<\/u>ik!/i.test(a.innerHTML)).toBeTruthy();
        expect(b.innerHTML).toBe('bbb');

        myComponent.data.set('name', 'er<span>erik</span>ik');

        san.nextTick(function () {
            expect(/hello er<span>erik<\/span>ik!/i.test(a.innerHTML)).toBeTruthy();
            expect(b.innerHTML).toBe('bbb');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("id can be pass and change", function (done) {
        var Button = san.defineComponent({
            template: '<button>btn</button>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-btn': Button
            },
            template: '<div><x-btn id="b-{{name}}"/></div>'
        });


        var myComponent = new MyComponent({
            data: {
                name: 'er'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var btn = document.getElementById('b-er');
        expect(btn.tagName).toBe('BUTTON');

        myComponent.data.set('name', 'san');

        san.nextTick(function () {
            expect(document.getElementById('b-er') == null).toBeTruthy();
            expect(btn === document.getElementById('b-san')).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("static bind name is a bool attr name", function () {
        var Button = san.defineComponent({
            template: '<a><b s-if="required">btn</b></a>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-btn': Button
            },
            template: '<div><x-btn required="true"/></div>'
        });


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var b = wrap.getElementsByTagName('b')[0];
        expect(b.innerHTML).toContain('btn');


        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("root tag name is template, default to div", function () {
        var Layer = san.defineComponent({
            template: '<template><div s-if="open"></div></template>',
            initData: function () {
                return {
                    open: false
                };
            },
            attached: function () {
                if (this.el.parentNode !== document.body) {
                    document.body.appendChild(this.el);
                }
            },
            detached: function () {
                this.el.parentNode.removeChild(this.el);
            }
        });

        var MyComponent = san.defineComponent({
            template: '<template>'
                + '<x-layer s-ref="lay" open="{{open}}" />'
                + '<button on-click="onClick">Show Layer</button>'
                + '</template>',
            components: {
                'x-layer': Layer
            },
            onClick: function () {
                this.data.set('open', true);
            }
        });


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(myComponent.el.tagName).toBe('DIV');
        expect(/^(x-layer|div)$/i.test(myComponent.ref('lay').el.tagName)).toBeTruthy();


        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("set data when value equals origin value, view cannot be updated because immutable", function (done) {
        var Panel = san.defineComponent({
            template: '<u>{{h}}</u>',
            attached: function () {
                this.data.set('h', 50);
            }
        });

        var MyComponent = san.defineComponent({
            template: '<div>'
                + '<x-panel h="{{ph}}" />'
                + '</div>',
            components: {
                'x-panel': Panel
            }
        });

        var myComponent = new MyComponent({
            data: {
                ph: 100
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var u = wrap.getElementsByTagName('u')[0];
        expect(u.innerHTML).toBe('100');

        myComponent.nextTick(function () {
            expect(u.innerHTML).toBe('50');
            myComponent.data.set('ph', 100);

            myComponent.nextTick(function () {
                expect(u.innerHTML).toBe('50');

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        })
    });

    it("set data force when value equals origin value, view should be updated", function (done) {
        var Panel = san.defineComponent({
            template: '<u>{{h}}</u>',
            attached: function () {
                this.data.set('h', 50);
            }
        });

        var MyComponent = san.defineComponent({
            template: '<div>'
                + '<x-panel h="{{ph}}" />'
                + '</div>',
            components: {
                'x-panel': Panel
            }
        });


        var myComponent = new MyComponent({
            data: {
                ph: 100
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var u = wrap.getElementsByTagName('u')[0];
        expect(u.innerHTML).toBe('100');

        myComponent.nextTick(function () {
            expect(u.innerHTML).toBe('50');
            myComponent.data.set('ph', 100, {force: 1});

            myComponent.nextTick(function () {
                expect(u.innerHTML).toBe('100');

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        })
    });

    it("has only s-bind declaration", function (done) {
        var Article = san.defineComponent({
            template: '<div><h3>{{title}}</h3><h4 s-if="subtitle">{{subtitle}}</h4><p>{{content}}</p></div>'
        });
        var MyComponent = san.defineComponent({
            components: {
                'x-a': Article
            },
            template: '<div><x-a s-bind="article" /></div>'
        });
        var myComponent = new MyComponent({
            data: {
                article: {
                    title: 'Hello',
                    subtitle: 'San',
                    content: 'framework'
                }
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var h3 = wrap.getElementsByTagName('h3')[0];
        var h4 = wrap.getElementsByTagName('h4')[0];
        var p = wrap.getElementsByTagName('p')[0];
        expect(h3.innerHTML).toContain('Hello');
        expect(h4.innerHTML).toContain('San');
        expect(p.innerHTML).toContain('framework');

        myComponent.data.set('article.subtitle', '');
        myComponent.data.set('article.title', 'HeySan');
        myComponent.nextTick(function () {
            expect(h3.innerHTML).toContain('HeySan');
            expect(wrap.getElementsByTagName('h4').length).toBe(0);
            expect(p.innerHTML).toContain('framework');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });


    it("has s-bind with other attr, confilct", function (done) {
        var Article = san.defineComponent({
            template: '<div><h3>{{title}}</h3><h4 s-if="subtitle">{{subtitle}}</h4><p>{{content}}</p></div>'
        });
        var MyComponent = san.defineComponent({
            components: {
                'x-a': Article
            },
            template: '<div><x-a s-bind="article" title="{{title}}"/></div>'
        });
        var myComponent = new MyComponent({
            data: {
                article: {
                    title: 'Hello',
                    subtitle: 'San',
                    content: 'framework'
                },

                title: 'Hey'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var h3 = wrap.getElementsByTagName('h3')[0];
        var h4 = wrap.getElementsByTagName('h4')[0];
        var p = wrap.getElementsByTagName('p')[0];
        expect(h3.innerHTML).toContain('Hey');
        expect(h4.innerHTML).toContain('San');
        expect(p.innerHTML).toContain('framework');

        myComponent.data.set('article.subtitle', '');
        myComponent.data.set('article.title', 'Bye');
        myComponent.nextTick(function () {
            expect(h3.innerHTML).toContain('Hey');
            expect(wrap.getElementsByTagName('h4').length).toBe(0);
            expect(p.innerHTML).toContain('framework');

            myComponent.data.set('title', 'What');
            myComponent.nextTick(function () {
                expect(h3.innerHTML).toContain('What');
                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });

    });

    it("modify data in created, dont refresh view in next tick", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li s-for="item in list">{{item}}</li></ul>',

            initData: function () {
                return {
                    list: []
                };
            },
            created: function () {
                this.data.push('list', 1);
            }

        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.nextTick(function () {
            expect(wrap.getElementsByTagName('li').length).toBe(1);
            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("set expr contains dynamic assessor, update children component success", function (done) {
        var Child = san.defineComponent({
            template: '<b>{{d.test1.value}}</b>'
        });

        var MyComponent = san.defineComponent({
            template: '<div><x-child d="{{map}}"/><a>{{map[list[index].title].value}}</a></div>',
            components: {
                'x-child': Child
            }
        });

        var myComponent = new MyComponent({
            data: {
                map: {
                    test1: { value: 'hello' }
                },
                list: [
                    {
                        title: 'test1'
                    }
                ],
                index: 0
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('hello');
        expect(wrap.getElementsByTagName('a')[0].innerHTML).toBe('hello');

        myComponent.data.set('map[list[index].title].value', 'bye');

        myComponent.nextTick(function () {
            expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('bye');
            expect(wrap.getElementsByTagName('a')[0].innerHTML).toBe('bye');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("root element with if, has data when inited", function (done) {
        var num = 0;
        var MyComponent = san.defineComponent({
            template: '<b s-if="person" on-click="add">{{person.name}}</b>',
            add: function () {
                num++;
            }
        });

        var myComponent = new MyComponent({
            data: {
                person: {
                    name: 'errorrik'
                }
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('b').length).toBe(1);

        var b = wrap.getElementsByTagName('b')[0];
        expect(b.innerHTML).toBe('errorrik');

        triggerEvent(b, 'click');

        myComponent.nextTick(function () {
            expect(num).toBe(1);
            myComponent.data.set('person', null);

            myComponent.nextTick(function () {
                expect(wrap.getElementsByTagName('b').length).toBe(0);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it("root element with if, no data when inited", function (done) {
        var num = 0;
        var MyComponent = san.defineComponent({
            template: '<b s-if="person" on-click="add">{{person.name}}</b>',
            add: function () {
                num++;
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('b').length).toBe(0);
        myComponent.data.set('person', {
            name: 'errorrik'
        });

        myComponent.nextTick(function () {
            expect(wrap.getElementsByTagName('b').length).toBe(1);

            var b = wrap.getElementsByTagName('b')[0];
            triggerEvent(b, 'click');
            expect(b.innerHTML).toBe('errorrik');

            myComponent.nextTick(function () {
                expect(num).toBe(1);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });

        });
    });

    it("root element with if as child, has data when inited", function (done) {
        var Child = san.defineComponent({
            template: '<b s-if="person">{{person.name}}</b>'
        });

        var MyComponent = san.defineComponent({
            template: '<div><x-child person="{{p}}"/></div>',
            components: {
                'x-child': Child
            }
        });

        var myComponent = new MyComponent({
            data: {
                p: {
                    name: 'errorrik'
                }
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('b').length).toBe(1);
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('errorrik');

        myComponent.data.set('p', null);

        myComponent.nextTick(function () {
            expect(wrap.getElementsByTagName('b').length).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("root element with if as child, no data when inited", function (done) {
        var Child = san.defineComponent({
            template: '<b s-if="person">{{person.name}}</b>'
        });

        var MyComponent = san.defineComponent({
            template: '<div><x-child person="{{p}}"/></div>',
            components: {
                'x-child': Child
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('b').length).toBe(0);
        myComponent.data.set('p', {
            name: 'errorrik'
        });

        myComponent.nextTick(function () {
            expect(wrap.getElementsByTagName('b').length).toBe(1);
            expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('errorrik');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("checkbox as component root", function (done) {
        var Checkbox = san.defineComponent({
            template: '<input type="checkbox" value="{{value}}" checked="{{checked}}">'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-cb': Checkbox
            },

            template: '<div>'
                + '<label s-for="p in ps"><x-cb value="{{p}}" checked="{{online}}"/>{{p}}</label>'
                + '</div>',

            initData: function () {
                return {
                    online: ['varsha'],
                    ps: ['errorrik', 'varsha', 'firede']
                };
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var inputs = wrap.getElementsByTagName('input');
        expect(inputs[0].checked).toBeFalsy();
        expect(inputs[1].checked).toBeTruthy();
        expect(inputs[2].checked).toBeFalsy();

        myComponent.data.push('online', 'errorrik');
        myComponent.nextTick(function () {

            expect(inputs[0].checked).toBeTruthy();
            expect(inputs[1].checked).toBeTruthy();
            expect(inputs[2].checked).toBeFalsy();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("getComponentType called by aNode and scope", function (done) {
        var Button = san.defineComponent({
            template: '<button><slot/></button>'
        });

        var Link = san.defineComponent({
            template: '<a><slot/></a>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-button': Button
            },

            template: '<div>'
                + '<x-link s-for="item in list">{{item.title}}</x-link>'
                + '<x-button>last</x-button>'
                + '</div>',

            getComponentType: function (aNode, scope) {
                var tagName = aNode.tagName;
                if (tagName === 'x-link') {
                    return scope.get('item.type') === 'a' ? Link : Button
                }

                return this.components[tagName];
            }
        });

        var myComponent = new MyComponent({
            data: {
                list: [
                    { type: 'a', title: 'one' },
                    { type: 'button', title: 'two' },
                    { type: 'button', title: 'three' },
                    { type: 'a', title: 'four' }
                ]
            }
        });
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var child = myComponent.el.firstChild;
        expect(child.tagName).toBe('A');
        expect(child.innerHTML).toContain('one');

        child = child.nextSibling;
        expect(child.tagName).toBe('BUTTON');
        expect(child.innerHTML).toContain('two');

        child = child.nextSibling;
        expect(child.tagName).toBe('BUTTON');
        expect(child.innerHTML).toContain('three');

        child = child.nextSibling;
        expect(child.tagName).toBe('A');
        expect(child.innerHTML).toContain('four');

        child = myComponent.el.lastChild;
        expect(child.tagName).toBe('BUTTON');
        expect(child.innerHTML).toContain('last');

        myComponent.nextTick(function () {

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("data prop with empty string, should not autotrans true", function () {
        var Child = san.defineComponent({
            template: '<b>{{text}}</b>'
        });

        var MyComponent = san.defineComponent({
            template: '<div><x-child text="" s-ref="child" /></div>',
            components: {
                'x-child': Child
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('');
        expect(myComponent.ref('child').data.get('text')).toBe('');
        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("outer class merge inner class", function (done) {
        var Child = san.defineComponent({
            template: '<b class="{{clazz}}">{{text}}</b>'
        });

        var MyComponent = san.defineComponent({
            template: '<div><x-child class="{{clazz}}" s-ref="child" /></div>',
            components: {
                'x-child': Child
            }
        });

        var myComponent = new MyComponent({
            data: {
                clazz: 'outer'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(myComponent.ref('child').el.className).toBe('outer');
        myComponent.ref('child').data.set('clazz', ['inn1', 'inn2']);

        myComponent.nextTick(function () {
            expect(myComponent.ref('child').el.className).toBe('inn1 inn2 outer');
            myComponent.data.set('clazz', '');

            myComponent.nextTick(function () {
                expect(myComponent.ref('child').el.className).toBe('inn1 inn2');


                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it("fragment as component root", function (done) {
        var MyComponent = san.defineComponent({
            template: '<fragment>see <a href="{{link}}">{{linkText || name}}</a> to start <b>{{name}}</b> framework</fragment>'
        });

        var myComponent = new MyComponent({
            data: {
                link: 'https://baidu.github.io/san/',
                name: 'San',
                linkText: 'HomePage'
            }
        });

        expect(myComponent.el == null).toBeTruthy();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var as = wrap.getElementsByTagName('a');
        var bs = wrap.getElementsByTagName('b');
        expect(as.length).toBe(1);
        expect(as[0].innerHTML).toBe('HomePage');
        expect(bs[0].innerHTML).toBe('San');

        myComponent.data.set('linkText', 'github');
        myComponent.data.set('link', 'https://github.com/baidu/san/');
        myComponent.data.set('name', 'san');
        myComponent.nextTick(function () {
            var as = wrap.getElementsByTagName('a');
            var bs = wrap.getElementsByTagName('b');
            expect(as.length).toBe(1);
            expect(as[0].innerHTML).toBe('github');
            expect(bs[0].innerHTML).toBe('san');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("fragment with if as component root", function (done) {
        var MyComponent = san.defineComponent({
            template: '<fragment s-if="!hidd">see <a href="{{link}}">{{linkText || name}}</a> to start <b>{{name}}</b> framework</fragment>'
        });

        var myComponent = new MyComponent({
            data: {
                link: 'https://baidu.github.io/san/',
                name: 'San',
                linkText: 'HomePage'
            }
        });

        expect(myComponent.el == null).toBeTruthy();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        expect(wrap.innerHTML).toContain('see');
        expect(wrap.innerHTML).toContain('framework');

        var as = wrap.getElementsByTagName('a');
        var bs = wrap.getElementsByTagName('b');
        expect(as.length).toBe(1);
        expect(as[0].innerHTML).toBe('HomePage');
        expect(bs[0].innerHTML).toBe('San');

        myComponent.data.set('linkText', 'github');
        myComponent.data.set('link', 'https://github.com/baidu/san/');
        myComponent.data.set('name', 'san');
        myComponent.nextTick(function () {

            expect(wrap.innerHTML).toContain('see');
            expect(wrap.innerHTML).toContain('start');

            var as = wrap.getElementsByTagName('a');
            var bs = wrap.getElementsByTagName('b');
            expect(as.length).toBe(1);
            expect(as[0].innerHTML).toBe('github');
            expect(bs[0].innerHTML).toBe('san');

            myComponent.data.set('hidd', true);
            myComponent.nextTick(function () {
                var as = wrap.getElementsByTagName('a');
                expect(as.length).toBe(0);
                expect(wrap.innerHTML).not.toContain('see');
                expect(wrap.innerHTML).not.toContain('framework');

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it("fragment as component root", function (done) {
        var Child = san.defineComponent({
            template: '<fragment>see <a href="{{link}}">{{linkText || name}}</a> to start <b>{{name}}</b> framework</fragment>'
        });

        var MyComponent = san.defineComponent({
            template: '<div><x-child link="{{link}}" name="{{name}}" link-text="{{linkText}}"/></div>',
            components: {
                'x-child': Child
            }
        });

        var myComponent = new MyComponent({
            data: {
                link: 'https://baidu.github.io/san/',
                name: 'San',
                linkText: 'HomePage'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var as = wrap.getElementsByTagName('a');
        var bs = wrap.getElementsByTagName('b');
        expect(as.length).toBe(1);
        expect(as[0].innerHTML).toBe('HomePage');
        expect(bs[0].innerHTML).toBe('San');

        myComponent.data.set('linkText', 'github');
        myComponent.data.set('link', 'https://github.com/baidu/san/');
        myComponent.data.set('name', 'san');
        myComponent.nextTick(function () {
            var as = wrap.getElementsByTagName('a');
            var bs = wrap.getElementsByTagName('b');
            expect(as.length).toBe(1);
            expect(as[0].innerHTML).toBe('github');
            expect(bs[0].innerHTML).toBe('san');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("fragment root el in for", function (done) {
        var Child = san.defineComponent({
            template: '<fragment>see <a href="{{link}}">{{linkText || name}}</a> to start <b>{{name}}</b> framework</fragment>'
        });

        var MyComponent = san.defineComponent({
            template: '<div><x-child s-for="f in frameworks" link="{{f.link}}" name="{{f.name}}" link-text="{{f.linkText}}"/></div>',
            components: {
                'x-child': Child
            }
        });

        var myComponent = new MyComponent({
            data: {
                frameworks: [
                    {
                        link: 'https://baidu.github.io/san/',
                        name: 'San',
                        linkText: 'HomePage'
                    },
                    {
                        link: 'https://reactjs.org/',
                        name: 'react',
                        linkText: 'HomePage'
                    },
                    {
                        link: 'https://vuejs.org/',
                        name: 'Vue',
                        linkText: 'HomePage'
                    }
                ]

            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var as = wrap.getElementsByTagName('a');
        var bs = wrap.getElementsByTagName('b');
        expect(as.length).toBe(3);
        expect(as[0].innerHTML).toBe('HomePage');
        expect(bs[0].innerHTML).toBe('San');
        expect(as[2].innerHTML).toBe('HomePage');
        expect(bs[2].innerHTML).toBe('Vue');

        myComponent.data.removeAt('frameworks', 1);
        myComponent.data.set('frameworks[1].name', 'vue');
        myComponent.nextTick(function () {
            var as = wrap.getElementsByTagName('a');
            var bs = wrap.getElementsByTagName('b');
            expect(as.length).toBe(2);
            expect(as[1].innerHTML).toBe('HomePage');
            expect(bs[1].innerHTML).toBe('vue');

            myComponent.data.push('frameworks', {
                link: 'https://reactjs.org/',
                name: 'react',
                linkText: 'Home'
            });

            myComponent.nextTick(function () {
                var as = wrap.getElementsByTagName('a');
                var bs = wrap.getElementsByTagName('b');
                expect(as.length).toBe(3);
                expect(as[1].innerHTML).toBe('HomePage');
                expect(bs[1].innerHTML).toBe('vue');
                expect(as[2].innerHTML).toBe('Home');
                expect(bs[2].innerHTML).toBe('react');

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it("component as component root", function (done) {
        var Child = san.defineComponent({
            template: '<h3>see <a href="{{link}}">{{linkText || name}}</a> to start <b>{{name}}</b> framework</h3>'
        });

        var MyComponent = san.defineComponent({
            template: '<x-child link="{{link}}" name="{{framework}}" link-text="{{linkText}}" style="font-size:18px"/>',
            components: {
                'x-child': Child
            }
        });

        var myComponent = new MyComponent({
            data: {
                link: 'https://baidu.github.io/san/',
                framework: 'San',
                linkText: 'HomePage'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        expect(myComponent.el.tagName).toBe('H3');
        expect(myComponent.el.className).toBe('');
        expect(!!myComponent.el.id).toBeFalsy();
        expect(myComponent.el.style.fontSize).toContain('18');

        var as = wrap.getElementsByTagName('a');
        var bs = wrap.getElementsByTagName('b');
        expect(as.length).toBe(1);
        expect(as[0].innerHTML).toBe('HomePage');
        expect(bs[0].innerHTML).toBe('San');

        myComponent.data.set('linkText', 'github');
        myComponent.data.set('link', 'https://github.com/baidu/san/');
        myComponent.data.set('framework', 'san');
        myComponent.nextTick(function () {
            var as = wrap.getElementsByTagName('a');
            var bs = wrap.getElementsByTagName('b');
            expect(as.length).toBe(1);
            expect(as[0].innerHTML).toBe('github');
            expect(bs[0].innerHTML).toBe('san');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("component as component root, use s-bind", function (done) {
        var Child = san.defineComponent({
            template: '<h3>see <a href="{{link}}">{{linkText || name}}</a> to start <b>{{name}}</b> framework</h3>'
        });

        var MyComponent = san.defineComponent({
            template: '<x-child s-bind="{{info}}" style="font-size:18px"/>',
            components: {
                'x-child': Child
            }
        });

        var myComponent = new MyComponent({
            data: {
                info: {
                    link: 'https://baidu.github.io/san/',
                    name: 'San',
                    linkText: 'HomePage'
                }
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        expect(myComponent.el.tagName).toBe('H3');
        expect(myComponent.el.className).toBe('');
        expect(!!myComponent.el.id).toBeFalsy();
        expect(myComponent.el.style.fontSize).toContain('18');

        var as = wrap.getElementsByTagName('a');
        var bs = wrap.getElementsByTagName('b');
        expect(as.length).toBe(1);
        expect(as[0].innerHTML).toBe('HomePage');
        expect(bs[0].innerHTML).toBe('San');

        myComponent.data.set('info.linkText', 'github');
        myComponent.data.set('info.link', 'https://github.com/baidu/san/');
        myComponent.data.set('info.name', 'san');
        myComponent.nextTick(function () {
            var as = wrap.getElementsByTagName('a');
            var bs = wrap.getElementsByTagName('b');
            expect(as.length).toBe(1);
            expect(as[0].innerHTML).toBe('github');
            expect(bs[0].innerHTML).toBe('san');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("for directive as root", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a s-for="item in list">{{item}}</a>'
        });

        var myComponent = new MyComponent({
            data: {
                list: ['err', 'lee', 'gray']
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(myComponent.el == null).toBeTruthy();

        var as = wrap.getElementsByTagName('a');
        expect(as.length).toBe(3);
        expect(as[0].parentNode).toBe(wrap);
        expect(as[0].innerHTML).toBe('err');
        expect(as[1].innerHTML).toBe('lee');

        myComponent.data.removeAt('list', 1);
        myComponent.data.set('list[0]', 'errorrik');
        myComponent.nextTick(function () {
            var as = wrap.getElementsByTagName('a');
            expect(as.length).toBe(2);
            expect(as[1].parentNode).toBe(wrap);
            expect(as[0].innerHTML).toBe('errorrik');
            expect(as[1].innerHTML).toBe('gray');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("for directive with fragment as root", function (done) {
        var MyComponent = san.defineComponent({
            template: '<fragment s-for="item in list"><b>{{item.name}}</b><a>{{item.email}}</a></fragment>'
        });

        var myComponent = new MyComponent({
            data: {
                list: [
                    {name: 'err', email: 'errorrik@gmail.com'},
                    {name: 'lee', email: 'leeight@gmail.com'},
                    {name: 'gray', email: 'xxx@outlook.com'}
                ]
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(myComponent.el == null).toBeTruthy();

        var as = wrap.getElementsByTagName('a');
        var bs = wrap.getElementsByTagName('b');
        expect(as.length).toBe(3);
        expect(bs.length).toBe(3);
        expect(as[0].parentNode).toBe(wrap);
        expect(bs[0].innerHTML).toBe('err');
        expect(bs[1].innerHTML).toBe('lee');

        myComponent.data.removeAt('list', 1);
        myComponent.data.set('list[0].name', 'errorrik');
        myComponent.nextTick(function () {
            var as = wrap.getElementsByTagName('a');
            var bs = wrap.getElementsByTagName('b');
            expect(as.length).toBe(2);
            expect(as[1].parentNode).toBe(wrap);
            expect(bs[0].innerHTML).toBe('errorrik');
            expect(bs[1].innerHTML).toBe('gray');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("fragment as component root, detach and re-attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<fragment>see <a href="{{link}}">{{linkText || name}}</a> to start <b>{{name}}</b> framework</fragment>'
        });

        var myComponent = new MyComponent({
            data: {
                link: 'https://baidu.github.io/san/',
                name: 'San',
                linkText: 'HomePage'
            }
        });

        expect(myComponent.el == null).toBeTruthy();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var as = wrap.getElementsByTagName('a');
        var bs = wrap.getElementsByTagName('b');
        expect(as.length).toBe(1);
        expect(as[0].innerHTML).toBe('HomePage');
        expect(bs[0].innerHTML).toBe('San');

        myComponent.data.set('linkText', 'github');
        myComponent.data.set('link', 'https://github.com/baidu/san/');
        myComponent.data.set('name', 'san');
        myComponent.nextTick(function () {
            var as = wrap.getElementsByTagName('a');
            var bs = wrap.getElementsByTagName('b');
            expect(as.length).toBe(1);
            expect(as[0].innerHTML).toBe('github');
            expect(bs[0].innerHTML).toBe('san');

            myComponent.detach();
            expect(wrap.innerHTML).toBe('');
            expect(myComponent.lifeCycle.detached).toBeTruthy();

            myComponent.attach(wrap);
            expect(myComponent.lifeCycle.detached).toBeFalsy();
            as = wrap.getElementsByTagName('a');
            bs = wrap.getElementsByTagName('b');
            expect(as.length).toBe(1);
            expect(as[0].innerHTML).toBe('github');
            expect(bs[0].innerHTML).toBe('san');

            document.body.removeChild(wrap);
            done();
        });
    });

    it("component as component root, detach and re-attach", function (done) {
        var Child = san.defineComponent({
            template: '<h3>see <a href="{{link}}">{{linkText || name}}</a> to start <b>{{name}}</b> framework</h3>'
        });

        var MyComponent = san.defineComponent({
            template: '<x-child link="{{link}}" name="{{framework}}" link-text="{{linkText}}" />',
            components: {
                'x-child': Child
            }
        });

        var myComponent = new MyComponent({
            data: {
                link: 'https://baidu.github.io/san/',
                framework: 'San',
                linkText: 'HomePage'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var as = wrap.getElementsByTagName('a');
        var bs = wrap.getElementsByTagName('b');
        expect(myComponent.el.tagName).toBe('H3');
        expect(as.length).toBe(1);
        expect(as[0].innerHTML).toBe('HomePage');
        expect(bs[0].innerHTML).toBe('San');

        myComponent.data.set('linkText', 'github');
        myComponent.data.set('link', 'https://github.com/baidu/san/');
        myComponent.data.set('framework', 'san');
        myComponent.nextTick(function () {
            var as = wrap.getElementsByTagName('a');
            var bs = wrap.getElementsByTagName('b');
            expect(as.length).toBe(1);
            expect(as[0].innerHTML).toBe('github');
            expect(bs[0].innerHTML).toBe('san');

            myComponent.detach();
            expect(wrap.innerHTML).toBe('');
            expect(myComponent.lifeCycle.detached).toBeTruthy();

            myComponent.attach(wrap);
            expect(myComponent.lifeCycle.detached).toBeFalsy();
            as = wrap.getElementsByTagName('a');
            bs = wrap.getElementsByTagName('b');
            expect(as.length).toBe(1);
            expect(as[0].innerHTML).toBe('github');
            expect(bs[0].innerHTML).toBe('san');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("for directive as root, detach and re-attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a s-for="item in list">{{item}}</a>'
        });

        var myComponent = new MyComponent({
            data: {
                list: ['err', 'lee', 'gray']
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(myComponent.el == null).toBeTruthy();

        var as = wrap.getElementsByTagName('a');
        expect(as.length).toBe(3);
        expect(as[0].parentNode).toBe(wrap);
        expect(as[0].innerHTML).toBe('err');
        expect(as[1].innerHTML).toBe('lee');

        myComponent.data.removeAt('list', 1);
        myComponent.data.set('list[0]', 'errorrik');
        myComponent.nextTick(function () {
            var as = wrap.getElementsByTagName('a');
            expect(as.length).toBe(2);
            expect(as[1].parentNode).toBe(wrap);
            expect(as[0].innerHTML).toBe('errorrik');
            expect(as[1].innerHTML).toBe('gray');

            myComponent.detach();
            expect(wrap.innerHTML).toBe('');
            expect(myComponent.lifeCycle.detached).toBeTruthy();


            myComponent.attach(wrap);
            expect(myComponent.lifeCycle.detached).toBeFalsy();
            as = wrap.getElementsByTagName('a');
            expect(as.length).toBe(2);
            expect(as[1].parentNode).toBe(wrap);
            expect(as[0].innerHTML).toBe('errorrik');
            expect(as[1].innerHTML).toBe('gray');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("if as component root, detach and re-attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div s-if="!hidd">see <a href="{{link}}">{{linkText || name}}</a> to start <b>{{name}}</b> framework</div>'
        });

        var myComponent = new MyComponent({
            data: {
                link: 'https://baidu.github.io/san/',
                name: 'San',
                linkText: 'HomePage'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        expect(wrap.innerHTML).toContain('see');
        expect(wrap.innerHTML).toContain('framework');

        var as = wrap.getElementsByTagName('a');
        var bs = wrap.getElementsByTagName('b');
        expect(as.length).toBe(1);
        expect(as[0].innerHTML).toBe('HomePage');
        expect(bs[0].innerHTML).toBe('San');

        myComponent.data.set('linkText', 'github');
        myComponent.data.set('link', 'https://github.com/baidu/san/');
        myComponent.data.set('name', 'san');
        myComponent.nextTick(function () {

            expect(wrap.innerHTML).toContain('see');
            expect(wrap.innerHTML).toContain('start');

            var as = wrap.getElementsByTagName('a');
            var bs = wrap.getElementsByTagName('b');
            expect(as.length).toBe(1);
            expect(as[0].innerHTML).toBe('github');
            expect(bs[0].innerHTML).toBe('san');

            myComponent.detach();
            expect(wrap.innerHTML).toBe('');
            expect(myComponent.lifeCycle.detached).toBeTruthy();


            myComponent.attach(wrap);
            expect(myComponent.lifeCycle.detached).toBeFalsy();
            as = wrap.getElementsByTagName('a');
            expect(as.length).toBe(1);
            expect(as[0].innerHTML).toBe('github');


            myComponent.data.set('hidd', true);
            myComponent.nextTick(function () {
                var as = wrap.getElementsByTagName('a');
                expect(as.length).toBe(0);
                expect(wrap.innerHTML).not.toContain('see');
                expect(wrap.innerHTML).not.toContain('framework');

                myComponent.detach();
                expect(wrap.innerHTML).toBe('');
                expect(myComponent.lifeCycle.detached).toBeTruthy();


                myComponent.attach(wrap);
                expect(wrap.innerHTML).not.toBe('');
                expect(myComponent.lifeCycle.detached).toBeFalsy();

                myComponent.data.set('hidd', false);
                myComponent.nextTick(function () {
                    expect(wrap.innerHTML).toContain('see');
                    expect(wrap.innerHTML).toContain('start');

                    var as = wrap.getElementsByTagName('a');
                    var bs = wrap.getElementsByTagName('b');
                    expect(as.length).toBe(1);
                    expect(as[0].innerHTML).toBe('github');
                    expect(bs[0].innerHTML).toBe('san');

                    myComponent.dispose();
                    document.body.removeChild(wrap);
                    done();
                });

            });
        });
    });
    it("identify subcomponent with reserved hot tag", function() {
        var Label = san.defineComponent({
            template: '<span title="{{text}}">{{text}}</span>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'b': Label
            },

            template: '<div><b text="{{name}}"></b></div>',

            initData: function() {
                return { name: 'erik' };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerText).toBe('erik');
        expect(span.title).toBe('erik');

        myComponent.dispose();
        document.body.removeChild(wrap);

    });

    it("identify subcomponent with reserved hot tag with getComponentType", function() {
        var Label = san.defineComponent({
            template: '<span title="{{text}}">{{text}}<i>{{tip}}</i></span>'
        });
        var MyComponent = san.defineComponent({
            getComponentType: function(aNode) {
                if (aNode.tagName === 'b') {
                    return Label;
                }
            },

            template: '<div><b text="{{name}}" tip="{{company}}"></b></div>',

            initData: function() {
                return { name: 'erik', company: 'baidu' };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerText).toBe('erikbaidu');
        expect(span.title).toBe('erik');

        var i = wrap.getElementsByTagName('i')[0];
        expect(i.innerText).toBe('baidu');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });



    it("show directive apply to component", function (done) {
        var Label = san.defineComponent({
            template: '<span style="position:absolute">span</span>'
        })
        var MyComponent = san.defineComponent({
            components: {'x-l': Label},
            template: '<div><x-l s-show="num == 3" style="top:1px"/></div>'
        });
        var myComponent = new MyComponent({
            data: {num: 2}
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.style.display).toBe('none');
        expect(span.style.position).toBe('absolute');
        expect(span.style.top).toBe('1px');

        myComponent.data.set('num', 3);

        myComponent.nextTick(function () {
            expect(span.style.display).toBe('');
            expect(span.style.position).toBe('absolute');
            expect(span.style.top).toBe('1px');
            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });
});

