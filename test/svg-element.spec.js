if (!/MSIE|Trident/.test(navigator.userAgent)) {

    describe("SVG", function () {

        var myComponent;
        var wrap;

        beforeEach(function(done) {

            var MyComponent = san.defineComponent({
                template: '<svg><rect width="{{size}}" height="{{size}}" /></svg>',
                initData: function() {
                    return {
                        size: 50
                    };
                }
            });

            myComponent = new MyComponent();

            wrap = document.createElement('div');
            document.body.appendChild(wrap);
            done();

        });

        afterEach(function() {
            myComponent.dispose();
            document.body.removeChild(wrap);
        });

        it("create element", function () {

            myComponent.attach(wrap);

            var rect = wrap.getElementsByTagName('rect')[0];
            expect(+rect.getAttribute('width')).toBe(50);

        });

        it("setAttrbute", function (done) {

            myComponent.attach(wrap);
            var rect = wrap.getElementsByTagName('rect')[0];
            var size = 100;
            myComponent.data.set('size', size);

            san.nextTick(function() {
                expect(+rect.getAttribute('width')).toBe(size);
                done();
            });

        });

    });

}
