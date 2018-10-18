var san = require('../../../dist/san.ssr');

var MyComponent = san.defineComponent({
    template: '<div><u>{{-num1+-num2}}</u></div>'
});

exports = module.exports = MyComponent;
