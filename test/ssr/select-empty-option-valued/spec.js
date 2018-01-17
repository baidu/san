it("select, null and undefined should select empty option, init valued", function (done) {
    // [inject] init

    var select = wrap.getElementsByTagName('select')[0];

    expect(select.selectedIndex).toBe(1);
    expect(select.value).toBe('firede');
    myComponent.data.set('online', null);

    san.nextTick(function () {
        var select = wrap.getElementsByTagName('select')[0];

        expect(select.selectedIndex).toBe(2);
        expect(select.value).toBe('');
        expect(wrap.getElementsByTagName('b')[0].title).toBe('');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});

