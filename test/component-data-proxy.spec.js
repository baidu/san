(typeof Proxy !== 'undefined') && describe("Component Data Proxy", function () {
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

    it("computed", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span title="{{name}}">{{name}}</span></div>',

            initData: function () {
                return {
                    'first': 'first',
                    'last': 'last'
                }
            },

            computed: {
                name: function () {
                    return this.d.first + ' ' + this.d.last;
                }
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('first last');

        myComponent.d.last = 'xxx';

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('first xxx');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("computed, deep prop", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span title="{{name}}">{{text}}</span></div>',

            initData: function () {
                return {
                    person: {
                        name: {
                            'first': 'first',
                            'last': 'last'
                        },

                        cars: ['bmw', 'lexus', 'porsche']
                    }
                }
            },

            computed: {
                name: function () {
                    return this.d.person.name.first + ' ' + this.d.person.name.last;
                },

                text: function () {
                    return this.d.name + ' has ' + this.d.person.cars[2];
                }
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('first last');
        expect(span.innerHTML).toContain('first last has porsche');

        myComponent.d.person.name.last = 'xxx';
        myComponent.d.person.cars[2] = 'xiaomi';

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('first xxx');
            expect(span.innerHTML).toContain('first xxx has xiaomi');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("computed, compute once after 1 data set", function (done) {
        var nameCalls = 0;
        var MyComponent = san.defineComponent({
            template: '<div><span title="{{name}}">{{text}}</span></div>',

            initData: function () {
                return {
                    person: {
                        name: {
                            'first': 'first',
                            'last': 'last'
                        },

                        cars: ['bmw', 'lexus', 'porsche']
                    }
                }
            },

            computed: {
                name: function () {
                    nameCalls++;
                    return this.d.person.name.first + ' ' + this.d.person.name.last;
                },

                text: function () {
                    return this.d.name + ' has ' + this.d.person.cars[2];
                }
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('first last');
        expect(span.innerHTML).toContain('first last has porsche');
        expect(nameCalls).toBe(1);

        myComponent.d.person.name = {
            first: 'one',
            last: 'two'
        };

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('one two');
            expect(span.innerHTML).toContain('one two has porsche');
            expect(nameCalls).toBe(2);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("computed, deep prop, read cracked", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span title="{{name}}">{{text}}</span></div>',

            initData: function () {
                return {
                    person: {
                        name: {
                            'first': 'first',
                            'last': 'last'
                        },
                        age: 18,

                        cars: ['bmw', 'lexus', 'porsche']
                    }
                }
            },

            computed: {
                name: function () {
                    var name = this.d.person.name;
                    var first = name.first;
                    var age = this.d.person.age;
                    var last = name.last;

                    return first + ' ' + last + ' is ' + age;
                },

                text: function () {
                    return this.d.name + ' has ' + this.d.person.cars[2];
                }
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('first last is 18');
        expect(span.innerHTML).toContain('first last is 18 has porsche');

        myComponent.d.person.name.last = 'xxx';
        myComponent.d.person.cars[2] = 'xiaomi';

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('first xxx is 18');
            expect(span.innerHTML).toContain('first xxx is 18 has xiaomi');


            myComponent.d.person.name.first = 'one';
            myComponent.d.person.age = 20;

            san.nextTick(function () {
                var span = wrap.getElementsByTagName('span')[0];
                expect(span.title).toBe('one xxx is 20');
                expect(span.innerHTML).toContain('one xxx is 20 has xiaomi');
                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });

    });

    it("computed has computed dependency, computed item change", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span title="{{msg}}">{{msg}}</span></div>',

            initData: function () {
                return {
                    first: 'first',
                    last: 'last',
                    email: 'name@name.com'
                }
            },

            computed: {
                msg: function () {
                    return this.d.name + '(' + this.d.email + ')'
                },

                name: function () {
                    return this.d.first + ' ' + this.d.last;
                }
            }
        });


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('first last(name@name.com)');

        myComponent.d.last = 'xxx';

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('first xxx(name@name.com)');

            myComponent.d.email = 'whatever@gmail.com';
            san.nextTick(function () {
                var span = wrap.getElementsByTagName('span')[0];
                expect(span.title).toBe('first xxx(whatever@gmail.com)');

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });

    });

    it("computed has computed dependency, normal data change", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span title="{{msg}}">{{msg}}</span></div>',

            initData: function () {
                return {
                    first: 'first',
                    last: 'last',
                    email: 'name@name.com'
                }
            },

            computed: {
                msg: function () {
                    return this.d.name + '(' + this.d.email + ')'
                },

                name: function () {
                    return this.d.first + ' ' + this.d.last;
                }
            }
        });


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('first last(name@name.com)');

        myComponent.d.email = 'san@san.com';

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('first last(san@san.com)');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("computed item compute once when init", function () {
        var nameCount = 0;
        var welcomeCount = 0;
        var textCount = 0;

        var dataChangeCount = 0;
        var fire = san.Data.prototype.fire;
        san.Data.prototype.fire = function (change) {
            dataChangeCount++;
            fire.call(this, change);
        };

        var MyComponent = san.defineComponent({
            template: '<span>{{text}}</span>',

            initData: function() {
                return {
                    realname: 'san',
                    hello: 'hello'
                };
            },

            computed: {
                name: function () {
                    nameCount++;
                    return 'good' + this.d.realname;
                },

                text: function () {
                    textCount++;
                    return this.d.welcome + this.d.name;
                },

                welcome: function () {
                    welcomeCount++;
                    return this.d.hello + ' ';
                }
            }
        })


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(dataChangeCount).toBe(0);
        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML).toBe('hello goodsan');
        expect(nameCount).toBe(1);
        expect(welcomeCount).toBe(1);
        expect(textCount).toBe(1);

        myComponent.dispose();
        document.body.removeChild(wrap);
        san.Data.prototype.fire = fire;
    });

    it("computed, array", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span title="{{name}}">{{text}}</span></div>',

            initData: function () {
                return {
                    person: {
                        name: {
                            'first': 'first',
                            'last': 'last'
                        },

                        cars: ['bmw', 'lexus', 'porsche']
                    }
                }
            },

            computed: {
                name: function () {
                    return this.d.person.name.first + ' ' + this.d.person.name.last;
                },

                text: function () {
                    return this.d.name + ' has ' + this.d.cars[2];
                },

                cars: function () {
                    return this.d.person.cars.map(function (e) {
                        return e.toUpperCase();
                    });
                }
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('first last');
        expect(span.innerHTML).toContain('first last has PORSCHE');

        myComponent.d.person.name.last = 'xxx';
        myComponent.d.person.cars[2] = 'xiaomi';

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('first xxx');
            expect(span.innerHTML).toContain('first xxx has XIAOMI');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    JSON && JSON.stringify && it("computed, json stringify", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span title="{{name.first}}">{{text}}</span></div>',

            initData: function () {
                return {
                    name: {
                        'first': 'first',
                        'last': 'last'
                    }
                }
            },

            computed: {
                text: function () {
                    return JSON.stringify(this.d.name)
                }
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('first');
        expect(span.innerHTML).toContain('"first":"first"');
        expect(span.innerHTML).toContain('"last":"last"');

        myComponent.d.name.o = "other";

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML).toContain('"o":"other"');
            expect(span.innerHTML).toContain('"first":"first"');
            expect(span.innerHTML).toContain('"last":"last"');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    Object.assign && it("computed, object assign", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span title="{{name.first}}">{{name.first}}</span></div>',

            initData: function () {
                return {
                    name: {
                        'first': 'first',
                        'last': 'last'
                    }
                }
            },

            computed: {
                namecp: function () {
                    return Object.assign({}, this.d.name)
                }
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('first');
        var namecp = myComponent.data.get('namecp');
        expect(namecp.first).toBe('first');
        expect(namecp.last).toBe('last');

        myComponent.d.name.o = "other";

        san.nextTick(function () {
            var namecp = myComponent.data.get('namecp');
            expect(namecp.first).toBe('first');
            expect(namecp.o).toBe("other");

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    

    it("computed, array map", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><p s-for="car in lcars">{{car}}</p></div>',

            initData: function () {
                return {
                    cars: ['bmw', 'lexus', 'porsche']
                };
            },

            computed: {
                lcars: function () {
                    return this.d.cars.map(function (e) {
                        return e.toUpperCase();
                    });
                }
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var ps = wrap.getElementsByTagName('p');
        expect(ps.length).toBe(3);
        expect(ps[2].innerHTML).toContain('PORSCHE');

        myComponent.d.cars.push('benz');

        san.nextTick(function () {
            expect(ps.length).toBe(4);
            expect(ps[2].innerHTML).toContain('PORSCHE');
            expect(ps[3].innerHTML).toContain('BENZ');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("computed has data getter in if", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span title="{{name}}">{{text}}</span></div>',
        
            initData: function () {
                return {
                    'childText': 'child',
                    age: 16,
                    adultText: 'adult'
                }
            },
        
            computed: {
                text: function () {
                    var age = this.d.age;
                    if (age < 18) {
                        return this.d.childText;
                    }
                    return this.d.adultText;
                }
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML).toContain('child');

        myComponent.d.age = 19;
        san.nextTick(function () {
            expect(span.innerHTML).toContain('adult');

            myComponent.d.adultText = 'old';
            san.nextTick(function () {
                expect(span.innerHTML).toContain('old');

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it("computed cannot set data", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span title="{{name}}">{{text}}</span></div>',
        
            initData: function () {
                return {
                    'childText': 'child',
                    age: 16,
                    adultText: 'adult'
                }
            },
        
            computed: {
                text: function () {
                    var age = this.d.age;
                    this.d.age = 50;
                    if (age < 18) {
                        return this.d.childText;
                    }
                    return this.d.adultText;
                }
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML).toContain('child');
        expect(myComponent.d.age).toBe(16);

        myComponent.d.age = 19;
        san.nextTick(function () {
            expect(span.innerHTML).toContain('adult');
            expect(myComponent.d.age).toBe(19);

            myComponent.d.adultText = 'old';
            san.nextTick(function () {
                expect(span.innerHTML).toContain('old');

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });
});