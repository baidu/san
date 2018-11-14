describe("Component Async", function () {

    it("loaded by promise resolved", function (done) {
        var Label = san.defineComponent({
            template: '<u>{{text}}</u>'
        });

        var loadSuccess;
        var MyComponent = san.defineComponent({
            components: {
                'x-label': {
                    load: function () {
                        return {
                            then: function (success) {
                                loadSuccess = success;
                            }
                        };
                    }
                }
            },

            template: '<div><x-label text="{{text}}"/></div>',

            attached: function () {
                this.nextTick(function () {
                    loadSuccess(Label);
                });
            }
        });

        var myComponent = new MyComponent({
            data: {
                text: 'Hello San'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('u').length).toBe(0);

        setTimeout(function () {
            expect(wrap.getElementsByTagName('u').length).toBe(1);
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('Hello San');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        }, 500);

    });


    it("loading placeholder", function (done) {
        var Label = san.defineComponent({
            template: '<u>{{text}}</u>'
        });

        var LoadingLabel = san.defineComponent({
            template: '<b>{{text}}</b>'
        });

        var loadSuccess;
        var MyComponent = san.defineComponent({
            components: {
                'x-label': {
                    load: function () {
                        return {
                            then: function (success) {
                                loadSuccess = success;
                            }
                        };
                    },
                    loading: LoadingLabel
                }
            },

            template: '<div><x-label text="{{text}}"/></div>',

            attached: function () {
                this.nextTick(function () {
                    loadSuccess(Label);
                });
            }
        });

        var myComponent = new MyComponent({
            data: {
                text: 'Hello San'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('u').length).toBe(0);
        expect(wrap.getElementsByTagName('b').length).toBe(1);
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toBe('Hello San');

        setTimeout(function () {
            expect(wrap.getElementsByTagName('u').length).toBe(1);
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toBe('Hello San');

            expect(wrap.getElementsByTagName('b').length).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        }, 500);

    });
});
