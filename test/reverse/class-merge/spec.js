it("outer class merge inner class", function (done) {
    // [inject] init

    expect(myComponent.ref('child').el.className).toBe('outer');
    myComponent.ref('child').data.set('clazz', ['inn1', 'inn2']);

    myComponent.nextTick(function () {
        expect(myComponent.ref('child').el.className).toBe('inn1 inn2 outer');
        myComponent.data.set('clazz', '');

        myComponent.nextTick(function () {
            expect(myComponent.ref('child').el.className).toBe('inn1 inn2');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });
});
