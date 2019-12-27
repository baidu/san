it("render list with template, template has no sibling, no data, set soon", function (done) {
    // [inject] init

    var h4s = wrap.getElementsByTagName('h4');
    var ps = wrap.getElementsByTagName('p');

    expect(h4s.length).toBe(0);
    expect(ps.length).toBe(0);

    myComponent.data.set('persons', [
        {name: 'otakustay', email: 'otakustay@gmail.com'},
        {name: 'errorrik', email: 'errorrik@gmail.com'}
    ]);

    san.nextTick(function () {
        var h4s = wrap.getElementsByTagName('h4');
        var ps = wrap.getElementsByTagName('p');
        expect(h4s.length).toBe(2);
        expect(ps.length).toBe(2);

        expect(h4s[0].innerHTML).toBe('otakustay');
        expect(ps[0].innerHTML).toBe('otakustay@gmail.com');
        expect(h4s[1].innerHTML).toBe('errorrik');
        expect(ps[1].innerHTML).toBe('errorrik@gmail.com');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});

