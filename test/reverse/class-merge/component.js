var san = require('../../..');
var Child = san.defineComponent({
    template: '<b class="{{clazz}}">{{text}}</b>'
});

var MyComponent = san.defineComponent({
    template: '<div><x-child class="{{clazz}}" s-ref="child" /></div>',
    components: {
        'x-child': Child
    }
});

exports = module.exports = MyComponent;
