it("component fill slot", function (done) {
    // [inject] init


    var input = wrap.getElementsByTagName('input')[0];
    expect(input.value).toBe('er');
    expect(wrap.getElementsByTagName('b')[0].title).toBe('er');

    myComponent.data.set('searchValue', 'san');

    san.nextTick(function () {
        var input = wrap.getElementsByTagName('input')[0];
        expect(input.value).toBe('san');
        expect(wrap.getElementsByTagName('b')[0].title).toBe('san');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});

