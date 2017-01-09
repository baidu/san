define(function (require) {
    var san = require('san');
    var service = require('../service');
    var template = require('tpl!./List.html');

    return san.defineComponent({
        template: template,

        filters: {
            formatDate: require('../filters').formatDate
        },

        components: {
            'router-link': require('san-router').Link
        },

        route: function () {
            var route = this.data.get('route');
            var todos = service.todos(+(route.query.category || 0));

            this.data.set('todos', todos);
            if (!this.data.get('categories')) {
                this.data.set('categories', service.categories());
            }
        },

        doneTodo: function (index) {
            var todo = this.data.get('todos', index);
            service.doneTodo(todo.id);

            this.data.set('todos.' + index + '.done', true);
        },

        rmTodo: function (index) {
            var todo = this.data.get('todos', index);
            service.rmTodo(todo.id);

            this.data.removeAt('todos', index);
        }
    });
});
