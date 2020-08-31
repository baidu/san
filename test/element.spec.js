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

    it("bind prop, no quotes", function () {
        var MyComponent = san.defineComponent({
            template: '<a><span title={{name}} class=text>{{name}}</span></a>'
        });
        var myComponent = new MyComponent({
            data: {
                name: 'errorrik'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.getAttribute('title')).toBe('errorrik');
        expect(span.className).toBe('text');
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
        expect(/(^| )msg( |$)/.test(span.className)).toBeTruthy();
        expect(/(^| )msg-notice( |$)/.test(span.className)).toBeTruthy();
        expect(/(^| )msg-error( |$)/.test(span.className)).toBeTruthy();

        myComponent.data.set('extra', 'msg-error');


        san.nextTick(function () {
            expect(/(^| )msg( |$)/.test(span.className)).toBeTruthy();
            expect(/(^| )msg-notice( |$)/.test(span.className)).toBeFalsy();
            expect(/(^| )msg-error( |$)/.test(span.className)).toBeTruthy();

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

    it("id prop can change", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><a id="a-{{name}}">{{name}}</a></div>'
        });
        var myComponent = new MyComponent({
            data: {
                name: 'er'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var a = document.getElementById('a-er');
        expect(a.tagName).toBe('A');

        myComponent.data.set('name', 'san');

        san.nextTick(function () {
            expect(document.getElementById('a-er') == null).toBeTruthy();
            expect(a === document.getElementById('a-san')).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });
    });

    it("html entity in text should decode collectly", function () {
        var MyComponent = san.defineComponent({
            template: '<div data-text="&lt;&amp;ddddd&quot;&gt;&#39;&#x00021;"></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(myComponent.el.getAttribute('data-text')).toBe('<&ddddd">\'!');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("html entity support is limited", function () {
        var entityStr = '&#39;&#x00021;&emsp;&ensp;&thinsp;&copy;&lt;p&gt;&reg;&lt;/p&gt;&reg;&zwnj;&zwj;&lt;&nbsp;&gt;&quot;&lll;';
        var MyComponent = san.defineComponent({
            template: '<u>' + entityStr + '</u>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var compare = document.createElement('u');
        compare.innerHTML = entityStr;
        document.body.appendChild(compare);

        expect(myComponent.el.offsetWidth).toBe(compare.offsetWidth);
        myComponent.dispose();
        document.body.removeChild(wrap);
        document.body.removeChild(compare);
    });

    it("has only s-bind attr", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><input s-bind="inputProps"><u>{{inputProps.value}}</u></div>'
        });
        var myComponent = new MyComponent({
            data: {
                inputProps: {
                    type: 'text',
                    value: 'hello'
                }
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var input = wrap.getElementsByTagName('input')[0];
        var u = wrap.getElementsByTagName('u')[0];
        expect(input.value).toBe('hello');
        expect(u.innerHTML).toContain('hello');

        myComponent.data.set('inputProps.value', 'mygod');
        myComponent.nextTick(function () {
            expect(input.value).toBe('mygod');
            expect(u.innerHTML).toContain('mygod');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("has s-bind with other attr, confilct", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><a s-bind="aProps" target="{{target}}">link</a></div>'
        });
        var myComponent = new MyComponent({
            data: {
                aProps: {
                    title: 'link',
                    href: 'http://www.baidu.com/',
                    target: '_top',
                    'data-test': 'test'
                },
                target: '_blank'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var a = wrap.getElementsByTagName('a')[0];
        expect(a.title).toBe('link');
        expect(a.target).toBe('_blank');
        expect(a.href).toContain('baidu');
        expect(a.getAttribute('data-test')).toContain('test');

        myComponent.data.set('aProps', {
            href: 'https://github.com/',
            target: '_self'
        });
        myComponent.nextTick(function () {
            expect(a.title).toBeFalsy();
            expect(a.target).toBe('_blank');
            expect(a.href).toContain('github');
            expect(a.getAttribute('data-test')).toBeFalsy();

            myComponent.data.set('target', 'test');
            myComponent.nextTick(function () {
                expect(a.target).toBe('test');

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });

    });

    it("disabled attr for normal element", function () {
        var MyComponent = san.defineComponent({
            template: '<div><a disabled checked>san</a></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var a = wrap.getElementsByTagName('a')[0];

        expect(a.hasAttribute('disabled')).toBeTruthy();
        expect(a.hasAttribute('checked')).toBeTruthy();

        // ie 是个 bt，什么元素都能 disabled
        if (!/msie/i.test(navigator.userAgent)) {
            expect(a.disabled).toBeFalsy();
            expect(a.checked).toBeFalsy();
        }

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("disabled attr for form element", function () {
        var MyComponent = san.defineComponent({
            template: '<div><button disabled>san</button></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var btn = wrap.getElementsByTagName('button')[0];
        expect(btn.disabled).toBeTruthy();

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("type attr for button element", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><form action="https://www.baidu.com/"><input type="text" value="test" name="kw"><button type="button">nosubmit</button></form></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var btn = wrap.getElementsByTagName('button')[0];
        expect(btn.getAttribute('type')).toBe('button');

        triggerEvent(btn, 'click');
        setTimeout(function () {
            done();
            myComponent.dispose();
            document.body.removeChild(wrap);
        }, 2000)
    });

    it("s- and san- attr should be ignore", function () {
        var MyComponent = san.defineComponent({
            template: '<div><a s-b="b" san-c="c">test</a></div>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var a = wrap.getElementsByTagName('a')[0];
        expect(a.hasAttribute('s-b')).toBeFalsy();
        expect(a.hasAttribute('san-c')).toBeFalsy();

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("content attr interp valued null and undefined and false", function () {
        var MyComponent = san.defineComponent({
            template: '<div undef="a{{undef}}b" nul="a{{nul}}b" falsy="a{{falsy}}b">test</div>'
        });
        var myComponent = new MyComponent({
            data: {
                nul: null,
                falsy: false
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(myComponent.el.getAttribute('undef')).toBe('ab');
        expect(myComponent.el.getAttribute('nul')).toBe('ab');
        expect(myComponent.el.getAttribute('falsy')).toBe('afalseb');

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("content attr with only one expr interp", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div undef="{{undef}}" nul="{{nul}}" falsy="{{falsy}}" truth="{{truth}}" estr="{{estr}}" zero="{{0}}">test</div>'
        });
        var myComponent = new MyComponent({
            data: {
                nul: null,
                falsy: false,
                truth: true,
                estr: ''
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(myComponent.el.hasAttribute('undef')).toBeFalsy();
        expect(myComponent.el.hasAttribute('nul')).toBeFalsy();
        expect(myComponent.el.hasAttribute('falsy')).toBeTruthy();
        expect(myComponent.el.hasAttribute('estr')).toBeTruthy();
        expect(myComponent.el.getAttribute('falsy')).toBe('false');
        expect(myComponent.el.getAttribute('estr')).toBe('');
        expect(myComponent.el.getAttribute('zero')).toBe('0');

        myComponent.data.set('nul', '');
        myComponent.data.set('undef', '');
        myComponent.nextTick(function () {
            expect(myComponent.el.hasAttribute('undef')).toBeTruthy();
            expect(myComponent.el.hasAttribute('nul')).toBeTruthy();
            expect(myComponent.el.getAttribute('undef')).toBe('');
            expect(myComponent.el.getAttribute('nul')).toBe('');

            var undef;
            myComponent.data.set('nul', null);
            myComponent.data.set('undef', undef);

            myComponent.nextTick(function () {
                expect(myComponent.el.hasAttribute('undef')).toBeFalsy();
                expect(myComponent.el.hasAttribute('nul')).toBeFalsy();

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it("s-bind includes null and undefined", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><a s-bind="sb">test</a></div>'
        });
        var undef;
        var myComponent = new MyComponent({
            data: {
                sb: {
                    nul: null,
                    falsy: false,
                    truth: true,
                    estr: '',
                    undef: undef,
                    zero: 0
                }
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var aEl = wrap.getElementsByTagName('a')[0];

        expect(aEl.hasAttribute('undef')).toBeFalsy();
        expect(aEl.hasAttribute('nul')).toBeFalsy();
        expect(aEl.hasAttribute('falsy')).toBeTruthy();
        expect(aEl.hasAttribute('estr')).toBeTruthy();
        expect(aEl.getAttribute('falsy')).toBe('false');
        expect(aEl.getAttribute('estr')).toBe('');
        expect(aEl.getAttribute('zero')).toBe('0');

        myComponent.data.set('sb.nul', '');
        myComponent.data.set('sb.undef', '');
        myComponent.nextTick(function () {
            expect(aEl.hasAttribute('undef')).toBeTruthy();
            expect(aEl.hasAttribute('nul')).toBeTruthy();
            expect(aEl.getAttribute('undef')).toBe('');
            expect(aEl.getAttribute('nul')).toBe('');

            myComponent.data.set('sb.nul', null);
            myComponent.data.set('sb.undef', undef);

            myComponent.nextTick(function () {
                expect(aEl.hasAttribute('undef')).toBeFalsy();
                expect(aEl.hasAttribute('nul')).toBeFalsy();

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it("s-bind apply to component root element", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div s-bind="sb">test</div>'
        });
        var undef;
        var myComponent = new MyComponent({
            data: {
                sb: {
                    nul: null,
                    falsy: false,
                    truth: true,
                    estr: '',
                    undef: undef,
                    zero: 0
                }
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        expect(myComponent.el.hasAttribute('undef')).toBeFalsy();
        expect(myComponent.el.hasAttribute('nul')).toBeFalsy();
        expect(myComponent.el.hasAttribute('falsy')).toBeTruthy();
        expect(myComponent.el.hasAttribute('estr')).toBeTruthy();
        expect(myComponent.el.getAttribute('falsy')).toBe('false');
        expect(myComponent.el.getAttribute('estr')).toBe('');
        expect(myComponent.el.getAttribute('zero')).toBe('0');

        myComponent.data.set('sb.nul', '');
        myComponent.data.set('sb.undef', '');
        myComponent.nextTick(function () {
            expect(myComponent.el.hasAttribute('undef')).toBeTruthy();
            expect(myComponent.el.hasAttribute('nul')).toBeTruthy();
            expect(myComponent.el.getAttribute('undef')).toBe('');
            expect(myComponent.el.getAttribute('nul')).toBe('');

            myComponent.data.set('sb.nul', null);
            myComponent.data.set('sb.undef', undef);

            myComponent.nextTick(function () {
                expect(myComponent.el.hasAttribute('undef')).toBeFalsy();
                expect(myComponent.el.hasAttribute('nul')).toBeFalsy();

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it("show directive 4 display style", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><span s-show="num == 3">{{num}}</span></div>'
        });
        var myComponent = new MyComponent({
            data: {num: 2}
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.style.display).toBe('none');

        myComponent.data.set('num', 3);

        myComponent.nextTick(function () {
            expect(span.style.display).toBe('');
            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })
    });
});
