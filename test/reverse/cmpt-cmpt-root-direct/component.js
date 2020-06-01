var san = require('../../..');

var Label = san.defineComponent({
    template: '<span title="{{text}}">{{text}}</span>'
});

var MyComponent = san.defineComponent({
    components: {
        'ui-label': Label
    },
    template: '<ui-label text="{{name}}"></ui-label>',

    attached: function () {
        this.data.set('name', 'errorrik');
    }
});

exports = module.exports = MyComponent;