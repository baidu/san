it("null", function () {
    // [inject] init

    expect(wrap.getElementsByTagName('b').length).toBe(1);

    myComponent.dispose();
    document.body.removeChild(wrap);
});
