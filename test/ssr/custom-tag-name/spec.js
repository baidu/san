
it("custom tag name", function () {
    // [inject] init

    expect(wrap.getElementsByTagName('x-p').length).toBe(1);
    expect(wrap.getElementsByTagName('x-p')[0].innerHTML).toContain('hello san');

    myComponent.dispose();
    document.body.removeChild(wrap);

});
