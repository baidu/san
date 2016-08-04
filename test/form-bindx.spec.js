describe("Form-Bindx", function () {

    it("text value", function (done) {
        var defName = 'input something';

        var MyComponent = san.defineComponent({
            template: '<div><span title="{{name}}">{{name}}</span> <input bindx-value="name"/></div>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', defName);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        var input = wrap.getElementsByTagName('input')[0];
        var inputEl = san.getEl(input.id);
        expect(span.title).toBe(defName);

        doneSpec();
        function doneSpec() {
            var name = myComponent.data.get('name');
            if (name !== defName) {
                expect(span.title).toBe(name);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
                return;
            }

            setTimeout(doneSpec, 500);
        }
    });

    it("text value in for, set op directly", function (done) {
        var defList = [
            'errorrik',
            'varsha',
            'firede'
        ];

        var MyComponent = san.defineComponent({
            template: '<div>input something<input bindx-value="item" san-for="item in list"></div>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('list', defList);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var inputs = wrap.getElementsByTagName('input');
        expect(inputs[0].value).toBe('errorrik');
        expect(inputs[1].value).toBe('varsha');
        expect(inputs[2].value).toBe('firede');

        doneSpec();
        function doneSpec() {
            var list = myComponent.data.get('list');
            if (list[0] !== 'errorrik' || list[1] !== 'varsha' || list[2] !== 'firede') {
                expect(list[0]).toBe(inputs[0].value);
                expect(list[1]).toBe(inputs[1].value);
                expect(list[2]).toBe(inputs[2].value);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
                return;
            }

            setTimeout(doneSpec, 500);
        }
    });

    it("text value in for, set op", function (done) {
        var MyComponent = san.defineComponent({
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


        doneSpec();
        function doneSpec() {
            var list = myComponent.data.get('list');
            if (list[0].name !== 'errorrik' || list[1].name !== 'varsha' || list[2].name !== 'firede') {
                var spans = wrap.getElementsByTagName('span');
                expect(spans[0].title).toBe(list[0].name);
                expect(spans[1].title).toBe(list[1].name);
                expect(spans[2].title).toBe(list[2].name);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
                return;
            }

            setTimeout(doneSpec, 500);
        }
    });

    it("text value in nested for, set op", function (done) {
        var MyComponent = san.defineComponent({
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

        doneSpec();
        function doneSpec() {
            var colors0 = myComponent.data.get('persons[0].colors');
            var colors1 = myComponent.data.get('persons[1].colors');

            if (colors0[0].name !== 'blue'
                || colors0[1].name !== 'yellow'
                || colors1[0].name !== 'red'
                || colors1[1].name !== 'green'
            ) {

                var aes = wrap.getElementsByTagName('a');

                var p0tels = aes[0].getElementsByTagName('span');
                expect(p0tels[0].title).toBe(colors0[0].name);
                expect(p0tels[1].title).toBe(colors0[1].name);

                var p1tels = aes[1].getElementsByTagName('span');
                expect(p1tels[0].title).toBe(colors1[0].name);
                expect(p1tels[1].title).toBe(colors1[1].name);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
                return;
            }

            setTimeout(doneSpec, 500);
        }
    });


    it("text value in for, push op", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div>input something<div san-for="item in list"><span bind-title="item.name">{{item.name}}</span><input bindx-value="item.name"></div></div>',
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

            doneSpec();
        });

        function doneSpec() {
            var list = myComponent.data.get('list');
            if (list[0].name !== 'errorrik' || list[1].name !== 'varsha' || list[2].name !== 'otakustay') {
                var spans = wrap.getElementsByTagName('span');
                expect(spans[0].title).toBe(list[0].name);
                expect(spans[1].title).toBe(list[1].name);
                expect(spans[2].title).toBe(list[2].name);

                done();
                myComponent.dispose();
                document.body.removeChild(wrap);
                return;
            }

            setTimeout(doneSpec, 500);
        }
    });


    it("text value in for, unshift op", function (done) {
        var MyComponent = san.defineComponent({
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

            doneSpec();
        });

        function doneSpec() {
            var list = myComponent.data.get('list');
            if (list[0].name !== 'otakustay'
                || list[1].name !== 'errorrik'
                || list[2].name !== 'varsha'
                || list[3].name !== 'firede'
            ) {
                var spans = wrap.getElementsByTagName('span');
                expect(list[0].name).toBe(spans[0].title);
                expect(list[1].name).toBe(spans[1].title);
                expect(list[2].name).toBe(spans[2].title);
                expect(list[3].name).toBe(spans[3].title);

                done();
                myComponent.dispose();
                document.body.removeChild(wrap);
                return;
            }

            setTimeout(doneSpec, 500);
        }
    });

    it("text value in for, remove op", function (done) {
        var inputed = 0;
        var interval;

        var MyComponent = san.defineComponent({
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

        myComponent.data.removeAt('list', 2);
        san.nextTick(function () {
            var inputs = wrap.getElementsByTagName('input');
            expect(inputs[0].value).toBe('errorrik');
            expect(inputs[1].value).toBe('varsha');

            doneSpec();
        });

        function doneSpec() {
            var list = myComponent.data.get('list');
            if (list[0].name !== 'errorrik'
                || list[1].name !== 'varsha'
            ) {
                var spans = wrap.getElementsByTagName('span');
                expect(list[0].name).toBe(spans[0].title);
                expect(list[1].name).toBe(spans[1].title);

                done();
                myComponent.dispose();
                document.body.removeChild(wrap);
                return;
            }

            setTimeout(doneSpec, 500);
        }
    });

    it("checkbox", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div>'
                + '<b>{{online | join("|")}}</b>'
                + '<label><input type="checkbox" value="errorrik" bindx-checked="online">errorrik</label>'
                + '<label><input type="checkbox" value="varsha" bindx-checked="online">varsha</label>'
                + '<label><input type="checkbox" value="firede" bindx-checked="online">firede</label>'
                + '</div>',

            initData: function () {
                return {
                    online: ['varsha']
                };
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var inputs = wrap.getElementsByTagName('input');
        expect(inputs[0].checked).toBe(false);
        expect(inputs[1].checked).toBe(true);
        expect(inputs[2].checked).toBe(false);
        expect(wrap.getElementsByTagName('b')[0].innerHTML.indexOf('varsha')).toBe(0);


        function doneSpec() {
            var online = myComponent.data.get('online');

            if (online.length !== 1) {
                var bEl = wrap.getElementsByTagName('b')[0];
                expect(bEl.innerHTML.indexOf(online.join('|')) >= 0).toBe(true);

                var values = {};
                for (var i = 0; i < online.length; i++) {
                    values[online[i]] = true;
                }

                var inputs = wrap.getElementsByTagName('input');
                for (var i = 0; i < inputs.length; i++) {
                    var input = inputs[i];
                    expect(input.checked).toBe(!!values[input.value]);
                }

                done();
                myComponent.dispose();
                document.body.removeChild(wrap);
                return;
            }

            setTimeout(doneSpec, 500);
        }

        doneSpec();
    });

    it("radio", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div>'
                + '<b>{{online}}</b>'
                + '<label><input type="radio" value="errorrik" bindx-checked="online" name="onliner">errorrik</label>'
                + '<label><input type="radio" value="varsha" bindx-checked="online" name="onliner">varsha</label>'
                + '<label><input type="radio" value="firede" bindx-checked="online" name="onliner">firede</label>'
                + '</div>',

            initData: function () {
                return {
                    online: 'varsha'
                };
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var inputs = wrap.getElementsByTagName('input');
        expect(inputs[0].checked).toBe(false);
        expect(inputs[1].checked).toBe(true);
        expect(inputs[2].checked).toBe(false);
        expect(wrap.getElementsByTagName('b')[0].innerHTML.indexOf('varsha')).toBe(0);


        function doneSpec() {
            var online = myComponent.data.get('online');
            if (online !== 'varsha') {
                var bEl = wrap.getElementsByTagName('b')[0];
                expect(bEl.innerHTML.indexOf(online) >= 0).toBe(true);

                var inputs = wrap.getElementsByTagName('input');
                for (var i = 0; i < inputs.length; i++) {
                    var input = inputs[i];
                    expect(input.checked).toBe(online === input.value);
                }

                done();
                myComponent.dispose();
                document.body.removeChild(wrap);
                return;
            }

            setTimeout(doneSpec, 500);
        }

        doneSpec();
    });

    it("select", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div>'
                + '<b>{{online}}</b>'
                + '<select bindx-value="online">'
                +   '<option value="errorrik">errorrik</option>'
                +   '<option value="varsha">varsha</option>'
                +   '<option value="firede">firede</option>'
                + '</select>'
                + '</div>',

            initData: function () {
                return {
                    online: 'varsha'
                };
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var select = wrap.getElementsByTagName('select')[0];

        san.nextTick(function () {
            expect(select.selectedIndex).toBe(1);
            expect(wrap.getElementsByTagName('b')[0].innerHTML.indexOf('varsha')).toBe(0);

            doneSpec();
        });

        function doneSpec() {
            var online = myComponent.data.get('online');
            if (online !== 'varsha') {
                var select = wrap.getElementsByTagName('select')[0];
                expect(select.value).toBe(online);
                expect(wrap.getElementsByTagName('b')[0].innerHTML.indexOf(online)).toBe(0);

                done();
                myComponent.dispose();
                document.body.removeChild(wrap);
                return;
            }

            setTimeout(doneSpec, 500);
        }
    });
});
