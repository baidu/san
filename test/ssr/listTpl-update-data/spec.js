it("render list with template, init false, update soon", function (done) {
    // [inject] init

    var h4s = wrap.getElementsByTagName('h4');
    var ps = wrap.getElementsByTagName('p');
    expect(h4s.length).toBe(0);
    expect(ps.length).toBe(0);
    myComponent.data.set('cond', true);

    san.nextTick(function () {

        var h4s = wrap.getElementsByTagName('h4');
        var ps = wrap.getElementsByTagName('p');
        expect(h4s.length).toBe(2);
        expect(ps.length).toBe(2);
        expect(h4s[0].innerHTML).toBe('errorrik');
        expect(h4s[1].innerHTML).toBe('varsha');
        expect(ps[0].innerHTML).toBe('errorrik@gmail.com');
        expect(ps[1].innerHTML).toBe('wangshuonpu@163.com');

        myComponent.data.unshift('persons', {name: 'otakustay', email: 'otakustay@gmail.com'});

        san.nextTick(function () {
            var h4s = wrap.getElementsByTagName('h4');
            var ps = wrap.getElementsByTagName('p');
            expect(h4s.length).toBe(3);
            expect(ps.length).toBe(3);
            expect(h4s[0].innerHTML).toBe('otakustay');
            expect(h4s[1].innerHTML).toBe('errorrik');
            expect(h4s[2].innerHTML).toBe('varsha');
            expect(ps[1].innerHTML).toBe('errorrik@gmail.com');
            expect(ps[2].innerHTML).toBe('wangshuonpu@163.com');
            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });
});

