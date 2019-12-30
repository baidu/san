it("update component, merge init data and given data", function (done) {
    // [inject] init

    var span = wrap.getElementsByTagName('span')[0];
    expect(span.innerHTML.indexOf('airike') >= 0).toBeTruthy();
    expect(span.title).toBe('title');
    var a = wrap.getElementsByTagName('a')[0];
    expect(a.title).toBe('none');
    var u = wrap.getElementsByTagName('u')[0];
    expect(u.title).toBe('bidu');

    myComponent.data.set('school', 'hainan-mid');
    myComponent.data.set('jokeName', '2bbbbbbb');

    san.nextTick(function () {
        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML.indexOf('2bbbbbbb') >= 0).toBeTruthy();
        expect(span.title).toBe('title');
        var a = wrap.getElementsByTagName('a')[0];
        expect(a.title).toBe('hainan-mid');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });

});

