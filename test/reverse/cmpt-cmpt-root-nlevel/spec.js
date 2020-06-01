it("component as root el, more than 1 level, update on attached", function (done) {
    // [inject] init

    var span = wrap.getElementsByTagName('span')[0];
    expect(span.title).toBe('erik');
    expect(span.innerHTML).toContain('erik');

    myComponent.nextTick(function () {
        expect(span.title).toBe('errorrik');
        expect(span.innerHTML).toContain('errorrik');
        myComponent.dispose();
        document.body.removeChild(wrap);

        done();
    });
});
