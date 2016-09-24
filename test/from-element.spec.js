describe("Component Compile From Element", function () {

    it("update attribute", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                    email: 'errorrik@gmail.com',
                    name: 'errorrik'
                };
            }
        });


        var wrap = document.createElement('div');
        wrap.innerHTML = '<a><span title="errorrik@gmail.com" prop-title="{{email}}">errorrik</span></a>';
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        myComponent.data.set('email', 'erik168@163.com');
        myComponent.data.set('name', 'erik');

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title.indexOf('erik168@163.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })

    });

    it("update text", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                    email: 'errorrik@gmail.com',
                    name: 'errorrik'
                };
            }
        });


        var wrap = document.createElement('div');
        wrap.innerHTML = '<a><span title="errorrik@gmail.com" prop-title="{{email}}">errorrik<script type="text/san">{{name}}</script></span></a>';
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

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

        var wrap = document.createElement('div');
        wrap.innerHTML = '<div><h5>'
            + '<a san-component="ui-label" prop-title="name" prop-text="jokeName"><span prop-title="{{title}}" title="errorrik">airike<script type="text/san">{{text}}</script></span></a>'
            + '</h5>'
            + '<p><a>none<script type="text/san">{{school}}</script></a><u>bidu<script type="text/san">{{company}}</script></u></p></div>';
        document.body.appendChild(wrap);


        var myComponent = new MyComponent({
            data: {
                jokeName: 'airike',
                name: 'errorrik',
                school: 'none',
                company: 'bidu'
            },
            el: wrap.firstChild
        });

        myComponent.data.set('name', 'erik');
        myComponent.data.set('jokeName', '2b');

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML.indexOf('airike')).toBe(0);
        expect(span.title).toBe('errorrik');

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML.indexOf('2b')).toBe(0);
            expect(span.title).toBe('erik');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("update for, init with empty data", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>',
            initData: function () {
                return {
                    persons: []
                };
            }
        });


        var wrap = document.createElement('div');
        wrap.innerHTML = '<ul><li>name - email</li>'
            + '<script type="text/san" san-stump="for"><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></script>'
            + '<li>name - email</li></ul>';
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
            initData: function () {
                return {
                    persons: []
                };
            }
        });

        var wrap = document.createElement('div');
        wrap.innerHTML = '<ul><li>name - email</li>'
            + '<li san-for="p,i in persons" prop-title="{{p.name}}" title="errorrik">errorrik - errorrik@gmail.com<script type="text/san">{{p.name}} - {{p.email}}</script></li>'
            + '<li san-for="p,i in persons" prop-title="{{p.name}}" title="otakustay">otakustay - otakustay@gmail.com<script type="text/san">{{p.name}} - {{p.email}}</script></li>'
            + '<script type="text/san" san-stump="for"><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></script>'
            + '<li>name - email</li></ul>';
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild,
            data: {
                'persons': [
                    {name: 'errorrik', email: 'errorrik@gmail.com'},
                    {name: 'otakustay', email: 'otakustay@gmail.com'}
                ]
            }
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
            initData: function () {
                return {
                    persons: []
                };
            }
        });

        var wrap = document.createElement('div');
        wrap.innerHTML = '<ul><li>name - email</li>'
            + '<li san-for="p,i in persons" prop-title="{{p.name}}" title="errorrik">errorrik - errorrik@gmail.com<script type="text/san">{{p.name}} - {{p.email}}</script></li>'
            + '<li san-for="p,i in persons" prop-title="{{p.name}}" title="varsha">varsha - wangshuonpu@163.com<script type="text/san">{{p.name}} - {{p.email}}</script></li>'
            + '<script type="text/san" san-stump="for"><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></script>'
            + '<li>name - email</li></ul>';
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild,
            data: {
                'persons': [
                    {name: 'errorrik', email: 'errorrik@gmail.com'},
                    {name: 'varsha', email: 'wangshuonpu@163.com'}
                ]
            }
        });

        myComponent.data.removeAt('persons', 0);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('errorrik');
        expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);


        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(3);
            expect(lis[1].getAttribute('title')).toBe('varsha');
            expect(lis[1].innerHTML.indexOf('varsha - wangshuonpu@163.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });


    it("set update for, init with many data", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                    persons: []
                };
            }
        });

        var wrap = document.createElement('div');
        wrap.innerHTML = '<ul><li>name - email</li>'
            + '<li san-for="p,i in persons" prop-title="{{p.name}}" title="errorrik">errorrik - errorrik@gmail.com<script type="text/san">{{p.name}} - {{p.email}}</script></li>'
            + '<li san-for="p,i in persons" prop-title="{{p.name}}" title="varsha">varsha - wangshuonpu@163.com<script type="text/san">{{p.name}} - {{p.email}}</script></li>'
            + '<script type="text/san" san-stump="for"><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></script>'
            + '<li>name - email</li></ul>';
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild,
            data: {
                'persons': [
                    {name: 'errorrik', email: 'errorrik@gmail.com'},
                    {name: 'varsha', email: 'wangshuonpu@163.com'}
                ]
            }
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
        });

        var wrap = document.createElement('div');
        wrap.innerHTML = '<u><span san-if="cond" title="errorrik" prop-title="{{name}}">errorrik<script type="text/san">{{name}}</script></span></u>';
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild,
            data: {
                'cond': true,
                'name': 'errorrik'
            }
        });

        myComponent.data.set('cond', false);
        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('errorrik');


        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(0);

            myComponent.data.set('cond', true);

            san.nextTick(function () {
                var span = wrap.firstChild.firstChild;
                expect(span.title).toBe('errorrik');
                expect(span.innerHTML.indexOf('errorrik')).toBe(0);


                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it("update if, init with false", function (done) {
        var MyComponent = san.defineComponent({
        });

        var wrap = document.createElement('div');
        wrap.innerHTML = '<u><a>nimei</a><script type="text/san" san-stump="if"><span san-if="cond" title="{{name}}">{{name}}</span></script></u>';
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild,
            data: {
                'cond': false,
                'name': 'errorrik'
            }
        });

        myComponent.data.set('cond', true);
        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(0);


        san.nextTick(function () {
            var span = wrap.firstChild.firstChild.nextSibling;
            expect(span.title).toBe('errorrik');
            expect(span.innerHTML.indexOf('errorrik')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("update else, init with false", function (done) {
        var MyComponent = san.defineComponent({
        });

        var wrap = document.createElement('div');
        wrap.innerHTML = '<u><a>nimei</a>'
            + '<script type="text/san" san-stump="if"><span san-if="cond" title="{{name}}">{{name}}</span></script>'
            + '<span san-else title="otakustay" prop-title="{{name2}}">otakustay<script type="text/san">{{name2}}</script></span>'
            + '</u>';
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild,
            data: {
                'cond': false,
                'name': 'errorrik',
                'name2': 'otakustay'
            }
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
        });

        var wrap = document.createElement('div');
        wrap.innerHTML = '<u>'
            + '<span san-if="cond" title="errorrik" prop-title="{{name}}">errorrik<script type="text/san">{{name}}</script></span>'
            + '<script type="text/san" san-stump="else"><span san-else title="{{name2}}">{{name2}}</span></script>'
            + '</u>';
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild,
            data: {
                'cond': true,
                'name': 'errorrik',
                'name2': 'otakustay'
            }
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

});
