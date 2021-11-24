import './list.css'

import san from 'san'
import Todo from './model'
import Category from '../category/model'

import service from '../service'
import { formatDate } from '../filters'
import { Link } from 'san-router'


const template = `
<div class="todos">
    <router-link to="/add" class="todo-add"><i class="fa fa-plus-square"></i></router-link>
    <ul class="filter-category">
        <li
            s-for="item in categories"
            style="background: {{item.color}}"
            class="{{item.id == route.query.category ? 'checked' : ''}}"
        >
            <router-link to="/todos/category/{{ item.id }}">{{ item.title }}</router-link>
        </li>
    </ul>

    <router-link to="/" class="fa fa-close filter-category-clear" style="display: {{route.query.category ? '' : 'none'}}"></router-link>

    <ul class="todo-list">
        <li s-for="item, index in todos"
            style="border-color: {{item.category.color}}"
            class="{{item.done ? 'todo-done' : ''}}"
        >
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
            <div class="todo-meta">
                <span s-if="item.category.title">{{ item.category.title }} | </span>
                <span>预期完成时间: {{ item.endTime | formatDate('YYYY-MM-DD, h:mm a') }}</span>
            </div>
            <router-link class="fa fa-pencil" to="/edit/{{ item.id }}"></router-link>
            <i class="fa fa-check" on-click="doneTodo(index)"></i>
            <i class="fa fa-trash-o" on-click="rmTodo(index)"></i>
        </li>
    </ul>
</div>
`;

interface ListData {
    todos: Todo[];
    categories: Category[];
}

interface ListBehavior {
    doneTodo: (index: number) => void;
    rmTodo: (index: number) => void;
}

const List = san.defineComponent<ListData, ListBehavior>({
    template,

    components: {
        'router-link': Link
    },

    filters: {
        formatDate
    },

    route() {
        let route = this.data.get('route');
        let todos = service.todos(+(route.query.category || 0));

        this.data.set('todos', todos);
        this.data.set('categories', service.categories());
    },

    doneTodo(index) {
        let todo = this.data.get('todos')[index];
        service.doneTodo(todo.id);

        this.data.set('todos.' + index + '.done', true);
    },

    rmTodo(index) {
        let todo = this.data.get('todos')[index];
        service.rmTodo(todo.id);

        this.data.removeAt('todos', index);
    }
});

export default List;
