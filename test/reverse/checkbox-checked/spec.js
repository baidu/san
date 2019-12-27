it("checkbox checked", function (done) {
    // [inject] init

    var inputs = wrap.getElementsByTagName('input');
    expect(inputs[0].checked).toBeFalsy();
    expect(inputs[1].checked).toBeTruthy();
    expect(inputs[2].checked).toBeTruthy();

    myComponent.data.set('cValue', ['1']);

    san.nextTick(function () {
        var inputs = wrap.getElementsByTagName('input');
        expect(inputs[0].checked).toBeTruthy();
        expect(inputs[1].checked).toBeFalsy();
        expect(inputs[2].checked).toBeFalsy();

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});

