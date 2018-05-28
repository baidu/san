describe("Transition", function () {

    it("transition property, attach and dispose", function (done) {
        var attached;
        var disposed;

        var MyComponent = san.defineComponent({
            template: '<div style="height:110px;line-height:110px">content</div>',

            transition: {
                enter: function (el, enterDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '110px';
                            enterDone();

                            san.nextTick(function () {
                                myComponent.dispose();
                                expect(disposed).not.toBeTruthy();
                            });
                            return;
                        }

                        el.style.fontSize = 10 + 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                },

                leave: function (el, leaveDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '10px';
                            leaveDone();

                            expect(disposed).toBeTruthy();
                            document.body.removeChild(wrap);
                            done();
                            return;
                        }

                        el.style.fontSize = 110 - 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                }
            },

            attached: function () {
                attached = true;
            },

            disposed: function () {
                disposed = true;
            }
        });


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(attached).toBeTruthy();
    });


    it("transition property, attach and detach and dispose", function (done) {
        var attached = 0;
        var disposed;
        var detached;

        var MyComponent = san.defineComponent({
            template: '<div style="height:110px;line-height:110px">content</div>',

            transition: {
                enter: function (el, enterDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '110px';
                            enterDone();

                            san.nextTick(function () {
                                if (attached > 1) {
                                    myComponent.dispose();
                                    expect(disposed).not.toBeTruthy();
                                }
                                else {
                                    myComponent.detach();
                                    expect(detached).not.toBeTruthy();
                                }
                            });
                            return;
                        }

                        el.style.fontSize = 10 + 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                },

                leave: function (el, leaveDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '10px';
                            leaveDone();

                            expect(detached).toBeTruthy();
                            if (attached > 1) {
                                expect(disposed).toBeTruthy();
                                document.body.removeChild(wrap);
                                done();
                            }
                            else {
                                expect(disposed).not.toBeTruthy();
                                detached = false;
                                myComponent.attach(wrap);
                            }
                            return;
                        }

                        el.style.fontSize = 110 - 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                }
            },

            attached: function () {
                attached++;
            },

            disposed: function () {
                disposed = true;
            },

            detached: function () {
                detached = true;
            }
        });


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(attached > 0).toBeTruthy();
    });


    it("s-transition in root element, attach and detach and dispose", function (done) {
        var attached = 0;
        var disposed;
        var detached;

        var MyComponent = san.defineComponent({
            template: '<div style="height:110px;line-height:110px" s-transition="myTrans">content</div>',

            myTrans: {
                enter: function (el, enterDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '110px';
                            enterDone();

                            san.nextTick(function () {
                                if (attached > 1) {
                                    myComponent.dispose();
                                    expect(disposed).not.toBeTruthy();
                                }
                                else {
                                    myComponent.detach();
                                    expect(detached).not.toBeTruthy();
                                }
                            });
                            return;
                        }

                        el.style.fontSize = 10 + 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                },

                leave: function (el, leaveDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '10px';
                            leaveDone();

                            expect(detached).toBeTruthy();
                            if (attached > 1) {
                                expect(disposed).toBeTruthy();
                                document.body.removeChild(wrap);
                                done();
                            }
                            else {
                                expect(disposed).not.toBeTruthy();
                                detached = false;
                                myComponent.attach(wrap);
                            }
                            return;
                        }

                        el.style.fontSize = 110 - 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                }
            },

            attached: function () {
                attached++;
            },

            disposed: function () {
                disposed = true;
            },

            detached: function () {
                detached = true;
            }
        });


        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(attached > 0).toBeTruthy();
    });

    it("transition option, attach and detach and dispose", function (done) {
        var attached = 0;
        var disposed;
        var detached;

        var MyComponent = san.defineComponent({
            template: '<div style="height:110px;line-height:110px">content</div>',

            attached: function () {
                attached++;
            },

            disposed: function () {
                disposed = true;
            },

            detached: function () {
                detached = true;
            }
        });


        var myComponent = new MyComponent({
            transition: {
                enter: function (el, enterDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '110px';
                            enterDone();

                            san.nextTick(function () {
                                if (attached > 1) {
                                    myComponent.dispose();
                                    expect(disposed).not.toBeTruthy();
                                }
                                else {
                                    myComponent.detach();
                                    expect(detached).not.toBeTruthy();
                                }
                            });
                            return;
                        }

                        el.style.fontSize = 10 + 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                },

                leave: function (el, leaveDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '10px';
                            leaveDone();

                            expect(detached).toBeTruthy();
                            if (attached > 1) {
                                expect(disposed).toBeTruthy();
                                document.body.removeChild(wrap);
                                done();
                            }
                            else {
                                expect(disposed).not.toBeTruthy();
                                detached = false;
                                myComponent.attach(wrap);
                            }
                            return;
                        }

                        el.style.fontSize = 110 - 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                }
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(attached > 0).toBeTruthy();
    });

    it("directive apply if, init false", function (done) {
        var enterFinish;
        var leaveFinish;

        var MyComponent = san.defineComponent({
            template: '<div style="height:110px;line-height:110px"><span s-if="num > 10000" title="biiig" s-transition="ifTrans">biiig</span></div>',

            ifTrans: {
                enter: function (el, enterDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '110px';
                            enterFinish = true;
                            enterDone();
                            return;
                        }

                        el.style.fontSize = 10 + 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                },

                leave: function (el, leaveDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '10px';
                            leaveFinish = true;
                            leaveDone();
                            return;
                        }

                        el.style.fontSize = 110 - 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                }
            }
        });


        var myComponent = new MyComponent({
            data: {
                num: 300
            }
        });


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(0);

        myComponent.data.set('num', 30000);

        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);
            expect(enterFinish).not.toBeTruthy();
            whenEnterFinish();
        });

        function whenEnterFinish() {
            if (enterFinish) {
                myComponent.data.set('num', 100);

                san.nextTick(function () {
                    expect(leaveFinish).not.toBeTruthy();

                    whenLeaveFinish();
                });
                return;
            }

            setTimeout(whenEnterFinish, 50);
        }

        function whenLeaveFinish() {
            if (leaveFinish) {
                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
                return;
            }

            setTimeout(whenLeaveFinish, 50);
        }
    });


    it("directive apply if, init true", function (done) {
        var enterFinish;
        var leaveFinish;

        var MyComponent = san.defineComponent({
            template: '<div style="height:110px;line-height:110px"><span s-if="num > 10000" title="biiig" s-transition="ifTrans">biiig</span></div>',

            ifTrans: {
                enter: function (el, enterDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '110px';
                            enterFinish = true;
                            enterDone();
                            return;
                        }

                        el.style.fontSize = 10 + 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                },

                leave: function (el, leaveDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '10px';
                            leaveFinish = true;
                            leaveDone();
                            return;
                        }

                        el.style.fontSize = 110 - 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                }
            }
        });


        var myComponent = new MyComponent({
            data: {
                num: 30000
            }
        });


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);
        expect(enterFinish).not.toBeTruthy();

        whenEnterFinish();


        function whenEnterFinish() {
            if (enterFinish) {
                myComponent.data.set('num', 100);

                san.nextTick(function () {
                    expect(leaveFinish).not.toBeTruthy();
                    var spans = wrap.getElementsByTagName('span');
                    expect(spans.length).toBe(1);

                    whenLeaveFinish();
                });
                return;
            }

            setTimeout(whenEnterFinish, 50);
        }

        function whenLeaveFinish() {
            var spans = wrap.getElementsByTagName('span');
            if (leaveFinish) {
                expect(spans.length).toBe(0);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
                return;
            }


            expect(spans.length).toBe(1);
            setTimeout(whenLeaveFinish, 50);
        }
    });

    it("directive apply if with component, init false", function (done) {
        var enterFinish;
        var leaveFinish;

        var Label = san.defineComponent({
            template: '<span title="{{title}}">{{title}}</span>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-label': Label
            },

            template: '<div style="height:110px;line-height:110px"><x-label s-if="num > 10000" s-transition="ifTrans" title="sansan"/></div>',

            ifTrans: {
                enter: function (el, enterDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '110px';
                            enterFinish = true;
                            enterDone();
                            return;
                        }

                        el.style.fontSize = 10 + 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                },

                leave: function (el, leaveDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '10px';
                            leaveFinish = true;
                            leaveDone();
                            return;
                        }

                        el.style.fontSize = 110 - 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                }
            }
        });


        var myComponent = new MyComponent({
            data: {
                num: 300
            }
        });


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(0);

        myComponent.data.set('num', 30000);

        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);
            expect(enterFinish).not.toBeTruthy();
            whenEnterFinish();
        });

        function whenEnterFinish() {
            if (enterFinish) {
                myComponent.data.set('num', 100);

                san.nextTick(function () {
                    expect(leaveFinish).not.toBeTruthy();

                    whenLeaveFinish();
                });
                return;
            }

            setTimeout(whenEnterFinish, 50);
        }

        function whenLeaveFinish() {
            if (leaveFinish) {
                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
                return;
            }

            setTimeout(whenLeaveFinish, 50);
        }
    });

    it("directive apply if and template, should not have transition effect", function (done) {
        var enterFinish;
        var leaveFinish;

        var MyComponent = san.defineComponent({
            template: '<div style="height:110px;line-height:110px"><template s-transition="ifTrans" s-if="num > 10000"><span title="biiig">biiig</span></template></div>',

            ifTrans: {
                enter: function (el, enterDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '110px';
                            enterFinish = true;
                            enterDone();
                            return;
                        }

                        el.style.fontSize = 10 + 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                },

                leave: function (el, leaveDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '10px';
                            leaveFinish = true;
                            leaveDone();
                            return;
                        }

                        el.style.fontSize = 110 - 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                }
            }
        });


        var myComponent = new MyComponent({
            data: {
                num: 300
            }
        });


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(0);


        myComponent.data.set('num', 30000);
        myComponent.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);
            expect(spans[0].innerHTML).toBe('biiig');

            myComponent.data.set('num', 3000);
            myComponent.nextTick(function () {
                var spans = wrap.getElementsByTagName('span');
                expect(spans.length).toBe(0);

                setTimeout(function () {
                    expect(enterFinish).not.toBeTruthy();
                    expect(leaveFinish).not.toBeTruthy();

                    myComponent.dispose();
                    document.body.removeChild(wrap);
                    done();
                }, 500);
            });
        });
    });

    it("directive apply if, no enter behavior", function (done) {
        var enterFinish;
        var leaveFinish;

        var MyComponent = san.defineComponent({
            template: '<div style="height:110px;line-height:110px"><span s-if="num > 10000" title="biiig" s-transition="ifTrans" style="font-size:20px">biiig</span></div>',

            ifTrans: {
                leave: function (el, leaveDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '10px';
                            leaveFinish = true;
                            leaveDone();
                            return;
                        }

                        el.style.fontSize = 110 - 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                }
            }
        });


        var myComponent = new MyComponent({
            data: {
                num: 300
            }
        });


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(0);
        expect(enterFinish).not.toBeTruthy();

        myComponent.data.set('num', 20000);
        setTimeout(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);
            expect(/^20/.test(spans[0].style.fontSize)).toBeTruthy();


            myComponent.data.set('num', 100);
            san.nextTick(function () {
                expect(leaveFinish).not.toBeTruthy();
                var spans = wrap.getElementsByTagName('span');
                expect(spans.length).toBe(1);

                whenLeaveFinish();
            });

        }, 200);


        function whenLeaveFinish() {
            var spans = wrap.getElementsByTagName('span');
            if (leaveFinish) {
                expect(spans.length).toBe(0);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
                return;
            }


            expect(spans.length).toBe(1);
            setTimeout(whenLeaveFinish, 50);
        }
    });

    it("directive apply if, no leave behavior", function (done) {
        var enterFinish;
        var leaveFinish;

        var MyComponent = san.defineComponent({
            template: '<div style="height:110px;line-height:110px"><span s-if="num > 10000" title="biiig" s-transition="ifTrans">biiig</span></div>',

            ifTrans: {
                enter: function (el, enterDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '110px';
                            enterFinish = true;
                            enterDone();
                            return;
                        }

                        el.style.fontSize = 10 + 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                }
            }
        });


        var myComponent = new MyComponent({
            data: {
                num: 30000
            }
        });


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);
        expect(enterFinish).not.toBeTruthy();

        whenEnterFinish();


        function whenEnterFinish() {
            if (enterFinish) {
                myComponent.data.set('num', 100);

                san.nextTick(function () {
                    var spans = wrap.getElementsByTagName('span');
                    expect(spans.length).toBe(0);

                    myComponent.dispose();
                    document.body.removeChild(wrap);
                    done();
                });
                return;
            }

            setTimeout(whenEnterFinish, 50);
        }
    });


    it("directive apply multi if, init with else condition", function (done) {

        var enterFinishIf;
        var leaveFinishIf;
        var enterFinishElse;
        var leaveFinishElse;

        var MyComponent = san.defineComponent({
            template: '<div style="height:110px;line-height:110px"><span s-if="num > 10000" title="biiig" s-transition="ifTrans">biiig</span>  \n'
            + '<span s-elif="num > 1000" title="biig">biig</span>  \n'
            + '<span s-elif="num > 100" title="big">big</span>  \n'
            + ' <b s-else title="small" s-transition="elseTrans">small</b></div>',

            ifTrans: {
                enter: function (el, enterDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '110px';
                            enterFinishIf = true;
                            enterDone();
                            return;
                        }

                        el.style.fontSize = 10 + 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                },

                leave: function (el, leaveDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '10px';
                            leaveFinishIf = true;
                            leaveDone();
                            return;
                        }

                        el.style.fontSize = 110 - 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                }
            },

            elseTrans: {
                enter: function (el, enterDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '110px';
                            enterFinishElse = true;
                            enterDone();
                            return;
                        }

                        el.style.fontSize = 10 + 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                },

                leave: function (el, leaveDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '10px';
                            leaveFinishElse = true;
                            leaveDone();
                            return;
                        }

                        el.style.fontSize = 110 - 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                }
            }
        });


        var myComponent = new MyComponent({
            data: {
                num: 30
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var bs = wrap.getElementsByTagName('b');
        expect(bs.length).toBe(1);
        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(0);
        expect(enterFinishElse).not.toBeTruthy();
        whenEnterElseFinish();

        function whenEnterElseFinish() {
            if (enterFinishElse) {
                myComponent.data.set('num', 30000);
                san.nextTick(function () {
                    var bs = wrap.getElementsByTagName('b');
                    expect(bs.length).toBe(1);
                    var spans = wrap.getElementsByTagName('span');
                    expect(spans.length).toBe(0);

                    whenLeaveElseFinish()
                });
                return;
            }

            setTimeout(whenEnterElseFinish, 50);
        }

        function whenLeaveElseFinish() {
            if (leaveFinishElse) {
                var bs = wrap.getElementsByTagName('b');
                expect(bs.length).toBe(0);
                var spans = wrap.getElementsByTagName('span');
                expect(spans.length).toBe(1);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
                return;
            }

            setTimeout(whenLeaveElseFinish, 50);
        }
    });

    it("directive apply multi if, init with if condition", function (done) {

        var enterFinishIf;
        var leaveFinishIf;
        var enterFinishElse;
        var leaveFinishElse;

        var MyComponent = san.defineComponent({
            template: '<div style="height:110px;line-height:110px"><span s-if="num > 10000" title="biiig" s-transition="ifTrans">biiig</span>  \n'
            + '<span s-elif="num > 1000" title="biig">biig</span>  \n'
            + '<span s-elif="num > 100" title="big">big</span>  \n'
            + ' <b s-else title="small" s-transition="elseTrans">small</b></div>',

            ifTrans: {
                enter: function (el, enterDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '110px';
                            enterFinishIf = true;
                            enterDone();
                            return;
                        }

                        el.style.fontSize = 10 + 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                },

                leave: function (el, leaveDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '10px';
                            leaveFinishIf = true;
                            leaveDone();
                            return;
                        }

                        el.style.fontSize = 110 - 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                }
            },

            elseTrans: {
                enter: function (el, enterDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '110px';
                            enterFinishElse = true;
                            enterDone();
                            return;
                        }

                        el.style.fontSize = 10 + 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                },

                leave: function (el, leaveDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '10px';
                            leaveFinishElse = true;
                            leaveDone();
                            return;
                        }

                        el.style.fontSize = 110 - 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                }
            }
        });


        var myComponent = new MyComponent({
            data: {
                num: 30000
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var bs = wrap.getElementsByTagName('b');
        expect(bs.length).toBe(0);
        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);
        expect(enterFinishIf).not.toBeTruthy();
        whenEnterIfFinish();

        function whenEnterIfFinish() {
            if (enterFinishIf) {
                myComponent.data.set('num', 30);
                san.nextTick(function () {
                    var bs = wrap.getElementsByTagName('b');
                    expect(bs.length).toBe(0);
                    var spans = wrap.getElementsByTagName('span');
                    expect(spans.length).toBe(1);

                    whenLeaveIfFinish()
                });
                return;
            }

            setTimeout(whenEnterIfFinish, 50);
        }

        function whenLeaveIfFinish() {
            var bs = wrap.getElementsByTagName('b');
            var spans = wrap.getElementsByTagName('span');

            if (leaveFinishIf) {
                expect(bs.length).toBe(1);
                expect(spans.length).toBe(0);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
                return;
            }


            expect(bs.length).toBe(0);
            expect(spans.length).toBe(1);
            setTimeout(whenLeaveIfFinish, 50);
        }
    });

    it("directive apply for with component", function (done) {
        var enterFinish = 0;
        var leaveFinish = 0;

        var Label = san.defineComponent({
            template: '<span title="{{title}}">{{title}}</span>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-label': Label
            },

            template: '<div style="height:110px;line-height:110px"><x-label s-for="item in list" s-transition="trans" title="{{item}}"/></div>',

            trans: {
                enter: function (el, enterDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '110px';
                            enterFinish++;
                            enterDone();
                            return;
                        }

                        el.style.fontSize = 10 + 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                },

                leave: function (el, leaveDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '10px';
                            leaveFinish++;
                            leaveDone();
                            return;
                        }

                        el.style.fontSize = 110 - 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                }
            }
        });


        var myComponent = new MyComponent({
            data: {
                list: [1,2,3,4]
            }
        });


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(4);
        expect(enterFinish === 0).toBeTruthy();

        whenListEnterFinish();

        function whenListEnterFinish() {
            if (enterFinish === 4) {
                myComponent.data.push('list', 5);
                myComponent.data.splice('list', [1,2]);
                myComponent.data.unshift('list', 6);
                myComponent.data.push('list', 7);

                san.nextTick(function () {
                    var spans = wrap.getElementsByTagName('span');
                    expect(spans.length).toBe(4);
                    expect(leaveFinish === 0).toBeTruthy();
                    whenListItemDisposeFinish();
                });

                return;
            }

            setTimeout(whenListEnterFinish, 50);
        }

        function whenListItemDisposeFinish() {
            if (leaveFinish === 2) {
                var spans = wrap.getElementsByTagName('span');
                expect(spans.length).toBe(5);
                expect(spans[0].innerHTML).toBe('6');
                expect(spans[4].innerHTML).toBe('7');
                whenAllEnter();

                return;
            }

            setTimeout(whenListItemDisposeFinish, 10);
        }

        function whenAllEnter() {
            if (enterFinish === 7) {
                myComponent.dispose();
                document.body.removeChild(wrap);
                done();

                return;
            }

            setTimeout(whenAllEnter, 50);
        }
    });

    it("directive apply for with component should override inner root element s-transition", function (done) {
        var enterFinish = 0;
        var leaveFinish = 0;

        var Label = san.defineComponent({
            template: '<span title="{{title}}" s-transition="myTrans">{{title}}</span>',

            myTrans: {
                enter: function (el, enterDone) {
                    el.setAttribute('data-test', 'fail');
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '110px';
                            enterFinish++;
                            enterDone();
                            return;
                        }

                        el.style.fontSize = '110px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                },

                leave: function (el, leaveDone) {
                    el.setAttribute('data-test', 'fail');
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '10px';
                            leaveFinish++;
                            leaveDone();
                            return;
                        }

                        el.style.fontSize = '10px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                }
            }
        });

        var MyComponent = san.defineComponent({
            components: {
                'x-label': Label
            },

            template: '<div style="height:110px;line-height:110px"><x-label s-for="item in list" s-transition="trans" title="{{item}}"/></div>',

            trans: {
                enter: function (el, enterDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '110px';
                            enterFinish++;
                            enterDone();
                            return;
                        }

                        el.style.fontSize = 10 + 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                },

                leave: function (el, leaveDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '10px';
                            leaveFinish++;
                            leaveDone();
                            return;
                        }

                        el.style.fontSize = 110 - 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                }
            }
        });


        var myComponent = new MyComponent({
            data: {
                list: [1, 2, 3, 4]
            }
        });


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(4);
        expect(spans[0].getAttribute('data-test')).not.toBe('fail');
        expect(enterFinish === 0).toBeTruthy();

        whenListEnterFinish();

        function whenListEnterFinish() {
            if (enterFinish === 4) {
                myComponent.data.push('list', 5);
                myComponent.data.splice('list', [1, 2]);
                myComponent.data.unshift('list', 6);
                myComponent.data.push('list', 7);

                san.nextTick(function () {
                    var spans = wrap.getElementsByTagName('span');
                    expect(spans.length).toBe(4);
                    expect(spans[0].getAttribute('data-test')).not.toBe('fail');
                    expect(leaveFinish === 0).toBeTruthy();
                    whenListItemDisposeFinish();
                });

                return;
            }

            setTimeout(whenListEnterFinish, 50);
        }

        function whenListItemDisposeFinish() {
            if (leaveFinish === 2) {
                var spans = wrap.getElementsByTagName('span');
                expect(spans.length).toBe(5);
                expect(spans[0].getAttribute('data-test')).not.toBe('fail');
                expect(spans[0].innerHTML).toBe('6');
                expect(spans[4].innerHTML).toBe('7');
                whenAllEnter();

                return;
            }

            setTimeout(whenListItemDisposeFinish, 10);
        }

        function whenAllEnter() {
            if (enterFinish === 7) {
                myComponent.dispose();
                document.body.removeChild(wrap);
                done();

                return;
            }

            setTimeout(whenAllEnter, 50);
        }
    });

    it("function should be creator, can access component data", function (done) {
        var enterFinish;
        var leaveFinish;

        var MyComponent = san.defineComponent({
            template: '<div style="height:110px;line-height:110px"><span s-if="num > 10000" title="biiig" s-transition="ifTrans(needTrans)">biiig</span></div>',

            ifTrans: function (enabled) {
                return {
                    enter: function (el, enterDone) {
                        if (!enabled) {
                            el.style.fontSize = '110px';
                            enterFinish = true;
                            enterDone();
                            return;
                        }

                        var steps = 20;
                        var currentStep = 0;

                        function goStep() {
                            if (currentStep >= steps) {
                                el.style.fontSize = '110px';
                                enterFinish = true;
                                enterDone();
                                return;
                            }

                            el.style.fontSize = 10 + 100 / steps * currentStep++ + 'px';
                            setTimeout(goStep, 16);
                        }

                        goStep();
                    },

                    leave: function (el, leaveDone) {
                        if (!enabled) {
                            el.style.fontSize = '10px';
                            leaveFinish = true;
                            leaveDone();
                            return;
                        }

                        var steps = 20;
                        var currentStep = 0;

                        function goStep() {
                            if (currentStep >= steps) {
                                el.style.fontSize = '10px';
                                leaveFinish = true;
                                leaveDone();
                                return;
                            }

                            el.style.fontSize = 110 - 100 / steps * currentStep++ + 'px';
                            setTimeout(goStep, 16);
                        }

                        goStep();
                    }
                };
            }
        });


        var myComponent = new MyComponent({
            data: {
                needTrans: true,
                num: 300
            }
        });


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(0);

        myComponent.data.set('num', 30000);

        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);
            expect(enterFinish).not.toBeTruthy();
            whenEnterFinish();
        });

        function whenEnterFinish() {
            if (enterFinish) {
                myComponent.data.set('needTrans', false);
                myComponent.data.set('num', 100);

                san.nextTick(function () {
                    expect(leaveFinish).toBeTruthy();

                    myComponent.dispose();
                    document.body.removeChild(wrap);
                    done();
                    return;
                });
                return;
            }

            setTimeout(whenEnterFinish, 50);
        }
    });

    it("directive transition found in deep object", function (done) {
        var enterFinish;
        var leaveFinish;

        var MyComponent = san.defineComponent({
            template: '<div style="height:110px;line-height:110px"><span s-if="num > 10000" title="biiig" s-transition="trans.ifcreator(needTrans)">biiig</span></div>',

            trans: {
                ifcreator: function (enabled) {
                    return {
                        enter: function (el, enterDone) {
                            if (!enabled) {
                                el.style.fontSize = '110px';
                                enterFinish = true;
                                enterDone();
                                return;
                            }

                            var steps = 20;
                            var currentStep = 0;

                            function goStep() {
                                if (currentStep >= steps) {
                                    el.style.fontSize = '110px';
                                    enterFinish = true;
                                    enterDone();
                                    return;
                                }

                                el.style.fontSize = 10 + 100 / steps * currentStep++ + 'px';
                                setTimeout(goStep, 16);
                            }

                            goStep();
                        },

                        leave: function (el, leaveDone) {
                            if (!enabled) {
                                el.style.fontSize = '10px';
                                leaveFinish = true;
                                leaveDone();
                                return;
                            }

                            var steps = 20;
                            var currentStep = 0;

                            function goStep() {
                                if (currentStep >= steps) {
                                    el.style.fontSize = '10px';
                                    leaveFinish = true;
                                    leaveDone();
                                    return;
                                }

                                el.style.fontSize = 110 - 100 / steps * currentStep++ + 'px';
                                setTimeout(goStep, 16);
                            }

                            goStep();
                        }
                    };
                }
            }
        });


        var myComponent = new MyComponent({
            data: {
                num: 300
            }
        });


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(0);

        myComponent.data.set('num', 30000);

        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);
            expect(enterFinish).toBeTruthy();

            myComponent.data.set('needTrans', true);
            myComponent.data.set('num', 100);

            san.nextTick(function () {
                expect(leaveFinish).not.toBeTruthy();

                whenLeaveFinish();
            });
        });

        function whenLeaveFinish() {
            if (leaveFinish) {
                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
                return;
            }

            setTimeout(whenLeaveFinish, 50);
        }
    });

    it("directive apply for and fast change many times", function (done) {
        var leaveFinish = 0;
        var MyComponent = san.defineComponent({
            template: '<div style="height:110px;line-height:110px"><span s-for="item in list" s-transition="trans">{{item}}</span></div>',

            trans: {
                enter: function (el, enterDone) {
                    var steps = 20;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '110px';
                            enterDone();
                            return;
                        }

                        el.style.fontSize = 10 + 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                },

                leave: function (el, leaveDone) {
                    var steps = 50;
                    var currentStep = 0;

                    function goStep() {
                        if (currentStep >= steps) {
                            el.style.fontSize = '10px';
                            leaveFinish++;
                            leaveDone();

                            expect(wrap.getElementsByTagName('span').length).toBe(5-leaveFinish)
                            return;
                        }

                        el.style.fontSize = 110 - 100 / steps * currentStep++ + 'px';
                        setTimeout(goStep, 16);
                    }

                    goStep();
                }
            }
        });


        var myComponent = new MyComponent({
            data: {
                list: [1,2,3,4]
            }
        });


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(4);

        setTimeout(function () {
            myComponent.data.pop('list');
            san.nextTick(function () {
                myComponent.data.pop('list');
                san.nextTick(function () {
                    myComponent.data.unshift('list', 5);
                    san.nextTick(function () {
                        myComponent.data.splice('list', [1,1]);

                        san.nextTick(function () {
                            var spans = wrap.getElementsByTagName('span');
                            expect(spans.length).toBe(5);

                            whenFinish();
                        });
                    });
                })
            })
        }, 500);

        function whenFinish() {
            if (leaveFinish === 3) {
                var spans = wrap.getElementsByTagName('span');
                expect(spans.length).toBe(2);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();

                return;
            }

            setTimeout(whenFinish, 100);
        }
    });
});

