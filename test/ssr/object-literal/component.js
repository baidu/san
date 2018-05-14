var san = require('../../../dist/san.ssr');
var Article = san.defineComponent({
    template: '<div><h3>{{a.title}}</h3><b s-if="a.hot">hot</b><div s-if="a.author"><u>{{a.author.name}}</u><a>{{a.author.email}}</a></div><p>{{a.content}}</p></div>'
});

var MyComponent = san.defineComponent({
    components: {
        'x-a': Article
    },
    template: '<div><x-a a="{{{author:aAuthor, ...article}}}"/></div>'
});

exports = module.exports = MyComponent;
