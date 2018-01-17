it("scoped by given content, access owner data", function (done) {
    // [inject] init

    expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('errorrik');
    expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('male');
    expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('errorrik@gmail.com');
    expect(wrap.getElementsByTagName('a')[0].innerHTML).toBe('tip');
    myComponent.data.set('man.email', 'erik168@163.com');
    myComponent.data.set('desc', 'nonono');
    san.nextTick(function () {

        expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('errorrik');
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('male');
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('erik168@163.com');
        expect(wrap.getElementsByTagName('a')[0].innerHTML).toBe('nonono');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    })
});

