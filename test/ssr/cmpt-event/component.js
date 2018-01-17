
var san = require('../../../dist/san.ssr');
var Label = san.defineComponent({
    template: '<a><span title="{{title}}">{{text}}</span></a>',

    attached: function () {
        san.nextTick(function () {
            this.fire('test');
        }, this);
    }
});

var MyComponent = san.defineComponent({
    components: {
        'ui-label': Label
    },

    template: '<div><ui-label title="{{title}}" text="{{text}}" on-test="testHandler(title)"></ui-label></div>',

    testHandler: function (title) {
        this.data.set('title', title + 'test');
    }
});

exports = module.exports = MyComponent;
