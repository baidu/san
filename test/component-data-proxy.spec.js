describe("Component Data Proxy", function () {
    it("simple item", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{name}}">{{name}}</span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.d.name = 'er';

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('er');
        expect(span.innerHTML.indexOf('er')).toBe(0);
        
        myComponent.d.name = 'san';
        expect(myComponent.d.name).toBe('san');
        expect(myComponent.data.get('name')).toBe('san');
        san.nextTick(function () {
            expect(span.title).toBe('san');
            expect(span.innerHTML.indexOf('san')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("whole object", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{p.org.name}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.d.p = {
            name: 'erik',
            email: 'errorrik@gmail.com',
            org: {
                name: 'efe',
                company: 'baidu'
            }
        };

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('efe');
        myComponent.d.p = {
            name: 'erik',
            email: 'errorrik@gmail.com',
            org: {
                name: 'ssg',
                company: 'baidu'
            }
        };

        san.nextTick(function () {
            expect(span.title).toBe('ssg');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });


    it("deep item", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{p.org.name}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.d.p = {
            name: 'erik',
            email: 'errorrik@gmail.com',
            org: {
                name: 'efe',
                company: 'baidu'
            }
        };

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('efe');
        myComponent.d.p.org.name = 'ssg';

        san.nextTick(function () {
            expect(span.title).toBe('ssg');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });
});