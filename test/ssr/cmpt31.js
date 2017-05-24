// bool attr
var san = require('../../dist/san.all');
var MyComponent = san.defineComponent({
    template: '<div>'
        + '<button disabled>button</button>'
        + '</div>'
});

exports = module.exports = MyComponent;
