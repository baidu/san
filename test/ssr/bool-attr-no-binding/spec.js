it("bool attr, no binding", function () {
    // [inject] init

    expect(wrap.getElementsByTagName('button')[0].disabled).toBeTruthy();
    myComponent.dispose();
    document.body.removeChild(wrap);
});

