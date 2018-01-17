it("update elif, init with all false", function (done) {
    // [inject] init

    var spans = wrap.getElementsByTagName('span');
    expect(spans.length).toBe(0);

    myComponent.data.set('cond2', true);

    san.nextTick(function () {
        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);
        expect(spans[0].title).toBe('leeight');

        myComponent.data.set('cond1', true);
        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);
            expect(spans[0].title).toBe('errorrik');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });
});

