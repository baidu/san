
var san = require('../../dist/san.ssr');


var Man = san.defineComponent({
    template: '<div><slot name="test" var-n="{{data.name}}" var-email="{{data.email}}" var-sex="{{data.sex ? \'male\' : \'female\'}}"><p on-click="emailClick(email)">{{n}},{{sex}},{{email}}</p></slot></div>',
    emailClick: function (email) {
        clickInfo.email = email;
        clickInfo.outer = false;
    }
});

var MyComponent = san.defineComponent({
    components: {
        'x-man': Man
    },

    template: '<div><x-man data="{{man}}"></x-man></div>',

    emailClick: function (email) {
        clickInfo.email = 'fail';
        clickInfo.outer = true;
    }
});

exports = module.exports = MyComponent;
