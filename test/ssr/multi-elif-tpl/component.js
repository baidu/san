
var san = require('../../../dist/san.ssr');



var MyComponent = san.defineComponent({
    template: '<div><template s-if="num > 10000"><h2>biiig</h2><p>{{num}}</p></template>  \n'
    + '<template s-elif="num > 1000"><h3>biig</h3><p>{{num}}</p></template>  \n'
    + '<template s-elif="num > 100"><h4>big</h4><p>{{num}}</p></template>  \n'
    + ' <template s-else><h5>small</h5><p>{{num}}</p></template></div>'
});

exports = module.exports = MyComponent;
