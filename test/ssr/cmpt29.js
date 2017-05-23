// date data
var san = require('../../dist/san.all');
var MyComponent = san.defineComponent({
    filters: {
        year: function (date) {
            return date.getFullYear()
        }
    },
    template: '<div>'
        + '<b title="{{date|year}}">{{date|year}}</b>'
        + '</div>'
});

exports = module.exports = MyComponent;
