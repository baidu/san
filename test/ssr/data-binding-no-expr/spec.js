it("data binding no expr, auto true", function (done) {
    // [inject] init

    var us = wrap.getElementsByTagName('u');

    expect(us.length).toBe(1);
    expect(myComponent.ref('l').data.get('hasu')).toBeTruthy();

    san.nextTick(function () {
        myComponent.dispose();
        document.body.removeChild(wrap);

        done();
    })
});

