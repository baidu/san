it("scoped slot by default content which has filter", function (done) {
    // [inject] init

    expect(wrap.getElementsByTagName('p')[0].innerHTML).toContain('Errorrik,Male,Errorrik@gmail.com');
    myComponent.data.set('man.email', 'erik168@163.com');
    san.nextTick(function () {
        expect(wrap.getElementsByTagName('p')[0].innerHTML).toContain('Errorrik,Male,Erik168@163.com');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});

