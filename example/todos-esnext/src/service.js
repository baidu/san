/**
 * @file 服务
 */

import data from './data'


/**
 * 对象属性拷贝
 *
 * @inner
 * @param {Object} target 目标对象
 * @param {Object} source 源对象
 * @return {Object} 返回目标对象
 */
function extend(target, source) {
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }

    return target;
}

export default {
    todos(category) {
        let categoryMap = {};
        for (let i = 0; i < data.category.length; i++) {
            let item = data.category[i];
            categoryMap[item.id] = item;
        }

        let todos = [];
        for (let i = 0; i < data.list.length; i++) {
            let item = data.list[i];

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

    todo(id) {
        let categoryMap = {};
        for (let i = 0; i < data.category.length; i++) {
            let item = data.category[i];
            categoryMap[item.id] = item;
        }

        for (let i = 0; i < data.list.length; i++) {
            let item = data.list[i];

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

    categories() {
        let categories = [];

        for (let i = 0; i < data.category.length; i++) {
            categories.push(extend({}, data.category[i]));
        }

        return categories;
    },

    doneTodo(id) {
        for (let i = 0; i < data.list.length; i++) {
            let item = data.list[i];

            if (item.id === id) {
                item.done = true;
                break;
            }
        }
    },

    rmTodo(id) {
        id = +id;
        for (let i = 0; i < data.list.length; i++) {
            let item = data.list[i];

            if (item.id === id) {
                data.list.splice(i, 1);
                break;
            }
        }
    },

    addTodo(todo) {
        let first = data.list[0];
        let id = 1;
        if (first) {
            id = first.id + 1;
        }

        todo = extend({}, todo);
        todo.id = id;
        data.list.unshift(todo);
    },

    editTodo(todo) {
        todo = extend({}, todo);

        for (let i = 0; i < data.list.length; i++) {
            let item = data.list[i];

            if (item.id === todo.id) {
                data.list[i] = todo;
                break;
            }
        }
    },

    addCategory(category) {
        let first = data.category[0];
        let id;
        if (first) {
            id = data.category.length + 1;
        }

        category = extend({}, category);
        category.id = id;
        data.category.unshift(category);
    },

    rmCategory(id) {
        id = +id;
        for (let i = 0; i < data.category.length; i++) {
            let item = data.category[i];

            if (item.id === id) {
                data.category.splice(i, 1);
                break;
            }
        }
    },

    editCategory(category) {
        category = extend({}, category);

        for (let i = 0; i < data.category.length; i++) {
            let item = data.category[i];

            if (item.id === category.id) {
                data.category[i] = category;
                break;
            }
        }
    }
};

