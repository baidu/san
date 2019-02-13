it("root element with if as child, no data when inited", function (done) {
    // [inject] init

    expect(wrap.getElementsByTagName('b').length).toBe(0);
    myComponent.data.set('p', {
        name: 'errorrik'
    });

    myComponent.nextTick(function () {
        expect(wrap.getElementsByTagName('b').length).toBe(1);
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('errorrik');

        myComponent.data.set('p', null);

        myComponent.nextTick(function () {
            expect(wrap.getElementsByTagName('b').length).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });
});
