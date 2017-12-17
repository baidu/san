
var san = require('../../dist/san.ssr');

var Man = san.defineComponent({
    template: '<div><slot name="test" var-n="data.name" var-email="data.email" var-sex="data.sex ? \'male\' : \'female\'"><p>{{n}},{{sex}},{{email}}</p></slot></div>'
});

var MyComponent = san.defineComponent({
    components: {
        'x-man': Man
    },

    template: '<div><x-man data="{{man}}"><h3 slot="test">{{n}}</h3><b slot="test">{{sex}}</b><u slot="test">{{email}}</u><a slot="test">{{desc}}</a></x-man></div>'
});

exports = module.exports = MyComponent;

