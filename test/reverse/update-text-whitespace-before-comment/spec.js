it("update text", function (done) {
    // [inject] init


    expect(myComponent.data.get('email')).toBe('errorrik@gmail.com');
    expect(myComponent.data.get('name')).toBe('errorrik');
    myComponent.data.set('email', 'erik168@163.com');
    myComponent.data.set('name', 'erik');

    san.nextTick(function () {
        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML.indexOf('erik')).toBe(0);
        expect(span.title.indexOf('erik168@163.com')).toBe(0);

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    })

});

