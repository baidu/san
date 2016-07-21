describe("Component", function () {
    var ColorPicker = san.Component({
        template: '<b bind-title="value">{{value}}</b>'
            + '<ul class="ui-colorpicker">'
            +    '<li '
            +        'san-for="item in datasource" '
            +        'style="background: {{item}}" '
            +        'class="{{item == value | yesToBe(\'selected\')}}" '
            +        'on-click="itemClick(item)"'
            +    '></li>'
            + '</ul>',

        initData: {
            datasource: [
                'red', 'blue', 'yellow', 'green'
            ]
        },

        itemClick: function (item) {
            this.data.set('value', item);
        }
    });

    // it("life cycle", function () {
    //     var isInited = false;
    //     var isCreated = false;
    //     var isAttached = false;
    //     var isDetached = false;
    //     var isDisposed = false;

    //     var MyComponent = san.Component({
    //         components: {
    //             'ui-color': ColorPicker
    //         },
    //         template: '<span title="{{color}}">{{color}}</span>',

    //         inited: function () {
    //             isInited = true;
    //         },

    //         created: function () {
    //             isCreated = true;
    //         },

    //         attached: function () {
    //             isAttached = true;
    //         },

    //         detached: function () {
    //             isDetached = true;
    //         },

    //         disposed: function () {
    //             isDisposed = true;
    //         }
    //     });
    //     var myComponent = new MyComponent();
    //     expect(myComponent.lifeCycle.is('inited')).toBe(true);
    //     expect(myComponent.lifeCycle.is('created')).toBe(false);
    //     expect(myComponent.lifeCycle.is('attached')).toBe(false);
    //     expect(isInited).toBe(true);
    //     expect(isCreated).toBe(false);
    //     expect(isAttached).toBe(false);

    //     myComponent.data.set('color', 'green');

    //     var wrap = document.createElement('div');
    //     document.body.appendChild(wrap);
    //     myComponent.attach(wrap);
    //     expect(myComponent.lifeCycle.is('inited')).toBe(true);
    //     expect(myComponent.lifeCycle.is('created')).toBe(true);
    //     expect(myComponent.lifeCycle.is('attached')).toBe(true);
    //     expect(isInited).toBe(true);
    //     expect(isCreated).toBe(true);
    //     expect(isAttached).toBe(true);

    //     myComponent.detach();
    //     expect(myComponent.lifeCycle.is('created')).toBe(true);
    //     expect(myComponent.lifeCycle.is('attached')).toBe(false);
    //     expect(myComponent.lifeCycle.is('detached')).toBe(true);
    //     expect(isDetached).toBe(true);

    //     myComponent.attach(wrap);
    //     expect(myComponent.lifeCycle.is('created')).toBe(true);
    //     expect(myComponent.lifeCycle.is('attached')).toBe(true);
    //     expect(myComponent.lifeCycle.is('detached')).toBe(false);


    //     myComponent.dispose();
    //     expect(myComponent.lifeCycle.is('inited')).toBe(false);
    //     expect(myComponent.lifeCycle.is('created')).toBe(false);
    //     expect(myComponent.lifeCycle.is('attached')).toBe(false);
    //     expect(myComponent.lifeCycle.is('detached')).toBe(false);
    //     expect(myComponent.lifeCycle.is('disposed')).toBe(true);
    //     expect(isDisposed).toBe(true);

    //     document.body.removeChild(wrap);
    // });

    // it("ref", function () {
    //     var MyComponent = san.Component({
    //         components: {
    //             'ui-color': ColorPicker
    //         },
    //         template: '<span title="{{color}}">{{color}}</span> <ui-color bindx-value="color" san-ref="colorPicker"></ui-color>'
    //     });
    //     var myComponent = new MyComponent();
    //     myComponent.data.set('color', 'green');

    //     var wrap = document.createElement('div');
    //     document.body.appendChild(wrap);
    //     myComponent.attach(wrap);

    //     var span = wrap.firstChild.firstChild;
    //     expect(myComponent.refs.colorPicker instanceof ColorPicker).toBe(true);
    //     expect(wrap.getElementsByTagName('b')[0].title).toBe('green');


    //     myComponent.dispose();
    //     document.body.removeChild(wrap);
    // });

    // it("dynamic ref", function () {
    //     var MyComponent = san.Component({
    //         components: {
    //             'ui-color': ColorPicker
    //         },
    //         template: '<span title="{{color}}">{{color}}</span> <ui-color bindx-value="color" san-ref="{{name}}"></ui-color>'
    //     });
    //     var myComponent = new MyComponent();
    //     myComponent.data.set('color', 'green');
    //     myComponent.data.set('name', 'c');

    //     var wrap = document.createElement('div');
    //     document.body.appendChild(wrap);
    //     myComponent.attach(wrap);

    //     var span = wrap.firstChild.firstChild;
    //     expect(myComponent.refs.c instanceof ColorPicker).toBe(true);
    //     expect(wrap.getElementsByTagName('b')[0].title).toBe('green');


    //     myComponent.dispose();
    //     document.body.removeChild(wrap);
    // });



    // it("update prop", function (done) {
    //     var Label = san.Component({
    //         template: '<span title="{{text}}">{{text}}</span>'
    //     });

    //     var MyComponent = san.Component({
    //         components: {
    //             'ui-label': Label
    //         },
    //         template: '<ui-label bind-text="name"></ui-label>'
    //     });


    //     var myComponent = new MyComponent();
    //     myComponent.data.set('name', 'erik');

    //     var wrap = document.createElement('div');
    //     document.body.appendChild(wrap);
    //     myComponent.attach(wrap);

    //     var span = wrap.getElementsByTagName('span')[0];
    //     expect(span.title).toBe('erik');

    //     myComponent.data.set('name', 'ci');

    //     san.nextTick(function () {
    //         expect(span.title).toBe('ci');
    //         done();
    //         myComponent.dispose();
    //         document.body.removeChild(wrap);
    //     });
    // });

    var TelList = san.Component({
        template: '<ul><li san-for="item in list" title="{{item}}">{{item}}</li></ul>'
    });

    var PersonList = san.Component({
        components: {
            'ui-tel': TelList
        },
        template: '<dl san-for="item in list"><dt title="{{item.name}}">{{item.name}}</dt><dd><ui-tel bind-list="item.tels"></ui-tel></dd></dl>'
    });

    it("nested", function (done) {
        var MyComponent = san.Component({
            components: {
                'ui-person': PersonList
            },
            template: '<ui-person bind-list="persons"></ui-person>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {
                name: 'erik',
                tels: [
                    '12345678',
                    '123456789',
                ]
            },
            {
                name: 'firede',
                tels: [
                    '2345678',
                    '23456789',
                ]
            }
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);
        var dts = wrap.getElementsByTagName('dt');
        expect(dts[0].title).toBe('erik');
        expect(dts[1].title).toBe('firede');

        var dds = wrap.getElementsByTagName('dd');
        var p1lis = dds[1].getElementsByTagName('li');
        expect(p1lis[0].title).toBe('2345678');
        expect(p1lis[1].title).toBe('23456789');

        myComponent.data.set('persons[1].name', 'leeight');
        myComponent.data.set('persons[1].tels', ['12121212', '16161616', '18181818']);


        san.nextTick(function () {
            var dts = wrap.getElementsByTagName('dt');
            expect(dts[0].title).toBe('erik');
            expect(dts[1].title).toBe('leeight');

            var dds = wrap.getElementsByTagName('dd');
            var p1lis = dds[1].getElementsByTagName('li');
            expect(p1lis[0].title).toBe('12121212');
            expect(p1lis[1].title).toBe('16161616');
            // expect(p1lis[2].title).toBe('18181818');

        //     myComponent.dispose();
        // document.body.removeChild(wrap);
            done();
        });
    });



});
