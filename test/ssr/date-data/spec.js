it("date data", function (done) {
    // [inject] init

    var b = wrap.getElementsByTagName('b')[0];
    expect(b.title).toBe('1983');

    myComponent.data.set('date', new Date(1984, 10, 10));

    san.nextTick(function () {
        var b = wrap.getElementsByTagName('b')[0];
        expect(b.title).toBe('1984');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});

