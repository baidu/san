
var san = require('../../../dist/san.ssr');
var MyComponent = san.defineComponent({
    template: '<ul><li san-for="p,i in persons" title="{{p}}">{{i}}-{{p}}</li></ul>'
});

exports = module.exports = MyComponent;
