it("complex structure in textnode", function (done) {
    // [inject] init

    var a = wrap.getElementsByTagName('a')[0];
    var b = wrap.getElementsByTagName('b')[0];
    expect(a.innerHTML.toLowerCase()).toContain('hello er<u>erik</u>ik!');
    expect(b.innerHTML).toBe('bbb');

    myComponent.data.set('name', 'er<span>erik</span>ik');

    san.nextTick(function () {
        expect(a.innerHTML.toLowerCase()).toContain('hello er<span>erik</span>ik!');
        expect(b.innerHTML).toBe('bbb');

        myComponent.dispose();
        document.body.removeChild(wrap);

        done();
    });
});

