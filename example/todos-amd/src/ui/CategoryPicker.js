define(function (require) {
    var vm = require('san-vm');
    var template = require('tpl!./CategoryPicker.html');

    return vm.Component({
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
