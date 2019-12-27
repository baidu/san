it("array literal with spread", function (done) {
    // [inject] init

    var lis = wrap.getElementsByTagName('li');
    expect(lis.length).toBe(3);

    expect(lis[0].innerHTML).toBe('1');
    expect(lis[1].innerHTML).toBe('true');
    expect(lis[2].innerHTML).toBe('erik');
    myComponent.data.set('ext', [3, 4]);
    myComponent.data.set('ext2', [5, 6]);
    san.nextTick(function () {
        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(7);

        expect(lis[0].innerHTML).toBe('1');
        expect(lis[1].innerHTML).toBe('true');
        expect(lis[4].innerHTML).toBe('erik');
        expect(lis[2].innerHTML).toBe('3');
        expect(lis[3].innerHTML).toBe('4');

        expect(lis[5].innerHTML).toBe('5');
        expect(lis[6].innerHTML).toBe('6');

        myComponent.dispose();
        document.body.removeChild(wrap);

        done();
    });
});
