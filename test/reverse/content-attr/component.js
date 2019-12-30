var san = require('../../..');

var MyComponent = san.defineComponent({
    template: '<div undef="{{undef}}" nul="{{nul}}" falsy="{{falsy}}" truth="{{truth}}" estr="{{estr}}" zero="{{0}}">test</div>'
});

exports = module.exports = MyComponent;


