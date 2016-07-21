describe("Expr update detect", function () {

    san.addFilter('upx', function (source, first) {
        if (source) {
            if (first) {
                return source.charAt(0).toUpperCase() + source.slice(1);
            }

            return source.toUpperCase();
        }

        return source;
    });

    it("simple text", function (done) {
        var MyComponent = san.Component({
            template: '<span title="{{name}}">{{name}}</span>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'er');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('er');
        myComponent.data.set('name', 'san');
        san.nextTick(function () {
            expect(span.title).toBe('san');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("complex text", function (done) {
        var MyComponent = san.Component({
            template: '<span title="hello {{val1}}, have dinner with {{val2}}?"></span>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 'er');
        myComponent.data.set('val2', 'san');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('hello er, have dinner with san?');
        myComponent.data.set('val2', 'etpl');

        san.nextTick(function () {
            expect(span.title).toBe('hello er, have dinner with etpl?');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("text has interpolation and filter", function (done) {
        var MyComponent = san.Component({
            template: '<span title="hello {{name | upx(!all)}}!"></span>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'san');
        myComponent.data.set('all', true);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('hello SAN!');
        myComponent.data.set('all', false);

        san.nextTick(function () {
            expect(span.title).toBe('hello San!');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });


    it("bind ident", function (done) {
        var MyComponent = san.Component({
            template: '<span bind-title="name"></span>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'er');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('er');
        myComponent.data.set('name', 'san');

        san.nextTick(function () {
            expect(span.title).toBe('san');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind unary", function (done) {
        var MyComponent = san.Component({
            template: '<span bind-title="!val1"></span>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 10);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('false');
        myComponent.data.set('val1', 0);

        san.nextTick(function () {
            expect(span.title).toBe('true');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind binary", function (done) {
        var MyComponent = san.Component({
            template: '<span bind-title="val1 + val2"></span>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 10);
        myComponent.data.set('val2', 10);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('20');
        myComponent.data.set('val2', 5);

        san.nextTick(function () {
            expect(span.title).toBe('15');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind binary complex", function (done) {
        var MyComponent = san.Component({
            template: '<span bind-title="val1 + val2 * val3 / val4"></span>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 10);
        myComponent.data.set('val2', 10);
        myComponent.data.set('val3', 10);
        myComponent.data.set('val4', 5);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('30');
        myComponent.data.set('val2', 5);

        san.nextTick(function () {
            expect(span.title).toBe('20');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind property accessor, set item", function (done) {
        var MyComponent = san.Component({
            template: '<span bind-title="p.name"></span>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('p', {
            name: 'erik',
            email: 'errorrik@gmail.com'
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('erik');
        myComponent.data.set('p.name', 'errorrik');

        san.nextTick(function () {
            expect(span.title).toBe('errorrik');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });


    it("bind property accessor, set outer data", function (done) {
        var MyComponent = san.Component({
            template: '<span bind-title="p.org.name"></span>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('p', {
            name: 'erik',
            email: 'errorrik@gmail.com',
            org: {
                name: 'efe',
                company: 'baidu'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('efe');
        myComponent.data.set('p', {
            name: 'erik',
            email: 'errorrik@gmail.com',
            org: {
                name: 'ssg',
                company: 'baidu'
            }
        });

        san.nextTick(function () {
            expect(span.title).toBe('ssg');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind property accessor, variable item", function (done) {
        var MyComponent = san.Component({
            template: '<span bind-title="p.orgs[index].name"></span>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('p', {
            name: 'erik',
            email: 'errorrik@gmail.com',
            orgs: [
                {
                    name: 'efe',
                    company: 'baidu'
                },

                {
                    name: 'ssg',
                    company: 'baidu'
                }
            ]
        });
        myComponent.data.set('index', 0);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('efe');

        myComponent.data.set('index', 1);

        san.nextTick(function () {
            expect(span.title).toBe('ssg');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind property accessor, after level of variable item", function (done) {
        var MyComponent = san.Component({
            template: '<span bind-title="p.orgs[index].name"></span>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('p', {
            name: 'erik',
            email: 'errorrik@gmail.com',
            orgs: [
                {
                    name: 'efe',
                    company: 'baidu'
                },

                {
                    name: 'ssg',
                    company: 'baidu'
                }
            ]
        });
        myComponent.data.set('index', 0);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('efe');

        myComponent.data.set('p.orgs[0].name', 'mms');

        san.nextTick(function () {
            expect(span.title).toBe('mms');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind property accessor, before level of variable item", function (done) {
        var MyComponent = san.Component({
            template: '<span bind-title="p.orgs[index].name"></span>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('p', {
            name: 'erik',
            email: 'errorrik@gmail.com',
            orgs: [
                {
                    name: 'efe',
                    company: 'baidu'
                },

                {
                    name: 'ssg',
                    company: 'baidu'
                }
            ]
        });
        myComponent.data.set('index', 0);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('efe');

        myComponent.data.set('p.orgs', [
            {
                name: 'ssg',
                company: 'baidu'
            },
            {
                name: 'efe',
                company: 'baidu'
            }
        ]);

        san.nextTick(function () {
            expect(span.title).toBe('ssg');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind property accessor, in variable item", function (done) {
        var MyComponent = san.Component({
            template: '<span bind-title="p.orgs[index].name"></span>',
        });
        var myComponent = new MyComponent();
        myComponent.data.set('p', {
            name: 'erik',
            email: 'errorrik@gmail.com',
            orgs: [
                {
                    name: 'efe',
                    company: 'baidu'
                },

                {
                    name: 'ssg',
                    company: 'baidu'
                }
            ]
        });
        myComponent.data.set('index', 0);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.title).toBe('efe');

        myComponent.data.set('p.orgs[0]', {
            name: 'mms',
            company: 'baidu'
        });

        san.nextTick(function () {
            expect(span.title).toBe('mms');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });
});
