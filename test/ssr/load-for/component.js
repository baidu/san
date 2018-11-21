var san = require('../../../dist/san.ssr');

var LI = san.defineComponent({
    template: '<li><b><slot/></b></li>'
});

var LoadingLabel = san.defineComponent({
    template: '<li><slot/></li>'
});

var loadInvokeCount = 0;
var loadSuccess;
var MyComponent = san.defineComponent({
    components: {
        'x-li': san.createComponentLoader({
            load: function () {
                loadInvokeCount++;
                return {
                    then: function (success) {
                        loadSuccess = success;
                    }
                };
            },
            placeholder: LoadingLabel
        })
    },

    template: '<ul><x-li s-for="item in list">Hello {{item}}</x-li></ul>'
});

exports = module.exports = MyComponent;
