describe("Element-Event", function () {
    it("bind click", function (done) {
        var clicked = 0;

        var MyComponent = san.Component({
            template: '<span title="{{name}}" on-click="clicker(name, email, $event)" style="color: red; cursor: pointer">{{name}}, please click here!</span>',

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

        var MyComponent = san.Component({
            template: '<span title="{{name}}">{{name}}</span> <input bind-value="name" on-input="inputer($event)"/>',

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
        expect(span.firstChild.textContent || span.firstChild.innerText).toBe('input something');

        function doneSpec() {
            if (myComponent.data.get('name') !== 'input something') {

                expect(span.firstChild.textContent || span.firstChild.innerText).toBe(input.value);

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
