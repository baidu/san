describe("Component", function () {

    var ColorPicker = san.defineComponent({
        template: '<div><b title="{{value}}">{{value}}</b>'
            + '<ul class="ui-colorpicker">'
            +    '<li '
            +        'san-for="item in datasource" '
            +        'style="background: {{item}}" '
            +        'class="{{item == value | yesToBe(\'selected\')}}" '
            +        'on-click="itemClick(item)"'
            +    '></li>'
            + '</ul></div>',

        initData: {
            datasource: [
                'red', 'blue', 'yellow', 'green'
            ]
        },

        itemClick: function (item) {
            this.data.set('value', item);
        }
    });

    var Label = san.defineComponent({
        template: '<span title="{{text}}">{{text}}</span>'
    });

    it("life cycle", function () {
        var isInited = false;
        var isCreated = false;
        var isAttached = false;
        var isDetached = false;
        var isDisposed = false;

        var MyComponent = san.defineComponent({
            components: {
                'ui-color': ColorPicker
            },
            template: '<span title="{{color}}">{{color}}</span>',

            inited: function () {
                isInited = true;
            },

            created: function () {
                isCreated = true;
            },

            attached: function () {
                isAttached = true;
            },

            detached: function () {
                isDetached = true;
            },

            disposed: function () {
                isDisposed = true;
            }
        });
        var myComponent = new MyComponent();
        expect(myComponent.lifeCycle.is('inited')).toBe(true);
        expect(myComponent.lifeCycle.is('created')).toBe(false);
        expect(myComponent.lifeCycle.is('attached')).toBe(false);
        expect(isInited).toBe(true);
        expect(isCreated).toBe(false);
        expect(isAttached).toBe(false);

        myComponent.data.set('color', 'green');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);
        expect(myComponent.lifeCycle.is('inited')).toBe(true);
        expect(myComponent.lifeCycle.is('created')).toBe(true);
        expect(myComponent.lifeCycle.is('attached')).toBe(true);
        expect(isInited).toBe(true);
        expect(isCreated).toBe(true);
        expect(isAttached).toBe(true);

        myComponent.detach();
        expect(myComponent.lifeCycle.is('created')).toBe(true);
        expect(myComponent.lifeCycle.is('attached')).toBe(false);
        expect(myComponent.lifeCycle.is('detached')).toBe(true);
        expect(isDetached).toBe(true);

        myComponent.attach(wrap);
        expect(myComponent.lifeCycle.is('created')).toBe(true);
        expect(myComponent.lifeCycle.is('attached')).toBe(true);
        expect(myComponent.lifeCycle.is('detached')).toBe(false);


        myComponent.dispose();
        expect(myComponent.lifeCycle.is('inited')).toBe(false);
        expect(myComponent.lifeCycle.is('created')).toBe(false);
        expect(myComponent.lifeCycle.is('attached')).toBe(false);
        expect(myComponent.lifeCycle.is('detached')).toBe(false);
        expect(myComponent.lifeCycle.is('disposed')).toBe(true);
        expect(isDisposed).toBe(true);

        document.body.removeChild(wrap);
    });

    it("life cycle updated", function (done) {
        var times = 0;

        var MyComponent = san.defineComponent({
            template: '<a><span title="{{email}}">{{name}}</span></a>',

            updated: function () {
                times++;
            }
        });
        var myComponent = new MyComponent();
        myComponent.data.set('email', 'errorrik@gmail.com');
        myComponent.data.set('name', 'errorrik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(times).toBe(0);

        myComponent.data.set('email', 'erik168@163.com');
        myComponent.data.set('name', 'erik');
        expect(times).toBe(0);

        san.nextTick(function () {
            expect(times).toBe(1);

            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML.indexOf('erik')).toBe(0);
            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })

    });

    it("initData", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{email}}">{{name}}</span></a>',

            initData: function () {
                return {
                    email: 'errorrik@gmail.com',
                    name: 'errorrik'
                }
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        myComponent.data.set('email', 'erik168@163.com');
        myComponent.data.set('name', 'erik');

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML.indexOf('errorrik')).toBe(0);
        expect(span.title.indexOf('errorrik@gmail.com')).toBe(0);

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML.indexOf('erik')).toBe(0);
            expect(span.title.indexOf('erik168@163.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })

    });

    it("life cycle updated, nested component", function (done) {
        var times = 0;
        var subTimes = 0;

        var Label = san.defineComponent({
            template: '<a><span title="{{title}}">{{text}}</span></a>',

            updated: function () {
                subTimes++;
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div><h5><ui-label title="{{name}}" text="{{jokeName}}"></ui-label></h5>'
                + '<p><a>{{school}}</a><u>{{company}}</u></p></div>',

            updated: function () {
                times++;
            }
        });

        var myComponent = new MyComponent();
        myComponent.data.set('jokeName', 'airike');
        myComponent.data.set('name', 'errorrik');
        myComponent.data.set('school', 'none');
        myComponent.data.set('company', 'bidu');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(times).toBe(0);
        expect(subTimes).toBe(0);

        myComponent.data.set('name', 'erik');
        myComponent.data.set('jokeName', '2b');
        expect(times).toBe(0);
        expect(subTimes).toBe(0);

        san.nextTick(function () {

            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML.indexOf('2b')).toBe(0);
            expect(times).toBe(1);
            expect(subTimes).toBe(1);


            myComponent.data.set('school', 'hainan mid');
            myComponent.data.set('company', 'baidu');

            san.nextTick(function () {
                expect(times).toBe(2);
                expect(subTimes).toBe(1);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });

    });

    it("template tag in template", function (done) {
        var Label = san.defineComponent({
            template: '<template class="ui-label" title="{{text}}">{{text}}</template>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },
            template: '<div><ui-label text="{{name}}"></ui-label></div>'
        });


        var myComponent = new MyComponent();
        myComponent.data.set('name', 'erik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var labelEl = wrap.firstChild.firstChild;
        expect(labelEl.className).toBe('ui-label');
        expect(labelEl.title).toBe('erik');

        myComponent.data.set('name', 'ci');

        san.nextTick(function () {
            expect(labelEl.className).toBe('ui-label');
            expect(labelEl.title).toBe('ci');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("custom event listen and fire", function () {
        var receive;

        var Label = san.defineComponent({
            template: '<template class="ui-label" title="{{text}}">{{text}}</template>',

            attached: function () {
                this.fire('haha', this.data.get('text') + 'haha');
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div><ui-label text="{{name}}" on-haha="labelHaha($event)"></ui-label></div>',

            labelHaha: function (e) {
                receive = e;
            }
        });


        var myComponent = new MyComponent();
        myComponent.data.set('name', 'erik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var labelEl = wrap.firstChild.firstChild;
        expect(labelEl.className).toBe('ui-label');
        expect(labelEl.title).toBe('erik');
        expect(receive).toBe('erikhaha');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("ref", function () {
        var MyComponent = san.defineComponent({
            components: {
                'ui-color': ColorPicker
            },
            template: '<div><span title="{{color}}">{{color}}</span> <ui-color value="{= color =}" san-ref="colorPicker"></ui-color></div>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('color', 'green');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(myComponent.ref('colorPicker') instanceof ColorPicker).toBe(true);
        expect(wrap.getElementsByTagName('b')[0].title).toBe('green');


        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("dynamic ref", function () {
        var MyComponent = san.defineComponent({
            components: {
                'ui-color': ColorPicker
            },
            template: '<div><span title="{{color}}">{{color}}</span> <ui-color value="{=color=}" san-ref="{{name}}"></ui-color></div>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('color', 'green');
        myComponent.data.set('name', 'c');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(myComponent.ref('c') instanceof ColorPicker).toBe(true);
        expect(wrap.getElementsByTagName('b')[0].title).toBe('green');


        myComponent.dispose();
        document.body.removeChild(wrap);
    });



    it("update prop", function (done) {
        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },
            template: '<a><ui-label text="{{name}}"></ui-label></a>'
        });


        var myComponent = new MyComponent();
        myComponent.data.set('name', 'erik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('erik');

        myComponent.data.set('name', 'ci');

        san.nextTick(function () {
            expect(span.title).toBe('ci');
            done();
            myComponent.dispose();
            document.body.removeChild(wrap);
        });
    });

    it("update prop from self attached", function (done) {
        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },
            template: '<a><ui-label text="{{name}}"></ui-label></a>',

            attached: function () {
                this.data.set('name', 'ci');
            }
        });


        var myComponent = new MyComponent();
        myComponent.data.set('name', 'erik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('erik');

        san.nextTick(function () {
            expect(span.title).toBe('ci');
            done();
            myComponent.dispose();
            document.body.removeChild(wrap);
        });
    });

    var TelList = san.defineComponent({
        template: '<ul><li san-for="item in list" title="{{item}}">{{item}}</li></ul>'
    });

    var PersonList = san.defineComponent({
        components: {
            'ui-tel': TelList
        },
        template: '<div><dl san-for="item in list"><dt title="{{item.name}}">{{item.name}}</dt><dd><ui-tel list="{{item.tels}}"></ui-tel></dd></dl></div>'
    });

    it("nested", function (done) {
        var MyComponent = san.defineComponent({
            components: {
                'ui-person': PersonList
            },
            template: '<div><ui-person list="{{persons}}"></ui-person></div>'
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
            expect(p1lis[2].title).toBe('18181818');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("in for", function (done) {
        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },
            template: '<ul><li san-for="p in persons"><b title="{{p.name}}">{{p.name}}</b><h5 san-for="t in p.tels"><ui-label text="{{t}}"></ui-label></h5></li></ul>'
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
        var lis = wrap.getElementsByTagName('li');
        expect(lis[0].getElementsByTagName('b')[0].title).toBe('erik');
        expect(lis[1].getElementsByTagName('b')[0].title).toBe('firede');

        var p1tels = lis[1].getElementsByTagName('span');
        expect(p1tels[0].title).toBe('2345678');
        expect(p1tels[1].title).toBe('23456789');

        myComponent.data.set('persons[1].name', 'leeight');
        myComponent.data.set('persons[1].tels', ['12121212', '16161616', '18181818']);


        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis[0].getElementsByTagName('b')[0].title).toBe('erik');
            expect(lis[1].getElementsByTagName('b')[0].title).toBe('leeight');

            var p1tels = lis[1].getElementsByTagName('span');
            expect(p1tels[0].title).toBe('12121212');
            expect(p1tels[1].title).toBe('16161616');
            expect(p1tels[2].title).toBe('18181818');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("inner el event and outer custom event", function (done) {
        var innerClicked;
        var outerReceive;

        var Label = san.defineComponent({
            template: '<template class="ui-label" on-click="clicker" style="cursor:pointer;text-decoration:underline">here</template>',

            clicker: function () {
                innerClicked = true;
                this.fire('haha', 1);
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div>Click <ui-label on-haha="labelHaha($event)"></ui-label></div>',

            labelHaha: function (e) {
                outerReceive = e;
            }
        });


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        function detect() {
            if (innerClicked || outerReceive) {
                expect(innerClicked).toBe(true);
                expect(outerReceive).toBe(1);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
                return;
            }

            setTimeout(detect, 500);
        }

        // wd bridge
        WDBridge.send('action', 'click:#' + myComponent.childs[1].id);

        detect();
    });

});
