it("component root el", function (done) {
    // [inject] init

    var as = wrap.getElementsByTagName('a');
    var bs = wrap.getElementsByTagName('b');
    expect(myComponent.el.getElementsByTagName('h3')[0].parentNode).toBe(myComponent.el);
    expect(as.length).toBe(1);
    expect(as[0].innerHTML).toBe('HomePage');
    expect(bs[0].innerHTML).toBe('San');

    myComponent.data.set('linkText', 'github');
    myComponent.data.set('link', 'https://github.com/baidu/san/');
    myComponent.data.set('framework', 'san');
    myComponent.nextTick(function () {
        expect(myComponent.el.getElementsByTagName('h3')[0].parentNode).toBe(myComponent.el);
        var as = wrap.getElementsByTagName('a');
        var bs = wrap.getElementsByTagName('b');
        expect(as.length).toBe(1);
        expect(as[0].innerHTML).toBe('github');
        expect(bs[0].innerHTML).toBe('san');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});
