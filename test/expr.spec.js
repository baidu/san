describe("Expression", function () {

    function tobeFilter(value, expectValue) {
        expect(value).toBe(expectValue);
        return value;
    }


    it("unary string !", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{!val1 | tobe(!1)}}</b>',
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

    it("unary string !!", function () {
        var MyComponent = san.defineComponent({
            template: '<b>{{!!val1 | tobe(!0)}}</b>',
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

});
