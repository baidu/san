
var san = require('../../../dist/san.ssr');


var entityStr = '&#39;&#x00021;&emsp;&ensp;&thinsp;&copy;&lt;p&gt;&reg;&lt;/p&gt;&reg;&zwnj;&zwj;&lt;&nbsp;&gt;&quot;';
var MyComponent = san.defineComponent({
    template: '<u>' + entityStr + '</u>'
});

exports = module.exports = MyComponent;

