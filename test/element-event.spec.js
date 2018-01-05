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

        triggerEvent('#' + span.id, 'click');

        doneSpec();

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

        triggerEvent('#' + span.id, 'click');
        triggerEvent('#' + spanNoArgs.id, 'click');
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
                done();
                myComponent.dispose();
                document.body.removeChild(wrap);
                return;
            }
            setTimeout(doneSpec, 500);
        }
        // 两次点击，期望只有第一次nativeEvent的点击生效
        triggerEvent('#' + nativeChildEl.id, 'click');
        triggerEvent('#' + childEl.id, 'click');
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
        triggerEvent('#' + aBtn.id, 'click');
        triggerEvent('#' + bBtn.id, 'click');
        triggerEvent('#' + cBtn.id, 'click');
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

        triggerEvent('#' + span.id, 'click');

        doneSpec();

    });
});
