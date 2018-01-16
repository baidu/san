it("computed data", function (done) {
    // [inject] init

    var b = wrap.getElementsByTagName('b')[0];

    expect(b.title).toBe('real1');

    myComponent.data.set('title', '2');

    san.nextTick(function () {
        expect(b.title).toBe('real2');

        myComponent.dispose();
        document.body.removeChild(wrap);

        done();
    })
});

