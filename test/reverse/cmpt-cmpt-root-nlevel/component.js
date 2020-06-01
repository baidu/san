var san = require('../../..');

var Label = san.defineComponent({
    template: '<span title="{{text}}">{{text}}</span>'
});

var Child = san.defineComponent({
    components: {
        'ui-label': Label
    },
    template: '<ui-label text="{{name}}"></ui-label>'
});

var MyComponent = san.defineComponent({
    components: {
        'ui-c': Child
    },
    template: '<ui-c name="{{name}}"></ui-c>',

    attached: function () {
        this.data.set('name', 'errorrik');
    }
});

exports = module.exports = MyComponent;