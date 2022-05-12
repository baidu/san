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
});
