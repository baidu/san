it("s-bind", function (done) {
    // [inject] init

    var h3 = wrap.getElementsByTagName('h3')[0];
    var h4 = wrap.getElementsByTagName('h4')[0];
    var p = wrap.getElementsByTagName('p')[0];
    expect(h3.innerHTML).toContain('Hey');
    expect(h4.innerHTML).toContain('San');
    expect(p.innerHTML).toContain('framework');

    var a = wrap.getElementsByTagName('a')[0];
    expect(a.title).toBe('link');
    expect(a.target).toBe('_blank');
    expect(a.href).toContain('baidu');
    expect(a.getAttribute('data-test')).toContain('test');

    myComponent.data.set('aProps', {
        href: 'https://github.com/',
        target: '_self'
    });
    myComponent.data.set('article.subtitle', '');
    myComponent.data.set('article.title', 'Bye');

    san.nextTick(function () {
        expect(h3.innerHTML).toContain('Hey');
        expect(wrap.getElementsByTagName('h4').length).toBe(0);
        expect(p.innerHTML).toContain('framework');

        expect(a.title).toBeFalsy();
        expect(a.target).toBe('_blank');
        expect(a.href).toContain('github');
        expect(a.getAttribute('data-test')).toBeFalsy();

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();
    });
});

