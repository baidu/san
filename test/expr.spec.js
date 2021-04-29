describe("Expression", function () {

    function tobeFilter(value, expectValue) {
        expect(value).toBe(expectValue);
        return value;
    }


    it("bool true", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 | tobe(true)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', true);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("bool false", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 | tobe(false)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', false);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("null", function () {
        var MyComponent = san.defineComponent({
            template: '<a><b s-if="nullValue === null">b</b></a>'
        });
        var myComponent = new MyComponent({ data: { nullValue: null }});

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(wrap.getElementsByTagName('b').length).toBe(1);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("unary -", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{-val1 | tobe(-10)}}</b>',
            filters: { tobe: tobeFilter }
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 10);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("unary +", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{+val1 | tobe(10)}}</b>',
            filters: { tobe: tobeFilter }
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', '10');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("unary +true", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{+true | tobe(1)}}</b>',
            filters: { tobe: tobeFilter }
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("unary +string", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{+"20" | tobe(20)}}</b>',
            filters: { tobe: tobeFilter }
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("unary +number", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{+5-2 | tobe(3)}}</b>',
            filters: { tobe: tobeFilter }
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("unary !", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{!val1 | tobe(false)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 10);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("unary !null", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{!null | tobe(true)}}</b>',
            filters: { tobe: tobeFilter }
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("unary !array", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{![] | tobe(false)}}</b>',
            filters: { tobe: tobeFilter }
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("unary !obj", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{!{} | tobe(false)}}</b>',
            filters: { tobe: tobeFilter }
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("unary !!", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{!!val1 | tobe(true)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 10);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("tertiary when cond true", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{a+b-c ? v1 + v2 : v3 + v4 | tobe(\'hello erik\')}}</b>',
            filters: {tobe: tobeFilter},
            initData: function () {
                return {
                    a: 1,
                    b: 2,
                    c: 2,
                    v1: 'hello ',
                    v2: 'erik',
                    v3: 'bye ',
                    v4: 'moon'
                }
            }
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("tertiary when cond false", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{a+b-c ? v1 + v2 : v3 + v4 | tobe(\'bye moon\')}}</b>',
            filters: {tobe: tobeFilter},
            initData: function () {
                return {
                    a: 1,
                    b: 2,
                    c: 3,
                    v1: 'hello ',
                    v2: 'erik',
                    v3: 'bye ',
                    v4: 'moon'
                }
            }
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("binary number +", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{num1 + num2 | tobe(4)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('num1', 1);
        myComponent.data.set('num2', 3);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("binary string +", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 + val2 | tobe("hello varsha")}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 'hello ');
        myComponent.data.set('val2', 'varsha');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("binary number -", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 - val2 | tobe(4)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 5);
        myComponent.data.set('val2', 1);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("binary number *", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 * val2 | tobe(150)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 5);
        myComponent.data.set('val2', 30);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("binary number /", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 / val2 | tobe(6)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 30);
        myComponent.data.set('val2', 5);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("binary number %", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 % val2 | tobe(2)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 30);
        myComponent.data.set('val2', 7);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("binary number ==", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 == val2 | tobe(!0)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', '');
        myComponent.data.set('val2', 0);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("binary number ===", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 === val2 | tobe(!1)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', '');
        myComponent.data.set('val2', 0);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("binary number !=", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 != val2 | tobe(!1)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', '');
        myComponent.data.set('val2', 0);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("binary number !==", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 !== val2 | tobe(!0)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', '');
        myComponent.data.set('val2', 0);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("binary number >", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 > val2 | tobe(!0)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 1);
        myComponent.data.set('val2', 0);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("binary number <", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 < val2 | tobe(!1)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 1);
        myComponent.data.set('val2', 0);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("binary number <, no whitespaces between", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1<0 | tobe(!1)}}</b>',
            filters: { tobe: tobeFilter }
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 1);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("binary number >=", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 >= val2 | tobe(!0)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 1);
        myComponent.data.set('val2', 1);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("binary number <=", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 <= val2 | tobe(!0)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 1);
        myComponent.data.set('val2', 1);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("confuse a + b * c", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 + val2 * val3 | tobe(23)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 3);
        myComponent.data.set('val2', 4);
        myComponent.data.set('val3', 5);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("confuse a * b + c", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 * val2 + val3 | tobe(17)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 3);
        myComponent.data.set('val2', 4);
        myComponent.data.set('val3', 5);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("confuse a % b + c", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 % val2 + val3 | tobe(8)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 3);
        myComponent.data.set('val2', 4);
        myComponent.data.set('val3', 5);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("confuse a * (b + c), parenthesized", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 * (val2 + val3) | tobe(27)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 3);
        myComponent.data.set('val2', 4);
        myComponent.data.set('val3', 5);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("confuse a * b == c + d", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 * val2 == val3 + val4 | tobe(!0)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 3);
        myComponent.data.set('val2', 4);
        myComponent.data.set('val3', 5);
        myComponent.data.set('val4', 7);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("confuse a * b <= c + d", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 * val2 <= val3 + val4 | tobe(!1)}}</b>',
            filters: {tobe: tobeFilter}
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 3);
        myComponent.data.set('val2', 4);
        myComponent.data.set('val3', 5);
        myComponent.data.set('val4', 6);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("confuse a * b <= c + d ? a1 * b1 <= c1 + d1 ? xxx : xxxx : xxx", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 * val2 <= val3 + val4 ? va1 * va2 <= va3 + va4 ? \'3\' : yno: \'1\' | tobe(\'yno\')}}</b>',
            filters: {tobe: tobeFilter},
            initData: function () {
                return {
                    val1: 3,
                    val2: 4,
                    val3: 7,
                    val4: 6,
                    va1: 3,
                    va2: 4,
                    va3: 5,
                    va4: 6,
                    yno: 'yno'
                }
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("confuse a * b <= c + d ? a1 * b1 <= c1 + d1 ? xxx : xxxx : xxx", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 * val2 <= val3 + val4 ? va1 * va2 <= va3 + va4 ? \'3\' : yno: \'1\' | tobe(\'1\')}}</b>',
            filters: {tobe: tobeFilter},
            initData: function () {
                return {
                    val1: 3,
                    val2: 4,
                    val3: 5,
                    val4: 6,
                    va1: 3,
                    va2: 4,
                    va3: 5,
                    va4: 6,
                    yno: 'yno'
                }
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("confuse a * b <= c + d ? a1 * b1 <= c1 + d1 ? xxx : xxxx : xxx", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{val1 * val2 <= val3 + val4 ? \'1\' : va1 * va2 > va3 + va4 ? \'3\' : yno | tobe(\'3\')}}</b>',
            filters: {tobe: tobeFilter},
            initData: function () {
                return {
                    val1: 3,
                    val2: 4,
                    val3: 5,
                    val4: 6,
                    va1: 3,
                    va2: 4,
                    va3: 5,
                    va4: 6,
                    yno: 'yno'
                }
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("no whitespace binary in number literals", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{1+1|tobe(2)}}</b>',
            filters: { tobe: tobeFilter }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("use san.Data and san.evalExpr", function () {
        var parentData = new san.Data({
            val1: 1,
            val2: 1,
            val3: 3,
            val4: 4
        });
        var data = new san.Data({
            val1: 3,
            val2: 4,
            arr: [1,2,3,4]
        }, parentData);

        expect(san.evalExpr(san.parseExpr('val1+val2'), data)).toBe(7);
        expect(san.evalExpr(san.parseExpr('val3+val4'), data)).toBe(7);

        expect(san.evalExpr(san.parseExpr('arr[val1] - arr[0] + 5'), data)).toBe(8);
        expect(san.evalExpr(san.parseExpr('arr[val3] - arr[0] + 5'), data)).toBe(8);

        data.push('arr', 100);

        expect(san.evalExpr(san.parseExpr('arr[val2]-arr[0]+5'), data)).toBe(104);
        expect(san.evalExpr(san.parseExpr('arr[val4]-arr[0]+5'), data)).toBe(104);
    });

    it("method", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{plus(val1) | tobe(3)}}</b>',
            filters: { tobe: tobeFilter },
            plus: function (a) {
                return a + 1;
            }
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 2);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("not exists method", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{plus(val1) | tobe(undef)}}</b>',
            filters: { tobe: tobeFilter }
        });
        var myComponent = new MyComponent();
        myComponent.data.set('val1', 2);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

});
