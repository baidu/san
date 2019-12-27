it("given undefined data dont reset initData", function (done) {
    // [inject] init

    expect(myComponent.getFooValue()).toBe('foo');
    expect(wrap.getElementsByTagName('u')[0].innerHTML.indexOf('foo') >= 0).toBeTruthy();
    myComponent.data.set('formData', {foo: 'bar'});

    san.nextTick(function () {
        expect(myComponent.getFooValue()).toBe('bar');
        expect(wrap.getElementsByTagName('u')[0].innerHTML.indexOf('bar') >= 0).toBeTruthy();
        done();
        document.body.removeChild(wrap);
    });
});
