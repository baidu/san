describe("Element", function () {

    it("empty string prop", function () {
        var MyComponent = san.defineComponent({
            template: '<a><span class="">test</span><span class="test2">test2</span></a>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var spans = wrap.getElementsByTagName('span');
        expect(spans[0].className).toBe('');
        expect(spans[1].className).toBe('test2');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("empty custom string prop", function () {
        var MyComponent = san.defineComponent({
            template: '<a><span data-name="">test</span></a>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.getAttribute('data-name')).toBe('');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("empty custom string prop, unvalue", function () {
        var MyComponent = san.defineComponent({
            template: '<a><span data-name>test</span></a>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.getAttribute('data-name')).toBe('');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("line-break attribute", function () {
        var MyComponent = san.defineComponent({
            template: '<a title="line1\r\nline2"><span title="line1\r\nline2">test</span><span class="test2">test2</span></a>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var a = wrap.getElementsByTagName('a')[0];
        expect(a.title.indexOf('line1') >= 0).toBeTruthy();
        expect(a.title.indexOf('line2') >= 0).toBeTruthy();
        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title.indexOf('line1') >= 0).toBeTruthy();
        expect(span.title.indexOf('line2') >= 0).toBeTruthy();

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("attribute with space around equal operator", function () {
        var MyComponent = san.defineComponent({
            template: '<a title = "test0"><span title  ="test1">test1</span><span title=  "test2">test2</span></a>'
        });
        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);
        var a = wrap.getElementsByTagName('a')[0];
        expect(a.title).toBe('test0');
        var spans = wrap.getElementsByTagName('span');
        expect(spans[0].title).toBe('test1');
        expect(spans[1].title).toBe('test2');
        myComponent.dispose();
        document.body.removeChild(wrap);
    });


    it("bind prop, data change before attach", function () {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{name}}">{{name}}</span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'errorrik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.getAttribute('title')).toBe('errorrik');
        expect(span.innerHTML.indexOf('errorrik')).toBe(0);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("bind prop, which has xxx- prefix", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a data-name="{{name}}"><span data-name="{{name}}">{{name}}</span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'errorrik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var a = wrap.firstChild;
        var span = a.firstChild;
        expect(span.getAttribute('data-name')).toBe('errorrik');
        expect(a.getAttribute('data-name')).toBe('errorrik');


        myComponent.data.set('name', 'erik');

        san.nextTick(function () {
            expect(span.getAttribute('data-name')).toBe('erik');
            expect(a.getAttribute('data-name')).toBe('erik');
            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });


    it("bind prop, data change after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span title="{{name}}">{{name}}</span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'errorrik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;

        expect(span.getAttribute('title')).toBe('errorrik');
        expect(span.innerHTML.indexOf('errorrik')).toBe(0);

        myComponent.data.set('name', 'varsha');

        expect(span.title).toBe('errorrik');
        expect(span.innerHTML.indexOf('errorrik')).toBe(0);

        san.nextTick(function () {
            expect(span.title).toBe('varsha');
            expect(span.innerHTML.indexOf('varsha')).toBe(0)


            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });


    it("bind class", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span class="msg {{extra}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('extra', 'msg-notice');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.className).toBe('msg msg-notice');

        myComponent.data.set('extra', 'msg-error');


        san.nextTick(function () {
            expect(span.className).toBe('msg msg-error');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind class, auto expand array", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span class="msg {{extra}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('extra', ['msg-notice', 'msg-error']);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.className).toBe('msg msg-notice msg-error');

        myComponent.data.set('extra', 'msg-error');


        san.nextTick(function () {
            expect(span.className).toBe('msg msg-error');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind style", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span style="position: absolute; display: {{display}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('display', 'block');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.style.position).toBe('absolute');
        expect(span.style.display).toBe('block');

        myComponent.data.set('display', 'none');


        san.nextTick(function () {
            expect(span.style.position).toBe('absolute');
            expect(span.style.display).toBe('none');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind style, auto expand object", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span style="position: absolute; display: {{display}}; {{extra}}"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('display', 'block');
        myComponent.data.set('extra', {
            height: '20px',
            width: '100px'
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.style.position).toBe('absolute');
        expect(span.style.display).toBe('block');
        expect(span.style.width).toBe('100px');
        expect(span.style.height).toBe('20px');

        myComponent.data.set('display', 'none');
        myComponent.data.set('extra.height', '50px');


        san.nextTick(function () {
            expect(span.style.position).toBe('absolute');
            expect(span.style.display).toBe('none');
            expect(span.style.width).toBe('100px');
            expect(span.style.height).toBe('50px');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind input valued undefined", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><input type="text" value="{=info.value=}"></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var input = wrap.getElementsByTagName('input')[0];
        expect(input.value).toBe('');

        myComponent.data.set('info', {value: 'true'});


        san.nextTick(function () {
            expect(input.value).toBe('true');

            myComponent.data.set('info', {});

            san.nextTick(function () {
                expect(input.value).toBe('');
                myComponent.dispose();
                document.body.removeChild(wrap);

                done();
            });
        });
    });

    it("bind draggable", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><div draggable="{{draggable}}"></div></a>'
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);

        var myComponent = new MyComponent();
        myComponent.attach(wrap);

        san.nextTick(function () {

            var span = wrap.firstChild.firstChild;
            expect(span.draggable).toBeFalsy();

            // change data
            myComponent.data.set('draggable', true);

            // next tick
            san.nextTick(function (){

                expect(span.draggable).toBeTruthy();

                myComponent.dispose();
                document.body.removeChild(wrap);

                done();

            });

        });
    });

    it("bind multiple", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><input type="file" multiple="{{ed}}"></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var input = wrap.getElementsByTagName('input')[0];
        expect(input.multiple).toBeFalsy();

        myComponent.data.set('ed', true);


        san.nextTick(function () {
            expect(input.multiple).toBeTruthy();


            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind disabled", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><input type="text" disabled="{{ed}}"><textarea disabled="{{ed}}"></textarea><button disabled="{{ed}}">btn</button></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var input = wrap.getElementsByTagName('input')[0];
        var textarea = wrap.getElementsByTagName('textarea')[0];
        var btn = wrap.getElementsByTagName('button')[0];
        expect(input.disabled).toBeFalsy();
        expect(textarea.disabled).toBeFalsy();
        expect(btn.disabled).toBeFalsy();

        myComponent.data.set('ed', true);


        san.nextTick(function () {
            expect(input.disabled).toBeTruthy();
            expect(textarea.disabled).toBeTruthy();
            expect(btn.disabled).toBeTruthy();


            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind disabled, init false value", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><input type="text" disabled="{{ed}}"><textarea disabled="{{ed}}"></textarea><button disabled="{{ed}}">btn</button></div>'
        });
        var myComponent = new MyComponent({
            data: {ed: false}
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var input = wrap.getElementsByTagName('input')[0];
        var textarea = wrap.getElementsByTagName('textarea')[0];
        var btn = wrap.getElementsByTagName('button')[0];
        expect(input.disabled).toBeFalsy();
        expect(textarea.disabled).toBeFalsy();
        expect(btn.disabled).toBeFalsy();

        myComponent.data.set('ed', true);

        san.nextTick(function () {
            expect(input.disabled).toBeTruthy();
            expect(textarea.disabled).toBeTruthy();
            expect(btn.disabled).toBeTruthy();


            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind disabled, init true value", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><input type="text" disabled="{{ed}}"><textarea disabled="{{ed}}"></textarea><button disabled="{{ed}}">btn</button></div>'
        });
        var myComponent = new MyComponent({
            data: {ed: true}
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var input = wrap.getElementsByTagName('input')[0];
        var textarea = wrap.getElementsByTagName('textarea')[0];
        var btn = wrap.getElementsByTagName('button')[0];
        expect(input.disabled).toBeTruthy();
        expect(textarea.disabled).toBeTruthy();
        expect(btn.disabled).toBeTruthy();

        myComponent.data.set('ed', false);

        san.nextTick(function () {
            expect(input.disabled).toBeFalsy();
            expect(textarea.disabled).toBeFalsy();
            expect(btn.disabled).toBeFalsy();

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("bind readonly", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><input type="text" readonly="{{ed}}"><textarea readonly="{{ed}}"></textarea></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var input = wrap.getElementsByTagName('input')[0];
        var textarea = wrap.getElementsByTagName('textarea')[0];
        expect(input.readOnly).toBeFalsy();
        expect(textarea.readOnly).toBeFalsy();

        myComponent.data.set('ed', true);


        san.nextTick(function () {
            expect(input.readOnly).toBeTruthy();
            expect(textarea.readOnly).toBeTruthy();


            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("form no value attribute", function () {
        var MyComponent = san.defineComponent({
            template: '<div><input type="text" disabled></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var input = wrap.getElementsByTagName('input')[0];
        expect(input.disabled).toBeTruthy();


        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("s-html", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span s-html="html"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('html', '<b>xxx</b>');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(/^<b>xxx<\/b>/i.test(span.innerHTML)).toBeTruthy();


        myComponent.data.set('html', '<b>aaa</b>');


        san.nextTick(function () {

            expect(/^<b>aaa<\/b>/i.test(span.innerHTML)).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("s-html with filter", function (done) {
        var MyComponent = san.defineComponent({
            filters: {
                b: function (source) {
                    return '<b>' + source.replace(/^b:/, '') + '</b>';
                }
            },

            template: '<a><span s-html="html|b"></span></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('html', 'b:xxx');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(/^<b>xxx<\/b>/i.test(span.innerHTML)).toBeTruthy();


        myComponent.data.set('html', 'b:aaa');


        san.nextTick(function () {

            expect(/^<b>aaa<\/b>/i.test(span.innerHTML)).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });



    it("complex structure in textnode", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span>aaa</span>hello {{name|raw}}!<b>bbb</b></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'er<u>erik</u>ik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var a = wrap.getElementsByTagName('a')[0];
        var b = wrap.getElementsByTagName('b')[0];
        expect(/hello er<u>erik<\/u>ik!/i.test(a.innerHTML)).toBeTruthy();
        expect(b.innerHTML).toBe('bbb');

        myComponent.data.set('name', 'er<span>erik</span>ik');

        san.nextTick(function () {
            expect(/hello er<span>erik<\/span>ik!/i.test(a.innerHTML)).toBeTruthy();
            expect(b.innerHTML).toBe('bbb');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("complex structure in textnode, no prev sibling", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a>hello {{name|raw}}!<b>bbb</b></a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'er<u>erik</u>ik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var a = wrap.getElementsByTagName('a')[0];
        var b = wrap.getElementsByTagName('b')[0];

        expect(/hello er<u>erik<\/u>ik!/i.test(a.innerHTML)).toBeTruthy();
        expect(b.innerHTML).toBe('bbb');

        myComponent.data.set('name', 'er<span>erik</span>ik');

        san.nextTick(function () {
            expect(/hello er<span>erik<\/span>ik!/i.test(a.innerHTML)).toBeTruthy();
            expect(b.innerHTML).toBe('bbb');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("complex structure in textnode, no next sibling", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a><span>aaa</span>hello {{name|raw}}!</a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'er<u>erik</u>ik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var a = wrap.getElementsByTagName('a')[0];
        expect(/hello er<u>erik<\/u>ik!/i.test(a.innerHTML)).toBeTruthy();

        myComponent.data.set('name', 'er<span>erik</span>ik');

        san.nextTick(function () {
            expect(/hello er<span>erik<\/span>ik!/i.test(a.innerHTML)).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("complex structure in textnode, no sibling", function (done) {
        var MyComponent = san.defineComponent({
            template: '<a>hello {{name|raw}}!</a>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'er<u>erik</u>ik');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var a = wrap.getElementsByTagName('a')[0];
        expect(/er<u>erik<\/u>ik/i.test(a.innerHTML)).toBeTruthy();

        myComponent.data.set('name', 'er<span>erik</span>ik');

        san.nextTick(function () {
            expect(/er<span>erik<\/span>ik/i.test(a.innerHTML)).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });


    it("id prop compatibility", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul id="test"><li s-for="name in list" id="it-{{name}}">{{name}}</li></ul>'
        });
        var myComponent = new MyComponent({
            data: {
                list: ['errorrik', 'leeight']
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var ul = document.getElementById('test');
        expect(ul.tagName).toBe('UL');

        expect(document.getElementById('it-errorrik').innerHTML).toBe('errorrik');
        expect(document.getElementById('it-leeight').innerHTML).toBe('leeight');

        myComponent.data.set('list[0]', '2b');

        san.nextTick(function () {
            expect(document.getElementById('it-errorrik') == null).toBeTruthy();
            expect(document.getElementById('it-2b').innerHTML).toBe('2b');
            expect(document.getElementById('it-leeight').innerHTML).toBe('leeight');

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });
});
