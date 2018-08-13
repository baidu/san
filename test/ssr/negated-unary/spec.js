it("negated-unary expr", function (done) {
    // [inject] init

    var u = wrap.getElementsByTagName('u')[0];
    expect(u.innerHTML).toBe('1');

    myComponent.data.set('num1', 14);
    san.nextTick(function () {
        expect(u.innerHTML).toBe('-2');

        myComponent.dispose();
        document.body.removeChild(wrap);

        done();
    });
});
