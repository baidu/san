it("two way binding textarea value", function (done) {
    // [inject] init

    var span = wrap.getElementsByTagName('span')[0];
    var input = wrap.getElementsByTagName('textarea')[0];
    expect(span.title).toBe('errorrik');
    expect(input.value).toBe('errorrik');


    function doneSpec() {
        var name = myComponent.data.get('name');

        if (name !== 'errorrik') {
            expect(span.title).toBe(name);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
            return;
        }

        setTimeout(doneSpec, 500);
    }

    triggerEvent('#' + input.id, 'input', 'test' + (+new Date()));
    setTimeout(doneSpec, 500);

});

