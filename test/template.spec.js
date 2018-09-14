describe("Template Tag", function () {

    it("has text sibling，mix inner text node", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a>test<template>{{name}}<p>ppp</p>{{name}}</template>aaaa</a>'
        });

        var myComponent = new MyComponent({
            data: {
                name: 'HelloSan'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var a = wrap.getElementsByTagName('a')[0];

        var html = a.innerHTML.toLowerCase();
        expect(html).toContain('test');
        expect(html).toContain('aaaa');

        expect(/<\/p>\s*hellosan/i.test(html)).toBeTruthy();
        expect(/hellosan\s*<p/i.test(html)).toBeTruthy();
        myComponent.data.set('name', 'ByeER');

        san.nextTick(function () {

            var html = a.innerHTML.toLowerCase();
            expect(/<\/p>\s*byeer/i.test(html)).toBeTruthy();
            expect(/byeer\s*<p/i.test(html)).toBeTruthy();
            expect(html).toContain('test');
            expect(html).toContain('aaaa');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });


    it("has text sibling，mix inner text node, init with empty string", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a>test<template>{{name}}<p>ppp</p>{{name}}</template>aaaa</a>'
        });

        var myComponent = new MyComponent({
            data: {
                name: ''
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var a = wrap.getElementsByTagName('a')[0];

        expect(a.innerHTML).toContain('test');
        expect(a.innerHTML).toContain('aaaa');
        myComponent.data.set('name', 'ByeER');

        san.nextTick(function () {
            var html = a.innerHTML.toLowerCase();
            expect(/<\/p>\s*byeer/i.test(html)).toBeTruthy();
            expect(/byeer\s*<p/i.test(html)).toBeTruthy();

            expect(html).toContain('test');
            expect(html).toContain('aaaa');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("with if", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><u>Hello {{name}}!</u><template s-if="num">11111</template> <template s-else>22222</template></div>'
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.innerHTML).toContain('22222');
        expect(wrap.innerHTML).not.toContain('11111');
        myComponent.data.set('num', 100);

        san.nextTick(function () {
            expect(wrap.innerHTML).not.toContain('22222');
            expect(wrap.innerHTML).toContain('11111');

            myComponent.data.set('num', 0);

            san.nextTick(function () {
                expect(wrap.innerHTML).toContain('22222');
                expect(wrap.innerHTML).not.toContain('11111');

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            })
        });
    });
});
