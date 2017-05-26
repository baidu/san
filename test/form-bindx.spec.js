describe("Form TwoWay Binding", function () {

    it("text value", function (done) {
        var defName = 'text value';

        var MyComponent = san.defineComponent({
            template: '<div><span title="{{name}}">{{name}}</span> <input value="{=name=}"/></div>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', defName);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        var input = wrap.getElementsByTagName('input')[0];
        expect(span.title).toBe(defName);


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

        triggerEvent('#' + input.id, 'input', 'test' + (+new Date()));
        setTimeout(doneSpec, 500);

    });

    it("textarea value", function (done) {
        var defName = 'textarea val</textarea>ue';

        var MyComponent = san.defineComponent({
            template: '<div><span title="{{name}}">{{name}}</span> <textarea value="{=name=}"></textarea></div>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', defName);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe(defName);
        var textarea = wrap.getElementsByTagName('textarea')[0];
        expect(textarea.value).toBe(defName);

        doneSpec();
        triggerEvent('#' + textarea.id, 'input', 'added2')


        function doneSpec() {
            var name = myComponent.data.get('name');
            if (name !== defName) {
                expect(span.title).toBe(name);
                expect(textarea.value).toBe(name);

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
            template: '<div>input something<input value="{=item=}" san-for="item in list"></div>'
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

        triggerEvent('#' + inputs[1].id , 'input', 'added3');

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
            template: '<div>input something<div san-for="item in list"><span title="{{item.name}}">{{item.name}}</span><input value="{=item.name=}"></div></div>'
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

        triggerEvent('#' + inputs[1].id , 'input', 'test');
        setTimeout(doneSpec, 500);

    });

    it("text value in nested for, set op", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><a san-for="p in persons">'
                + '<b title="{{p.name}}">{{p.name}}</b>'
                + '<h5 san-for="color in p.colors"><span title="{{color.name}}">{{color.name}}</span><input value="{=color.name=}"></h5>'
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

        triggerEvent('#' + inputs[1].id, 'input', 'test')
        setTimeout(doneSpec, 500);

    });


    it("text value in for, push op", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div>input something<div san-for="item in list"><span title="{{item.name}}">{{item.name}}</span><input value="{=item.name=}"></div></div>'
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

            triggerEvent('#'+ inputs[1].id, 'input', 'test');
            setTimeout(doneSpec, 500);

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
            template: '<div>input something<div san-for="item in list"><span title="{{item.name}}">{{item.name}}</span><input value="{=item.name=}"></div></div>'
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

            triggerEvent('#' + inputs[1].id, 'input', 'test');

            setTimeout(doneSpec, 500);

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
            template: '<div>input something<div san-for="item in list"><span title="{{item.name}}">{{item.name}}</span><input value="{=item.name=}"></div></div>'
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

            triggerEvent('#' + inputs[1].id, 'input', 'test');
            setTimeout(doneSpec, 500);
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
            filters: {
                join: function (source, sep) {
                    if (source instanceof Array) {
                        return source.join(sep);
                    }

                    return source;
                }
            },

            template: '<div>'
                + '<b>{{online | join("|")}}</b>'
                + '<label><input type="checkbox" value="errorrik" checked="{=online=}">errorrik</label>'
                + '<label><input type="checkbox" value="varsha" checked="{=online=}">varsha</label>'
                + '<label><input type="checkbox" value="firede" checked="{=online=}">firede</label>'
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

        triggerEvent('#' + inputs[0].id, 'click');

        setTimeout(doneSpec, 500);

    });

    it("radio", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div>'
                + '<b>{{online}}</b>'
                + '<label><input type="radio" value="errorrik" checked="{=online=}" name="onliner">errorrik</label>'
                + '<label><input type="radio" value="varsha" checked="{=online=}" name="onliner">varsha</label>'
                + '<label><input type="radio" value="firede" checked="{=online=}" name="onliner">firede</label>'
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

        triggerEvent('#' + inputs[0].id, 'click');

        setTimeout(doneSpec, 500);

    });

    it("select", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div>'
                + '<b title="{{online}}">{{online}}</b>'
                + '<select value="{=online=}">'
                +   '<option value="errorrik">errorrik</option>'
                +   '<option value="firede">firede</option>'
                + '</select>'
                + '</div>',

            initData: function () {
                return {
                    online: 'firede'
                };
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var select = wrap.getElementsByTagName('select')[0];
        expect(wrap.getElementsByTagName('b')[0].title).toBe('firede');


        triggerEvent('#' + select.id, 'select', 0);
        setTimeout(doneSpec, 500);


        function doneSpec() {
            var online = myComponent.data.get('online');
            if (online !== 'firede') {
                var select = wrap.getElementsByTagName('select')[0];
                expect(select.value).toBe(online);
                expect(wrap.getElementsByTagName('b')[0].title).toBe(online);

                done();
                myComponent.dispose();
                document.body.removeChild(wrap);
                return;
            }

            setTimeout(doneSpec, 500);
        }
    });

    it("select, option not has value prop", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div>'
                + '<b title="{{online}}">{{online}}</b>'
                + '<select value="{=online=}">'
                +   '<option>errorrik</option>'
                +   '<option>firede</option>'
                + '</select>'
                + '</div>',

            initData: function () {
                return {
                    online: 'firede'
                };
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var select = wrap.getElementsByTagName('select')[0];

        expect(select.selectedIndex).toBe(1);
        expect(wrap.getElementsByTagName('b')[0].title).toBe('firede');

        triggerEvent('#' + select.id, 'select', 0);
        setTimeout(doneSpec, 500);

        function doneSpec() {
            var online = myComponent.data.get('online');
            if (online !== 'firede') {
                var select = wrap.getElementsByTagName('select')[0];
                expect(select.value).toBe(online);
                expect(wrap.getElementsByTagName('b')[0].title).toBe(online);

                done();
                myComponent.dispose();
                document.body.removeChild(wrap);
                return;
            }

            setTimeout(doneSpec, 500);
        }
    });

    it("select render and dispose in one loop", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div>'
                + '<b title="{{online}}">{{online}}</b>'
                + '<div san-for="item in list">'
                + '<select value="{=online=}">'
                +   '<option value="errorrik">errorrik</option>'
                +   '<option value="firede">firede</option>'
                + '</select>'
                + '</div>'
                + '</div>',

            initData: function () {
                return {
                    online: 'firede'
                };
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.data.set('list', [1]);
        myComponent.data.set('list', [2]);

        san.nextTick(function () {
            var select = wrap.getElementsByTagName('select')[0];

            expect(select.selectedIndex).toBe(1);
            expect(select.value).toBe('firede');
            expect(wrap.getElementsByTagName('b')[0].title).toBe('firede');

            done();
            myComponent.dispose();
            document.body.removeChild(wrap);
        });
    });

    it("select, option in loop", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div>'
                + '<b title="{{online}}">{{online}}</b>'
                + '<select value="{=online=}">'
                +   '<option s-for="p in persons" value="{{p}}">{{p}}</option>'
                + '</select>'
                + '</div>',

            initData: function () {
                return {
                    online: 'firede',
                    persons: ['errorrik', 'firede']
                };
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);
        var select = wrap.getElementsByTagName('select')[0];

        expect(select.selectedIndex).toBe(1);
        expect(select.value).toBe('firede');
        myComponent.data.set('online', 'errorrik');

        san.nextTick(function () {
            var select = wrap.getElementsByTagName('select')[0];

            expect(select.selectedIndex).toBe(0);
            expect(select.value).toBe('errorrik');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("dynamic expr", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div>'
                + '<select value="{=item=}">'
                + '    <option value="0">1</option>'
                + '    <option value="1">2</option>'
                + '    <option value="2">3</option>'
                + '</select>'
                + '<input type="text" value="{=list[item]=}">'
                + '<p s-for="i in list" title="{{i}}">{{i}}</p>'
                + '</div>',

            initData: function () {
                return {
                    list: ['one', 'two', 'three'],
                    item: '2'
                }
            }
        })

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var select = wrap.getElementsByTagName('select')[0];
        var input = wrap.getElementsByTagName('input')[0];
        var ps = wrap.getElementsByTagName('p');

        expect(input.value).toBe('three');
        expect(select.selectedIndex).toBe(2);
        expect(ps[0].title).toBe('one');
        expect(ps[1].title).toBe('two');
        expect(ps[2].title).toBe('three');
        myComponent.data.set('item', '1');

        san.nextTick(function () {
            expect(input.value).toBe('two');
            expect(select.selectedIndex).toBe(1);

            triggerEvent('#' + input.id, 'input', '22222');

            setTimeout(function () {
                expect(input.value).toBe('two22222');
                expect(ps[0].title).toBe('one');
                expect(ps[1].title).toBe(input.value);
                expect(ps[2].title).toBe('three');

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            }, 400);
        });
    });
});
