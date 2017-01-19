describe("Element", function () {

    it("bind prop, data change before attach", function () {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{name}}">{{name}}</span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'errorrik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.getAttribute('title')).toBe('errorrik');
        expect(span.innerHTML.indexOf('errorrik')).toBe(0);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });


    it("bind prop, data change after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{name}}">{{name}}</span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'errorrik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;

        expect(span.getAttribute('title')).toBe('errorrik');
        expect(span.innerHTML.indexOf('errorrik')).toBe(0);

        myComponent.data.set('name', 'varsha');

        expect(span.title).toBe('errorrik');
        expect(span.innerHTML.indexOf('errorrik')).toBe(0);

        san.nextTick(function () {
            expect(span.title).toBe('varsha');
            expect(span.innerHTML.indexOf('varsha')).toBe(0)


            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });


    it("bind class", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span class="msg {{extra}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('extra', 'msg-notice');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.className).toBe('msg msg-notice');

        myComponent.data.set('extra', 'msg-error');


        san.nextTick(function () {
            expect(span.className).toBe('msg msg-error');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind class, auto expand", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span class="msg {{extra}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('extra', ['msg-notice', 'msg-error']);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.className).toBe('msg msg-notice msg-error');

        myComponent.data.set('extra', 'msg-error');


        san.nextTick(function () {
            expect(span.className).toBe('msg msg-error');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind style", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span style="position: absolute; display: {{display}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('display', 'block');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.style.position).toBe('absolute');
        expect(span.style.display).toBe('block');

        myComponent.data.set('display', 'none');


        san.nextTick(function () {
            expect(span.style.position).toBe('absolute');
            expect(span.style.display).toBe('none');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind disabled", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><input type="text" disabled="{{ed}}"><textarea disabled="{{ed}}"></textarea><button disabled="{{ed}}">btn</button></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var input = wrap.getElementsByTagName('input')[0];
        var textarea = wrap.getElementsByTagName('textarea')[0];
        var btn = wrap.getElementsByTagName('button')[0];
        expect(input.disabled).toBeFalsy();
        expect(textarea.disabled).toBeFalsy();
        expect(btn.disabled).toBeFalsy();

        myComponent.data.set('ed', true);


        san.nextTick(function () {
            expect(input.disabled).toBeTruthy();
            expect(textarea.disabled).toBeTruthy();
            expect(btn.disabled).toBeTruthy();


            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind readonly", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><input type="text" readonly="{{ed}}"><textarea readonly="{{ed}}"></textarea></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var input = wrap.getElementsByTagName('input')[0];
        var textarea = wrap.getElementsByTagName('textarea')[0];
        expect(input.readOnly).toBeFalsy();
        expect(textarea.readOnly).toBeFalsy();

        myComponent.data.set('ed', true);


        san.nextTick(function () {
            expect(input.readOnly).toBeTruthy();
            expect(textarea.readOnly).toBeTruthy();


            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("no value attribute", function () {
        var MyComponent = san.defineComponent({
            template: '<div><input type="text" disabled></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var input = wrap.getElementsByTagName('input')[0];
        expect(input.disabled).toBeTruthy();
        expect(input.getAttribute('disabled')).toBe('disabled');


        myComponent.dispose();
        document.body.removeChild(wrap);
    });
});
