it("render component with san-if, init true, update soon", function (done) {
    // [inject] init

    var dts = wrap.getElementsByTagName('dt');
    expect(dts[0].title).toBe('erik');
    expect(dts[1].title).toBe('firede');

    var dds = wrap.getElementsByTagName('dd');
    var p1lis = dds[1].getElementsByTagName('li');
    expect(p1lis[0].title).toBe('2345678');
    expect(p1lis[1].title).toBe('23456789');

    myComponent.data.set('cond', false);
    myComponent.data.set('persons[1].name', 'leeight');
    myComponent.data.set('persons[1].tels', ['12121212', '16161616', '18181818']);

    san.nextTick(function () {
        var dts = wrap.getElementsByTagName('dt');
        var dds = wrap.getElementsByTagName('dd');
        expect(dts.length).toBe(0);
        expect(dds.length).toBe(0);


        myComponent.data.set('cond', true);

        san.nextTick(function () {
            var dts = wrap.getElementsByTagName('dt');
            expect(dts[0].title).toBe('erik');
            expect(dts[1].title).toBe('leeight');

            var dds = wrap.getElementsByTagName('dd');
            var p1lis = dds[1].getElementsByTagName('li');
            expect(p1lis[0].title).toBe('12121212');
            expect(p1lis[1].title).toBe('16161616');
            expect(p1lis[2].title).toBe('18181818');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });
});

