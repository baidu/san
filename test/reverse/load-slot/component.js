var san = require('../../..');

var Label = san.defineComponent({
    template: '<u><slot/></u>'
});

var Panel = san.defineComponent({
    template: '<a><slot/></a>'
})

var LoadingLabel = san.defineComponent({
    template: '<b><slot/></b>'
});

var loadSuccess;
var MyComponent = san.defineComponent({
    components: {
        'x-panel': Panel,
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

    template: '<div><x-panel><x-label>Hello {{text}}</x-label></x-panel></div>',

    attached: function () {
        this.nextTick(function () {
            loadSuccess(Label);
        });
    }
});

exports = module.exports = MyComponent;
