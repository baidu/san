
var san = require('../../..');

var MyComponent = san.defineComponent({
    template: '<form>'
      + '<fieldset s-for="cate in cates">'
        + '<label s-for="item in forms[cate]">{{item}}</label>'
      + '</fieldset>'
    + '</form>',

    initData: function() {
        return {
            formLen: 3
        };
    },

    computed: {
        forms: function () {
            var cates = this.data.get('cates');
            var formLen = this.data.get('formLen');

            var result = {};
            if (cates instanceof Array) {
                var start = 1;
                for (var i = 0; i < cates.length; i++) {
                    result[cates[i]] = [];
                    for (var j = 0; j < formLen; j++) {
                        result[cates[i]].push(start++);
                    }
                }
            }

            return result;
        }
    }
})

exports = module.exports = MyComponent;
