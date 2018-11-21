var san = require('../../../dist/san.ssr');

var Label = san.defineComponent({
    template: '<u>{{text}}</u>'
});

var LoadingLabel = san.defineComponent({
    template: '<b>{{text}}</b>'
});

var loadSuccess;
var MyComponent = san.defineComponent({
    components: {
        'x-label': san.createComponentLoader({
            load: function () {
                return {
                    then: function (success) {
                        loadSuccess = success;
                    }
                };
            },
            placeholder: LoadingLabel
        })
    },

    template: '<div><x-label text="{{text}}" s-if="isShow"/></div>'
});

exports = module.exports = MyComponent;
