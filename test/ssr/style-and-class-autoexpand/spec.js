it("style and class autoexpand", function (done) {
    // [inject] init

    var a = wrap.getElementsByTagName('a')[0];
    var h3 = wrap.getElementsByTagName('h3')[0];
    var span = wrap.getElementsByTagName('span')[0];

    expect(span.style.position).toBe('fixed');
    expect(span.style.display).toBe('block');
    expect(a.style.width).toBe('50px');
    expect(a.style.height).toBe('50px');
    expect(h3.style.width).toBe('50px');
    expect(h3.style.height).toBe('20px');
    expect(/(^| )app( |$)/.test(a.className)).toBeTruthy();
    expect(/(^| )main( |$)/.test(a.className)).toBeTruthy();
    expect(/(^| )app-title( |$)/.test(h3.className)).toBeTruthy();
    expect(/(^| )main-title( |$)/.test(h3.className)).toBeTruthy();
    expect(/(^| )ui( |$)/.test(span.className)).toBeTruthy();
    expect(/(^| )ui-label( |$)/.test(span.className)).toBeTruthy();

    myComponent.data.set('styles.title.height', '30px');
    myComponent.data.push('classes.main', 'wrap');

    san.nextTick(function () {

        expect(/(^| )app( |$)/.test(a.className)).toBeTruthy();
        expect(/(^| )main( |$)/.test(a.className)).toBeTruthy();
        expect(/(^| )wrap( |$)/.test(a.className)).toBeTruthy();

        expect(h3.style.height).toBe('30px');

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});

