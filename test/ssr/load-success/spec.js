
it("ComponentLoader loaded by promise resolved", function (done) {
    // [inject] init

    expect(wrap.getElementsByTagName('u').length).toBe(0);

    setTimeout(function () {
        expect(wrap.getElementsByTagName('u').length).toBe(1);
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('Hello San');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    }, 500);

});
