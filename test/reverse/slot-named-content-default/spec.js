it("default and named slot, content by default", function (done) {
    // [inject] init

    var p = wrap.getElementsByTagName('p')[0];
    var h3 = wrap.getElementsByTagName('h3')[0];
    expect(p.title).toBe('five');
    expect(h3.title).toBe('5');

    myComponent.data.set('text', 'two');
    myComponent.data.set('title', '2');
    myComponent.data.set('tText', 'six');
    myComponent.data.set('tTitle', '6');

    san.nextTick(function () {
        expect(p.title).toBe('six');
        expect(h3.title).toBe('6');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});

