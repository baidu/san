// bool attr
var san = require('../../..');
var MyComponent = san.defineComponent({
    template: '<div>'
        + '<button disabled>button</button>'
        + '</div>'
});

exports = module.exports = MyComponent;
