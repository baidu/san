define(function (require) {
    var san = require('san-core');
    var template = require('tpl!./CategoryPicker.html');

    return san.defineComponent({
        template: template,

        initData: function () {
            return {
                datasource: []
            };
        },

        itemClick: function (index) {
            var datasource = this.data.get('datasource');
            this.data.set('value', datasource[index].id);
        }
    });
});
