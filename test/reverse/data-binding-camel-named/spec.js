it("data binding name auto camel case", function (done) {
    // [inject] init

    var span = wrap.getElementsByTagName('span')[0];

    expect(span.title).toBe('1');
    expect(span.innerHTML.indexOf('one') === 0).toBeTruthy();

    myComponent.data.set('title', '2');
    myComponent.data.set('text', 'two');

    san.nextTick(function () {
        expect(span.title).toBe('2');
        expect(span.innerHTML.indexOf('two') === 0).toBeTruthy();

        myComponent.dispose();
        document.body.removeChild(wrap);

        done();
    })
});

