describe("Element", function () {

    sanVM.addFilter('uppercase', function (source) {
        if (source) {
            return source.charAt(0).toUpperCase() + source.slice(1);
        }

        return source;
    });

    it("bind prop, data change before attach", function () {
        var MyComponent = sanVM.Component({
            template: '<span title="{{name}}">{{name}}</span>'
        });
        var myComponent = new MyComponent();
        myComponent.set('name', 'errorrik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;

        expect(span.getAttribute('title')).toBe('errorrik');
        expect(span.firstChild.textContent || span.firstChild.innerText).toBe('errorrik');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });


    it("bind prop, data change after attach", function (done) {
        var MyComponent = sanVM.Component({
            template: '<span title="{{name}}">{{name}}</span>'
        });
        var myComponent = new MyComponent();
        myComponent.set('name', 'errorrik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;

        expect(span.getAttribute('title')).toBe('errorrik');
        expect(span.firstChild.textContent || span.firstChild.innerText).toBe('errorrik');

        myComponent.set('name', 'varsha');

        expect(span.title).toBe('errorrik');
        expect(span.firstChild.textContent || span.firstChild.innerText).toBe('errorrik');

        sanVM.nextTick(function () {
            expect(span.title).toBe('varsha');
            expect(span.firstChild.textContent || span.firstChild.innerText).toBe('varsha');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });




});
