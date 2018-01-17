it("default and named slot", function (done) {
    // [inject] init

    var u = wrap.getElementsByTagName('u')[0];
    var p = wrap.getElementsByTagName('p')[0];
    var h3 = wrap.getElementsByTagName('h3')[0];
    expect(u.title).toBe('tab');
    expect(p.title).toBe('one');
    expect(h3.title).toBe('1');

    myComponent.data.set('tabText', 'ctab');
    myComponent.data.set('text', 'two');
    myComponent.data.set('title', '2');

    san.nextTick(function () {
        expect(u.title).toBe('ctab');
        expect(p.title).toBe('two');
        expect(h3.title).toBe('2');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});

