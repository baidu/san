// data binding name auto camel case
var san = require('../../../dist/san.ssr');
var Label = san.defineComponent({
    template: '<a><span title="{{dataTitle}}">{{dataText}}</span></a>'
});

var MyComponent = san.defineComponent({
    components: {
        'ui-label': Label
    },

    template: '<div><ui-label data-title="{{title}}" data-text="{{text}}"></ui-label></div>'
});

exports = module.exports = MyComponent;
