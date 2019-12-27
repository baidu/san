it("render list with template, template has no sibling, pop and unshift soon", function (done) {
    // [inject] init

    var h4s = wrap.getElementsByTagName('h4');
    var ps = wrap.getElementsByTagName('p');

    expect(h4s.length).toBe(2);
    expect(ps.length).toBe(2);

    expect(h4s[0].innerHTML).toBe('otakustay');
    expect(ps[0].innerHTML).toBe('otakustay@gmail.com');
    expect(h4s[1].innerHTML).toBe('errorrik');
    expect(ps[1].innerHTML).toBe('errorrik@gmail.com');


    myComponent.data.pop('persons');
    san.nextTick(function () {
        var h4s = wrap.getElementsByTagName('h4');
        var ps = wrap.getElementsByTagName('p');
        expect(h4s.length).toBe(1);
        expect(ps.length).toBe(1);


        expect(h4s[0].innerHTML).toBe('otakustay');
        expect(ps[0].innerHTML).toBe('otakustay@gmail.com');


        myComponent.data.unshift('persons', {name: 'errorrik', email: 'errorrik@gmail.com'});
        san.nextTick(function () {
            expect(h4s[0].innerHTML).toBe('errorrik');
            expect(ps[0].innerHTML).toBe('errorrik@gmail.com');

            expect(h4s[1].innerHTML).toBe('otakustay');
            expect(ps[1].innerHTML).toBe('otakustay@gmail.com');


            expect(h4s.length).toBe(2);
            expect(ps.length).toBe(2);
            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });
});

