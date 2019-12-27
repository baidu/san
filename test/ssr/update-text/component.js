// update text
var san = require('../../..');
var MyComponent = san.defineComponent({
    template: '<a><span title="{{email}}">{{name}}</span></a>'
});

exports = module.exports = MyComponent;
