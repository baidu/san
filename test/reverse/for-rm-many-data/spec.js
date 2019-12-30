it("remove update for, init with many data", function (done) {
    // [inject] init

    myComponent.data.removeAt('persons', 0);

    var lis = wrap.getElementsByTagName('li');
    expect(lis.length).toBe(4);
    expect(lis[1].getAttribute('title')).toBe('errorrik');
    expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);


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


