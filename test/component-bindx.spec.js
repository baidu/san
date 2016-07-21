describe("Component-Bindx", function () {
    var ColorPicker = san.Component({
        template: ''
            + '<ul class="ui-colorpicker">'
            +    '<li '
            +        'san-for="item in datasource" '
            +        'style="cursor:pointer; background: {{item}};{{item == value | yesToBe(\'border:2px solid #ccc;\')}}" '
            +        'on-click="itemClick(item)"'
            +    '>click</li>'
            + '</ul>',

        initData: {
            datasource: [
                'red', 'blue', 'yellow', 'green'
            ]
        },

        itemClick: function (item) {
            this.data.set('value', item);
        },

        attached: function () {
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
        }
    });

    it("value", function (done) {
        var MyComponent = san.Component({
            components: {
                'ui-color': ColorPicker
            },
            template: '<span title="{{color}}">{{color}}</span> <ui-color bindx-value="color" san-ref="colorPicker"></ui-color>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('color', 'green');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.firstChild.textContent || span.firstChild.innerText).toBe('green');
        myComponent.refs.colorPicker.itemClick('blue');

        setTimeout(function () {
            var newValue = myComponent.refs.colorPicker.data.get('value');
            expect(newValue).not.toBe('greeb');
            expect(span.title).toBe(newValue);
            expect(myComponent.data.get('color')).toBe(newValue);

            done();
            myComponent.dispose();
            document.body.removeChild(wrap);
        }, 500);
    });


    it("value in for, set op directly", function (done) {
        var MyComponent = san.Component({
            components: {
                'ui-color': ColorPicker
            },
            template: '<div san-for="item in colors">'
                + '<span title="{{item}}">{{item}}</span><ui-color bindx-value="item"></ui-color>'
                + '</div>',
        });
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
        var MyComponent = san.Component({
            components: {
                'ui-color': ColorPicker
            },
            template: '<div san-for="item in colors">'
                + '<span title="{{item.name}}">{{item.name}}</span><ui-color bindx-value="item.name"></ui-color>'
                + '</div>',
        });
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
});
