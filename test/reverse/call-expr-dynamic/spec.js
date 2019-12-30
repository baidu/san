

it("call expr with dynamic name accessor", function (done) {
    // [inject] init

    expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('result 8');

    myComponent.data.set('isUp', 0);
    san.nextTick(function () {
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('result 2');
        myComponent.data.set('num1', 10);

        san.nextTick(function () {
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('result 7');
            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });
});
