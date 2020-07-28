describe("Component Compile", function () {

    it("simple component use san.parseComponentTemplate, and remove template", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{name}}">{{name}}</span></a>'
        });

        expect(MyComponent.prototype.aNode == null).toBeTruthy();
        MyComponent.prototype.aNode = san.parseComponentTemplate(MyComponent);
        MyComponent.prototype.template = null;

        var myComponent = new MyComponent({
            data: {
                name: 'er'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('er');
        expect(span.innerHTML.indexOf('er')).toBe(0);
        myComponent.data.set('name', 'san');
        myComponent.nextTick(function () {
            expect(span.title).toBe('san');
            expect(span.innerHTML.indexOf('san')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });

    });

    it("unpack from prototype aPack", function (done) {
        var MyComponent = san.defineComponent({
            aPack: [1,"a",4,2,"class",7,,6,1,3,"class",1,8,6,1,3,"_class",,2,"style",7,,6,1,3,"style",1,8,6,1,3,"_style",,2,"id",6,1,3,"id",1,"span",2,2,"title",6,1,3,"name",,9,,1,7,,6,1,3,"name",]
        });

        expect(MyComponent.prototype.aNode == null).toBeTruthy();

        var myComponent = new MyComponent({
            data: {
                name: 'er'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('er');
        expect(span.innerHTML.indexOf('er')).toBe(0);
        myComponent.data.set('name', 'san');
        myComponent.nextTick(function () {
            expect(span.title).toBe('san');
            expect(span.innerHTML.indexOf('san')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });

    });

    it("unpack from aPack static prop", function (done) {
        var MyComponent = san.defineComponent({
        });
        MyComponent.aPack = [1,"a",4,2,"class",7,,6,1,3,"class",1,8,6,1,3,"_class",,2,"style",7,,6,1,3,"style",1,8,6,1,3,"_style",,2,"id",6,1,3,"id",1,"span",2,2,"title",6,1,3,"name",,9,,1,7,,6,1,3,"name",];

        expect(MyComponent.prototype.aNode == null).toBeTruthy();

        var myComponent = new MyComponent({
            data: {
                name: 'er'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('er');
        expect(span.innerHTML.indexOf('er')).toBe(0);
        myComponent.data.set('name', 'san');
        myComponent.nextTick(function () {
            expect(span.title).toBe('san');
            expect(span.innerHTML.indexOf('san')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });

    });

    it("use aPack from parseTemplate", function () {

        var File = san.defineComponent({
            // template: '<span>erik</span>',
            aPack: [1,,1,1,"span",1,,3,"erik"]
        });

        var Folder = san.defineComponent({
            template: '<div><f class="customClass" id="customId" style="color: red;" /></div>',
            components: {
                f: File
            }
        });

        var myComponent = new Folder();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.id).toBe('customId');
        expect(span.style.color).toBe('red');
        expect(span.getAttribute('class')).toBe('customClass');

    });
});
