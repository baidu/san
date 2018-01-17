
var san = require('../../../dist/san.ssr');

var U = san.defineComponent({
    template: '<u>{{foo}}</u>',
    initData: function () {
        return {
            foo: 'foo'
        };
    }
});

var MyComponent = san.defineComponent({
    template: '<div><my-u s-ref="uc" foo="{{formData.foo}}" /></div>',
    components: {
        'my-u': U
    },
    initData: function () {
        return {
            formData: {}
        };
    },
    getFooValue: function () {
        return this.ref('uc').data.get('foo');
    }
});

exports = module.exports = MyComponent;

