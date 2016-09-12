define(function (require) {

    var san = require('san');

    var service = require('../service');
    var template = require('tpl!./Form.html');

    var AddCategoryDialog = san.defineComponent({
        template: '<div class="ui-layer add-category-layer" style="width: {{width}}px; top: {{top}}px; left: {{left}}px;">'
            + '<ui-addcategory san-ref="add" on-finished="finish($event)"></ui-addcategory>'
            + '</div>',

        components: {
            'ui-addcategory': require('../category/Add')
        },

        initData: function () {
            return {
                width: 200,
                top: 100,
                left: -1000
            };
        },

        show: function () {
            this.data.set('left', document.body.clientWidth / 2 - 100);
        },

        hide: function () {
            this.data.set('left', -1000);
        },

        finish: function (e) {
            this.hide();
            this.fire('finished');
            e.returnValue = false;
        }
    });

    var EditCategoryDialog = san.defineComponent({
        template: '<div class="ui-layer edit-category-layer" style="width: {{width}}px; top: {{top}}px; left: {{left}}px;">'
            +   '<i class="fa fa-times-circle-o" on-click="hide"></i>'
            +   '<ui-editcategory on-rm="edited" on-edit="edited"></ui-editcategory>'
            + '</div>',

        components: {
            'ui-editcategory': require('../category/Edit')
        },

        initData: function () {
            return {
                width: 200,
                top: 100,
                left: -1000
            };
        },

        show: function () {
            this.data.set('left', document.body.clientWidth / 2 - 100);
        },

        hide: function () {
            this.data.set('left', -1000);
        },

        edited: function () {
            this.fire('edited');
        }
    });


    return san.defineComponent({
        template: template,

        components: {
            'ui-categorypicker': require('../ui/CategoryPicker'),
            'ui-timepicker': require('../ui/TimePicker'),
            'ui-calendar': require('../ui/Calendar')
        },

        attached: function () {
            var id = this.data.get('id');
            if (id) {
                this.setTodo(service.todo(id));
            }

            this.updateCategories();
        },

        created: function () {
            var now = new Date();
            this.setTodo({
                id: 0,
                title: '',
                desc: '',
                endTime: now.getTime(),
                categoryId: null,
                done: false
            });

            var id = this.data.get('params[1]');
            if (id) {
                this.data.set('id', +id);
            }
        },

        setTodo: function (todo) {
            this.data.set('todo', todo);
            this.splitEndTime();
        },

        splitEndTime: function () {
            var endTime = new Date(this.data.get('todo.endTime'));
            this.data.set('endTimeHour', endTime.getHours());
            this.data.set('endTimeDate', new Date(
                endTime.getFullYear(),
                endTime.getMonth(),
                endTime.getDate()
            ));
        },

        joinEndTime: function () {
            var endTime = new Date(this.data.get('endTimeDate').getTime());
            endTime.setHours(this.data.get('endTimeHour'));
            this.data.set('todo.endTime', endTime.getTime());
        },

        submit: function () {
            this.joinEndTime();
            var todo = this.data.get('todo');
            var id = this.data.get('id');
            if (!todo.id) {
                service.addTodo(todo);
            }
            else {
                service.editTodo(todo);
            }

            history.go(-1);
        },

        cancel: function () {
            history.go(-1);
        },

        updateCategories: function () {
            this.data.set('categories', service.categories());
        },

        startAddCategory: function () {
            if (!this.addCategoryDialog) {
                this.addCategoryDialog = new AddCategoryDialog();
                this.addCategoryDialog.attach(document.body);
                this.addCategoryDialog.on('finished', this.updateCategories.bind(this));
            }
            this.addCategoryDialog.show();
        },

        startEditCategory: function () {
            if (!this.editCategoryDialog) {
                this.editCategoryDialog = new EditCategoryDialog();
                this.editCategoryDialog.attach(document.body);
                this.editCategoryDialog.on('edited', this.updateCategories.bind(this));
            }
            this.editCategoryDialog.show();
        },

        disposed: function () {
            if (this.addCategoryDialog) {
                this.addCategoryDialog.dispose();
                this.addCategoryDialog = null;
            }

            if (this.editCategoryDialog) {
                this.editCategoryDialog.dispose();
                this.editCategoryDialog = null;
            }
        }
    });
});
