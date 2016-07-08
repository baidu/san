define(function (require) {
    var vm = require('san-vm');
    var service = require('service');
    var template = require('tpl!./List.html');

    return vm.Component({
        template: template,

        attached: function () {
            this.data.set('name', 'errorrik');
            this.data.set('todos', service.todos());
            this.data.set('categories', service.categories());
        },


        doneTodo: function (index) {
            var todo = this.data.get('todos', index);
            service.doneTodo(todo.id);
            this.data.set('todos.' + index + '.done', true);
        },

        rmTodo: function (index) {
            var todo = this.data.get('todos', index);
            service.rmTodo(todo.id);
            this.data.remove('todos', index);
        }
    });
});
