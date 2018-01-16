it("update multi elif, init with mid elif", function (done) {
    // [inject] init

    var spans = wrap.getElementsByTagName('span');
    expect(spans.length).toBe(1);
    expect(spans[0].title).toBe('big');
    expect(wrap.getElementsByTagName('b').length).toBe(0);

    myComponent.data.set('num', 30000);

    san.nextTick(function () {
        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);
        expect(spans[0].title).toBe('biiig');
        expect(wrap.getElementsByTagName('b').length).toBe(0);

        myComponent.data.set('num', 10);
        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(0);
            var bs = wrap.getElementsByTagName('b');
            expect(bs[0].title).toBe('small');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });
});

