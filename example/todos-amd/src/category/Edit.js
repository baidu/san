define(function (require) {
    var san = require('san-core');
    var service = require('service');
    var template = require('tpl!./Edit.html');

    return san.defineComponent({
        template: template,

        components: {
            'ui-colorpicker': require('../ui/ColorPicker')
        },

        initData: {categories: []},

        attached: function () {
            this.data.set('categories', service.categories());
        },

        rm: function (index) {
            var category = this.data.get('categories')[index];
            service.rmCategory(category.id);
            this.data.remove('categories', index);
            this.fire('change');
        },

        edit: function (index) {
            var category = this.data.get('categories')[index];
            service.editCategory(category);
            this.fire('change');
        }
    });
});
