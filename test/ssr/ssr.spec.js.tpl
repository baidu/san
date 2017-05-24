describe("Component serialize from compiled renderer and reverse", function () {

    it("update attribute", function (done) {
        ##cmpt1##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        expect(wrap.firstChild.className).toBe('');
        expect(myComponent.data.get('email')).toBe('errorrik@gmail.com');
        expect(myComponent.data.get('name')).toBe('errorrik');
        myComponent.data.set('email', 'erik168@163.com');
        myComponent.data.set('name', 'erik');

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('erik168@163.com');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        })

    });

    it("update text", function (done) {
        ##cmpt2##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });


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

    it("update component", function (done) {
        ##cmpt3##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        expect(myComponent.data.get('jokeName')).toBe('airike');
        expect(myComponent.data.get('name')).toBe('errorrik');
        myComponent.data.set('name', 'erik');
        myComponent.data.set('jokeName', '2b');

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML.indexOf('airike')).toBe(0);
        expect(span.title).toBe('errorrik');

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML.indexOf('2b')).toBe(0);
            expect(span.title).toBe('erik');
            expect(myComponent.data.get('jokeName')).toBe('2b');
            expect(myComponent.data.get('name')).toBe('erik');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("update component, main element has attribute", function (done) {
        ##cmpt4##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        myComponent.data.set('name', 'erik');
        myComponent.data.set('jokeName', '2bbbbbbb');

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML.indexOf('airike') >= 0).toBeTruthy();
        expect(span.title).toBe('airike');

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML.indexOf('2bbbbbbb') >= 0).toBeTruthy();
            expect(span.title).toBe('2bbbbbbb');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("update component, merge init data and given data", function (done) {
        ##cmpt5##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML.indexOf('airike') >= 0).toBeTruthy();
        expect(span.title).toBe('title');
        var a = wrap.getElementsByTagName('a')[0];
        expect(a.title).toBe('none');
        var u = wrap.getElementsByTagName('u')[0];
        expect(u.title).toBe('bidu');

        myComponent.data.set('school', 'hainan-mid');
        myComponent.data.set('jokeName', '2bbbbbbb');

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML.indexOf('2bbbbbbb') >= 0).toBeTruthy();
            expect(span.title).toBe('title');
            var a = wrap.getElementsByTagName('a')[0];
            expect(a.title).toBe('hainan-mid');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("update for, init with empty data", function (done) {
        ##cmpt6##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(2);

        myComponent.data.push('persons',
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        );

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(3);
            expect(lis[1].getAttribute('title')).toBe('otakustay');
            expect(lis[1].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("push update for, init with many data", function (done) {
        ##cmpt7##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('errorrik');
        expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);

        myComponent.data.push('persons',
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        );

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(5);
            expect(lis[3].getAttribute('title')).toBe('otakustay');
            expect(lis[3].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });


    it("remove update for, init with many data", function (done) {
        ##cmpt8##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        myComponent.data.removeAt('persons', 0);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('errorrik');
        expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);


        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(3);
            expect(lis[1].getAttribute('title')).toBe('otakustay');
            expect(lis[1].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });


    it("set update for, init with many data", function (done) {
        ##cmpt9##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        myComponent.data.set('persons[0]', {name: 'erik', email: 'erik168@163.com'});

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('errorrik');
        expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);


        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(4);
            expect(lis[1].getAttribute('title')).toBe('erik');
            expect(lis[1].innerHTML.indexOf('erik - erik168@163.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("update if, init with true", function (done) {
        ##cmpt10##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        expect(myComponent.data.get('name')).toBe('errorrik');
        myComponent.data.set('cond', false);
        var span = wrap.getElementsByTagName('span')[0];
        expect(span.title).toBe('errorrik');


        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(0);

            myComponent.data.set('cond', true);

            san.nextTick(function () {
                var span = wrap.getElementsByTagName('span')[0];
                expect(span.title).toBe('errorrik');
                expect(span.innerHTML.indexOf('errorrik') >= 0).toBeTruthy();


                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it("update if, init with false", function (done) {
        ##cmpt11##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        myComponent.data.set('cond', true);
        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(0);


        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.title).toBe('errorrik');
            expect(span.innerHTML.indexOf('errorrik')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("update else, init with false", function (done) {
        ##cmpt12##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        myComponent.data.set('cond', true);
        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);
        expect(spans[0].title).toBe('otakustay');
        expect(spans[0].innerHTML.indexOf('otakustay')).toBe(0);


        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);
            expect(spans[0].title).toBe('errorrik');
            expect(spans[0].innerHTML.indexOf('errorrik')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("update else, init with true", function (done) {
        ##cmpt13##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        myComponent.data.set('cond', false);
        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(1);
        expect(spans[0].title).toBe('errorrik');
        expect(spans[0].innerHTML.indexOf('errorrik')).toBe(0);


        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(1);
            expect(spans[0].title).toBe('otakustay');
            expect(spans[0].innerHTML.indexOf('otakustay')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it('default and named slot', function (done) {
        ##cmpt14##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        var u = wrap.getElementsByTagName('u')[0];
        var p = wrap.getElementsByTagName('p')[0];
        var h3 = wrap.getElementsByTagName('h3')[0];
        expect(u.title).toBe('tab');
        expect(p.title).toBe('one');
        expect(h3.title).toBe('1');

        myComponent.data.set('tabText', 'ctab');
        myComponent.data.set('text', 'two');
        myComponent.data.set('title', '2');

        san.nextTick(function () {
            expect(u.title).toBe('ctab');
            expect(p.title).toBe('two');
            expect(h3.title).toBe('2');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it('default and named slot, content by default', function (done) {
        ##cmpt15##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        var p = wrap.getElementsByTagName('p')[0];
        var h3 = wrap.getElementsByTagName('h3')[0];
        expect(p.title).toBe('five');
        expect(h3.title).toBe('5');

        myComponent.data.set('text', 'two');
        myComponent.data.set('title', '2');
        myComponent.data.set('tText', 'six');
        myComponent.data.set('tTitle', '6');

        san.nextTick(function () {
            expect(p.title).toBe('six');
            expect(h3.title).toBe('6');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("two way binding text value", function (done) {
        ##cmpt16##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        var span = wrap.getElementsByTagName('span')[0];
        var input = wrap.getElementsByTagName('input')[0];
        expect(span.title).toBe('errorrik');
        expect(input.value).toBe('errorrik');


        function doneSpec() {
            var name = myComponent.data.get('name');

            if (name !== 'errorrik') {
                expect(span.title).toBe(name);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
                return;
            }

            setTimeout(doneSpec, 500);
        }

        triggerEvent('#' + input.id, 'input', 'test' + (+new Date()));
        setTimeout(doneSpec, 500);

    });

    it("two way binding textarea value", function (done) {
        ##cmpt17##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        var span = wrap.getElementsByTagName('span')[0];
        var input = wrap.getElementsByTagName('textarea')[0];
        expect(span.title).toBe('errorrik');
        expect(input.value).toBe('errorrik');


        function doneSpec() {
            var name = myComponent.data.get('name');

            if (name !== 'errorrik') {
                expect(span.title).toBe(name);

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
                return;
            }

            setTimeout(doneSpec, 500);
        }

        triggerEvent('#' + input.id, 'input', 'test' + (+new Date()));
        setTimeout(doneSpec, 500);

    });

    it("component with san-if, init with true", function (done) {
        ##cmpt18##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        expect(myComponent.data.get('jokeName')).toBe('airike');
        expect(myComponent.data.get('name')).toBe('errorrik');
        myComponent.data.set('name', 'erik');
        myComponent.data.set('jokeName', '2b');

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML.indexOf('airike')).toBe(0);
        expect(span.title).toBe('errorrik');

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML.indexOf('2b')).toBe(0);
            expect(span.title).toBe('erik');
            expect(myComponent.data.get('jokeName')).toBe('2b');
            expect(myComponent.data.get('name')).toBe('erik');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("component with san-if, init with false", function (done) {
        ##cmpt19##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        // expect(myComponent.data.get('jokeName')).toBe('airike');
        // expect(myComponent.data.get('name')).toBe('errorrik');
        myComponent.data.set('name', 'erik');
        myComponent.data.set('jokeName', '2b');
        myComponent.data.set('cond', true);

        // var span = wrap.getElementsByTagName('span')[0];
        // expect(span.innerHTML.indexOf('airike')).toBe(0);
        // expect(span.title).toBe('errorrik');

        san.nextTick(function () {
            var span = wrap.getElementsByTagName('span')[0];
            expect(span.innerHTML.indexOf('2b')).toBe(0);
            expect(span.title).toBe('erik');
            expect(myComponent.data.get('jokeName')).toBe('2b');
            expect(myComponent.data.get('name')).toBe('erik');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("component with san-if, init with true, change much times", function (done) {
        ##cmpt20##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        expect(myComponent.data.get('jokeName')).toBe('airike');
        expect(myComponent.data.get('name')).toBe('errorrik');
        myComponent.data.set('name', 'erik');
        myComponent.data.set('jokeName', '2b');

        myComponent.data.set('cond', false);

        var span = wrap.getElementsByTagName('span')[0];
        expect(span.innerHTML.indexOf('airike')).toBe(0);
        expect(span.title).toBe('errorrik');

        san.nextTick(function () {
            expect(wrap.getElementsByTagName('span').length).toBe(0);
            myComponent.data.set('cond', true);

            san.nextTick(function () {
                var span = wrap.getElementsByTagName('span')[0];
                expect(span.innerHTML.indexOf('2b')).toBe(0);
                expect(span.title).toBe('erik');
                expect(myComponent.data.get('jokeName')).toBe('2b');
                expect(myComponent.data.get('name')).toBe('erik');


                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });

    });

    it("component with san-for, then push", function (done) {
        ##cmpt21##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        myComponent.data.push('list', {title: '3', text: 'three'});

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(2);
        expect(spans[0].title).toBe('1');
        expect(spans[1].title).toBe('2');

        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(3);
            expect(spans[0].title).toBe('1');
            expect(spans[1].title).toBe('2');
            expect(spans[2].title).toBe('3');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("component with san-for, then set item", function (done) {
        ##cmpt22##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        myComponent.data.set('list[0].title', '111');

        var spans = wrap.getElementsByTagName('span');
        expect(spans.length).toBe(2);
        expect(spans[0].title).toBe('1');
        expect(spans[1].title).toBe('2');

        san.nextTick(function () {
            var spans = wrap.getElementsByTagName('span');
            expect(spans.length).toBe(2);
            expect(spans[0].title).toBe('111');
            expect(spans[1].title).toBe('2');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });



    it("render component with san-if, init true, update soon", function (done) {
        ##cmpt23##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        var dts = wrap.getElementsByTagName('dt');
        expect(dts[0].title).toBe('erik');
        expect(dts[1].title).toBe('firede');

        var dds = wrap.getElementsByTagName('dd');
        var p1lis = dds[1].getElementsByTagName('li');
        expect(p1lis[0].title).toBe('2345678');
        expect(p1lis[1].title).toBe('23456789');

        myComponent.data.set('cond', false);
        myComponent.data.set('persons[1].name', 'leeight');
        myComponent.data.set('persons[1].tels', ['12121212', '16161616', '18181818']);

        san.nextTick(function () {
            var dts = wrap.getElementsByTagName('dt');
            var dds = wrap.getElementsByTagName('dd');
            expect(dts.length).toBe(0);
            expect(dds.length).toBe(0);


            myComponent.data.set('cond', true);

            san.nextTick(function () {
                var dts = wrap.getElementsByTagName('dt');
                expect(dts[0].title).toBe('erik');
                expect(dts[1].title).toBe('leeight');

                var dds = wrap.getElementsByTagName('dd');
                var p1lis = dds[1].getElementsByTagName('li');
                expect(p1lis[0].title).toBe('12121212');
                expect(p1lis[1].title).toBe('16161616');
                expect(p1lis[2].title).toBe('18181818');

                myComponent.dispose();
                document.body.removeChild(wrap);
                done();
            });
        });
    });

    it("bool attr, init false", function (done) {
        ##cmpt24##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        expect(wrap.getElementsByTagName('button')[0].disabled).toBeFalsy();
        myComponent.data.set('distate', true);

        san.nextTick(function () {
            expect(wrap.getElementsByTagName('button')[0].disabled).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("bool attr, init true", function (done) {
        ##cmpt25##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        expect(wrap.getElementsByTagName('button')[0].disabled).toBeTruthy();
        myComponent.data.set('distate', false);

        san.nextTick(function () {
            expect(wrap.getElementsByTagName('button')[0].disabled).toBeFalsy();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });


    it("checkbox checked", function (done) {
        ##cmpt26##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        var inputs = wrap.getElementsByTagName('input');
        expect(inputs[0].checked).toBeFalsy();
        expect(inputs[1].checked).toBeTruthy();
        expect(inputs[2].checked).toBeTruthy();

        myComponent.data.set('cValue', ['1']);

        san.nextTick(function () {
            var inputs = wrap.getElementsByTagName('input');
            expect(inputs[0].checked).toBeTruthy();
            expect(inputs[1].checked).toBeFalsy();
            expect(inputs[2].checked).toBeFalsy();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("radio checked", function (done) {
        ##cmpt27##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        var inputs = wrap.getElementsByTagName('input');
        expect(inputs[0].checked).toBeFalsy();
        expect(inputs[1].checked).toBeTruthy();
        expect(inputs[2].checked).toBeFalsy();

        myComponent.data.set('cValue', '1');

        san.nextTick(function () {
            var inputs = wrap.getElementsByTagName('input');
            expect(inputs[0].checked).toBeTruthy();
            expect(inputs[1].checked).toBeFalsy();
            expect(inputs[2].checked).toBeFalsy();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("option selected", function (done) {
        ##cmpt28##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        var select = wrap.getElementsByTagName('select')[0];
        expect(select.selectedIndex).toBe(1);

        myComponent.data.set('online', 'otakustay');

        san.nextTick(function () {
            var select = wrap.getElementsByTagName('select')[0];
            expect(select.selectedIndex).toBe(2);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("date data", function (done) {
        ##cmpt29##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        var b = wrap.getElementsByTagName('b')[0];
        expect(b.title).toBe('1983');

        myComponent.data.set('date', new Date(1984, 10, 10));

        san.nextTick(function () {
            var b = wrap.getElementsByTagName('b')[0];
            expect(b.title).toBe('1984');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("date data with init data", function (done) {
        ##cmpt30##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        var b = wrap.getElementsByTagName('b')[0];
        expect(b.title).toBe('1983');

        myComponent.data.set('date', new Date(1984, 10, 10));

        san.nextTick(function () {
            var b = wrap.getElementsByTagName('b')[0];
            expect(b.title).toBe('1984');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("bool attr, no binding", function () {
        ##cmpt31##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        expect(wrap.getElementsByTagName('button')[0].disabled).toBeTruthy();
        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("bool attr twoway binding, init true", function (done) {
        ##cmpt32##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        expect(wrap.getElementsByTagName('button')[0].disabled).toBeTruthy();
        myComponent.data.set('distate', false);

        san.nextTick(function () {
            expect(wrap.getElementsByTagName('button')[0].disabled).toBeFalsy();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("bool attr twoway binding, init false", function (done) {
        ##cmpt33##

        var myComponent = new MyComponent({
            el: wrap.firstChild
        });

        expect(wrap.getElementsByTagName('button')[0].disabled).toBeFalsy();
        myComponent.data.set('distate', true);

        san.nextTick(function () {
            expect(wrap.getElementsByTagName('button')[0].disabled).toBeTruthy();

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });
});
