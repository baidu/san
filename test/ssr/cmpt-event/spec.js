it("component event", function (done) {
    // [inject] init

    var span = wrap.getElementsByTagName('span')[0];
    expect(myComponent.data.get('title')).toBe('1');
    expect(span.title).toBe('1');

    setTimeout(function () {
        expect(myComponent.data.get('title')).toBe('1test');
        expect(span.title).toBe('1test');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    }, 200);
});

