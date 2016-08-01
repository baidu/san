define(function (require) {
    var defineComponent = require('../defineComponent');
    var service = require('../service');
    var template = require('tpl!./List.html');

    return defineComponent({
        template: template,

        filters: {
            formatDate: require('../filters').formatDate
        },

        attached: function () {
            this.data.set('todos', service.todos(+this.data.get('params[1]')));
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
