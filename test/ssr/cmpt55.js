
var san = require('../../dist/san.ssr');



var Man = san.defineComponent({
    template: '<div><slot name="test" var-n="data.name" var-email="data.email" var-sex="data.sex ? \'male\' : \'female\'"><p>{{n}},{{sex}},{{email}}</p></slot></div>',
    emailClick: function (email) {
        clickInfo.email = 'fail';
        clickInfo.outer = false;
    }
});

var MyComponent = san.defineComponent({
    components: {
        'x-man': Man
    },

    template: '<div><x-man data="{{man}}"><h3 slot="test">{{n}}</h3><b slot="test">{{sex}}</b><u slot="test" on-click="emailClick(email)">{{email}}</u></x-man></div>',


    emailClick: function (email) {
        clickInfo.email = email;
        clickInfo.outer = true;
    }
});

exports = module.exports = MyComponent;
