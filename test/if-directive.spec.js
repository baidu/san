describe("IfDirective", function () {

    it("for true literal", function () {
        var MyComponent = san.defineComponent({
            template: '<div><span san-if="true" title="errorrik">errorrik</span></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("for false literal", function () {
        var MyComponent = san.defineComponent({
            template: '<div><span san-if="false" title="errorrik">errorrik</span></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(0);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("for false literal use s-", function () {
        var MyComponent = san.defineComponent({
            template: '<div><span s-if="false" title="errorrik">errorrik</span></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(0);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });


    it("render when true, and update soon", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span san-if="cond" title="errorrik">errorrik</span></div>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('cond', true);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('errorrik');

        myComponent.data.set('cond', false);

        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("render when false, and update soon", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span san-if="!cond" title="errorrik">errorrik</span></div>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('cond', true);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(0);

        myComponent.data.set('cond', false);

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('errorrik');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("and else", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span san-if="!cond" title="errorrik">errorrik</span>  <span san-else title="varsha">varsha</span></div>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('cond', true);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);
        expect(spans[0].title).toBe('varsha');

        myComponent.data.set('cond', false);

        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);
            expect(spans[0].title).toBe('errorrik');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("render list, init false, update soon", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-if="cond" san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();

        myComponent.data.set('cond', false);
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(2);
        myComponent.data.set('cond', true);

        san.nextTick(function () {

            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(4);
            expect(lis[2].getAttribute('title')).toBe('varsha');
            expect(lis[2].innerHTML.indexOf('varsha - wangshuonpu@163.com')).toBe(0);
            expect(lis[1].getAttribute('title')).toBe('errorrik');
            expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("render list, init true, update soon", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-if="cond" san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();

        myComponent.data.set('cond', true);
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[2].getAttribute('title')).toBe('varsha');
        expect(lis[2].innerHTML.indexOf('varsha - wangshuonpu@163.com')).toBe(0);
        expect(lis[1].getAttribute('title')).toBe('errorrik');
        expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);

        myComponent.data.set('cond', false);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(2);

            myComponent.data.unshift('persons',
                {name: 'otakustay', email: 'otakustay@gmail.com'}
            );
            myComponent.data.set('cond', true);

            san.nextTick(function () {
                var lis = wrap.getElementsByTagName('li');
                expect(lis.length).toBe(5);
                expect(lis[3].getAttribute('title')).toBe('varsha');
                expect(lis[3].innerHTML.indexOf('varsha - wangshuonpu@163.com')).toBe(0);
                expect(lis[1].getAttribute('title')).toBe('otakustay');
                expect(lis[1].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it("render list, init true, render data use as condition", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><ul san-if="persons"><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></ul></div>'
        });
        var myComponent = new MyComponent();

        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(2);
        expect(lis[1].getAttribute('title')).toBe('varsha');
        expect(lis[1].innerHTML.indexOf('varsha - wangshuonpu@163.com')).toBe(0);
        expect(lis[0].getAttribute('title')).toBe('errorrik');
        expect(lis[0].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);

        myComponent.data.set('persons', [
            {name: 'otakustay', email: 'otakustay@gmail.com'},
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);


        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(3);
            expect(lis[2].getAttribute('title')).toBe('varsha');
            expect(lis[2].innerHTML.indexOf('varsha - wangshuonpu@163.com')).toBe(0);
            expect(lis[1].getAttribute('title')).toBe('errorrik');
            expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);
            expect(lis[0].getAttribute('title')).toBe('otakustay');
            expect(lis[0].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
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

    it("render component, init false, update soon", function (done) {
        var MyComponent = san.defineComponent({
            components: {
                'ui-person': PersonList
            },
            template: '<div><ui-person list="{{persons}}" san-if="cond"></ui-person></div>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('cond', false);
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
        var dds = wrap.getElementsByTagName('dd');
        expect(dts.length).toBe(0);
        expect(dds.length).toBe(0);


        myComponent.data.set('cond', true);
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

    it("render component, init true, update soon", function (done) {
        var MyComponent = san.defineComponent({
            components: {
                'ui-person': PersonList
            },
            template: '<div><ui-person list="{{persons}}" san-if="cond"></ui-person></div>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('cond', true);
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

        myComponent.data.set('cond', false);
        myComponent.data.set('persons[1].name', 'leeight');
        myComponent.data.set('persons[1].tels', ['12121212', '16161616', '18181818']);


        san.nextTick(function () {
            var dts = wrap.getElementsByTagName('dt');
            var dds = wrap.getElementsByTagName('dd');
            expect(dts.length).toBe(0);
            expect(dds.length).toBe(0);


            myComponent.data.set('cond', true);

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
    });

    it("change condition expr data twice, first time diffent and second time same", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                    totalPage: 5,
                    current: 5
                };
            },
            template: '<div><span san-if="current - 1 < totalPage">{{ current - 1 }}</span></div>'
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);

        myComponent.data.set('current', 6);
        myComponent.data.set('totalPage', 6);


        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("change condition expr data twice, first time same and second time different", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                    totalPage: 5,
                    current: 5
                };
            },
            template: '<div><span san-if="current - 1 < totalPage">{{ current - 1 }}</span></div>'
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);


        myComponent.data.set('totalPage', 6);
        myComponent.data.set('current', 6);

        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("change condition expr data many times", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                    totalPage: 5,
                    current: 5
                };
            },
            template: '<div><span san-if="current - 1 < totalPage">{{ current - 1 }}</span></div>'
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);


        myComponent.data.set('totalPage', 6);
        myComponent.data.set('current', 6);
        myComponent.data.set('current', 7);
        myComponent.data.set('totalPage', 8);
        myComponent.data.set('current', 9);
        myComponent.data.set('totalPage', 9);

        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("condition expr data not be changed, inner element should update view", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                    condition: true,
                    list: ['one', 'two']
                };
            },
            template: '<div><div san-if="condition"><u san-for="item,index in list" title="{{index}}{{item}}">{{index}}{{item}}</u></span></div>'
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var us = wrap.getElementsByTagName('u');
        expect(us.length).toBe(2);
        expect(us[0].title).toBe('0one');
        expect(us[0].innerHTML.indexOf('0one')).toBe(0);


        myComponent.data.set('list', ['three']);

        san.nextTick(function () {
            var us = wrap.getElementsByTagName('u');
            expect(us.length).toBe(1);
            expect(us[0].title).toBe('0three');
            expect(us[0].innerHTML.indexOf('0three')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

});
