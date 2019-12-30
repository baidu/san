
it("ComponentLoader fallback with fallback prop", function (done) {
    // [inject] init

    expect(wrap.getElementsByTagName('u').length).toBe(0);
    expect(wrap.getElementsByTagName('b').length).toBe(1);
    expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('Hello San');

    setTimeout(function () {

        expect(wrap.getElementsByTagName('u').length).toBe(0);
        expect(wrap.getElementsByTagName('input').length).toBe(1);
        expect(wrap.getElementsByTagName('input')[0].value).toBe('Hello San');

        expect(wrap.getElementsByTagName('b').length).toBe(0);

        myComponent.data.set('text', 'GoodBye San');

        myComponent.nextTick(function () {
            expect(wrap.getElementsByTagName('input')[0].value).toBe('GoodBye San');
            myComponent.dispose();
            document.body.removeChild(wrap);
            done();

        });
    }, 500);

});
