var san = require('../../..');
var MyComponent = san.defineComponent({
    template: '<u>result {{op[isUp ? "plus" : "minus"](num1, num2)}}</u>',

    op: {
        plus: function (a, b) {
            return a + b;
        },

        minus: function (a, b) {
            return a - b;
        }
    }
});

exports = module.exports = MyComponent;
