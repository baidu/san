// push update for, init with many data
var san = require('../../../dist/san.ssr');
var MyComponent = san.defineComponent({
    template: '<ul><li s-for="item in [1, 2, three, ...other]">{{item}}</li></ul>'
});

exports = module.exports = MyComponent;
