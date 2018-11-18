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

    it("fallback by fallback declaration", function (done) {
        var Label = san.defineComponent({
            template: '<u>{{text}}</u>'
        });

        var LoadingLabel = san.defineComponent({
            template: '<b>{{text}}</b>'
        });

        var FallbackLabel = san.defineComponent({
            template: '<input value="{{text}}"/>'
        });

        var loadFail;
        var loadSuccess;
        var MyComponent = san.defineComponent({
            components: {
                'x-label': {
                    load: function () {
                        return {
                            then: function (success, fail) {
                                loadSuccess = success;
                                loadFail = fail;
                            }
                        };
                    },
                    loading: LoadingLabel,
                    fallback: FallbackLabel
                }
            },

            template: '<div><x-label text="{{text}}"/></div>',

            attached: function () {
                this.nextTick(function () {
                    loadFail();
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

            expect(wrap.getElementsByTagName('u').length).toBe(0);
            expect(wrap.getElementsByTagName('input').length).toBe(1);
            expect(wrap.getElementsByTagName('input')[0].value).toBe('Hello San');

            expect(wrap.getElementsByTagName('b').length).toBe(0);

            myComponent.data.set('text', 'GoodBye San');

            myComponent.nextTick(function () {
                expect(wrap.getElementsByTagName('input')[0].value).toBe('GoodBye San');
                myComponent.dispose();
                document.body.removeChild(wrap);
                done();

            });
        }, 500);

    });

    it("fallback by promise reject", function (done) {
        var Label = san.defineComponent({
            template: '<u>{{text}}</u>'
        });

        var LoadingLabel = san.defineComponent({
            template: '<b>{{text}}</b>'
        });

        var FallbackLabel = san.defineComponent({
            template: '<input value="{{text}}"/>'
        });

        var loadFail;
        var loadSuccess;
        var MyComponent = san.defineComponent({
            components: {
                'x-label': {
                    load: function () {
                        return {
                            then: function (success, fail) {
                                loadSuccess = success;
                                loadFail = fail;
                            }
                        };
                    },
                    loading: LoadingLabel
                }
            },

            template: '<div><x-label text="{{text}}"/></div>',

            attached: function () {
                this.nextTick(function () {
                    loadFail(FallbackLabel);
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

            expect(wrap.getElementsByTagName('u').length).toBe(0);
            expect(wrap.getElementsByTagName('input').length).toBe(1);
            expect(wrap.getElementsByTagName('input')[0].value).toBe('Hello San');

            expect(wrap.getElementsByTagName('b').length).toBe(0);

            myComponent.data.set('text', 'GoodBye San');

            myComponent.nextTick(function () {
                expect(wrap.getElementsByTagName('input')[0].value).toBe('GoodBye San');
                myComponent.dispose();
                document.body.removeChild(wrap);
                done();

            });
        }, 500);

    });

    it("with if", function (done) {
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

            template: '<div><x-label text="{{text}}" s-if="isShow"/></div>'
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
        })


    });

    it("with slot", function (done) {
        var Label = san.defineComponent({
            template: '<u><slot/></u>'
        });

        var LoadingLabel = san.defineComponent({
            template: '<b><slot/></b>'
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

            template: '<div><x-label>Hello {{text}}</x-label></div>',

            attached: function () {
                this.nextTick(function () {
                    loadSuccess(Label);
                });
            }
        });

        var myComponent = new MyComponent({
            data: {
                text: 'San'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('u').length).toBe(0);
        expect(wrap.getElementsByTagName('b').length).toBe(1);
        expect(wrap.getElementsByTagName('b')[0].innerHTML).toContain('Hello San');

        setTimeout(function () {
            expect(wrap.getElementsByTagName('u').length).toBe(1);
            expect(wrap.getElementsByTagName('u')[0].innerHTML).toContain('Hello San');

            expect(wrap.getElementsByTagName('b').length).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        }, 500);

    });

    it("in slot with slot", function (done) {
        var Label = san.defineComponent({
            template: '<u><slot/></u>'
        });

        var Panel = san.defineComponent({
            template: '<a><slot/></a>'
        })

        var LoadingLabel = san.defineComponent({
            template: '<b><slot/></b>'
        });

        var loadSuccess;
        var MyComponent = san.defineComponent({
            components: {
                'x-panel': Panel,
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

            template: '<div><x-panel><x-label>Hello {{text}}</x-label></x-panel></div>',

            attached: function () {
                this.nextTick(function () {
                    loadSuccess(Label);
                });
            }
        });

        var myComponent = new MyComponent({
            data: {
                text: 'San'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var a = wrap.getElementsByTagName('a')[0];

        expect(a.getElementsByTagName('u').length).toBe(0);
        expect(a.getElementsByTagName('b').length).toBe(1);
        expect(a.getElementsByTagName('b')[0].innerHTML).toContain('Hello San');

        setTimeout(function () {
            expect(a.getElementsByTagName('u').length).toBe(1);
            expect(a.getElementsByTagName('u')[0].innerHTML).toContain('Hello San');

            expect(a.getElementsByTagName('b').length).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        }, 500);

    });
});
