// update elif init with all true
var san = require('../../..');


var MyComponent = san.defineComponent({
    template: '<div><span s-if="num > 10000" title="biiig">biiig</span>  \n'
        + '<span s-elif="num > 1000" title="biig">biig</span>  \n'
        + '<span s-elif="num > 100" title="big">big</span>  \n'
        + ' <b s-else title="small">small</b></div>'
});

exports = module.exports = MyComponent;
