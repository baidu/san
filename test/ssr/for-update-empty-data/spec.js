it("update for, init with empty data", function (done) {
    // [inject] init

    var lis = wrap.getElementsByTagName('li');
    expect(lis.length).toBe(2);

    myComponent.data.push('persons',
        {name: 'otakustay', email: 'otakustay@gmail.com'}
    );

    san.nextTick(function () {
        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(3);
        expect(lis[1].getAttribute('title')).toBe('otakustay');
        expect(lis[1].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });

});

