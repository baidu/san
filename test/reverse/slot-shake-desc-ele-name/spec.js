it("dynamic slot name description and dynamic name in given slot element", function (done) {
    // [inject] init

    var bs = wrap.getElementsByTagName('b');
    expect(bs.length).toBe(4);
    expect(bs[0].innerHTML).toBe('Justineo');
    expect(bs[1].innerHTML).toBe('errorrik');
    expect(bs[2].innerHTML).toBe('otakustay@gmail.com');
    expect(bs[3].innerHTML).toBe('leeight@gmail.com');

    var lis = wrap.getElementsByTagName('li');
    expect(lis.length).toBe(8);
    expect(lis[1].innerHTML).toContain('justineo@gmail.com');
    expect(lis[3].innerHTML).toContain('errorrik@gmail.com');
    expect(lis[4].innerHTML).toContain('otakustay');
    expect(lis[6].innerHTML).toContain('leeight');

    myComponent.data.set('deps[0].strong', 'email');
    myComponent.data.pop('deps[0].members');
    myComponent.data.push('deps[1].members', {name: 'who', email: 'areyou@gmail.com'});

    myComponent.nextTick(function () {
        var bs = wrap.getElementsByTagName('b');
        expect(bs.length).toBe(4);
        expect(bs[0].innerHTML).toContain('justineo@gmail.com');
        expect(bs[0].getAttribute('slot') == null).toBeTruthy();
        expect(bs[1].innerHTML).toContain('otakustay@gmail.com');
        expect(bs[2].innerHTML).toContain('leeight@gmail.com');
        expect(bs[3].innerHTML).toContain('areyou@gmail.com');

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(8);
        expect(lis[0].innerHTML).toContain('Justineo');
        expect(lis[2].innerHTML).toContain('otakustay');
        expect(lis[4].innerHTML).toContain('leeight');
        expect(lis[6].innerHTML).toContain('who');

        myComponent.data.set('deps[1].columns', [
            {name: 'email', label: '邮'},
            {name: 'name', label: '名'}
        ]);

        myComponent.nextTick(function () {
            var bs = wrap.getElementsByTagName('b');
            expect(bs.length).toBe(4);
            expect(bs[0].innerHTML).toBe('justineo@gmail.com');
            expect(bs[0].getAttribute('slot') == null).toBeTruthy();
            expect(bs[1].innerHTML).toBe('otakustay@gmail.com');
            expect(bs[2].innerHTML).toBe('leeight@gmail.com');
            expect(bs[3].innerHTML).toBe('areyou@gmail.com');

            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(8);
            expect(lis[0].innerHTML).toContain('Justineo');
            expect(lis[3].innerHTML).toContain('otakustay');
            expect(lis[5].innerHTML).toContain('leeight');
            expect(lis[7].innerHTML).toContain('who');

            myComponent.data.set('deps[1].strong', 'name');

            myComponent.nextTick(function () {
                var bs = wrap.getElementsByTagName('b');
                expect(bs.length).toBe(4);
                expect(bs[0].innerHTML).toBe('justineo@gmail.com');
                expect(bs[0].getAttribute('slot') == null).toBeTruthy();
                expect(bs[1].innerHTML).toBe('otakustay');
                expect(bs[2].innerHTML).toBe('leeight');
                expect(bs[3].innerHTML).toBe('who');

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });
});

