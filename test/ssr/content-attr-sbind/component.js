var san = require('../../../dist/san.ssr');

var MyComponent = san.defineComponent({
    template: '<div s-bind="sb">test</div>'
});

exports = module.exports = MyComponent;


