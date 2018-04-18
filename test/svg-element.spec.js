if (!/MSIE|Trident/.test(navigator.userAgent)) {

    describe("SVG", function () {

        var myComponent;
        var wrap;

        beforeEach(function(done) {

            var MyComponent = san.defineComponent({
                template: '<svg viewBox="0 0 96 96" class="{{svgClass}}"><rect width="{{size}}" height="{{size}}" /></svg>',
                initData: function() {
                    return {
                        size: 50,
                        svgClass: 'cool'
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

            var svg = wrap.getElementsByTagName('svg')[0];
            expect(svg.getAttribute('viewBox')).toBe('0 0 96 96');
            expect(svg.getAttribute('class')).toBe('cool');

        });

        it("setAttrbute", function (done) {

            myComponent.attach(wrap);
            var rect = wrap.getElementsByTagName('rect')[0];
            var size = 100;
            myComponent.data.set('size', size);
            myComponent.data.set('svgClass', 'hot');

            san.nextTick(function() {
                var svg = wrap.getElementsByTagName('svg')[0];
                expect(svg.getAttribute('class')).toBe('hot');

                expect(+rect.getAttribute('width')).toBe(size);
                done();
            });

        });

    });

}
