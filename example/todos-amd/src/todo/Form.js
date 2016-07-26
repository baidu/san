define(function (require) {
    var san = require('san-core');
    var service = require('../service');
    var template = require('tpl!./Form.html');

    var AddCategoryDialog = san.Component({
        template: '<template class="ui-layer add-category-layer" style="width: {{width}}px; top: {{top}}px; left: {{left}}px;">'
            + '<ui-addcategory san-ref="add"></ui-addcategory>'
            + '</template>',

        components: {
            'ui-addcategory': require('../category/Add')
        },

        initData: {
            width: 200,
            top: 100,
            left: -1000
        },

        attached: function () {
            this.refs.add.on('finished', this.finish.bind(this));
        },

        show: function () {
            this.data.set('left', window.screen.availWidth / 2 - 100);
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

    var EditCategoryDialog = san.Component({
        template: '<template class="ui-layer edit-category-layer" style="width: {{width}}px; top: {{top}}px; left: {{left}}px;">'
            + '<i class="fa fa-times-circle-o" on-click="hide"></i>'
            + '<ui-editcategory san-ref="edit"></ui-editcategory>'
            + '</template>',

        components: {
            'ui-editcategory': require('../category/Edit')
        },

        initData: {
            width: 200,
            top: 100,
            left: -1000
        },

        attached: function () {
            this.refs.edit.on('change', this.change.bind(this));
        },

        show: function () {
            this.data.set('left', window.screen.availWidth / 2 - 100);
        },

        hide: function () {
            this.data.set('left', -1000);
        },

        change: function () {
            this.fire('change');
        }
    });


    return san.Component({
        template: template,

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
                this.editCategoryDialog.on('change', this.updateCategories.bind(this));
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
