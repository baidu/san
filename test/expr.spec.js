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

});
