it("bool attr twoway binding, init false", function (done) {
    // [inject] init

    expect(wrap.getElementsByTagName('button')[0].disabled).toBeFalsy();
    myComponent.data.set('distate', true);

    san.nextTick(function () {
        expect(wrap.getElementsByTagName('button')[0].disabled).toBeTruthy();

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});

