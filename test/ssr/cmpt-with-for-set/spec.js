it("component with san-for, then set item", function (done) {
    // [inject] init

    myComponent.data.set('list[0].title', '111');

    var spans = wrap.getElementsByTagName('span');
    expect(spans.length).toBe(2);
    expect(spans[0].title).toBe('1');
    expect(spans[1].title).toBe('2');

    san.nextTick(function () {
        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(2);
        expect(spans[0].title).toBe('111');
        expect(spans[1].title).toBe('2');


        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });

});



