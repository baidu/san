var san = require('../../../dist/san.ssr');
var Panel = san.defineComponent({
    template: '<template><slot/></template>'
});

var MyComponent = san.defineComponent({
    components: {
        'x-p': Panel
    },
    template: '<div><x-p>{{text}}</x-p></div>'
});

exports = module.exports = MyComponent;
