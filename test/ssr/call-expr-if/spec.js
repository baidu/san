
it("if directive with call expr", function (done) {

    // [inject] init

    expect(wrap.getElementsByTagName('u').length).toBe(0);
    expect(wrap.getElementsByTagName('b').length).toBe(1);

    myComponent.data.set('time', 16);
    san.nextTick(function () {

        expect(wrap.getElementsByTagName('u').length).toBe(1);
        expect(wrap.getElementsByTagName('b').length).toBe(0);
        myComponent.data.set('time', 19);

        san.nextTick(function () {
            expect(wrap.getElementsByTagName('u').length).toBe(0);
            expect(wrap.getElementsByTagName('b').length).toBe(1);

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });
});
