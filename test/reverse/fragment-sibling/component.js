// date data
var san = require('../../..');
var MyComponent = san.defineComponent({
    template: '<div>'
        + '<fragment>Hello <b>{{name}}</b> {{type}} and </fragment><fragment>{{start}} from <a href="{{docURL}}">doc</a>.</fragment>'
        + '</div>'
});

exports = module.exports = MyComponent;
