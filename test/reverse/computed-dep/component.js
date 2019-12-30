
var san = require('../../..');

var MyComponent = san.defineComponent({
    computed: {
        less: function () {
            return this.data.get('normal') - 1;
        },

        normal: function () {
            return this.data.get('num');
        },

        more: function () {
            return this.data.get('normal') + 1;
        }
    },

    template: '<div><a>{{less}}</a><u>{{normal}}</u><b>{{more}}</b></div>'
});

exports = module.exports = MyComponent;
