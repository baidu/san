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

    it("bool value and bool attr", function (done) {
        var Inner = san.defineComponent({
            template: '<button><slot/></button>'

        });

        var MyComponent = san.defineComponent({
            template: '<div><ui-inner attr-title="{{text}}" attr-disabled attr-data-d attr-data-disabled="{{ed}}">{{text}}</ui-inner></div>',

            components: {
                'ui-inner': Inner
            }
        });

        var myComponent = new MyComponent({
            data: {
                text: 'Hahaha',
                ed: true
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var btn = wrap.getElementsByTagName('button')[0];
        expect(btn.getAttribute('title')).toBe('Hahaha');
        expect(btn.getAttribute('data-d')).toBe('');
        expect(btn.disabled).toBeTruthy();
        expect(btn.getAttribute('data-disabled')).toBe('true');

        myComponent.data.set('ed', 'false');

        myComponent.nextTick(function () {
            expect(btn.disabled).toBeTruthy();
            expect(btn.getAttribute('data-disabled')).toBe('false');

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
            template: '<ui-inner attr-data-c="cover"><slot/></ui-inner>',

            components: {
                'ui-inner': DeepInner
            }
        });

        var MyComponent = san.defineComponent({
            template: '<div><ui-inner class="{{clz}}" attr-title="{{text}}" attr-data-t="state:{{text}}" attr-data-c="cover:{{text}}">{{text}}</ui-inner></div>',

            components: {
                'ui-inner': Inner
            }
        });

        var myComponent = new MyComponent({
            data: {
                text: 'Hahaha',
                clz: 'out-cls'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML).toContain('Hahaha');
        expect(span.className).toContain('out-cls');
        expect(span.getAttribute('title')).toBe('Hahaha');
        expect(span.getAttribute('data-t')).toBe('state:Hahaha');
        expect(span.getAttribute('data-c')).toBe('cover');

        myComponent.data.set('text', 'Wuwuwu');

        myComponent.nextTick(function () {
            expect(span.innerHTML).toContain('Wuwuwu');
            expect(span.getAttribute('title')).toBe('Wuwuwu');
            expect(span.getAttribute('data-t')).toBe('state:Wuwuwu');
            expect(span.getAttribute('data-c')).toBe('cover')

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
        expect(innerComponent.data.get('$attrs').title).toContain('Hahaha');
        expect(innerComponent.data.get('$attrs')['data-t']).toContain('state:Hahaha');

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
            template: '<p><span><slot/></span></p>'
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


        var p = wrap.getElementsByTagName('p')[0];
        expect(p.getAttribute('title')).toBe('Hahaha');
        expect(p.getAttribute('data-t')).toBe('state:Hahaha');

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML).toContain('Hahaha');
        expect(span.hasAttribute('title')).toBeFalsy();
        expect(span.hasAttribute('data-t')).toBeFalsy();

        myComponent.data.set('text', 'Wuwuwu');

        myComponent.nextTick(function () {
            expect(span.innerHTML).toContain('Wuwuwu');
            expect(p.getAttribute('title')).toBe('Wuwuwu');
            expect(p.getAttribute('data-t')).toBe('state:Wuwuwu');


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
            template: '<p><span s-bind="$attrs"><slot/></span></p>',
            inheritAttrs: false
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

        var p = wrap.getElementsByTagName('p')[0];
        expect(p.hasAttribute('title')).toBeFalsy();
        expect(p.hasAttribute('data-t')).toBeFalsy();

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
