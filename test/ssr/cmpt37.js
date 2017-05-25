// component with san-for, then push
var san = require('../../dist/san.all');

var MyComponent = san.defineComponent({
    computed: {
        realTitle: function () {
            return 'real' + this.data.get('title');
        }
    },

    template: '<div><b title="{{realTitle}}">{{realTitle}}</b></div>'
});

exports = module.exports = MyComponent;
