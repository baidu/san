it("for render object", function (done) {

    // [inject] init

    var erikHTML = 'erik-errorrik@gmail.com';
    var grayHTML = 'otakustay-otakustay@gmail.com';
    var leeHTML = 'leeight-leeight@gmail.com';

    var lis = wrap.getElementsByTagName('li');

    expect(lis.length).toBe(2);
    expect(lis[0].innerHTML === erikHTML || lis[0].innerHTML === grayHTML).toBeTrurhy();
    expect(lis[1].innerHTML === erikHTML || lis[1].innerHTML === grayHTML).toBeTrurhy();

    myComponent.data.set('persons.leeight', 'leeight@gmail.com');
    myComponent.nextTick(function () {
        var lis = wrap.getElementsByTagName('li');

        expect(lis.length).toBe(3);
        expect(lis[0].innerHTML === erikHTML || lis[0].innerHTML === grayHTML || lis[0].innerHTML === leeHTML).toBeTrurhy();
        expect(lis[1].innerHTML === erikHTML || lis[1].innerHTML === grayHTML || lis[1].innerHTML === leeHTML).toBeTrurhy();
        expect(lis[2].innerHTML === erikHTML || lis[2].innerHTML === grayHTML || lis[2].innerHTML === leeHTML).toBeTrurhy();

        myComponent.data.set('persons.erik', null);
        myComponent.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');

            expect(lis.length).toBe(2);
            expect(lis[0].innerHTML === grayHTML || lis[0].innerHTML === leeHTML).toBeTrurhy();
            expect(lis[1].innerHTML === grayHTML || lis[1].innerHTML === leeHTML).toBeTrurhy();
            expect(lis[2].innerHTML === grayHTML || lis[2].innerHTML === leeHTML).toBeTrurhy();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });
});
