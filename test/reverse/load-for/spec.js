
it("ComponentLoader with s-for", function (done) {
    // [inject] init

    expect(wrap.getElementsByTagName('li').length).toBe(3);
    expect(wrap.getElementsByTagName('b').length).toBe(0);
    expect(loadInvokeCount).toBe(1);

    myComponent.nextTick(function () {
        loadSuccess(LI);
    });

    setTimeout(function () {
        expect(wrap.getElementsByTagName('li').length).toBe(3);
        expect(wrap.getElementsByTagName('b').length).toBe(3);
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toContain('Hello yi');
        expect(wrap.getElementsByTagName('b')[1].innerHTML).toContain('Hello er');
        expect(wrap.getElementsByTagName('b')[2].innerHTML).toContain('Hello san');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    }, 500);

});
