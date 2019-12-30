// class and style auto expand
var san = require('../../..');

var Label = san.defineComponent({
    template: '<a><u s-if="hasu"></u></a>'
});

var MyComponent = san.defineComponent({
    components: {
        'ui-label': Label
    },

    template: '<div><ui-label s-ref="l" hasu></ui-label></div>'
});

exports = module.exports = MyComponent;
