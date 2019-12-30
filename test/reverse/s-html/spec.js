it("s-html", function (done) {
    // [inject] init

    expect(/^aa<a>bbb<\/a>cc/i.test(wrap.getElementsByTagName('b')[0].innerHTML)).toBeTruthy();
    myComponent.data.set('html', 'uu<u>xxx</u>yy');

    san.nextTick(function () {
        expect(/^uu<u>xxx<\/u>yy/i.test(wrap.getElementsByTagName('b')[0].innerHTML)).toBeTruthy();

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});

