// component with san-if, init with true, change much times
var san = require('../../..');
var Label = san.defineComponent({
    template: '<a><span title="{{title}}">{{text}}</span></a>'
});

var MyComponent = san.defineComponent({
    components: {
        'ui-label': Label
    },

    template: '<div><h5><ui-label title="{{name}}" text="{{jokeName}}" san-if="cond"></ui-label></h5>'
        + '<p><a>{{school}}</a><u>{{company}}</u></p></div>'
});

exports = module.exports = MyComponent;
