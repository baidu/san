
var san = require('../../..');

var Man = san.defineComponent({
    filters: {
        upper: function (source) {
            return source.charAt(0).toUpperCase() + source.slice(1);
        }
    },

    template: '<div><slot name="test" var-n="data.name" var-email="data.email" var-sex="data.sex ? \'male\' : \'female\'"><p>{{n}},{{sex}},{{email}}</p></slot></div>'
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

    template: '<div><x-man data="{{man}}"><h3 slot="test">{{n|upper}}</h3><b slot="test">{{sex|upper}}</b><u slot="test">{{email|upper}}</u></x-man></div>'
});

exports = module.exports = MyComponent;
