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
});
