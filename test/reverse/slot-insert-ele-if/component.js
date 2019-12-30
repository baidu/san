
var san = require('../../..');



var Folder = san.defineComponent({
    template: '<div><h1 on-click="toggle"><slot name="title"/></h1><slot name="content"/></div>',
    toggle: function () {
        var hidden = this.data.get('hidden');
        this.data.set('hidden', !hidden);
    }
});

var MyComponent = san.defineComponent({
    components: {
      'x-folder': Folder
    },

    template: ''
        + '<div>'
          + '<x-folder hidden="{{folderHidden}}"><b slot="title">{{name}}</b><template s-if="num > 10000" slot="content"><h2>biiig</h2><p>{{num}}</p></template>  \n'
            + '<template s-elif="num > 1000"><h3>biig</h3><p>{{num}}</p></template>  \n'
            + '<template s-elif="num > 100"><h4>big</h4><p>{{num}}</p></template>  \n'
            + ' <template s-else><h5>small</h5><p>{{num}}</p></template></x-folder>'
        + '</div>'
});

exports = module.exports = MyComponent;
