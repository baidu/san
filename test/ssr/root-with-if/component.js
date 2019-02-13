// component root with if
var san = require('../../../dist/san.ssr');
var Child = san.defineComponent({
    template: '<b s-if="person">{{person.name}}</b>'
});

var MyComponent = san.defineComponent({
    template: '<div><x-child person="{{p}}"/></div>',
    components: {
        'x-child': Child
    }
});

exports = module.exports = MyComponent;
