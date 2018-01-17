it("slot insert element 'template' apply for", function (done) {
    // [inject] init

    var h4s = wrap.getElementsByTagName('h4');
    var ps = wrap.getElementsByTagName('p');

    expect(h4s.length).toBe(2);
    expect(ps.length).toBe(2);

    expect(h4s[0].innerHTML).toBe('otakustay');
    expect(ps[0].innerHTML).toBe('otakustay@gmail.com');
    expect(h4s[1].innerHTML).toBe('errorrik');
    expect(ps[1].innerHTML).toBe('errorrik@gmail.com');


    expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('San');

    var contentSlot = myComponent.ref('folder').slot('content');
    expect(contentSlot.length).toBe(1);
    expect(contentSlot[0].children[0].children.length).toBe(2);
    expect(contentSlot[0].children[0].nodeType).toBe(san.NodeType.FOR);

    myComponent.data.pop('persons');
    san.nextTick(function () {
        var h4s = wrap.getElementsByTagName('h4');
        var ps = wrap.getElementsByTagName('p');
        expect(h4s.length).toBe(1);
        expect(ps.length).toBe(1);


        expect(h4s[0].innerHTML).toBe('otakustay');
        expect(ps[0].innerHTML).toBe('otakustay@gmail.com');

        var contentSlot = myComponent.ref('folder').slot('content');
        expect(contentSlot.length).toBe(1);
        expect(contentSlot[0].children[0].children.length).toBe(1);
        expect(contentSlot[0].children[0].nodeType).toBe(san.NodeType.FOR);

        myComponent.data.unshift('persons', {name: 'errorrik', email: 'errorrik@gmail.com'});
        san.nextTick(function () {
            var contentSlot = myComponent.ref('folder').slot('content');
            expect(contentSlot.length).toBe(1);
            expect(contentSlot[0].children[0].children.length).toBe(2);
            expect(contentSlot[0].children[0].nodeType).toBe(san.NodeType.FOR);

            expect(h4s[0].innerHTML).toBe('errorrik');
            expect(ps[0].innerHTML).toBe('errorrik@gmail.com');

            expect(h4s[1].innerHTML).toBe('otakustay');
            expect(ps[1].innerHTML).toBe('otakustay@gmail.com');


            expect(h4s.length).toBe(2);
            expect(ps.length).toBe(2);
            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });
});

