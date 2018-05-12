describe("Expression Update Detect", function () {

    function upxFilter(source, first) {
        if (source) {
            if (first) {
                return source.charAt(0).toUpperCase() + source.slice(1);
            }

            return source.toUpperCase();
        }

        return source;
    }

    it("simple text", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{name}}">{{name}}</span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'er');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('er');
        expect(span.innerHTML.indexOf('er')).toBe(0);
        myComponent.data.set('name', 'san');
        san.nextTick(function () {
            expect(span.title).toBe('san');
            expect(span.innerHTML.indexOf('san')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("complex text", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="hello {{val1}}, have dinner with {{val2}}?"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 'er');
        myComponent.data.set('val2', 'san');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('hello er, have dinner with san?');
        myComponent.data.set('val2', 'etpl');

        san.nextTick(function () {
            expect(span.title).toBe('hello er, have dinner with etpl?');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("text has interpolation and filter", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="hello {{name | upx(!all)}}!"></span></a>',
            filters: {upx: upxFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'san');
        myComponent.data.set('all', true);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('hello SAN!');
        myComponent.data.set('all', false);

        san.nextTick(function () {
            expect(span.title).toBe('hello San!');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("text has interpolation and filter in complex context", function (done) {
        var kTypeDefs1 = [
            {
                "name": "checked",
                "type": "bool",
                "bindx": true,
                "desc": "设置或者获取控件的选中状态",
                "defaultValue": "false"
            }
        ];
        var kTypeDefs2 = [
            {
                "name": "disabled",
                "type": "bool",
                "desc": "控制按钮的禁用状态",
                "defaultValue": "false"
            }
        ];


        var DataTypeExplorer = san.defineComponent({
            template: '<ul><li s-for="typeDef in typeDefs">{{typeDef.name | noop}}<i s-if="typeDef.bindx">ICON: bindx</i></li></ul>',
            filters: {
                noop: function (value) {
                    return value;
                }
            },
            initData: function() {
                return {
                    typeDefs: []
                };
            }
        });

        var MyComponent = san.defineComponent({
            template: '<div><ui-datatype-explorer typeDefs="{{typeDefs}}" /></div>',
            components: {
                'ui-datatype-explorer': DataTypeExplorer
            }
        });

        var myComponent = new MyComponent({
            data: {
                typeDefs: kTypeDefs1
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var li0 = wrap.getElementsByTagName('li')[0];
        expect(li0.innerHTML.indexOf('checked') >= 0).toBeTruthy();
        expect(li0.getElementsByTagName('i').length).toBe(1);
        myComponent.data.set('typeDefs', kTypeDefs2);


        san.nextTick(function () {

            var li0 = wrap.getElementsByTagName('li')[0];
            expect(li0.innerHTML.indexOf('checked') >= 0).toBeFalsy();
            expect(li0.innerHTML.indexOf('disabled') >= 0).toBeTruthy();
            expect(li0.getElementsByTagName('i').length).toBe(0);


            myComponent.data.set('typeDefs', kTypeDefs1);
            san.nextTick(function () {

                var li0 = wrap.getElementsByTagName('li')[0];
                expect(li0.innerHTML.indexOf('checked') >= 0).toBeTruthy();
                expect(li0.getElementsByTagName('i').length).toBe(1);

                myComponent.dispose();
                document.body.removeChild(wrap);

                done();
            });
        });
    });


    it("bind ident", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span title="{{name}}"></span></div>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'er');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('er');
        myComponent.data.set('name', 'san');

        san.nextTick(function () {
            expect(span.title).toBe('san');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind unary", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span title="{{!val1}}"></span></div>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 10);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('false');
        myComponent.data.set('val1', 0);

        san.nextTick(function () {
            expect(span.title).toBe('true');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind binary", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span title="{{val1 + val2}}"></span></div>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 10);
        myComponent.data.set('val2', 10);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('20');
        myComponent.data.set('val2', 5);

        san.nextTick(function () {
            expect(span.title).toBe('15');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind binary complex", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{val1 + val2 * val3 / val4}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 10);
        myComponent.data.set('val2', 10);
        myComponent.data.set('val3', 10);
        myComponent.data.set('val4', 5);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('30');
        myComponent.data.set('val2', 5);

        san.nextTick(function () {
            expect(span.title).toBe('20');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind property accessor, set item", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{p.name}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('p', {
            name: 'erik',
            email: 'errorrik@gmail.com'
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('erik');
        myComponent.data.set('p.name', 'errorrik');

        san.nextTick(function () {
            expect(span.title).toBe('errorrik');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind property accessor, set outer data", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{p.org.name}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('p', {
            name: 'erik',
            email: 'errorrik@gmail.com',
            org: {
                name: 'efe',
                company: 'baidu'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('efe');
        myComponent.data.set('p', {
            name: 'erik',
            email: 'errorrik@gmail.com',
            org: {
                name: 'ssg',
                company: 'baidu'
            }
        });

        san.nextTick(function () {
            expect(span.title).toBe('ssg');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind property accessor, set outer data, using merge", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{p.org.name}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('p', {
            name: 'erik',
            email: 'errorrik@gmail.com',
            org: {
                name: 'efe',
                company: 'baidu'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('efe');
        myComponent.data.merge('p', {
            org: {
                name: 'ssg',
                company: 'baidu'
            }
        });

        san.nextTick(function () {
            expect(span.title).toBe('ssg');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind property accessor, set outer data, using apply", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{p.org.name}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('p', {
            name: 'erik',
            email: 'errorrik@gmail.com',
            org: {
                name: 'efe',
                company: 'baidu'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('efe');
        myComponent.data.apply('p', function () {
            return {
                name: 'erik',
                email: 'errorrik@gmail.com',
                org: {
                    name: 'ssg',
                    company: 'baidu'
                }
            };
        });

        san.nextTick(function () {
            expect(span.title).toBe('ssg');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind property accessor, variable item", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{p.orgs[index].name}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('p', {
            name: 'erik',
            email: 'errorrik@gmail.com',
            orgs: [
                {
                    name: 'efe',
                    company: 'baidu'
                },

                {
                    name: 'ssg',
                    company: 'baidu'
                }
            ]
        });
        myComponent.data.set('index', 0);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('efe');

        myComponent.data.set('index', 1);

        san.nextTick(function () {
            expect(span.title).toBe('ssg');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind property accessor, after level of variable item", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{p.orgs[index].name}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('p', {
            name: 'erik',
            email: 'errorrik@gmail.com',
            orgs: [
                {
                    name: 'efe',
                    company: 'baidu'
                },

                {
                    name: 'ssg',
                    company: 'baidu'
                }
            ]
        });
        myComponent.data.set('index', 0);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('efe');

        myComponent.data.set('p.orgs[0].name', 'mms');

        san.nextTick(function () {
            expect(span.title).toBe('mms');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind property accessor, before level of variable item", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{p.orgs[index].name}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('p', {
            name: 'erik',
            email: 'errorrik@gmail.com',
            orgs: [
                {
                    name: 'efe',
                    company: 'baidu'
                },

                {
                    name: 'ssg',
                    company: 'baidu'
                }
            ]
        });
        myComponent.data.set('index', 0);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('efe');

        myComponent.data.set('p.orgs', [
            {
                name: 'ssg',
                company: 'baidu'
            },
            {
                name: 'efe',
                company: 'baidu'
            }
        ]);

        san.nextTick(function () {
            expect(span.title).toBe('ssg');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind property accessor, in variable item", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{p.orgs[index].name}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('p', {
            name: 'erik',
            email: 'errorrik@gmail.com',
            orgs: [
                {
                    name: 'efe',
                    company: 'baidu'
                },

                {
                    name: 'ssg',
                    company: 'baidu'
                }
            ]
        });
        myComponent.data.set('index', 0);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('efe');

        myComponent.data.set('p.orgs[0]', {
            name: 'mms',
            company: 'baidu'
        });

        san.nextTick(function () {
            expect(span.title).toBe('mms');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("tertiary expr, condition expr change", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{a1+a2 ? v1 : v2}}">{{a1+a2 ? v1 : v2}}</span></a>'
        });
        var myComponent = new MyComponent({
            data: {
                a1: 0,
                a2: 1,
                v1: 'v1',
                v2: 'v2'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('v1');
        myComponent.data.set('a2', 0);
        san.nextTick(function () {
            expect(span.title).toBe('v2');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("tertiary expr, value expr change", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{a1+a2 ? v1 : v2}}">{{a1+a2 ? v1 : v2}}</span></a>'
        });
        var myComponent = new MyComponent({
            data: {
                a1: 0,
                a2: 1,
                v1: 'v1',
                v2: 'v2'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('v1');
        myComponent.data.set('v1', 'vv1');
        san.nextTick(function () {
            expect(span.title).toBe('vv1');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("array literal", function (done) {
        var List = san.defineComponent({
            template: '<ul><li s-for="item in list">{{item}}</li></ul>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-l': List
            },
            template: '<div><x-l list="{{[1, true, \'erik\', four, five + four + \'2\']}}"/></div>'
        });
        var myComponent = new MyComponent({
            data: {
                four: 4,
                five: 5
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(5);

        expect(lis[0].innerHTML).toBe('1');
        expect(lis[1].innerHTML).toBe('true');
        expect(lis[2].innerHTML).toBe('erik');
        expect(lis[3].innerHTML).toBe('4');
        expect(lis[4].innerHTML).toBe('92');
        myComponent.data.set('four', 40);
        myComponent.data.set('five', 15);
        san.nextTick(function () {

            expect(lis[3].innerHTML).toBe('40');
            expect(lis[4].innerHTML).toBe('552');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("array literal with spread", function (done) {
        var List = san.defineComponent({
            template: '<ul><li s-for="item in list">{{item}}</li></ul>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-l': List
            },
            template: '<div><x-l list="{{[1, true, ...ext, \'erik\', ...ext2]}}"/></div>'
        });
        var myComponent = new MyComponent({
            data: {
                ext2: []
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(3);

        expect(lis[0].innerHTML).toBe('1');
        expect(lis[1].innerHTML).toBe('true');
        expect(lis[2].innerHTML).toBe('erik');
        myComponent.data.set('ext', [3, 4]);
        myComponent.data.set('ext2', [5, 6]);
        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(7);

            expect(lis[0].innerHTML).toBe('1');
            expect(lis[1].innerHTML).toBe('true');
            expect(lis[4].innerHTML).toBe('erik');
            expect(lis[2].innerHTML).toBe('3');
            expect(lis[3].innerHTML).toBe('4');

            expect(lis[5].innerHTML).toBe('5');
            expect(lis[6].innerHTML).toBe('6');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });
});
