it("scoped by default content, access inner data", function (done) {
    // [inject] init

    expect(wrap.getElementsByTagName('p')[0].innerHTML).toBe('errorrik,male,errorrik@gmail.com - tip');
    myComponent.data.set('man.email', 'erik168@163.com');
    myComponent.data.set('tip', 'sb');
    san.nextTick(function () {
        expect(wrap.getElementsByTagName('p')[0].innerHTML).toBe('errorrik,male,erik168@163.com - sb');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});

