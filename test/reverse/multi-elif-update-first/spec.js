it("update multi elif, init with first if", function (done) {
    // [inject] init


    var spans = wrap.getElementsByTagName('span');
    expect(spans.length).toBe(1);
    expect(spans[0].title).toBe('biiig');
    expect(wrap.getElementsByTagName('b').length).toBe(0);

    myComponent.data.set('num', 30);

    san.nextTick(function () {
        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(0);
        var bs = wrap.getElementsByTagName('b');
        expect(bs[0].title).toBe('small');

        myComponent.data.set('num', 3000);
        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);
            expect(spans[0].title).toBe('biig');
            expect(wrap.getElementsByTagName('b').length).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });
});

