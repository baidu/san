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
});
