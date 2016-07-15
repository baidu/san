define(function (require) {
    var vm = require('san-vm');
    var service = require('service');
    var template = require('tpl!./Add.html');


    return vm.Component({
        template: template,

        initData: {
            title: '',
            color: ''
        },

        submit: function () {
            var title = this.data.get('title');
            if (!title) {
                return;
            }

            service.addCategory({
                title: title,
                color: this.data.get('color')
            });

            this.finish();
        },

        cancel: function () {
            this.finish();
        },

        finish: function () {
            var e = {};
            this.fire('finished', e);

            if (e.returnValue !== false) {
                history.go(-1);
            }
        }
    });
});
