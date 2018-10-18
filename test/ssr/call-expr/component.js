var san = require('../../../dist/san.ssr');
var MyComponent = san.defineComponent({
    template: '<u>result {{10 + (base !== 0 ? enhance(num, abs(base)) : enhance(num, 1))}}</u>',

    enhance: function (num, times) {
        return num * this.square(times);
    },

    square: function (num) {
        return num * num;
    },

    abs: function (num) {
        if (num < 0) {
            return -num;
        }

        return num;
    }
});

exports = module.exports = MyComponent;
