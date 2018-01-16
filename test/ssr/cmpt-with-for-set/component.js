// component with san-for, then set item
var san = require('../../../dist/san.ssr');
var Label = san.defineComponent({
    template: '<a><span title="{{title}}">{{text}}</span></a>'
});

var MyComponent = san.defineComponent({
    components: {
        'ui-label': Label
    },

    template: '<div><ui-label title="{{item.title}}" text="{{item.text}}" san-for="item in list"></ui-label></div>'
});

exports = module.exports = MyComponent;
