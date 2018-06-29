
var san = require('../../../dist/san.ssr');
var MyComponent = san.defineComponent({
    template: '<ul><li san-for="p,i in persons" title="{{p}}">{{p}}-{{i}}</li></ul>'
});

exports = module.exports = MyComponent;
