
it("content attr with only one expr interp", function (done) {
    // [inject] init

    expect(myComponent.el.hasAttribute('undef')).toBeFalsy();
    expect(myComponent.el.hasAttribute('nul')).toBeFalsy();
    expect(myComponent.el.hasAttribute('falsy')).toBeTruthy();
    expect(myComponent.el.hasAttribute('estr')).toBeTruthy();
    expect(myComponent.el.getAttribute('falsy')).toBe('false');
    expect(myComponent.el.getAttribute('estr')).toBe('');
    expect(myComponent.el.getAttribute('zero')).toBe('0');

    myComponent.data.set('nul', '');
    myComponent.data.set('undef', '');
    myComponent.nextTick(function () {
        expect(myComponent.el.hasAttribute('undef')).toBeTruthy();
        expect(myComponent.el.hasAttribute('nul')).toBeTruthy();
        expect(myComponent.el.getAttribute('undef')).toBe('');
        expect(myComponent.el.getAttribute('nul')).toBe('');

        var undef;
        myComponent.data.set('nul', null);
        myComponent.data.set('undef', undef);

        myComponent.nextTick(function () {
            expect(myComponent.el.hasAttribute('undef')).toBeFalsy();
            expect(myComponent.el.hasAttribute('nul')).toBeFalsy();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });
});

