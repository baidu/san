it("option selected", function (done) {
    // [inject] init

    var select = wrap.getElementsByTagName('select')[0];
    expect(select.selectedIndex).toBe(1);

    myComponent.data.set('online', 'otakustay');

    san.nextTick(function () {
        var select = wrap.getElementsByTagName('select')[0];
        expect(select.selectedIndex).toBe(2);

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});

