
var san = require('../../../dist/san.ssr');

var Article = san.defineComponent({
    template: '<div><h3>{{title}}</h3><h4 s-if="subtitle">{{subtitle}}</h4><p>{{content}}</p></div>'
});

var MyComponent = san.defineComponent({
    components: {
        'x-a': Article
    },
    template: '<div><x-a s-bind="article" title="{{title}}"/><a s-bind="aProps" target="{{target}}">link</a></div>'
});

exports = module.exports = MyComponent;
