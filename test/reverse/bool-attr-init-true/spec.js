it("bool attr, init true", function (done) {
    // [inject] init

    expect(wrap.getElementsByTagName('button')[0].disabled).toBeTruthy();
    myComponent.data.set('distate', false);

    san.nextTick(function () {
        expect(wrap.getElementsByTagName('button')[0].disabled).toBeFalsy();

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});


