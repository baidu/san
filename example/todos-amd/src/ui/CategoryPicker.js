define(function (require) {
    var defineComponent = require('../defineComponent');
    var template = require('tpl!./CategoryPicker.html');

    return defineComponent({
        template: template,

        initData: {
            datasource: []
        },

        itemClick: function (index) {
            var datasource = this.data.get('datasource');
            this.data.set('value', datasource[index].id);
        }
    });
});
