it("complex structure in textnode", function (done) {
    // [inject] init

    var a = wrap.getElementsByTagName('a')[0];
    var b = wrap.getElementsByTagName('b')[0];
    expect(/\/span>hello er<u>erik<\/u>ik!<b/i.test(a.innerHTML)).toBeTruthy();
    expect(b.innerHTML).toBe('bbb');

    myComponent.data.set('name', 'er<span>erik</span>ik');

    san.nextTick(function () {
        expect(/\/span>hello er<span>erik<\/span>ik!<b/i.test(a.innerHTML)).toBeTruthy();
        expect(b.innerHTML).toBe('bbb');

        myComponent.dispose();
        document.body.removeChild(wrap);

        done();
    });
});

