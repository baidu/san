it("update component, main element has attribute", function (done) {
    // [inject] init

    myComponent.data.set('name', 'erik');
    myComponent.data.set('jokeName', '2bbbbbbb');

    var span = wrap.getElementsByTagName('span')[0];
    expect(span.innerHTML.indexOf('airike') >= 0).toBeTruthy();
    expect(span.title).toBe('airike');

    san.nextTick(function () {
        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML.indexOf('2bbbbbbb') >= 0).toBeTruthy();
        expect(span.title).toBe('2bbbbbbb');


        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });

});

