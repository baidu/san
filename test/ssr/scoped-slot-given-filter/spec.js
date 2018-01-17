it("scoped slot by given content which has filter", function (done) {
    // [inject] init

    expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('ERRORRIK');
    expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('MALE');
    expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('ERRORRIK@GMAIL.COM');
    myComponent.data.set('man.email', 'erik168@163.com');
    san.nextTick(function () {

        expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('ERRORRIK');
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('MALE');
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('ERIK168@163.COM');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    })
});

