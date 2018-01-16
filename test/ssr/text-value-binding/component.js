// two way binding text value
var san = require('../../../dist/san.ssr');
var MyComponent = san.defineComponent({
    template: '<div><span title="{{name}}">{{name}}</span> <input value="{=name=}"/></div>'
});

exports = module.exports = MyComponent;
