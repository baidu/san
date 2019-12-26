
var san = require('../../..');



var Panel = san.defineComponent({
    template: '<div><slot/></div>'
});

var Button = san.defineComponent({
    template: '<div><a><slot/></a></div>'
});

var Folder = san.defineComponent({
    template: '<div><h3 on-click="toggle"><slot name="title"/></h3><slot s-if="!hidden"/></div>',
    toggle: function () {
        var hidden = this.data.get('hidden');
        this.data.set('hidden', !hidden);
    }
});

var MyComponent = san.defineComponent({
    components: {
        'x-panel': Panel,
        'x-folder': Folder,
        'x-button': Button
    },

    template: '<div>'
        + '<x-folder hidden="{{folderHidden}}">'
        + '<b slot="title">{{title}}</b>'
        + '<x-panel><u>{{name}}</u><x-button>{{closeText}}</x-button></x-panel>'
        + '</x-folder>'
        + '</div>'
});

exports = module.exports = MyComponent;
