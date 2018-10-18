
it("call expr eval with component instance this", function (done) {
    // [inject] init

    expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('result 28');

    myComponent.data.set('base', 0);
    san.nextTick(function () {
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('result 12');
        myComponent.data.set('num', 10);

        san.nextTick(function () {
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('result 20');
            myComponent.data.set('base', -5);

            san.nextTick(function () {
                expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('result 260');
                myComponent.dispose();
                document.body.removeChild(wrap);

                done();
            });
        });
    });
});
