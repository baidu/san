describe("Component-Bindx", function () {
    function ColorPicker(options) {
        san.Component.call(this, options);
    }
    san.inherits(ColorPicker, san.Component);

    ColorPicker.prototype.template = ''
        + '<ul class="ui-colorpicker">'
        +    '<li '
        +        'san-for="item in datasource" '
        +        'style="cursor:pointer; background: {{item}};{{item == value | yesToBe(\'border:2px solid #ccc;\')}}" '
        +        'on-click="itemClick(item)"'
        +    '>click</li>'
        + '</ul>';

    ColorPicker.prototype.initData = function () {
        return {
            datasource: [
                'red', 'blue', 'yellow', 'green'
            ]
        }
    };

    ColorPicker.prototype.itemClick = function (item) {
        this.data.set('value', item);
    };

    ColorPicker.prototype.attached = function () {
        var me = this;
        var nextValue;
        var value = this.data.get('value');
        var datasource = this.data.get('datasource');
        for (var i = 0; i < 4; i++) {
            nextValue = datasource[i];
            if (nextValue !== value) {
                break;
            }
        }

        setTimeout(function () {me.itemClick(nextValue)}, 20);
    };


    it("value", function (done) {
        var MyComponent = function (options) {
            san.Component.call(this, options);
        };

        san.inherits(MyComponent, san.Component);
        MyComponent.prototype.components = {
            'ui-color': ColorPicker
        };
        MyComponent.prototype.template = '<div><span title="{{color}}">{{color}}</span> <ui-color bindx-value="color" san-ref="colorPicker"></ui-color></div>';

        var myComponent = new MyComponent();
        myComponent.data.set('color', 'green');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.innerHTML.indexOf('green')).toBe(0);
        myComponent.ref('colorPicker').itemClick('blue');

        setTimeout(function () {
            var newValue = myComponent.ref('colorPicker').data.get('value');
            expect(newValue).not.toBe('greeb');
            expect(span.title).toBe(newValue);
            expect(myComponent.data.get('color')).toBe(newValue);

            done();
            myComponent.dispose();
            document.body.removeChild(wrap);
        }, 500);
    });


    it("value in for, set op directly", function (done) {
        function MyComponent(options) {
            san.Component.call(this, options);
        }

        san.inherits(MyComponent, san.Component);
        MyComponent.prototype.components = {
            'ui-color': ColorPicker
        };
        MyComponent.prototype.template = '<div><div san-for="item in colors">'
            + '<span title="{{item}}">{{item}}</span><ui-color bindx-value="item"></ui-color>'
            + '</div></div>';


        var myComponent = new MyComponent();
        myComponent.data.set('colors', [
            'blue',
            'yellow'
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans[0].title).toBe('blue');
        expect(spans[1].title).toBe('yellow');


        setTimeout(function () {
            var colors = myComponent.data.get('colors');
            var spans = wrap.getElementsByTagName('span');

            expect(colors[0]).not.toBe('blue');
            expect(colors[1]).not.toBe('yellow');
            expect(colors[0]).toBe(spans[0].title);
            expect(colors[1]).toBe(spans[1].title);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        }, 1500);
    });

    it("value in for, set op", function (done) {
        function MyComponent(options) {
            san.Component.call(this, options);
        }
        san.inherits(MyComponent, san.Component);

        MyComponent.prototype.components = {
            'ui-color': ColorPicker
        };

        MyComponent.prototype.template = '<div><div san-for="item in colors">'
            + '<span title="{{item.name}}">{{item.name}}</span><ui-color bindx-value="item.name"></ui-color>'
            + '</div></div>';

        var myComponent = new MyComponent();
        myComponent.data.set('colors', [
            {name: 'blue'},
            {name: 'yellow'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans[0].title).toBe('blue');
        expect(spans[1].title).toBe('yellow');


        setTimeout(function () {
            var colors = myComponent.data.get('colors');
            var spans = wrap.getElementsByTagName('span');

            expect(colors[0].name).not.toBe('blue');
            expect(colors[1].name).not.toBe('yellow');
            expect(colors[0].name).toBe(spans[0].title);
            expect(colors[1].name).toBe(spans[1].title);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        }, 500);
    });

    it("in nested for, set op", function (done) {
        function MyComponent(options) {
            san.Component.call(this, options);
        }
        san.inherits(MyComponent, san.Component);

        MyComponent.prototype.components = {
            'ui-color': ColorPicker
        };

        MyComponent.prototype.template = '<div><a san-for="p in persons">'
            + '<b title="{{p.name}}">{{p.name}}</b>'
            + '<h5 san-for="color in p.colors"><span title="{{color.name}}">{{color.name}}</span><ui-color bindx-value="color.name"></ui-color></h5>'
            + '</a></div>';


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

        setTimeout(function () {
            var colors = myComponent.data.get('persons[1].colors');
            var aes = wrap.getElementsByTagName('a');

            var p1tels = aes[1].getElementsByTagName('span');
            expect(p1tels[0].title).toBe(colors[0].name);
            expect(p1tels[1].title).toBe(colors[1].name);

            expect(colors[0].name).not.toBe('red');
            expect(colors[1].name).not.toBe('green');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        }, 500);
    });

    it("nested", function (done) {
        function PersonView(options) {
            san.Component.call(this, options);
        }
        san.inherits(PersonView, san.Component);

        PersonView.prototype.components = {
            'ui-color': ColorPicker
        };
        PersonView.prototype.template = '<div><b title="{{value.name}}">{{value.name}}</b><b title="{{value.color}}">{{value.color}}</b><ui-color bindx-value="value.color"></ui-color></div>';

        function MyComponent(options) {
            san.Component.call(this, options);
        }
        san.inherits(MyComponent, san.Component);

        MyComponent.prototype.components = {
            'ui-person': PersonView
        };

        MyComponent.prototype.template = '<div><ui-person bind-value="person"></ui-person></div>';


        var myComponent = new MyComponent();
        myComponent.data.set('person', {
            name: 'erik',
            color: 'pick'
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var bs = wrap.getElementsByTagName('b');
        expect(bs[0].title).toBe('erik');
        expect(bs[1].title).toBe('pick');

        setTimeout(function () {
            var person = myComponent.data.get('person');
            expect(person.color).not.toBe('pick');

            var bs = wrap.getElementsByTagName('b');
            expect(bs[1].title).toBe(person.color);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        }, 500);
    });
});
