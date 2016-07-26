define(function (require) {
    var data = require('./performanceData');

    /**
     * 对象属性拷贝
     *
     * @inner
     * @param {Object} target 目标对象
     * @param {Object} source 源对象
     * @return {Object} 返回目标对象
     */
    function extend(target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }

        return target;
    }

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
                    item = extend({}, item);
                    todos.push(item);

                    if (item.categoryId) {
                        item.category = extend({}, categoryMap[item.categoryId]);
                    }
                }
            }

            return todos;
        },

        todo: function (id) {
            var categoryMap = {};
            for (var i = 0; i < data.category.length; i++) {
                var item = data.category[i];
                categoryMap[item.id] = item;
            }

            for (var i = 0; i < data.list.length; i++) {
                var item = data.list[i];

                if (item.id === id) {
                    if (item.categoryId) {
                        item = extend({}, item);
                        item.category = extend({}, categoryMap[item.categoryId]);
                    }

                    return item;
                }
            }

            return null;
        },

        categories: function () {
            var categories = [];

            for (var i = 0; i < data.category.length; i++) {
                categories.push(extend({}, data.category[i]));
            }

            return categories;
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
            id = +id;
            for (var i = 0; i < data.list.length; i++) {
                var item = data.list[i];

                if (item.id === id) {
                    data.list.splice(i, 1);
                    break;
                }
            }
        },

        addTodo: function (todo) {
            var first = data.list[0];
            var id = 1;
            if (first) {
                id = first.id + 1;
            }

            todo = extend({}, todo);
            todo.id = id;
            data.list.unshift(todo);
        },

        editTodo: function (todo) {
            todo = extend({}, todo);

            for (var i = 0; i < data.list.length; i++) {
                var item = data.list[i];

                if (item.id === todo.id) {
                    data.list[i] = todo;
                    break;
                }
            }
        },

        addCategory: function (category) {
            var first = data.category[0];
            var id = 1;
            if (first) {
                id = first.id + 1;
            }

            category = extend({}, category);
            category.id = id;
            data.category.unshift(category);
        },

        rmCategory: function (id) {
            id = +id;
            for (var i = 0; i < data.category.length; i++) {
                var item = data.category[i];

                if (item.id === id) {
                    data.category.splice(i, 1);
                    break;
                }
            }
        },

        editCategory: function (category) {
            category = extend({}, category);

            for (var i = 0; i < data.category.length; i++) {
                var item = data.category[i];

                if (item.id === category.id) {
                    data.category[i] = category;
                    break;
                }
            }
        }
    };
})
