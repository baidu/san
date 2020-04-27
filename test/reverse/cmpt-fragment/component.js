// component with fragment root el
var san = require('../../..');
var Child = san.defineComponent({
    template: '<fragment>see <a href="{{link}}">{{linkText || name}}</a> to start <b>{{name}}</b> framework</fragment>'
});

var MyComponent = san.defineComponent({
    template: '<div><x-child link="{{link}}" name="{{name}}" link-text="{{linkText}}"/></div>',
    components: {
        'x-child': Child
    }
});

exports = module.exports = MyComponent;
