it("update else, init with false", function (done) {
    // [inject] init

    myComponent.data.set('cond', true);
    var spans = wrap.getElementsByTagName('span');
    expect(spans.length).toBe(1);
    expect(spans[0].title).toBe('otakustay');
    expect(spans[0].innerHTML.indexOf('otakustay')).toBe(0);


    san.nextTick(function () {
        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);
        expect(spans[0].title).toBe('errorrik');
        expect(spans[0].innerHTML.indexOf('errorrik')).toBe(0);

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});

