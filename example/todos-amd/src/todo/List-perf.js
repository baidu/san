define(function (require) {
    var san = require('san-core');

    var defineComponent = require('../defineComponent');
    var service = require('../service-perf');
    var template = require('tpl!./List.html');

    return defineComponent({
        template: template,

        filters: {
            formatDate: require('../filters').formatDate
        },

        attached: function () {
            var now = new Date();
            this.data.set('todos', service.todos(+this.data.get('params[1]')));
            this.data.set('categories', service.categories());

            san.nextTick(function () {
                alert('List render: ' + ((new Date) - now));
            });
        },


        doneTodo: function (index) {
            var todo = this.data.get('todos', index);
            service.doneTodo(todo.id);

            var now = new Date();
            this.data.set('todos.' + index + '.done', true);
            san.nextTick(function () {
                alert('List item modify: ' + ((new Date) - now));
            });
        },

        rmTodo: function (index) {
            var todo = this.data.get('todos', index);
            service.rmTodo(todo.id);

            var now = new Date();
            this.data.remove('todos', index);
            san.nextTick(function () {
                alert('List item delete: ' + ((new Date) - now));
            });
        }
    });
});
