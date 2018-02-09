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

        expect(a.innerHTML).toContain('test');
        expect(a.innerHTML).toContain('aaaa');
        expect(/<\/p>hellosan/i.test(a.innerHTML)).toBeTruthy();
        expect(/hellosan<p/i.test(a.innerHTML)).toBeTruthy();
        myComponent.data.set('name', 'ByeER');

        san.nextTick(function () {
            expect(/<\/p>byeer/i.test(a.innerHTML)).toBeTruthy();
            expect(/byeer<p/i.test(a.innerHTML)).toBeTruthy();
            expect(a.innerHTML).toContain('test');
            expect(a.innerHTML).toContain('aaaa');

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
            expect(/<\/p>byeer/i.test(a.innerHTML)).toBeTruthy();
            expect(/byeer<p/i.test(a.innerHTML)).toBeTruthy();
            expect(a.innerHTML).toContain('test');
            expect(a.innerHTML).toContain('aaaa');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });
});
