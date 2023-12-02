describe("Component Attribute Inherit", function () {
    
    it("1 level", function (done) {
        var Inner = san.defineComponent({
            template: '<span><slot/></span>'

        });

        var MyComponent = san.defineComponent({
            template: '<div><ui-inner attr-title="{{text}}" attr-data-t="state:{{text}}">{{text}}</ui-inner></div>',

            components: {
                'ui-inner': Inner
            }
        });

        var myComponent = new MyComponent({
            data: {
                text: 'Hahaha'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML).toContain('Hahaha');
        expect(span.getAttribute('title')).toBe('Hahaha');
        expect(span.getAttribute('data-t')).toBe('state:Hahaha');

        myComponent.data.set('text', 'Wuwuwu');

        myComponent.nextTick(function () {
            expect(span.innerHTML).toContain('Wuwuwu');
            expect(span.getAttribute('title')).toBe('Wuwuwu');
            expect(span.getAttribute('data-t')).toBe('state:Wuwuwu');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("multi level", function (done) {
        var DeepInner = san.defineComponent({
            template: '<span><slot/></span>'
        });

        var Inner = san.defineComponent({
            template: '<ui-inner><slot/></ui-inner>',

            components: {
                'ui-inner': DeepInner
            }
        });

        var MyComponent = san.defineComponent({
            template: '<div><ui-inner attr-title="{{text}}" attr-data-t="state:{{text}}">{{text}}</ui-inner></div>',

            components: {
                'ui-inner': Inner
            }
        });

        var myComponent = new MyComponent({
            data: {
                text: 'Hahaha'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML).toContain('Hahaha');
        expect(span.getAttribute('title')).toBe('Hahaha');
        expect(span.getAttribute('data-t')).toBe('state:Hahaha');

        myComponent.data.set('text', 'Wuwuwu');

        myComponent.nextTick(function () {
            expect(span.innerHTML).toContain('Wuwuwu');
            expect(span.getAttribute('title')).toBe('Wuwuwu');
            expect(span.getAttribute('data-t')).toBe('state:Wuwuwu');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("inheritAttrs option to disable attr inherit, include style/class/id", function (done) {
        var Inner = san.defineComponent({
            template: '<span><slot/></span>',
            inheritAttrs: false
        });

        var MyComponent = san.defineComponent({
            template: '<div><ui-inner s-ref="inner" attr-title="{{text}}" attr-data-t="state:{{text}}" class="a" style="display:none" id="happy">{{text}}</ui-inner></div>',

            components: {
                'ui-inner': Inner
            }
        });

        var myComponent = new MyComponent({
            data: {
                text: 'Hahaha'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var innerComponent = myComponent.ref('inner');
        expect(innerComponent.data.get('$attrs')).toBeUndefined();

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML).toContain('Hahaha');
        expect(span.hasAttribute('title')).toBeFalsy();
        expect(span.hasAttribute('data-t')).toBeFalsy();
        expect(span.className).not.toContain('a');
        expect(span.id).not.toContain('happy');
        expect(span.style.display).not.toContain('none');


        myComponent.data.set('text', 'Wuwuwu');

        myComponent.nextTick(function () {
            expect(span.innerHTML).toContain('Wuwuwu');
            expect(span.hasAttribute('title')).toBeFalsy();
            expect(span.hasAttribute('data-t')).toBeFalsy();
            expect(span.className).not.toContain('a');
            expect(span.id).not.toContain('happy');
            expect(span.style.display).not.toContain('none');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("inheritAttrs static prop to disable attr inherit, include style/class/id", function (done) {
        var Inner = san.defineComponent({
            template: '<span><slot/></span>'
        });
        Inner.inheritAttrs = false;

        var MyComponent = san.defineComponent({
            template: '<div><ui-inner attr-title="{{text}}" attr-data-t="state:{{text}}" class="a" style="display:none" id="happy">{{text}}</ui-inner></div>',

            components: {
                'ui-inner': Inner
            }
        });

        var myComponent = new MyComponent({
            data: {
                text: 'Hahaha'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML).toContain('Hahaha');
        expect(span.hasAttribute('title')).toBeFalsy();
        expect(span.hasAttribute('data-t')).toBeFalsy();
        expect(span.className).not.toContain('a');
        expect(span.id).not.toContain('happy');
        expect(span.style.display).not.toContain('none');


        myComponent.data.set('text', 'Wuwuwu');

        myComponent.nextTick(function () {
            expect(span.innerHTML).toContain('Wuwuwu');
            expect(span.hasAttribute('title')).toBeFalsy();
            expect(span.hasAttribute('data-t')).toBeFalsy();
            expect(span.className).not.toContain('a');
            expect(span.id).not.toContain('happy');
            expect(span.style.display).not.toContain('none');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("component template declaration take precedence", function (done) {
        var Inner = san.defineComponent({
            template: '<span title="nothing"><slot/></span>'
        });

        var MyComponent = san.defineComponent({
            template: '<div><ui-inner attr-title="{{text}}" attr-data-t="state:{{text}}">{{text}}</ui-inner></div>',

            components: {
                'ui-inner': Inner
            }
        });

        var myComponent = new MyComponent({
            data: {
                text: 'Hahaha'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML).toContain('Hahaha');
        expect(span.getAttribute('title')).toBe('nothing');
        expect(span.getAttribute('data-t')).toBe('state:Hahaha');

        myComponent.data.set('text', 'Wuwuwu');

        myComponent.nextTick(function () {
            expect(span.innerHTML).toContain('Wuwuwu');
            expect(span.getAttribute('title')).toBe('nothing');
            expect(span.getAttribute('data-t')).toBe('state:Wuwuwu');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("inner component has $attrs data, not has attrXxx data", function (done) {
        var Inner = san.defineComponent({
            template: '<p><span s-bind="$attrs"><slot/></span></p>'
        });

        var MyComponent = san.defineComponent({
            template: '<div><ui-inner attr-title="{{text}}" attr-data-t="state:{{text}}" s-ref="inn">{{text}}</ui-inner></div>',

            components: {
                'ui-inner': Inner
            }
        });

        var myComponent = new MyComponent({
            data: {
                text: 'Hahaha'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var innComponent = myComponent.ref('inn');
        var innAttrs = innComponent.data.get('$attrs');
        expect(innAttrs.title).toBe('Hahaha');
        expect(innAttrs['data-t']).toBe('state:Hahaha');
        expect(innComponent.data.get('attrTitle')).toBeUndefined();

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML).toContain('Hahaha');
        expect(span.getAttribute('title')).toBe('Hahaha');
        expect(span.getAttribute('data-t')).toBe('state:Hahaha');

        myComponent.data.set('text', 'Wuwuwu');

        myComponent.nextTick(function () {
            expect(span.innerHTML).toContain('Wuwuwu');
            expect(span.getAttribute('title')).toBe('Wuwuwu');
            expect(span.getAttribute('data-t')).toBe('state:Wuwuwu');


            var innAttrs = innComponent.data.get('$attrs');
            expect(innAttrs.title).toBe('Wuwuwu');
            expect(innAttrs['data-t']).toBe('state:Wuwuwu');

            expect(innComponent.data.get('attrTitle')).toBeUndefined();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("spread inherit attrs to other element", function (done) {
        var Inner = san.defineComponent({
            template: '<p><span s-bind="$attrs"><slot/></span></p>'
        });

        var MyComponent = san.defineComponent({
            template: '<div><ui-inner attr-title="{{text}}" attr-data-t="state:{{text}}">{{text}}</ui-inner></div>',

            components: {
                'ui-inner': Inner
            }
        });

        var myComponent = new MyComponent({
            data: {
                text: 'Hahaha'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML).toContain('Hahaha');
        expect(span.getAttribute('title')).toBe('Hahaha');
        expect(span.getAttribute('data-t')).toBe('state:Hahaha');

        myComponent.data.set('text', 'Wuwuwu');

        myComponent.nextTick(function () {
            expect(span.innerHTML).toContain('Wuwuwu');
            expect(span.getAttribute('title')).toBe('Wuwuwu');
            expect(span.getAttribute('data-t')).toBe('state:Wuwuwu');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

});
