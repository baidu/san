define(function (require) {
    var san = require('san-core');
    var service = require('service');
    var template = require('tpl!./Edit.html');

    return san.defineComponent({
        template: template,

        components: {
            'ui-colorpicker': require('../ui/ColorPicker')
        },

        initData: function () {
            return {
                categories: []
            };
        },

        attached: function () {
            this.data.set('categories', service.categories());
        },

        rm: function (index) {
            var category = this.data.get('categories')[index];
            service.rmCategory(category.id);
            this.data.removeAt('categories', index);
            this.fire('rm');
        },

        edit: function (index) {
            var category = this.data.get('categories')[index];
            service.editCategory(category);
            this.fire('edit');
        }
    });
});
