// update else, init with true
var san = require('../../../dist/san.ssr');
var MyComponent = san.defineComponent({
    template: '<u>'
        + '<span san-if="cond" title="{{name}}">{{name}}</span>'
        + '<span san-else title="{{name2}}">{{name2}}</span>'
        + '</u>'
});

exports = module.exports = MyComponent;
