define(function (require) {
    var data = require('./data');

    return {
        todos: function (category) {
            var categoryMap = {};
            for (var i = 0; i < data.category.length; i++) {
                var item = data.category[i];
                categoryMap[item.id] = item;
            }

            var todos = [];
            for (var i = 0; i < data.list.length; i++) {
                var item = data.list[i];

                if (!category || item.categoryId === category) {
                    todos.push(item);
                }

                if (item.categoryId) {
                    item.category = categoryMap[item.categoryId];
                }
            }

            return todos;
        },

        categories: function () {
            return data.category;
        },

        doneTodo: function (id) {
            for (var i = 0; i < data.list.length; i++) {
                var item = data.list[i];

                if (item.id === id) {
                    item.done = true;
                    break;
                }
            }
        },

        rmTodo: function (id) {
            for (var i = 0; i < data.list.length; i++) {
                var item = data.list[i];

                if (item.id === id) {
                    data.list.splice(i, 1);
                    break;
                }
            }
        }
    };
})
