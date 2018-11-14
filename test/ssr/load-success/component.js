var san = require('../../../dist/san.ssr');

var Label = san.defineComponent({
    template: '<u>{{text}}</u>'
});

var loadSuccess;
var MyComponent = san.defineComponent({
    components: {
        'x-label': {
            load: function () {
                return {
                    then: function (success) {
                        loadSuccess = success;
                    }
                };
            }
        }
    },

    template: '<div><x-label text="{{text}}"/></div>',

    attached: function () {
        this.nextTick(function () {
            loadSuccess(Label);
        });
    }
});

exports = module.exports = MyComponent;
