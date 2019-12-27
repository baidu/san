it("update attribute", function (done) {
    // [inject] init

    expect(wrap.firstChild.className).toBe('');
    expect(myComponent.data.get('email')).toBe('errorrik@gmail.com');
    expect(myComponent.data.get('name')).toBe('errorrik');
    myComponent.data.set('email', 'erik168@163.com');
    myComponent.data.set('name', 'erik');

    san.nextTick(function () {
        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('erik168@163.com');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    })

});

