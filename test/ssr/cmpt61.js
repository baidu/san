
var san = require('../../dist/san.ssr');

var Man = san.defineComponent({
    filters: {
        upper: function (source) {
            return source.charAt(0).toUpperCase() + source.slice(1);
        }
    },
    template: '<div><slot var-n="data.name" var-email="data.email" var-sex="data.sex ? \'male\' : \'female\'"><p>{{n|upper}},{{sex|upper}},{{email|upper}}</p></slot></div>'
});

var MyComponent = san.defineComponent({
    components: {
        'x-man': Man
    },

    filters: {
        upper: function (source) {
            return source.toUpperCase();
        }
    },

    template: '<div><x-man data="{{man}}"/></div>'
});

exports = module.exports = MyComponent;
