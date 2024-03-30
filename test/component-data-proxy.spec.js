describe("Component Data Proxy", function () {
    it("simple item", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{name}}">{{name}}</span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.d.name = 'er';

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('er');
        expect(span.innerHTML.indexOf('er')).toBe(0);
        
        myComponent.d.name = 'san';
        expect(myComponent.d.name).toBe('san');
        expect(myComponent.data.get('name')).toBe('san');
        san.nextTick(function () {
            expect(span.title).toBe('san');
            expect(span.innerHTML.indexOf('san')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("whole object", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{p.org.name}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.d.p = {
            name: 'erik',
            email: 'errorrik@gmail.com',
            org: {
                name: 'efe',
                company: 'baidu'
            }
        };

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('efe');
        myComponent.d.p = {
            name: 'erik',
            email: 'errorrik@gmail.com',
            org: {
                name: 'ssg',
                company: 'baidu'
            }
        };

        san.nextTick(function () {
            expect(span.title).toBe('ssg');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });


    it("deep item", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{p.org.name}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.d.p = {
            name: 'erik',
            email: 'errorrik@gmail.com',
            org: {
                name: 'efe',
                company: 'baidu'
            }
        };

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('efe');
        myComponent.d.p.org.name = 'ssg';

        san.nextTick(function () {
            expect(span.title).toBe('ssg');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("after data.set, get collect value", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{p.org.name}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.d.p = {
            name: 'erik',
            email: 'errorrik@gmail.com',
            org: {
                name: 'efe',
                company: 'baidu'
            }
        };

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('efe');
        expect(myComponent.d.p.org.name).toBe('efe');
        myComponent.data.set('p.org.name', 'ssg');
        expect(myComponent.d.p.org.name).toBe('ssg');

        san.nextTick(function () {
            expect(span.title).toBe('ssg');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("push", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.d.persons = [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ];

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[2].getAttribute('title')).toBe('varsha 2/2');

        myComponent.d.persons.push(
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        );

        expect(myComponent.d.persons.length).toBe(3);
        expect(myComponent.d.persons[2].name).toBe('otakustay');
        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(5);
            expect(lis[2].getAttribute('title')).toBe('varsha 2/3');
            expect(lis[3].getAttribute('title')).toBe('otakustay 3/3');
            expect(lis[3].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("push, nest loop", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><ul san-for="col in cols">'
                + '<li san-for="item in col.list" title="{{item.title}}">{{item.title}}</li>'
                + '</ul></div>',

            initData: function () {
                return {
                    cols: [
                        {list: []}
                    ]
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(0);

        myComponent.d.cols[0].list.push({title: 'title'});
        expect(myComponent.data.get('cols[0].list[0].title')).toBe('title');
        expect(myComponent.d.cols[0].list[0].title).toBe('title');

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(1);
            expect(lis[0].title).toBe('title');
            expect(myComponent.data.get('cols[0].list[0].title')).toBe('title');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("no data initial, set and shift soon", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                };
            },

            template: '<ul><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></ul>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');

        expect(lis.length).toBe(0);

        myComponent.d.persons = [
            {name: 'otakustay', email: 'otakustay@gmail.com'},
            {name: 'errorrik', email: 'errorrik@gmail.com'}
        ];
        myComponent.d.persons.shift();

        expect(myComponent.d.persons[0].name).toBe('errorrik');
        expect(myComponent.d.persons.length).toBe(1);
        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(1);
            expect(lis[0].getAttribute('title')).toBe('errorrik');
            expect(lis[0].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("unshift", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent({
            data: {
                persons: [
                    {name: 'one', email: 'one@gmail.com'},
                    {name: 'two', email: 'two@gmail.com'}
                ]
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('one 1/2');
        expect(lis[1].innerHTML.indexOf('one - one@gmail.com')).toBe(0);

        var newLen = myComponent.d.persons.unshift(
            {name: 'three', email: 'three@gmail.com'}
        );
        expect(newLen).toBe(3);
        expect(myComponent.d.persons.length).toBe(3);
        expect(myComponent.d.persons[0].email).toBe('three@gmail.com');
        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(5);

            expect(lis[3].getAttribute('title')).toBe('two 3/3');
            expect(lis[3].innerHTML.indexOf('two - two@gmail.com')).toBe(0);
            expect(lis[2].getAttribute('title')).toBe('one 2/3');
            expect(lis[1].getAttribute('title')).toBe('three 1/3');
            expect(lis[1].innerHTML.indexOf('three - three@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("pop", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                    list: [1, 2]
                };
            },

            template: '<ul><li san-for="item in list">{{item}}</li></ul>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');

        expect(lis.length).toBe(2);
        expect(lis[1].innerHTML).toBe('2');

        expect(myComponent.d.list.pop()).toBe(2);
        expect(myComponent.d.list.length).toBe(1);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(1);
            expect(lis[0].innerHTML).toBe('1');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("splice, just remove", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.d.persons = [
            {name: 'one', email: 'one@gmail.com'},
            {name: 'two', email: 'two@gmail.com'},
            {name: 'three', email: 'three@gmail.com'},
            {name: 'four', email: 'four@gmail.com'},
            {name: 'five', email: 'five@gmail.com'}
        ];

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(7);
        expect(lis[1].getAttribute('title')).toBe('one 1/5');
        expect(lis[2].getAttribute('title')).toBe('two 2/5');

        myComponent.d.persons.splice(1, 3);
        expect(myComponent.d.persons.length).toBe(2);
        expect(myComponent.d.persons[0].name).toBe('one');
        expect(myComponent.d.persons[1].name).toBe('five');

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(4);
            expect(lis[1].getAttribute('title')).toBe('one 1/2');
            expect(lis[2].getAttribute('title')).toBe('five 2/2');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("splice, remove and insert", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'one', email: 'one@gmail.com'},
            {name: 'two', email: 'two@gmail.com'},
            {name: 'three', email: 'three@gmail.com'},
            {name: 'four', email: 'four@gmail.com'},
            {name: 'five', email: 'five@gmail.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(7);
        expect(lis[1].getAttribute('title')).toBe('one 1/5');
        expect(lis[2].getAttribute('title')).toBe('two 2/5');

        myComponent.d.persons.splice(1, 3,
            {name: 'six', email: 'six@gmail.com'},
            {name: 'seven', email: 'seven@gmail.com'}
        );
        expect(myComponent.d.persons.length).toBe(4);
        expect(myComponent.d.persons[0].name).toBe('one');
        expect(myComponent.d.persons[1].name).toBe('six');
        expect(myComponent.d.persons[2].name).toBe('seven');
        expect(myComponent.d.persons[3].name).toBe('five');


        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(6);
            expect(lis[1].getAttribute('title')).toBe('one 1/4');
            expect(lis[2].getAttribute('title')).toBe('six 2/4');
            expect(lis[3].getAttribute('title')).toBe('seven 3/4');
            expect(lis[4].getAttribute('title')).toBe('five 4/4');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("splice, with negative start", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.d.persons = [
            { name: 'one', email: 'one@gmail.com' },
            { name: 'two', email: 'two@gmail.com' },
            { name: 'three', email: 'three@gmail.com' },
            { name: 'four', email: 'four@gmail.com' },
            { name: 'five', email: 'five@gmail.com' }
        ];

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(7);
        expect(lis[1].getAttribute('title')).toBe('one 1/5');
        expect(lis[2].getAttribute('title')).toBe('two 2/5');

        myComponent.d.persons.splice(
            -4, 3,
            { name: 'six', email: 'six@gmail.com' },
            { name: 'seven', email: 'seven@gmail.com' }
        );
        expect(myComponent.d.persons.length).toBe(4);
        expect(myComponent.d.persons[0].name).toBe('one');
        expect(myComponent.d.persons[1].name).toBe('six');
        expect(myComponent.d.persons[2].name).toBe('seven');
        expect(myComponent.d.persons[3].name).toBe('five');

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(6);
            expect(lis[1].getAttribute('title')).toBe('one 1/4');
            expect(lis[2].getAttribute('title')).toBe('six 2/4');
            expect(lis[3].getAttribute('title')).toBe('seven 3/4');
            expect(lis[4].getAttribute('title')).toBe('five 4/4');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("set list item", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent({
            data: {
                persons: [
                    {name: 'one', email: 'one@gmail.com'},
                    {name: 'two', email: 'two@gmail.com'}
                ]
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('one 1/2');
        expect(lis[1].innerHTML.indexOf('one - one@gmail.com')).toBe(0);

        myComponent.d.persons[1] ={name: 'three', email: 'three@gmail.com'};
        expect(myComponent.d.persons.length).toBe(2);
        expect(myComponent.d.persons[1].email).toBe('three@gmail.com');

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(4);

            expect(lis[1].getAttribute('title')).toBe('one 1/2');
            expect(lis[2].getAttribute('title')).toBe('three 2/2');
            expect(lis[2].innerHTML.indexOf('three - three@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("set item of list item", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent({
            data: {
                persons: [
                    {name: 'one', email: 'one@gmail.com'},
                    {name: 'two', email: 'two@gmail.com'}
                ]
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('one 1/2');
        expect(lis[1].innerHTML.indexOf('one - one@gmail.com')).toBe(0);

        myComponent.d.persons[1].name = 'three';
        expect(myComponent.d.persons.length).toBe(2);
        expect(myComponent.d.persons[1].email).toBe('two@gmail.com');

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(4);

            expect(lis[1].getAttribute('title')).toBe('one 1/2');
            expect(lis[2].getAttribute('title')).toBe('three 2/2');
            expect(lis[2].innerHTML.indexOf('three - two@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("set array item, index overflow", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name</li><li san-for="p,i in persons">{{i+1}}-{{p}}</li><li>name</li></ul>'
        });
        var myComponent = new MyComponent({
            data: {
                persons: ['errorrik', 'varsha']
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].innerHTML).toBe('1-errorrik');
        expect(lis[2].innerHTML).toBe('2-varsha');

        myComponent.d.persons[0] = 'erik';
        myComponent.d.persons[3] = 'otakustay';
        
        expect(myComponent.d.persons[2]).toBeUndefined();
        expect(myComponent.d.persons[3]).toBe('otakustay');

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(6);
            expect(lis[1].innerHTML).toBe('1-erik');
            expect(lis[2].innerHTML).toBe('2-varsha');
            expect(lis[3].innerHTML).toBe('3-');
            expect(lis[4].innerHTML).toBe('4-otakustay');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("set array", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'any', email: 'anyone@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(3);
        expect(myComponent.d.persons.length).toBe(2);

        myComponent.d.persons = [
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        ];
        expect(myComponent.d.persons.length).toBe(1);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(2);
            expect(lis[0].getAttribute('title')).toBe('otakustay');
            expect(lis[0].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            expect(myComponent.d.persons[0].name).toBe('otakustay');
            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });
});