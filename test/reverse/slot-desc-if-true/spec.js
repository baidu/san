it("slot description apply if, init true", function (done) {
    // [inject] init

    expect(wrap.getElementsByTagName('p').length).toBe(1);
    expect(wrap.getElementsByTagName('p')[0].innerHTML).toBe('MVVM component framework');
    expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('San');

    var contentSlots = myComponent.ref('folder').slot();
    expect(contentSlots.length).toBe(1);

    myComponent.data.set('folderHidden', true);
    san.nextTick(function () {
        expect(wrap.getElementsByTagName('p').length).toBe(0);
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('San');

        var contentSlots = myComponent.ref('folder').slot();
        expect(contentSlots.length).toBe(0);
        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});1

