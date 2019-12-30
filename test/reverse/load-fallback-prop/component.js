var san = require('../../..');

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
        'x-label': san.createComponentLoader({
            load: function () {
                return {
                    then: function (success, fail) {
                        loadSuccess = success;
                        loadFail = fail;
                    }
                };
            },
            placeholder: LoadingLabel,
            fallback: FallbackLabel
        })
    },

    template: '<div><x-label text="{{text}}"/></div>',

    attached: function () {
        this.nextTick(function () {
            loadFail();
        });
    }
});

exports = module.exports = MyComponent;
