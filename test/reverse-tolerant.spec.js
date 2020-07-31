/**
 * 规范的 SSR 和反解 HTML 维护在 san-html-cases
 * 这里只维护反解额外兼容的不规范 HTML
 */
describe("Reverse", function () {
    it("whitespace between data comment", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{email}}">{{name}}</span></a>'
        });
        var wrap = document.createElement('div');
        wrap.innerHTML = '<a>\n    <!--s-data:{"email":"errorrik@gmail.com","name":"errorrik"}--><span title="errorrik@gmail.com">errorrik</span></a>'
        document.body.appendChild(wrap)
        var myComponent = new MyComponent({ el: wrap.firstChild });

        expect(myComponent.data.get('email')).toBe('errorrik@gmail.com');
        expect(myComponent.data.get('name')).toBe('errorrik');
        myComponent.data.set('email', 'erik168@163.com');
        myComponent.data.set('name', 'erik');

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML.indexOf('erik')).toBe(0);
            expect(span.title.indexOf('erik168@163.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });
});
