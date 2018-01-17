it("slot description apply for, init true", function (done) {
    // [inject] init

    expect(wrap.getElementsByTagName('p').length).toBe(2);
    expect(wrap.getElementsByTagName('p')[0].innerHTML).toBe('MVVM component framework');
    expect(wrap.getElementsByTagName('p')[1].innerHTML).toBe('MVVM component framework');
    expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('San');

    myComponent.data.set('folderHidden', true);
    san.nextTick(function () {
        expect(wrap.getElementsByTagName('p').length).toBe(0);
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('San');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});

