it("deep slot", function (done) {
    // [inject] init

    expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('contributor');
    expect(wrap.getElementsByTagName('a')[0].innerHTML).toContain('X');
    expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('errorrik');

    myComponent.data.set('closeText', 'close');
    myComponent.data.set('title', 'member');
    myComponent.data.set('name', 'otakustay');

    san.nextTick(function () {

        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('member');
        expect(wrap.getElementsByTagName('a')[0].innerHTML).toContain('close');
        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('otakustay');


        myComponent.data.set('folderHidden', true);

        san.nextTick(function () {

            expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('member');
            expect(wrap.getElementsByTagName('a').length).toBe(0);
            expect(wrap.getElementsByTagName('u').length).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    })
});

