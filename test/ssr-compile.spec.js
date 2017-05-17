describe("Component serialize from compiled renderer and reverse", function () {

    it("update attribute", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{email}}">{{name}}</span></a>'
        });

        var renderer = san.compileToRenderer(MyComponent);
        var wrap = document.createElement('div');
        wrap.innerHTML = renderer({
            email: 'errorrik@gmail.com',
            name: 'errorrik'
        });
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        expect(myComponent.data.get('email')).toBe('errorrik@gmail.com');
        expect(myComponent.data.get('name')).toBe('errorrik');
        myComponent.data.set('email', 'erik168@163.com');
        myComponent.data.set('name', 'erik');

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('erik168@163.com');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })

    });

    it("update text", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{email}}">{{name}}</span></a>'
        });

        var renderer = san.compileToRenderer(MyComponent);
        var wrap = document.createElement('div');
        wrap.innerHTML = renderer({
            email: 'errorrik@gmail.com',
            name: 'errorrik'
        });
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });


        expect(myComponent.data.get('email')).toBe('errorrik@gmail.com');
        expect(myComponent.data.get('name')).toBe('errorrik');
        myComponent.data.set('email', 'erik168@163.com');
        myComponent.data.set('name', 'erik');

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML.indexOf('erik')).toBe(0);
            expect(span.title.indexOf('erik168@163.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })

    });

    it("update component", function (done) {
        var Label = san.defineComponent({
            template: '<a><span title="{{title}}">{{text}}</span></a>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div><h5><ui-label title="{{name}}" text="{{jokeName}}"></ui-label></h5>'
                + '<p><a>{{school}}</a><u>{{company}}</u></p></div>'
        });

        var renderer = san.compileToRenderer(MyComponent);
        var wrap = document.createElement('div');
        wrap.innerHTML = renderer({
            jokeName: 'airike',
            name: 'errorrik',
            school: 'none',
            company: 'bidu'
        });

        document.body.appendChild(wrap);


        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        expect(myComponent.data.get('jokeName')).toBe('airike');
        expect(myComponent.data.get('name')).toBe('errorrik');
        myComponent.data.set('name', 'erik');
        myComponent.data.set('jokeName', '2b');

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML.indexOf('airike')).toBe(0);
        expect(span.title).toBe('errorrik');

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML.indexOf('2b')).toBe(0);
            expect(span.title).toBe('erik');
            expect(myComponent.data.get('jokeName')).toBe('2b');
            expect(myComponent.data.get('name')).toBe('erik');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("update component, main element has attribute", function (done) {
        var Label = san.defineComponent({
            template: '<span class="label" title="{{text}}">{{text}}</span>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div><h5><ui-label text="{{jokeName}}" class="{{labelClass}} my-label"></ui-label></h5>'
                + '<p><a>{{school}}</a><u>{{company}}</u></p></div>'
        });

        var renderer = san.compileToRenderer(MyComponent);
        var wrap = document.createElement('div');
        wrap.innerHTML = renderer({
            jokeName: 'airike',
            name: 'errorrik',
            school: 'none',
            company: 'bidu'
        });
        document.body.appendChild(wrap);


        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        myComponent.data.set('name', 'erik');
        myComponent.data.set('jokeName', '2bbbbbbb');

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML.indexOf('airike') >= 0).toBeTruthy();
        expect(span.title).toBe('airike');

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML.indexOf('2bbbbbbb') >= 0).toBeTruthy();
            expect(span.title).toBe('2bbbbbbb');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("update component, merge init data and given data", function (done) {
        var Label = san.defineComponent({
            template: '<span class="label" title="{{title}}">{{text}}</span>',

            initData: function () {
                return {
                    title: 'title',
                    text: 'text'
                };
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div><h5><ui-label text="{{jokeName}}" class="{{labelClass}} my-label"></ui-label></h5>'
                + '<p><a title="{{school}}">{{school}}</a><u title="{{company}}">{{company}}</u></p></div>',

            initData: function () {
                return {
                    jokeName: 'airike',
                    school: 'none',
                };
            }
        });

        var renderer = san.compileToRenderer(MyComponent);
        var wrap = document.createElement('div');

        wrap.innerHTML = renderer({
            company: 'bidu'
        });
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });


        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML.indexOf('airike') >= 0).toBeTruthy();
        expect(span.title).toBe('title');
        var a = wrap.getElementsByTagName('a')[0];
        expect(a.title).toBe('none');
        var u = wrap.getElementsByTagName('u')[0];
        expect(u.title).toBe('bidu');

        myComponent.data.set('school', 'hainan-mid');
        myComponent.data.set('jokeName', '2bbbbbbb');

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML.indexOf('2bbbbbbb') >= 0).toBeTruthy();
            expect(span.title).toBe('title');
            var a = wrap.getElementsByTagName('a')[0];
            expect(a.title).toBe('hainan-mid');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("update for, init with empty data", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul>'
                + '<li>name - email</li>'
                + '<li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li>'
                + '<li>name - email</li>'
                + '</ul>'
        });

        var renderer = san.compileToRenderer(MyComponent);
        var wrap = document.createElement('div');
        wrap.innerHTML = renderer({
            persons: []
        });
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(2);

        myComponent.data.push('persons',
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        );

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(3);
            expect(lis[1].getAttribute('title')).toBe('otakustay');
            expect(lis[1].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("push update for, init with many data", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul>'
                + '<li>name - email</li>'
                + '<li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li>'
                + '<li>name - email</li>'
                + '</ul>'
        });

        var renderer = san.compileToRenderer(MyComponent);
        var wrap = document.createElement('div');


        wrap.innerHTML = renderer({
            'persons': [
                {name: 'errorrik', email: 'errorrik@gmail.com'},
                {name: 'otakustay', email: 'otakustay@gmail.com'}
            ]
        });
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('errorrik');
        expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);

        myComponent.data.push('persons',
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        );

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(5);
            expect(lis[3].getAttribute('title')).toBe('otakustay');
            expect(lis[3].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });


    it("remove update for, init with many data", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul>'
                + '<li>name - email</li>'
                + '<li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li>'
                + '<li>name - email</li>'
                + '</ul>'
        });

        var renderer = san.compileToRenderer(MyComponent);
        var wrap = document.createElement('div');
        wrap.innerHTML = renderer({
            'persons': [
                {name: 'errorrik', email: 'errorrik@gmail.com'},
                {name: 'otakustay', email: 'otakustay@gmail.com'}
            ]
        });
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        myComponent.data.removeAt('persons', 0);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('errorrik');
        expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);


        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(3);
            expect(lis[1].getAttribute('title')).toBe('otakustay');
            expect(lis[1].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });


    it("set update for, init with many data", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul>'
                + '<li>name - email</li>'
                + '<li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li>'
                + '<li>name - email</li>'
                + '</ul>'
        });

        var renderer = san.compileToRenderer(MyComponent);
        var wrap = document.createElement('div');

        wrap.innerHTML = renderer({
            'persons': [
                {name: 'errorrik', email: 'errorrik@gmail.com'},
                {name: 'otakustay', email: 'otakustay@gmail.com'}
            ]
        });
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        myComponent.data.set('persons[0]', {name: 'erik', email: 'erik168@163.com'});

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('errorrik');
        expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);


        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(4);
            expect(lis[1].getAttribute('title')).toBe('erik');
            expect(lis[1].innerHTML.indexOf('erik - erik168@163.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("update if, init with true", function (done) {
        var MyComponent = san.defineComponent({
            template: '<u>'
                + '<span san-if="cond" title="{{name}}">{{name}}</span>'
                + '</u>'
        });

        var renderer = san.compileToRenderer(MyComponent);
        var wrap = document.createElement('div');
        wrap.innerHTML = renderer({
            'cond': true,
            'name': 'errorrik'
        });
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        expect(myComponent.data.get('name')).toBe('errorrik');
        myComponent.data.set('cond', false);
        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('errorrik');


        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(0);

            myComponent.data.set('cond', true);

            san.nextTick(function () {
                var span = wrap.getElementsByTagName('span')[0];
                expect(span.title).toBe('errorrik');
                expect(span.innerHTML.indexOf('errorrik') >= 0).toBeTruthy();


                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it("update if, init with false", function (done) {
        var MyComponent = san.defineComponent({
            template: '<u>'
                + '<a>nimei</a>'
                + '<span san-if="cond" title="{{name}}">{{name}}</span>'
                + '</u>'
        });

        var renderer = san.compileToRenderer(MyComponent);
        var wrap = document.createElement('div');

        wrap.innerHTML = renderer({
            'cond': false,
            'name': 'errorrik'
        });
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        myComponent.data.set('cond', true);
        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(0);


        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('errorrik');
            expect(span.innerHTML.indexOf('errorrik')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("update else, init with false", function (done) {
        var MyComponent = san.defineComponent({
            template: '<u>'
                + '<a>nimei</a>'
                + '<span san-if="cond" title="{{name}}">{{name}}</span>'
                + '<span san-else title="{{name2}}">{{name2}}</span>'
                + '</u>'
        });

        var renderer = san.compileToRenderer(MyComponent);
        var wrap = document.createElement('div');

        wrap.innerHTML = renderer({
            'cond': false,
            'name': 'errorrik',
            'name2': 'otakustay'
        });

        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        myComponent.data.set('cond', true);
        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);
        expect(spans[0].title).toBe('otakustay');
        expect(spans[0].innerHTML.indexOf('otakustay')).toBe(0);


        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);
            expect(spans[0].title).toBe('errorrik');
            expect(spans[0].innerHTML.indexOf('errorrik')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("update else, init with true", function (done) {
        var MyComponent = san.defineComponent({
            template: '<u>'
                + '<span san-if="cond" title="{{name}}">{{name}}</span>'
                + '<span san-else title="{{name2}}">{{name2}}</span>'
                + '</u>'
        });

        var renderer = san.compileToRenderer(MyComponent);
        var wrap = document.createElement('div');

        wrap.innerHTML = renderer({
            'cond': true,
            'name': 'errorrik',
            'name2': 'otakustay'
        });
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        myComponent.data.set('cond', false);
        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);
        expect(spans[0].title).toBe('errorrik');
        expect(spans[0].innerHTML.indexOf('errorrik')).toBe(0);


        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);
            expect(spans[0].title).toBe('otakustay');
            expect(spans[0].innerHTML.indexOf('otakustay')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it('default and named slot', function (done) {
        var Tab = san.defineComponent({
            template: '<div>'
                +   '<div class="head"><slot name="title"></slot></div>'
                +   '<div><slot></slot></div>'
                +   '<u title="{{text}}"></u>'
                + '</div>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-tab': Tab
            },

            template: '<div><ui-tab text="{{tabText}}">'
                + '<h3 slot="title" title="{{title}}">{{title}}</h3>'
                + '<p title="{{text}}">{{text}}</p>'
                + '</ui-tab></div>'
        });

        var renderer = san.compileToRenderer(MyComponent);
        var wrap = document.createElement('div');
        wrap.innerHTML = renderer({
            tabText: 'tab',
            text: 'one',
            title: '1'
        });
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        var u = wrap.getElementsByTagName('u')[0];
        var p = wrap.getElementsByTagName('p')[0];
        var h3 = wrap.getElementsByTagName('h3')[0];
        expect(u.title).toBe('tab');
        expect(p.title).toBe('one');
        expect(h3.title).toBe('1');

        myComponent.data.set('tabText', 'ctab');
        myComponent.data.set('text', 'two');
        myComponent.data.set('title', '2');

        san.nextTick(function () {
            expect(u.title).toBe('ctab');
            expect(p.title).toBe('two');
            expect(h3.title).toBe('2');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it('default and named slot, content by default', function (done) {
        var Tab = san.defineComponent({
            template: '<div>'
                +   '<div class="head"><slot name="title"><h3 title="{{title}}">{{title}}</h3></slot></div>'
                +   '<div><slot><p title="{{text}}">{{text}}</p></slot></div>'
                + '</div>',

            initData: function () {
                return {
                    title: '5',
                    text: 'five'
                }
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-tab': Tab
            },

            template: '<div><ui-tab title="{{tTitle}}" text="{{tText}}">'
                + '</ui-tab></div>'
        });

        var renderer = san.compileToRenderer(MyComponent);
        var wrap = document.createElement('div');

        wrap.innerHTML = renderer({
            tabText: 'tab',
            text: 'one',
            title: '1',
            tTitle: '5',
            tText: 'five'
        });
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        var p = wrap.getElementsByTagName('p')[0];
        var h3 = wrap.getElementsByTagName('h3')[0];
        expect(p.title).toBe('five');
        expect(h3.title).toBe('5');

        myComponent.data.set('text', 'two');
        myComponent.data.set('title', '2');
        myComponent.data.set('tText', 'six');
        myComponent.data.set('tTitle', '6');

        san.nextTick(function () {
            expect(p.title).toBe('six');
            expect(h3.title).toBe('6');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });
});
