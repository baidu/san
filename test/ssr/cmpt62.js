
var san = require('../../dist/san.ssr');

var MyComponent = san.defineComponent({
  template: '<form>'
      + '<fieldset s-for="cate in cates">'
        + '<label s-for="item in forms[cate]">{{item}}</label>'
      + '</fieldset>'
    + '</form>'
})

exports = module.exports = MyComponent;
