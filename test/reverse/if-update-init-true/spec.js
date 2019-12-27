it("update if, init with true", function (done) {
    // [inject] init

    expect(myComponent.data.get('name')).toBe('errorrik');
    myComponent.data.set('cond', false);
    var span = wrap.getElementsByTagName('span')[0];
    expect(span.title).toBe('errorrik');


    san.nextTick(function () {
        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(0);

        myComponent.data.set('cond', true);

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('errorrik');
            expect(span.innerHTML.indexOf('errorrik') >= 0).toBeTruthy();


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });
});

