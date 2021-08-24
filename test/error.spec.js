describe('error', function () {

    it('lifecycle hook', function () {
        var spy = jasmine.createSpy();
        var Child = san.defineComponent({
            template: '<h1>test</h1>',
            attached: function () {
                throw new Error('error');
            }
        });
        var MyComponent = san.defineComponent({
            template: '<div><x-child /></div>',
            components: {
                'x-child': Child
            },
            error: spy
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(spy).toHaveBeenCalled();

        var args = spy.calls.first().args;
        expect(args[2]).toBe('hook:attached');
        expect(args[1] instanceof Child).toBe(true);
        expect(args[0] instanceof Error).toBe(true);
        expect(args[0].message).toBe('error');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it('initData', function () {
        var spy = jasmine.createSpy();
        var Child = san.defineComponent({
            template: '<h1>test</h1>',
            initData: function () {
                throw new Error('error');
            }
        });
        var MyComponent = san.defineComponent({
            template: '<div><x-child /></div>',
            components: {
                'x-child': Child
            },
            error: spy
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(spy).toHaveBeenCalled();

        var args = spy.calls.first().args;
        expect(args[2]).toBe('initData');
        expect(args[1] instanceof Child).toBe(true);
        expect(args[0] instanceof Error).toBe(true);
        expect(args[0].message).toBe('error');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it('computed', function () {
        var spy = jasmine.createSpy();
        var Child = san.defineComponent({
            template: '<h1>{{ message }}</h1>',
            computed: {
                message: function () {
                    throw new Error('error');
                }
            }
        });
        var MyComponent = san.defineComponent({
            template: '<div><x-child /></div>',
            components: {
                'x-child': Child
            },
            error: spy
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.children[0].data.set('message', 'update');

        expect(spy).toHaveBeenCalled();

        var args = spy.calls.first().args;
        expect(args[2]).toBe('computed:message');
        expect(args[1] instanceof Child).toBe(true);
        expect(args[0] instanceof Error).toBe(true);
        expect(args[0].message).toBe('error');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it('watch', function () {
        var spy = jasmine.createSpy();
        var Child = san.defineComponent({
            template: '<h1>{{ message }}</h1>',
            initData: function () {
                return {
                    message: 'test'
                };
            },
            attached: function () {
                this.watch('message', function () {
                    throw new Error('error');
                });
            }
        });
        var MyComponent = san.defineComponent({
            template: '<div><x-child /></div>',
            components: {
                'x-child': Child
            },
            error: spy
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.children[0].data.set('message', 'update');

        expect(spy).toHaveBeenCalled();

        var args = spy.calls.first().args;
        expect(args[2]).toBe('watch:message');
        expect(args[1] instanceof Child).toBe(true);
        expect(args[0] instanceof Error).toBe(true);
        expect(args[0].message).toBe('error');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it('message handler', function () {
        var spy = jasmine.createSpy();
        var Child = san.defineComponent({
            template: '<h1>hello</h1>',
            attached: function () {
                this.dispatch('hello');
            }
        });
        var MyComponent = san.defineComponent({
            template: '<div><x-child /></div>',
            components: {
                'x-child': Child
            },
            messages: {
                hello: function () {
                    throw new Error('error');
                }
            },
            error: spy
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(spy).toHaveBeenCalled();

        var args = spy.calls.first().args;
        expect(args[2]).toBe('message:hello');
        expect(args[1] instanceof MyComponent).toBe(true);
        expect(args[0] instanceof Error).toBe(true);
        expect(args[0].message).toBe('error');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it('filter', function () {
        var spy = jasmine.createSpy();
        var Child = san.defineComponent({
            template: '<h1>{{ msg | add }}</h1>',
            filters: {
                add: function (str) {
                    throw new Error('error');
                }
            },
            initData: function () {
                return {
                    msg: 'test'
                };
            },
        });
        var MyComponent = san.defineComponent({
            template: '<div><x-child /></div>',
            components: {
                'x-child': Child
            },
            error: spy
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(spy).toHaveBeenCalled();

        var args = spy.calls.first().args;
        expect(args[2]).toBe('filter:add');
        expect(args[1] instanceof Child).toBe(true);
        expect(args[0] instanceof Error).toBe(true);
        expect(args[0].message).toBe('error');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it('fire event', function () {
        var spy = jasmine.createSpy();
        var Child = san.defineComponent({
            template: '<h1>{{ msg }}</h1>',
            initData: function () {
                return {
                    msg: 'test'
                };
            }
        });
        var MyComponent = san.defineComponent({
            template: '<div><x-child /></div>',
            components: {
                'x-child': Child
            },
            error: spy
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.children[0].on('ready', function () {
            throw new Error('error');
        });
        myComponent.children[0].fire('ready');

        expect(spy).toHaveBeenCalled();

        var args = spy.calls.first().args;
        expect(args[2]).toBe('event:ready');
        expect(args[1] instanceof Child).toBe(true);
        expect(args[0] instanceof Error).toBe(true);
        expect(args[0].message).toBe('error');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it('transition creator', function (done) {
        var spy = jasmine.createSpy();
        var Child = san.defineComponent({
            template: '<h1><span s-if="num > 1" s-transition="transCreator">test</span></h1>',
            initData: function () {
                return {
                    num: 0
                };
            },
            transCreator: function () {
                throw new Error('error');
            }
        });
        var MyComponent = san.defineComponent({
            template: '<div><x-child></x-child></div>',
            components: {
                'x-child': Child
            },
            error: spy
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.children[0].data.set('num', 2);
        san.nextTick(function () {
            expect(spy).toHaveBeenCalled();

            var args = spy.calls.first().args;
            expect(args[2]).toBe('transitionCreate');
            expect(args[1] instanceof Child).toBe(true);
            expect(args[0] instanceof Error).toBe(true);
            expect(args[0].message).toBe('error');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it('transition enter', function (done) {
        var spy = jasmine.createSpy();
        var Child = san.defineComponent({
            template: '<h1><span s-if="num > 1" s-transition="transCreator">test</span></h1>',
            initData: function () {
                return {
                    num: 0
                };
            },
            transCreator: function () {
                return {
                    enter: function () {
                        throw new Error('error');
                    }
                };
            }
        });
        var MyComponent = san.defineComponent({
            template: '<div><x-child></x-child></div>',
            components: {
                'x-child': Child
            },
            error: spy
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.children[0].data.set('num', 2);
        san.nextTick(function () {
            expect(spy).toHaveBeenCalled();

            var args = spy.calls.first().args;
            expect(args[2]).toBe('transitionEnter');
            expect(args[1] instanceof Child).toBe(true);
            expect(args[0] instanceof Error).toBe(true);
            expect(args[0].message).toBe('error');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it('transition leave', function (done) {
        var spy = jasmine.createSpy();
        var Child = san.defineComponent({
            template: '<h1><span s-if="num > 1" s-transition="transCreator">test</span></h1>',
            initData: function () {
                return {
                    num: 2
                };
            },
            transCreator: function () {
                return {
                    leave: function () {
                        throw new Error('error');
                    }
                };
            }
        });
        var MyComponent = san.defineComponent({
            template: '<div><x-child></x-child></div>',
            components: {
                'x-child': Child
            },
            error: spy
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.children[0].data.set('num', 0);
        san.nextTick(function () {
            expect(spy).toHaveBeenCalled();

            var args = spy.calls.first().args;
            expect(args[2]).toBe('transitionLeave');
            expect(args[1] instanceof Child).toBe(true);
            expect(args[0] instanceof Error).toBe(true);
            expect(args[0].message).toBe('error');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it('transition enter component', function (done) {
        var spy = jasmine.createSpy();
        var subChild = san.defineComponent({
            template: '<span></span>'
        });
        var Child = san.defineComponent({
            template: '<h1><sub-child s-if="num > 1" s-transition="transCreator">test</sub-child></h1>',
            initData: function () {
                return {
                    num: 2
                };
            },
            transCreator: function () {
                return {
                    enter: function () {
                        throw new Error('error');
                    }
                };
            },
            components: {
                'sub-child': subChild
            },
        });
        var MyComponent = san.defineComponent({
            template: '<div><x-child></x-child></div>',
            components: {
                'x-child': Child
            },
            error: spy
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.children[0].data.set('num', 0);
        san.nextTick(function () {
            expect(spy).toHaveBeenCalled();

            var args = spy.calls.first().args;
            expect(args[2]).toBe('transitionEnter');
            expect(args[1] instanceof Child).toBe(true);
            expect(args[0] instanceof Error).toBe(true);
            expect(args[0].message).toBe('error');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it('transition leave component', function (done) {
        var spy = jasmine.createSpy();
        var subChild = san.defineComponent({
            template: '<span></span>'
        });
        var Child = san.defineComponent({
            template: '<h1><sub-child s-if="num > 1" s-transition="transCreator">test</sub-child></h1>',
            initData: function () {
                return {
                    num: 2
                };
            },
            transCreator: function () {
                return {
                    leave: function () {
                        throw new Error('error');
                    }
                };
            },
            components: {
                'sub-child': subChild
            },
        });
        var MyComponent = san.defineComponent({
            template: '<div><x-child></x-child></div>',
            components: {
                'x-child': Child
            },
            error: spy
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.children[0].data.set('num', 0);
        san.nextTick(function () {
            expect(spy).toHaveBeenCalled();

            var args = spy.calls.first().args;
            expect(args[2]).toBe('transitionLeave');
            expect(args[1] instanceof Child).toBe(true);
            expect(args[0] instanceof Error).toBe(true);
            expect(args[0].message).toBe('error');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it('slot children', function () {
        var spy = jasmine.createSpy();
        var slotChild = san.defineComponent({
            template: '<span>test</span>',
            attached: function () {
                throw new Error('error');
            }
        });
        var Child = san.defineComponent({
            template: '<h1><slot /></h1>'
        });
        var MyComponent = san.defineComponent({
            template: '<div><x-child><x-slot-child /></x-child></div>',
            components: {
                'x-child': Child,
                'x-slot-child': slotChild
            },
            error: spy
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(spy).toHaveBeenCalled();

        var args = spy.calls.first().args;
        expect(args[2]).toBe('hook:attached');
        expect(args[1] instanceof slotChild).toBe(true);
        expect(args[0] instanceof Error).toBe(true);
        expect(args[0].message).toBe('error');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });
});
