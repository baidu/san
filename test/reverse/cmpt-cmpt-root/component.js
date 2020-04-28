var san = require('../../..');

var Child = san.defineComponent({
    template: '<h3>see <a href="{{link}}">{{linkText || name}}</a> to start <b>{{name}}</b> framework</h3>'
});

var Wrap = san.defineComponent({
    template: '<x-child link="{{link}}" name="{{framework}}" link-text="{{linkText}}" />',
    components: {
        'x-child': Child
    }
});

var MyComponent = san.defineComponent({
    template: '<div><x-wrap link="{{link}}" framework="{{framework}}" link-text="{{linkText}}" /></div>',
    components: {
        'x-wrap': Wrap
    }
});

exports = module.exports = MyComponent;