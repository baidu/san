describe("Element-Event", function () {

    it("bind click", function (done) {
        var clicked = 0;

        var MyComponent = san.defineComponent({
            template: '<a on-click="mainClicker"><span title="{{name}}" on-click="clicker(name, email, $event)" style="color: red; cursor: pointer">{{name}}, please click here!</span></a>',

            mainClicker: function () {
                expect(clicked).toBe(1);
                clicked++;
            },

            clicker: function (name, email, event) {
                expect(name).toBe('errorrik');
                expect(email).toBe('errorrik@gmail.com');
                expect(event.target || event.srcElement).toBe(span);


                expect(clicked).toBe(0);
                clicked++;
            }
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'errorrik');
        myComponent.data.set('email', 'errorrik@gmail.com');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.getAttribute('title')).toBe('errorrik');

        function doneSpec() {

            if (clicked) {
                done();
                myComponent.dispose();
                document.body.removeChild(wrap);

                return;
            }

            setTimeout(doneSpec, 500);
        }

        triggerEvent(span, 'click');

        doneSpec();

    });

    it("bind click to noexists method, dont throw error", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{name}}" on-click="nothingclicker(name, email, $event)">{{name}}, please click here!</span></a>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'errorrik');
        myComponent.data.set('email', 'errorrik@gmail.com');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.getAttribute('title')).toBe('errorrik');

        function doneSpec() {
            done();
            myComponent.dispose();
            document.body.removeChild(wrap);
        }

        expect(function () {
            triggerEvent(span, 'click');
        }).not.toThrow();


        setTimeout(doneSpec, 500);

    });

    it("bind click fire default event when no args description, empty args description dont add default arg", function (done) {
        var clicked = 0;

        var MyComponent = san.defineComponent({
            template: '<a><span title="{{name}}" on-click="clicker()" style="color: red; cursor: pointer">please click here!</span><span title="{{name}}" on-click="clickerNoArgs" style="color: red; cursor: pointer">please click here!</span></a>',

            clicker: function (event) {
                expect(event == null).toBeTruthy();
                clicked += 1;
            },
            clickerNoArgs: function (event) {
                expect(event.target || event.srcElement).toBe(spanNoArgs);
                clicked += 1;
            }
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);
        var span = wrap.firstChild.firstChild;
        var spanNoArgs = wrap.firstChild.lastChild;
        function doneSpec() {
            if (clicked == 2) {
                done();
                myComponent.dispose();
                document.body.removeChild(wrap);
                return;
            }
            setTimeout(doneSpec, 500);
        }

        triggerEvent(span, 'click');
        triggerEvent(spanNoArgs, 'click');
        doneSpec();
    });


    it("native bind click", function (done) {
        var clicked = 0;
        var ChildComponent = san.defineComponent({
            template: '<div><h2>child</h2></div>'
        });

        var MyComponent = san.defineComponent({
            template:
            '<div>' +
                '<child-component s-ref="nativeChild" on-click="native:clicker"></child-component>' +
                '<child-component s-ref="child"></child-component>' +
            '</div>',
            components: {
                'child-component': ChildComponent
            },
            clicker: function (event) {
                var div = this.ref('nativeChild').el;
                expect(event.target || event.srcElement).toBe(div);
                clicked += 1;
            }
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var nativeChildEl = wrap.firstChild.firstChild;
        var childEl = wrap.firstChild.lastChild;

        function doneSpec() {
            if (clicked === 1) {
                myComponent.dispose();
                document.body.removeChild(wrap);
                done();

                return;
            }
            setTimeout(doneSpec, 500);
        }
        // 两次点击，期望只有第一次nativeEvent的点击生效
        triggerEvent(nativeChildEl, 'click');
        triggerEvent(childEl, 'click');
        doneSpec();
    });

    it("native bind dont be invoked in fire", function (done) {
        var inCount = 0;
        var outCount = 0;
        var Checkbox = san.defineComponent({
            template: '<input type="checkbox" on-click="clicker" />',

            clicker: function () {
                inCount++;
                this.fire('click');
            }
        });

        var MyComponent = san.defineComponent({
            template: '<div><label><x-checkbox on-click="native:onNativeClick"/>Click me and see console</label></div>',

            components: {
                'x-checkbox': Checkbox
            },

            onNativeClick: function () {
                outCount++;
            }
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var input = wrap.getElementsByTagName('input')[0];

        function doneSpec() {
            if (inCount > 0) {
                expect(inCount).toBe(1);
                expect(outCount).toBe(1);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
                return;
            }

            setTimeout(doneSpec, 500);
        }

        triggerEvent(input, 'click');
        doneSpec();
    });

    it("issue-185", function (done) {
        var clicked = 0;

        var Button = san.defineComponent({
            template: '<button>{{text}}</button>'
        });

        var MyComponent = san.defineComponent({
            template:
            '<div>' +
                '<ui-button on-click="native:clicker(i, $event)" s-ref="btn-{{i}}" text="{{btn.text}}" s-for="btn,i in buttons" />' +
            '</div>',
            components: {
                'ui-button': Button
            },
            initData: function () {
                return {
                    buttons: [
                        {text: 'a'},
                        {text: 'b'},
                        {text: 'c'}
                    ]
                };
            },
            clicker: function (i, event) {
                var btn = this.ref('btn-' + i);
                expect(event.target || event.srcElement).toBe(btn.el);
                clicked += i;
            }
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var aBtn = wrap.firstChild.children[0];
        var bBtn = wrap.firstChild.children[1];
        var cBtn = wrap.firstChild.children[2];

        function doneSpec() {
            if (clicked === (0 + 1 + 2)) {
                done();
                myComponent.dispose();
                document.body.removeChild(wrap);
                return;
            }
            setTimeout(doneSpec, 500);
        }
        triggerEvent(aBtn, 'click');
        triggerEvent(bBtn, 'click');
        triggerEvent(cBtn, 'click');
        doneSpec();
    });

    it("capture modifier", function (done) {
        if (!document.addEventListener) {
            done();
            return;
        }

        var clicked = 0;

        var MyComponent = san.defineComponent({
            template: '<a on-click="capture:mainClicker"><span title="{{name}}" on-click="capture:clicker(name, email, $event)" style="color: red; cursor: pointer">{{name}}, please click here!</span></a>',

            mainClicker: function () {
                clicked++;
            },

            clicker: function (name, email, event) {
                expect(name).toBe('errorrik');
                expect(email).toBe('errorrik@gmail.com');
                expect(event.target || event.srcElement).toBe(span);

                expect(clicked).toBe(1);
                clicked++;
            }
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'errorrik');
        myComponent.data.set('email', 'errorrik@gmail.com');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.getAttribute('title')).toBe('errorrik');

        function doneSpec() {

            if (clicked) {
                done();
                myComponent.dispose();
                document.body.removeChild(wrap);

                return;
            }

            setTimeout(doneSpec, 500);
        }

        triggerEvent(span, 'click');

        doneSpec();

    });

    it("arg string literal contains colon not means modifier", function (done) {
        if (!document.addEventListener) {
            done();
            return;
        }

        var clicked = 0;
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{name}}" on-click="clicker(\'te:st\')">{{name}}, please click here!</span></a>',

            mainClicker: function () {
                clicked++;
            },

            clicker: function (text) {
                expect(text).toBe('te:st');
                clicked++;
            }
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'errorrik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        function doneSpec() {

            if (clicked) {
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

    it("stop modifier", function (done) {
        var clicked = 0;
        var MyComponent = san.defineComponent({
            template: '<a on-click="mainClicker"><span on-click="stop:clicker">please click here!</span><b>{{name}}</b></a>',

            mainClicker: function () {
                this.data.set('name', 'erik');
            },

            clicker: function () {
                clicked = 1;
                this.data.set('name', 'Erik');
            }
        });
        var myComponent = new MyComponent({
            data: {
                name: 'errorrik'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var b = wrap.getElementsByTagName('b')[0];
        expect(b.innerHTML).toBe('errorrik');

        function doneSpec() {

            if (clicked) {
                expect(myComponent.data.get('name')).toBe('errorrik');
                myComponent.nextTick(function () {
                    expect(b.innerHTML).toBe('errorrik');

                    myComponent.dispose();
                    document.body.removeChild(wrap);
                    done();
                })

                return;
            }

            setTimeout(doneSpec, 500);
        }

        triggerEvent(wrap.getElementsByTagName('span')[0], 'click');

        doneSpec();

    });
});
