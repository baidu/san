it("component with san-for, then push", function (done) {
    // [inject] init

    myComponent.data.push('list', {title: '3', text: 'three'});

    var spans = wrap.getElementsByTagName('span');
    expect(spans.length).toBe(2);
    expect(spans[0].title).toBe('1');
    expect(spans[1].title).toBe('2');

    san.nextTick(function () {
        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(3);
        expect(spans[0].title).toBe('1');
        expect(spans[1].title).toBe('2');
        expect(spans[2].title).toBe('3');


        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });

});

