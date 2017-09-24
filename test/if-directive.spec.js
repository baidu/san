describe("IfDirective", function () {

    function nextElement(el) {
        var next = el.nextSibling;
        while (next) {
            if (next.nodeType === 1) {
                break;
            }

            next = next.nextSibling;
        }
        return next;
    }

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

    it("position right when create", function () {
        var MyComponent = san.defineComponent({
            template: '<div><b san-if="true" title="errorrik">errorrik</b><u>uuu</u></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var b = wrap.getElementsByTagName('b')[0];
        expect(b.previousSibling).toBe(null);
        var u = nextElement(b);
        expect(u != null).toBeTruthy();
        if (u) {
            expect(u.tagName).toBe('U');
        }

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("position right when update", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><b san-if="cond" title="errorrik">errorrik</b><u>uuu</u></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('b').length).toBe(0);
        myComponent.data.set('cond', true);

        san.nextTick(function () {
            var b = wrap.getElementsByTagName('b')[0];
            expect(b.previousSibling).toBe(null);
            var u = nextElement(b);
            expect(u != null).toBeTruthy();
            if (u) {
                expect(u.tagName).toBe('U');
            }

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
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

    it("render when false, and update soon， interp compat", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span san-if="{{!cond}}" title="errorrik">errorrik</span></div>'
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

    it("elif", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span s-if="cond1" title="errorrik">errorrik</span>  <span s-elif="cond2" title="leeight">leeight</span></div>'
        });
        var myComponent = new MyComponent({
            data: {
                cond1: true,
                cond2: true
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);
        expect(spans[0].title).toBe('errorrik');

        myComponent.data.set('cond1', false);

        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);
            expect(spans[0].title).toBe('leeight');

            myComponent.data.set('cond2', false);
            san.nextTick(function () {
                var spans = wrap.getElementsByTagName('span');
                expect(spans.length).toBe(0);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it("elif and else", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span s-if="cond1" title="errorrik">errorrik</span>  \n'
                + '<span s-elif="cond2" title="leeight">leeight</span>  \n' +
                ' <b s-else title="nobody">nobody</b></div>'
        });
        var myComponent = new MyComponent({
            data: {
                cond1: true,
                cond2: true
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);
        expect(spans[0].title).toBe('errorrik');
        expect(wrap.getElementsByTagName('b').length).toBe(0);

        myComponent.data.set('cond1', false);

        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);
            expect(spans[0].title).toBe('leeight');
            expect(wrap.getElementsByTagName('b').length).toBe(0);

            myComponent.data.set('cond2', false);
            san.nextTick(function () {
                expect(wrap.getElementsByTagName('span').length).toBe(0);
                var bs = wrap.getElementsByTagName('b');
                expect(bs[0].title).toBe('nobody');
                
                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it("multi elif", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span s-if="num > 10000" title="biiig">biiig</span>  \n'
            + '<span s-elif="num > 1000" title="biig">biig</span>  \n'
            + '<span s-elif="num > 100" title="big">big</span>  \n'
            + ' <b s-else title="small">small</b></div>'
        });
        var myComponent = new MyComponent({
            data: {
                num: 300
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);
        expect(spans[0].title).toBe('big');
        expect(wrap.getElementsByTagName('b').length).toBe(0);

        myComponent.data.set('num', 30000);

        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);
            expect(spans[0].title).toBe('biiig');
            expect(wrap.getElementsByTagName('b').length).toBe(0);

            myComponent.data.set('num', 10);
            san.nextTick(function () {
                var spans = wrap.getElementsByTagName('span');
                expect(spans.length).toBe(0);
                var bs = wrap.getElementsByTagName('b');
                expect(bs[0].title).toBe('small');

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
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

    it("has event binding", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span s-if="cond1" title="errorrik" on-click="notice(\'errorrik\')">errorrik</span>  \n'
                + '<span s-elif="cond2" title="leeight" on-click="notice(\'leeight\')">leeight</span>  \n' +
                ' <b s-else title="nobody" on-click="notice(\'nobody\')">nobody</b></div>',

            notice: function (msg) {
                alert(msg)
            }
        });
        var myComponent = new MyComponent({
            data: {
                cond1: true,
                cond2: true
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);
        expect(spans[0].title).toBe('errorrik');
        expect(wrap.getElementsByTagName('b').length).toBe(0);

        myComponent.data.set('cond1', false);

        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);
            expect(spans[0].title).toBe('leeight');
            expect(wrap.getElementsByTagName('b').length).toBe(0);

            myComponent.data.set('cond2', false);
            san.nextTick(function () {
                expect(wrap.getElementsByTagName('span').length).toBe(0);
                var bs = wrap.getElementsByTagName('b');
                expect(bs[0].title).toBe('nobody');
                
                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

});
