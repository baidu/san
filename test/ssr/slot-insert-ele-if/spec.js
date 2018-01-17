it("slot insert element 'template' apply if", function (done) {
    // [inject] init

    var ps = wrap.getElementsByTagName('p');
    var h2s = wrap.getElementsByTagName('h2');
    var h3s = wrap.getElementsByTagName('h3');
    var h4s = wrap.getElementsByTagName('h4');
    var h5s = wrap.getElementsByTagName('h5');

    expect(ps[0].innerHTML).toBe('300');
    expect(h2s.length).toBe(0);
    expect(h3s.length).toBe(0);
    expect(h4s.length).toBe(1);
    expect(h5s.length).toBe(0);

    myComponent.data.set('num', 30000);

    san.nextTick(function () {

        expect(ps[0].innerHTML).toBe('30000');
        expect(h2s.length).toBe(1);
        expect(h3s.length).toBe(0);
        expect(h4s.length).toBe(0);
        expect(h5s.length).toBe(0);

        myComponent.data.set('num', 10);
        san.nextTick(function () {

            expect(ps[0].innerHTML).toBe('10');
            expect(h2s.length).toBe(0);
            expect(h3s.length).toBe(0);
            expect(h4s.length).toBe(0);
            expect(h5s.length).toBe(1);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });
});

