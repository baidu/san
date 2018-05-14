it("object literal with spread", function (done) {
    // [inject] init

    expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('san');
    expect(wrap.getElementsByTagName('b').length).toBe(0);
    expect(wrap.getElementsByTagName('p')[0].innerHTML).toBe('framework');
    expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('erik');
    expect(wrap.getElementsByTagName('a')[0].innerHTML).toBe('errorrik@gmail.com');

    myComponent.data.set('aAuthor', null);
    myComponent.data.set('article.content', 'component');
    san.nextTick(function () {


        expect(wrap.getElementsByTagName('h3')[0].innerHTML).toBe('san');
        expect(wrap.getElementsByTagName('b').length).toBe(0);
        expect(wrap.getElementsByTagName('p')[0].innerHTML).toBe('component');
        expect(wrap.getElementsByTagName('u').length).toBe(0);
        expect(wrap.getElementsByTagName('a').length).toBe(0);

        myComponent.dispose();
        document.body.removeChild(wrap);

        done();
    });
});
