var san = require('../../../dist/san.ssr');

var Label = san.defineComponent({
    template: '<u>{{text}}</u>'
});

var LoadingLabel = san.defineComponent({
    template: '<b>{{text}}</b>'
});

var FallbackLabel = san.defineComponent({
    template: '<input value="{{text}}"/>'
});

var loadFail;
var loadSuccess;
var MyComponent = san.defineComponent({
    components: {
        'x-label': {
            load: function () {
                return {
                    then: function (success, fail) {
                        loadSuccess = success;
                        loadFail = fail;
                    }
                };
            },
            loading: LoadingLabel
        }
    },

    template: '<div><x-label text="{{text}}"/></div>',

    attached: function () {
        this.nextTick(function () {
            loadFail(FallbackLabel);
        });
    }
});

exports = module.exports = MyComponent;
