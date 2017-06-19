// complex structure in textnode
var san = require('../../dist/san.ssr');

var MyComponent = san.defineComponent({
    template: '<a><span>aaa</span>hello {{name|raw}}!<b>bbb</b></a>'
});

exports = module.exports = MyComponent;
