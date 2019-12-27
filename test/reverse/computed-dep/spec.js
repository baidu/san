it("computed data has dependencies", function (done) {
    // [inject] init

    var b = wrap.getElementsByTagName('b')[0];
    var a = wrap.getElementsByTagName('a')[0];
    var u = wrap.getElementsByTagName('u')[0];

    expect(b.innerHTML).toBe('11');
    expect(a.innerHTML).toBe('9');
    expect(u.innerHTML).toBe('10');

    myComponent.data.set('num', 5);

    san.nextTick(function () {
        expect(b.innerHTML).toBe('6');
        expect(a.innerHTML).toBe('4');
        expect(u.innerHTML).toBe('5');

        myComponent.dispose();
        document.body.removeChild(wrap);

        done();
    })
});

