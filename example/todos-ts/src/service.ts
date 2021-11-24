
import data from './data'
import Todo from './todo/model'
import Category from './category/model'

interface CategoryMap {
    [key: number]:Category
}

export default {
    todos(categoryId: number) {
        let categoryMap:CategoryMap = {};

        for (let i = 0; i < data.category.length; i++) {
            let item = data.category[i];
            item.id && (categoryMap[item.id] = item);
        }

        let todos = [];
        for (let i = 0; i < data.list.length; i++) {
            let item = data.list[i];

            if (!categoryId || item.categoryId === categoryId) {
                item = Object.assign({}, item);
                todos.push(item);

                if (item.categoryId) {
                    item.category = Object.assign({}, categoryMap[item.categoryId]);
                }
            }
        }

        return todos;
    },

    todo(id: number) {
        let categoryMap:CategoryMap = {};
        for (let i = 0; i < data.category.length; i++) {
            let item = data.category[i];
            item.id && (categoryMap[item.id] = item);
        }

        for (let i = 0; i < data.list.length; i++) {
            let item = data.list[i];

            if (item.id === id) {
                if (item.categoryId) {
                    item = Object.assign({}, item);
                    item.category = Object.assign({}, categoryMap[item.categoryId]);
                }

                return item;
            }
        }

        return null;
    },

    categories() {
        let categories = [];

        for (let i = 0; i < data.category.length; i++) {
            categories.push(Object.assign({}, data.category[i]));
        }

        return categories;
    },

    doneTodo(id: number) {
        for (let i = 0; i < data.list.length; i++) {
            let item = data.list[i];

            if (item.id === id) {
                item.done = true;
                break;
            }
        }
    },

    rmTodo(id: number) {
        for (let i = 0; i < data.list.length; i++) {
            let item = data.list[i];

            if (item.id === id) {
                data.list.splice(i, 1);
                break;
            }
        }
    },

    addTodo(todo: Todo) {
        let first = data.list[0];
        let id = 1;
        if (first) {
            id = first.id + 1;
        }

        todo = Object.assign({}, todo);
        todo.id = id;
        data.list.unshift(todo);
    },

    editTodo(todo: Todo) {
        todo = Object.assign({}, todo);

        for (let i = 0; i < data.list.length; i++) {
            let item = data.list[i];

            if (item.id === todo.id) {
                data.list[i] = todo;
                break;
            }
        }
    },

    addCategory(category: Category) {
        let first = data.category[0];
        let id;
        if (first) {
            id = data.category.length + 1;
        }

        category = Object.assign({}, category);
        category.id = id;
        data.category.unshift(category);
    },

    rmCategory(id: number) {
        id = +id;
        for (let i = 0; i < data.category.length; i++) {
            let item = data.category[i];

            if (item.id === id) {
                data.category.splice(i, 1);
                break;
            }
        }
    },

    editCategory(category: Category) {
        category = Object.assign({}, category);

        for (let i = 0; i < data.category.length; i++) {
            let item = data.category[i];

            if (item.id === category.id) {
                data.category[i] = category;
                break;
            }
        }
    }
}