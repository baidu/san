it("nest for", function (done) {
    // [inject] init

    var labels = wrap.getElementsByTagName('label');
    expect(labels.length).toBe(6);
    expect(labels[5].innerHTML).toBe('6');
    expect(labels[3].innerHTML).toBe('4');
    expect(labels[1].innerHTML).toBe('2');
    myComponent.data.set('forms.bar', [8,9]);
    san.nextTick(function () {
        var labels = wrap.getElementsByTagName('label');
        expect(labels.length).toBe(5);
        expect(labels[4].innerHTML).toBe('9');
        expect(labels[3].innerHTML).toBe('8');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});

