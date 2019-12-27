
it("ComponentLoader with s-if", function (done) {
    // [inject] init

    expect(wrap.getElementsByTagName('u').length).toBe(0);
    expect(wrap.getElementsByTagName('b').length).toBe(0);
    myComponent.data.set('isShow', true);
    myComponent.nextTick(function () {
        expect(wrap.getElementsByTagName('u').length).toBe(0);
        expect(wrap.getElementsByTagName('b').length).toBe(1);
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('Hello San');

        loadSuccess(Label);
        myComponent.nextTick(function () {
            expect(wrap.getElementsByTagName('u').length).toBe(1);
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('Hello San');
            expect(wrap.getElementsByTagName('b').length).toBe(0);

            myComponent.data.set('isShow', false);
            myComponent.nextTick(function () {
                expect(wrap.getElementsByTagName('u').length).toBe(0);
                expect(wrap.getElementsByTagName('b').length).toBe(0);
                myComponent.data.set('isShow', true);

                myComponent.nextTick(function () {
                    expect(wrap.getElementsByTagName('u').length).toBe(0);
                    expect(wrap.getElementsByTagName('b').length).toBe(1);
                    expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('Hello San');

                    myComponent.nextTick(function () {
                        expect(wrap.getElementsByTagName('u').length).toBe(1);
                        expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('Hello San');
                        expect(wrap.getElementsByTagName('b').length).toBe(0);

                        myComponent.dispose();
                        document.body.removeChild(wrap);
                        done();
                    });


                });
            });

        });
    });

});
