// render component with san-if, init true, update soon
var san = require('../../..');
var TelList = san.defineComponent({
    template: '<ul><li san-for="item in list" title="{{item}}">{{item}}</li></ul>'
});

var PersonList = san.defineComponent({
    components: {
        'ui-tel': TelList
    },
    template: '<div><dl san-for="item in list"><dt title="{{item.name}}">{{item.name}}</dt><dd><ui-tel list="{{item.tels}}"></ui-tel></dd></dl></div>'
});

var MyComponent = san.defineComponent({
    components: {
        'ui-person': PersonList
    },
    template: '<div><ui-person list="{{persons}}" san-if="cond"></ui-person></div>'
});

exports = module.exports = MyComponent;
