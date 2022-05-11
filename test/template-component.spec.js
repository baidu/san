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
});
