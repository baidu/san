it("set update for, init with many data", function (done) {
    // [inject] init

    myComponent.data.set('persons[0]', {name: 'erik', email: 'erik168@163.com'});

    var lis = wrap.getElementsByTagName('li');
    expect(lis.length).toBe(4);
    expect(lis[1].getAttribute('title')).toBe('errorrik');
    expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);


    san.nextTick(function () {
        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('erik');
        expect(lis[1].innerHTML.indexOf('erik - erik168@163.com')).toBe(0);

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });

});

