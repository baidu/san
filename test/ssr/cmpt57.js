
var san = require('../../dist/san.ssr');


var Folder = san.defineComponent({
    template: '<div><h3 on-click="toggle"><slot name="title"/></h3><slot name="content"/></div>',
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
          + '<x-folder hidden="{{folderHidden}}" s-ref="folder"><b slot="title">{{name}}</b><template san-for="p,i in persons" slot="content">  <h4>{{p.name}}</h4><p>{{p.email}}</p>  </template></x-folder>'
        + '</div>'
});

exports = module.exports = MyComponent;
