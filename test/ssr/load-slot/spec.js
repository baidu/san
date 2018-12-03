
it("ComponentLoader with s-if", function (done) {
    // [inject] init

    var a = wrap.getElementsByTagName('a')[0];

    expect(a.getElementsByTagName('u').length).toBe(0);
    expect(a.getElementsByTagName('b').length).toBe(1);
    expect(a.getElementsByTagName('b')[0].innerHTML).toContain('Hello San');

    setTimeout(function () {
        expect(a.getElementsByTagName('u').length).toBe(1);
        expect(a.getElementsByTagName('u')[0].innerHTML).toContain('Hello San');

        expect(a.getElementsByTagName('b').length).toBe(0);

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    }, 500);

});
