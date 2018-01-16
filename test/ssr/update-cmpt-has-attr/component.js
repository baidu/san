// update component, main element has attribute
var san = require('../../../dist/san.ssr');
var Label = san.defineComponent({
    template: '<span class="label" title="{{text}}">{{text}}</span>'
});

var MyComponent = san.defineComponent({
    components: {
        'ui-label': Label
    },

    template: '<div><h5><ui-label text="{{jokeName}}" class="{{labelClass}} my-label"></ui-label></h5>'
        + '<p><a>{{school}}</a><u>{{company}}</u></p></div>'
});

exports = module.exports = MyComponent;
