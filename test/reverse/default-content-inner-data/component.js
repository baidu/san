
var san = require('../../..');

var Man = san.defineComponent({
    template: '<div><slot var-n="data.name" var-email="data.email" var-sex="data.sex ? \'male\' : \'female\'"><p>{{n}},{{sex}},{{email}} - {{desc}}</p></slot></div>'
});

var MyComponent = san.defineComponent({
    components: {
        'x-man': Man
    },

    template: '<div><x-man data="{{man}}" desc="{{tip}}"/></div>'
});

exports = module.exports = MyComponent;

