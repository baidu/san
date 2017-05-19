// update component, merge init data and given data
var san = require('../../dist/san.all');
var Label = san.defineComponent({
    template: '<span class="label" title="{{title}}">{{text}}</span>',

    initData: function () {
        return {
            title: 'title',
            text: 'text'
        };
    }
});

var MyComponent = san.defineComponent({
    components: {
        'ui-label': Label
    },

    template: '<div><h5><ui-label text="{{jokeName}}" class="{{labelClass}} my-label"></ui-label></h5>'
        + '<p><a title="{{school}}">{{school}}</a><u title="{{company}}">{{company}}</u></p></div>',

    initData: function () {
        return {
            jokeName: 'airike',
            school: 'none',
        };
    }
});

exports = module.exports = MyComponent;
