it("fragment sibling", function (done) {
    // [inject] init

    expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('San');
    expect(wrap.innerHTML).toContain('Framework and');
    expect(wrap.innerHTML).toContain('learn from');

    myComponent.data.set('name', 'JQuery');
    myComponent.data.set('type', 'lib');
    myComponent.data.set('start', 'start');

    myComponent.nextTick(function () {
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('JQuery');
        expect(wrap.innerHTML).toContain('lib and');
        expect(wrap.innerHTML).toContain('start from');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });

});

