// update attribute
var san = require('../../../dist/san.ssr');
var MyComponent = san.defineComponent({
    template: '<a><span title="{{email}}">{{name}}</span></a>'
});

exports = module.exports = MyComponent;
