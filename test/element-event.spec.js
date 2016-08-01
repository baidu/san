describe("Element-Event", function () {
    function defineComponent(proto) {
        function ComponentClass(option) {
            san.Component.call(this, option);
        }

        ComponentClass.prototype = proto
        san.inherits(ComponentClass, san.Component);

        return ComponentClass;
    }


    it("bind click", function (done) {
        var clicked = 0;

        var MyComponent = defineComponent({
            template: '<a><span title="{{name}}" on-click="clicker(name, email, $event)" style="color: red; cursor: pointer">{{name}}, please click here!</span></a>',

            clicker: function (name, email, event) {
                expect(name).toBe('errorrik');
                expect(email).toBe('errorrik@gmail.com');
                expect(event.target || event.srcElement).toBe(span);

                clicked = 1;
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

        doneSpec();
    });

    it("bind text input", function (done) {
        var inputed = 0;

        var MyComponent = defineComponent({
            template: '<a><span title="{{name}}">{{name}}</span> <input bind-value="name" on-input="inputer($event)"/></a>',

            inputer: function (event) {
                this.data.set('name', event.value);
            }
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'input something');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        var input = wrap.getElementsByTagName('input')[0];
        expect(span.innerHTML.indexOf('input something')).toBe(0);

        function doneSpec() {
            if (myComponent.data.get('name') !== 'input something') {

                expect(span.innerHTML.indexOf(input.value)).toBe(0);

                done();
                myComponent.dispose();
                document.body.removeChild(wrap);

                return;
            }

            setTimeout(doneSpec, 500);
        }

        doneSpec();
    });
});
