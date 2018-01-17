// update elif init with all true
var san = require('../../../dist/san.ssr');



var Panel = san.defineComponent({
    template: '<a><slot></slot></a>'
});

var SearchBox = san.defineComponent({
    template: '<div><input type="text" value="{=value=}"><button>search</button></div>'
});

var MyComponent = san.defineComponent({
    components: {
        'x-panel': Panel,
        'x-search': SearchBox
    },

    template: '<div><b title="{{searchValue}}">{{searchValue}}</b>'
        + '<x-panel><x-search value="{=searchValue=}"></x-search></x-panel></div>'
});

exports = module.exports = MyComponent;
