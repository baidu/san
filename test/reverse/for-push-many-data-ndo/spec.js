it("push update for, init with many data, no ouput data in html", function (done) {
    // [inject] init

    var lis = wrap.getElementsByTagName('li');
    expect(lis.length).toBe(4);
    expect(lis[1].getAttribute('title')).toBe('errorrik');
    expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);

    myComponent.data.push('persons',
        {name: 'otakustay', email: 'otakustay@gmail.com'}
    );

    san.nextTick(function () {
        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(5);
        expect(lis[3].getAttribute('title')).toBe('otakustay');
        expect(lis[3].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });

});


