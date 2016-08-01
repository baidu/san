describe("Form-Bindx", function () {
    function defineComponent(proto) {
        function ComponentClass(option) {
            san.Component.call(this, option);
        }

        ComponentClass.prototype = proto
        san.inherits(ComponentClass, san.Component);

        return ComponentClass;
    }


    it("text value", function (done) {
        var MyComponent = defineComponent({
            template: '<div><span title="{{name}}">{{name}}</span> <input bindx-value="name"/></div>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'input something');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        var input = wrap.getElementsByTagName('input')[0];
        var inputEl = san.getEl(input.id);
        expect(span.title).toBe('input something');
        inputEl.valueSynchronizer({
            target: {value: 'otherthing'},
            srcElement: {value: 'otherthing'}
        });

        san.nextTick(function () {
            expect(span.title).toBe('otherthing');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("text value in for, set op directly", function (done) {
        var MyComponent = defineComponent({
            template: '<div>input something<input bindx-value="item" san-for="item in list"></div>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('list', [
            'errorrik',
            'varsha',
            'firede'
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var inputs = wrap.getElementsByTagName('input');
        expect(inputs[0].value).toBe('errorrik');
        expect(inputs[1].value).toBe('varsha');
        expect(inputs[2].value).toBe('firede');

        san.getEl(inputs[0].id).valueSynchronizer({
            target: {value: 'erik'},
            srcElement: {value: 'erik'}
        });
        san.getEl(inputs[1].id).valueSynchronizer({
            target: {value: 'erik'},
            srcElement: {value: 'erik'}
        });
        san.getEl(inputs[2].id).valueSynchronizer({
            target: {value: 'erik'},
            srcElement: {value: 'erik'}
        });

        san.nextTick(function () {
            var list = myComponent.data.get('list');
            expect(list[0]).toBe('erik');
            expect(list[1]).toBe('erik');
            expect(list[2]).toBe('erik');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("text value in for, set op", function (done) {
        var MyComponent = defineComponent({
            template: '<div>input something<div san-for="item in list"><span bind-title="item.name">{{item.name}}</span><input bindx-value="item.name"></div></div>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('list', [
            {name: 'errorrik'},
            {name: 'varsha'},
            {name: 'firede'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var inputs = wrap.getElementsByTagName('input');
        expect(inputs[0].value).toBe('errorrik');
        expect(inputs[1].value).toBe('varsha');
        expect(inputs[2].value).toBe('firede');

        san.getEl(inputs[0].id).valueSynchronizer({
            target: {value: 'erik'},
            srcElement: {value: 'erik'}
        });
        san.getEl(inputs[1].id).valueSynchronizer({
            target: {value: 'erik'},
            srcElement: {value: 'erik'}
        });
        san.getEl(inputs[2].id).valueSynchronizer({
            target: {value: 'erik'},
            srcElement: {value: 'erik'}
        });

        san.nextTick(function doneSpec() {
            var list = myComponent.data.get('list');
            expect(list[0].name).toBe('erik');
            expect(list[1].name).toBe('erik');
            expect(list[2].name).toBe('erik');

            var spans = wrap.getElementsByTagName('span');
            expect(spans[0].title).toBe('erik');
            expect(spans[1].title).toBe('erik');
            expect(spans[2].title).toBe('erik');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("text value in nested for, set op", function (done) {
        var MyComponent = defineComponent({
            template: '<div><a san-for="p in persons">'
                + '<b title="{{p.name}}">{{p.name}}</b>'
                + '<h5 san-for="color in p.colors"><span title="{{color.name}}">{{color.name}}</span><input bindx-value="color.name"></h5>'
                + '</a></div>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {
                name: 'erik',
                colors: [
                    {name: 'blue'},
                    {name: 'yellow'}
                ]
            },
            {
                name: 'firede',
                colors: [
                    {name: 'red'},
                    {name: 'green'}
                ]
            }
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);
        var aes = wrap.getElementsByTagName('a');
        expect(aes[0].getElementsByTagName('b')[0].title).toBe('erik');
        expect(aes[1].getElementsByTagName('b')[0].title).toBe('firede');

        var p1tels = aes[1].getElementsByTagName('span');
        expect(p1tels[0].title).toBe('red');
        expect(p1tels[1].title).toBe('green');

        var inputs = aes[1].getElementsByTagName('input');

        expect(inputs[0].value).toBe('red');
        expect(inputs[1].value).toBe('green');

        san.getEl(inputs[0].id).valueSynchronizer({
            target: {value: 'pick'},
            srcElement: {value: 'pick'}
        });
        san.getEl(inputs[1].id).valueSynchronizer({
            target: {value: 'yellow'},
            srcElement: {value: 'yellow'}
        });

        san.nextTick(function () {
            var colors = myComponent.data.get('persons[1].colors');
            expect(colors[0].name).toBe('pick');
            expect(colors[1].name).toBe('yellow');

            var aes = wrap.getElementsByTagName('a');
            var p1tels = aes[1].getElementsByTagName('span');
            expect(p1tels[0].title).toBe(colors[0].name);
            expect(p1tels[1].title).toBe(colors[1].name);

            var inputs = aes[1].getElementsByTagName('input');
            expect(inputs[0].value).toBe('pick');
            expect(inputs[1].value).toBe('yellow');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });


    it("text value in for, push op", function (done) {
        var MyComponent = defineComponent({
            template: '<div>input something<div san-for="item in list"><span bind-title="item.name"></span><input bindx-value="item.name"></div></div>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('list', [
            {name: 'errorrik'},
            {name: 'varsha'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var inputs = wrap.getElementsByTagName('input');
        expect(inputs[0].value).toBe('errorrik');
        expect(inputs[1].value).toBe('varsha');
        expect(inputs.length).toBe(2);

        myComponent.data.push('list', {name: 'otakustay'});
        san.nextTick(function () {
            var inputs = wrap.getElementsByTagName('input');
            expect(inputs[2].value).toBe('otakustay');
            expect(inputs[0].value).toBe('errorrik');
            expect(inputs[1].value).toBe('varsha');

            san.getEl(inputs[0].id).valueSynchronizer({
                target: {value: 'erik'},
                srcElement: {value: 'erik'}
            });
            san.getEl(inputs[1].id).valueSynchronizer({
                target: {value: 'erik'},
                srcElement: {value: 'erik'}
            });
            san.getEl(inputs[2].id).valueSynchronizer({
                target: {value: 'erik'},
                srcElement: {value: 'erik'}
            });
            san.nextTick(doneSpec);
        });

        function doneSpec() {
            var list = myComponent.data.get('list');
            expect(list[0].name).toBe('erik');
            expect(list[1].name).toBe('erik');
            expect(list[2].name).toBe('erik');

            var spans = wrap.getElementsByTagName('span');
            expect(spans[0].title).toBe('erik');
            expect(spans[1].title).toBe('erik');
            expect(spans[2].title).toBe('erik');

            done();
            myComponent.dispose();
            document.body.removeChild(wrap);
        }
    });


    it("text value in for, unshift op", function (done) {
        var MyComponent = defineComponent({
            template: '<div>input something<div san-for="item in list"><span bind-title="item.name">{{item.name}}</span><input bindx-value="item.name"></div></div>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('list', [
            {name: 'errorrik'},
            {name: 'varsha'},
            {name: 'firede'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var inputs = wrap.getElementsByTagName('input');
        expect(inputs[0].value).toBe('errorrik');
        expect(inputs[1].value).toBe('varsha');
        expect(inputs[2].value).toBe('firede');
        expect(inputs.length).toBe(3);

        myComponent.data.unshift('list', {name: 'otakustay'});
        san.nextTick(function () {
            var inputs = wrap.getElementsByTagName('input');
            expect(inputs[0].value).toBe('otakustay');
            expect(inputs[1].value).toBe('errorrik');
            expect(inputs[2].value).toBe('varsha');
            expect(inputs[3].value).toBe('firede');

            san.getEl(inputs[0].id).valueSynchronizer({
                target: {value: 'erik'},
                srcElement: {value: 'erik'}
            });
            san.getEl(inputs[1].id).valueSynchronizer({
                target: {value: 'erik'},
                srcElement: {value: 'erik'}
            });
            san.getEl(inputs[2].id).valueSynchronizer({
                target: {value: 'erik'},
                srcElement: {value: 'erik'}
            });
            san.getEl(inputs[3].id).valueSynchronizer({
                target: {value: 'erik'},
                srcElement: {value: 'erik'}
            });
            san.nextTick(doneSpec);
        });

        function doneSpec() {
            var list = myComponent.data.get('list');
            expect(list[0].name).toBe('erik');
            expect(list[1].name).toBe('erik');
            expect(list[2].name).toBe('erik');
            expect(list[3].name).toBe('erik');

            var spans = wrap.getElementsByTagName('span');
            expect(spans[0].title).toBe('erik');
            expect(spans[1].title).toBe('erik');
            expect(spans[2].title).toBe('erik');
            expect(spans[3].title).toBe('erik');

            done();
            myComponent.dispose();
            document.body.removeChild(wrap);
        }
    });

    it("text value in for, remove op", function (done) {
        var inputed = 0;
        var interval;

        var MyComponent = defineComponent({
            template: '<div>input something<div san-for="item in list"><span bind-title="item.name">{{item.name}}</span><input bindx-value="item.name"></div></div>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('list', [
            {name: 'errorrik'},
            {name: 'varsha'},
            {name: 'firede'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var inputs = wrap.getElementsByTagName('input');
        expect(inputs[0].value).toBe('errorrik');
        expect(inputs[1].value).toBe('varsha');
        expect(inputs[2].value).toBe('firede');
        expect(inputs.length).toBe(3);

        myComponent.data.remove('list', 2);
        san.nextTick(function () {
            var inputs = wrap.getElementsByTagName('input');
            expect(inputs[0].value).toBe('errorrik');
            expect(inputs[1].value).toBe('varsha');

            san.getEl(inputs[0].id).valueSynchronizer({
                target: {value: 'erik'},
                srcElement: {value: 'erik'}
            });
            san.getEl(inputs[1].id).valueSynchronizer({
                target: {value: 'erik'},
                srcElement: {value: 'erik'}
            });
            san.nextTick(doneSpec);
        });

        function doneSpec() {
            var list = myComponent.data.get('list');
            expect(list[0].name).toBe('erik');
            expect(list[1].name).toBe('erik');

            var spans = wrap.getElementsByTagName('span');
            expect(spans[0].title).toBe('erik');
            expect(spans[1].title).toBe('erik');

            done();
            myComponent.dispose();
            document.body.removeChild(wrap);
        }
    });
});
