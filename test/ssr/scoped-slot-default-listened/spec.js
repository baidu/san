it("scoped slot by default content has event listen", function (done) {
    var clickInfo = {};
    // [inject] init

    expect(wrap.getElementsByTagName('p')[0].innerHTML).toBe('errorrik,male,errorrik@gmail.com');
    myComponent.data.set('man.email', 'erik168@163.com');
    san.nextTick(function () {
        expect(wrap.getElementsByTagName('p')[0].innerHTML).toBe('errorrik,male,erik168@163.com');

        triggerEvent(wrap.getElementsByTagName('p')[0], 'click');
        setTimeout(function () {
            expect(clickInfo.email).toBe('erik168@163.com');
            expect(clickInfo.outer).toBeFalsy();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        }, 500);
    })
});

