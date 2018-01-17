// update elif init with all true
var san = require('../../../dist/san.ssr');



var MyComponent = san.defineComponent({
    template: '<div><template san-if="cond" san-for="p in persons">   <h4>{{p.name}}</h4>   <p>{{p.email}}</p>   </template></div>'
});

exports = module.exports = MyComponent;
