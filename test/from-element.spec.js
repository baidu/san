describe("Component Compile From Element", function () {

    it("update attribute", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                    email: 'errorrik@gmail.com',
                    name: 'errorrik'
                };
            }
        });


        var wrap = document.createElement('div');
        wrap.innerHTML = '<a><span title="errorrik@gmail.com" prop-title="{{email}}">errorrik</span></a>';
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });
        myComponent.attach(wrap);

        myComponent.data.set('email', 'erik168@163.com');
        myComponent.data.set('name', 'erik');

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title.indexOf('erik168@163.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })

    });

    it("update text", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                    email: 'errorrik@gmail.com',
                    name: 'errorrik'
                };
            }
        });


        var wrap = document.createElement('div');
        wrap.innerHTML = '<a><span title="errorrik@gmail.com" prop-title="{{email}}">errorrik<script type="text/san">{{name}}</script></span></a>';
        document.body.appendChild(wrap);

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });
        myComponent.attach(wrap);

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

    it("update component", function (done) {
        var Label = san.defineComponent({
            template: '<a><span title="{{title}}">{{text}}</span></a>'
        });

        var MyComponent = san.defineComponent({
            components: {
                'ui-label': Label
            },

            template: '<div><h5><ui-label bind-title="name" bind-text="jokeName"></ui-label></h5>'
                + '<p><a>{{school}}</a><u>{{company}}</u></p></div>',
        });

        var wrap = document.createElement('div');
        wrap.innerHTML = '<div><h5>'
            + '<a san-component="ui-label" bind-title="name" bind-text="jokeName"><span prop-title="{{title}}" title="errorrik">airike<script type="text/san">{{text}}</script></span></a>'
            + '</h5>'
            + '<p><a>none<script type="text/san">{{school}}</script></a><u>bidu<script type="text/san">{{company}}</script></u></p></div>';
        document.body.appendChild(wrap);


        var myComponent = new MyComponent({
            el: wrap.firstChild
        });
        // myComponent.data.set('jokeName', 'airike');
        // myComponent.data.set('name', 'errorrik');
        // myComponent.data.set('school', 'none');
        // myComponent.data.set('company', 'bidu');

        myComponent.data.set('name', 'erik');
        myComponent.data.set('jokeName', '2b');

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML.indexOf('airike')).toBe(0);
        expect(span.title).toBe('errorrik');

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML.indexOf('2b')).toBe(0);
            expect(span.title).toBe('erik');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

});
