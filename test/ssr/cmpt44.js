// update elif init with all true
var san = require('../../dist/san.ssr');

var MyComponent = san.defineComponent({
    template: '<div><span s-if="cond1" title="errorrik">errorrik</span>  <span s-elif="cond2" title="leeight">leeight</span></div>'
});

exports = module.exports = MyComponent;
