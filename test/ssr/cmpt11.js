// update if, init with false
var san = require('../../dist/san.ssr');
var MyComponent = san.defineComponent({
    template: '<u>'
        + '<a>nimei</a>'
        + '<span san-if="cond" title="{{name}}">{{name}}</span>'
        + '</u>'
});

exports = module.exports = MyComponent;
