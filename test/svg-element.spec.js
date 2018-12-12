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

        // svg foreignObject中可以渲染一个p标签
        it("foreignObject inner html", function (done) {

            var MyComponent = san.defineComponent({
                template: '<svg width="400px" height="300px" viewBox="0 0 400 300"'
                    + 'xmlns="http://www.w3.org/2000/svg">'
                    + '<foreignObject width="100" height="50">'
                    + '<p>Here is a paragraph that requires word wrap</p>'
                    + '</foreignObject>'
                    + '<circle cx="150" cy="50" r="50"/>'
                    + '</svg>'
            });
            var myComponent = new MyComponent;

            myComponent.attach(wrap);

            var foreignObjectEl = wrap.getElementsByTagName('foreignObject')[0];
            // 好像没啥用, 不论大小写，用 getElementsByTagName 都可以查询到节点
            expect(!!foreignObjectEl).toBe(true);

            //  所以匹配节点的标签是否是大写的
            expect(/\<foreignObject/.test(foreignObjectEl.outerHTML)).toBe(true);
            expect(/\<\/foreignObject\>/.test(foreignObjectEl.outerHTML)).toBe(true);

            done();
        });

    });

}
