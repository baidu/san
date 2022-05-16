describe("TemplateComponent", function () {
    it("as sub component", function (done) {
        var MyTplComponent = san.defineTemplateComponent({
            template: '<span title="{{t}}">{{n}}</span>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-tpl': MyTplComponent
            },
            template: '<a><x-tpl t="{{email}}" n="{{name}}"/></a>'
        });

        
        var myComponent = new MyComponent({
            data: {
                'email': 'errorrik@gmail.com',
                'name': 'errorrik'
            }
        });


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML).toContain('errorrik');
        expect(span.title).toContain('errorrik@gmail.com');

        myComponent.data.set('email', 'erik168@163.com');
        myComponent.data.set('name', 'erik');

        myComponent.nextTick(function () {
            expect(span.innerHTML).toContain('erik');
            expect(span.title).toContain('erik168');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("as root component", function (done) {
        var MyComponent = san.defineTemplateComponent({
            template: '<span title="{{t}}">{{n}}</span>'
        });

        
        var myComponent = new MyComponent({
            data: {
                't': 'errorrik@gmail.com',
                'n': 'errorrik'
            }
        });


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML).toContain('errorrik');
        expect(span.title).toContain('errorrik@gmail.com');

        myComponent.data.set('t', 'erik168@163.com');
        myComponent.data.set('n', 'erik');

        san.nextTick(function () {
            expect(span.innerHTML).toContain('erik');
            expect(span.title).toContain('erik168');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("with slot", function (done) {
        var MyTplComponent = san.defineTemplateComponent({
            template: '<span title="{{t}}"><slot/></span>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-tpl': MyTplComponent
            },
            template: '<a><x-tpl t="{{email}}">{{name}}</x-tpl></a>'
        });

        
        var myComponent = new MyComponent({
            data: {
                'email': 'errorrik@gmail.com',
                'name': 'errorrik'
            }
        });


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML).toContain('errorrik');
        expect(span.title).toContain('errorrik@gmail.com');

        myComponent.data.set('email', 'erik168@163.com');
        myComponent.data.set('name', 'erik');

        myComponent.nextTick(function () {
            expect(span.innerHTML).toContain('erik');
            expect(span.title).toContain('erik168');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("with fragment", function (done) {
        var MyTplComponent = san.defineTemplateComponent({
            template: '<fragment><h3><slot name="title"/></h3><span><slot/></span></fragment>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-tpl': MyTplComponent
            },
            template: '<div><x-tpl><a slot="title">{{name}}</a>{{email}}</x-tpl></div>'
        });

        
        var myComponent = new MyComponent({
            data: {
                'email': 'errorrik@gmail.com',
                'name': 'errorrik'
            }
        });


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        var a = wrap.getElementsByTagName('a')[0];
        expect(a.innerHTML).toContain('errorrik');
        expect(span.innerHTML).toContain('errorrik@gmail.com');

        myComponent.data.set('email', 'erik168@163.com');
        myComponent.data.set('name', 'erik');

        myComponent.nextTick(function () {
            expect(a.innerHTML).toContain('erik');
            expect(span.innerHTML).toContain('erik168');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("merge root element class literal", function (done) {
        var MyTplComponent = san.defineTemplateComponent({
            template: '<span title="{{t}}" class="c">{{n}}</span>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-tpl': MyTplComponent
            },
            template: '<a><x-tpl t="{{email}}" n="{{name}}" class="a b"/></a>'
        });

        
        var myComponent = new MyComponent({
            data: {
                'email': 'errorrik@gmail.com',
                'name': 'errorrik'
            }
        });


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML).toContain('errorrik');
        expect(span.title).toContain('errorrik@gmail.com');
        expect(span.className).toContain('a');
        expect(span.className).toContain('b');
        expect(span.className).toContain('c');

        myComponent.data.set('email', 'erik168@163.com');
        myComponent.data.set('name', 'erik');

        myComponent.nextTick(function () {
            expect(span.innerHTML).toContain('erik');
            expect(span.title).toContain('erik168');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("merge root element class literal", function (done) {
        var MyTplComponent = san.defineTemplateComponent({
            template: '<span title="{{t}}" class="{{xc}}">{{n}}</span>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-tpl': MyTplComponent
            },
            template: '<a><x-tpl t="{{email}}" n="{{name}}" class="{{cla}}" xc="{{xc}}"/></a>'
        });

        
        var myComponent = new MyComponent({
            data: {
                'email': 'errorrik@gmail.com',
                'name': 'errorrik',
                'cla': ['a', 'b'],
                'xc': 'c'
            }
        });


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML).toContain('errorrik');
        expect(span.title).toContain('errorrik@gmail.com');
        expect(span.className).toContain('a');
        expect(span.className).toContain('b');
        expect(span.className).toContain('c');

        myComponent.data.set('email', 'erik168@163.com');
        myComponent.data.set('name', 'erik');
        myComponent.data.set('xc', ['e', 'f']);
        myComponent.data.set('cla', 'g');

        myComponent.nextTick(function () {
            expect(span.innerHTML).toContain('erik');
            expect(span.title).toContain('erik168');
            expect(span.className).not.toContain('a');
            expect(span.className).toContain('e');
            expect(span.className).toContain('f');
            expect(span.className).toContain('g');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("merge root element style literal", function (done) {
        var MyTplComponent = san.defineTemplateComponent({
            template: '<span style="color:blue">test</span>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-tpl': MyTplComponent
            },
            template: '<a><x-tpl style="height:{{h}}"/></a>'
        });

        
        var myComponent = new MyComponent({
            data: {
                h: '10px'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(/color:\s*blue($|;)/i.test(span.style.cssText)).toBeTruthy();
        expect(/height:\s*10px($|;)/i.test(span.style.cssText)).toBeTruthy();

        myComponent.data.set('email', 'erik168@163.com');
        myComponent.data.set('name', 'erik');
        myComponent.data.set('h', '5px');

        myComponent.nextTick(function () {
            expect(/color:\s*blue($|;)/i.test(span.style.cssText)).toBeTruthy();
            expect(/height:\s*5px($|;)/i.test(span.style.cssText)).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("merge root element style, auto expand", function (done) {
        var MyTplComponent = san.defineTemplateComponent({
            template: '<span style="{{xs}}">test</span>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-tpl': MyTplComponent
            },
            template: '<a><x-tpl style="{{sty}}" xs="{{xs}}"/></a>'
        });

        
        var myComponent = new MyComponent({
            data: {
                sty: {
                    height: '10px',
                    position: 'absolute'
                },
                xs: 'color:blue;'
            }
        });


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(/height:\s*10px($|;)/i.test(span.style.cssText)).toBeTruthy();
        expect(/position:\s*absolute($|;)/i.test(span.style.cssText)).toBeTruthy();
        expect(/color:\s*blue($|;)/i.test(span.style.cssText)).toBeTruthy();

        myComponent.data.set('xs', {
            top: '10px',
            position: 'relative'
        });
        myComponent.data.set('sty', 'width: 5px');

        myComponent.nextTick(function () {
            expect(/width:\s*5px($|;)/i.test(span.style.cssText)).toBeTruthy();
            expect(/top:\s*10px($|;)/i.test(span.style.cssText)).toBeTruthy();
            expect(/position:\s*relative($|;)/i.test(span.style.cssText)).toBeTruthy();

            expect(/color/i.test(span.style.cssText)).toBeFalsy();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("initData", function (done) {
        var MyTplComponent = san.defineTemplateComponent({
            template: '<span class="{{c}}">test</span>',

            initData: function () {
                return {
                    c: ['c', 'd']
                }
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-tpl': MyTplComponent
            },
            template: '<a><x-tpl class="{{clz}}"/></a>'
        });

        
        var myComponent = new MyComponent({
            data: {
                'clz': 'a b'
            }
        });


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.className).toContain('a');
        expect(span.className).toContain('b');
        expect(span.className).toContain('c');
        expect(span.className).toContain('d');

        myComponent.data.set('clz', ['e']);

        myComponent.nextTick(function () {
            expect(span.className).toContain('e');
            expect(span.className).not.toContain('b');
            expect(span.className).toContain('c');
            expect(span.className).toContain('d');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("root element with if, has data when inited", function (done) {
        var MyTplComponent = san.defineTemplateComponent({
            template: '<b s-if="person">{{person.name}}</b>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-tpl': MyTplComponent
            },
            template: '<x-tpl person="{{person}}"/>'
        })

        var myComponent = new MyComponent({
            data: {
                person: {
                    name: 'errorrik'
                }
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('b').length).toBe(1);

        var b = wrap.getElementsByTagName('b')[0];
        expect(b.innerHTML).toBe('errorrik');


        myComponent.data.set('person', null);
        myComponent.nextTick(function () {
            expect(wrap.getElementsByTagName('b').length).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("root element with if, no data when inited", function (done) {
        var MyTplComponent = san.defineTemplateComponent({
            template: '<b s-if="person">{{person.name}}</b>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-tpl': MyTplComponent
            },
            template: '<x-tpl person="{{person}}"/>'
        })

        var myComponent = new MyComponent({});

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('b').length).toBe(0);

        myComponent.data.set('person', {
            name: 'errorrik'
        });
        myComponent.nextTick(function () {
            expect(wrap.getElementsByTagName('b').length).toBe(1);

            var b = wrap.getElementsByTagName('b')[0];
            expect(b.innerHTML).toBe('errorrik');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("native bind click", function (done) {
        var clicked = 0;
        var ChildComponent = san.defineTemplateComponent({
            template: '<h2>child</h2>'
        });

        var MyComponent = san.defineComponent({
            template:
            '<div>' +
                '<child-component on-click="native:clicker"></child-component>' +
                '<child-component></child-component>' +
            '</div>',
            components: {
                'child-component': ChildComponent
            },
            clicker: function (event) {
                expect(event.target || event.srcElement).toBe(nativeChildEl);
                clicked += 1;
            }
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var h2s = wrap.getElementsByTagName('h2');
        var nativeChildEl = h2s[0];
        var childEl = h2s[1];

        function doneSpec() {
            if (clicked === 1) {
                myComponent.dispose();
                document.body.removeChild(wrap);
                done();

                return;
            }
            setTimeout(doneSpec, 500);
        }

        // 两次点击，期望只有第一次nativeEvent的点击生效
        triggerEvent(nativeChildEl, 'click');
        triggerEvent(childEl, 'click');
        doneSpec();
    });
});
