define(function (require) {
    var san = require('san');

    var service = require('../service-perf');
    var template = require('tpl!./List.html');

    return san.defineComponent({
        template: template,

        components: {
            'router-link': require('san-router').Link
        },

        filters: {
            formatDate: require('../filters').formatDate
        },

        route: function () {
            var now = new Date();
            var route = this.data.get('route');
            var todos = service.todos(+(route.query.category || 0));

            this.data.set('todos', todos);
            if (!this.data.get('categories')) {
                this.data.set('categories', service.categories());
            }

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
