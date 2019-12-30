var san = require('../../..');
var Article = san.defineComponent({
    template: '<div><h3>{{a.title}}</h3><h4>{{a.from}}</h4><b s-if="a.hot">hot</b><div s-if="a.author"><u>{{a.author.name}}</u><a>{{a.author.email}}</a></div><p>{{a.content}}</p></div>'
});

var MyComponent = san.defineComponent({
    components: {
        'x-a': Article
    },
    template: '<div><x-a a="{{{author:aAuthor, from, ...article}}}"/></div>'
});

exports = module.exports = MyComponent;
