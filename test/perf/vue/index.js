const Vue = require('vue')
const san = require('../../../dist/san.ssr');

var data = {
    "todos": [
    ],
    "categories": [
        {
            "id": 8,
            "title": "category8",
            "color": "#c23531"
        },
        {
            "id": 7,
            "title": "category7",
            "color": "#314656"
        },
        {
            "id": 6,
            "title": "category6",
            "color": "#dd8668"
        },
        {
            "id": 5,
            "title": "category5",
            "color": "#91c7ae"
        },
        {
            "id": 4,
            "title": "category4",
            "color": "#6e7074"
        },
        {
            "id": 3,
            "title": "category3",
            "color": "#bda29a"
        },
        {
            "id": 2,
            "title": "category2",
            "color": "#44525d"
        },
        {
            "id": 1,
            "title": "category1",
            "color": "#c4ccd3"
        }
    ]
};

for (var i = 1000; i > 0; i--) {
    data.todos.push({
        "id": i,
        "title": "TodoTitle" + i,
        "desc": "Todo Description" + i,
        "endTime": 1548149025190,
        "category": data.categories[i % 8],
        "addTime": 1548062625190,
        "done": i === 100 ? true : false
    });
}

const MyComponent = san.defineComponent({
    trimWhitespace: 'all',
    template: `
<div class="todos">
    <a href="#/add" class="todo-add"><i class="fa fa-plus-square"></i></a>
    <ul class="filter-category">
        <li
            san-for="item in categories"
            style="background: {{item.color}}"
        >
            <a href="/todos/category/{{ item.id }}">{{ item.title }}</a>
        </li>
    </ul>

    <ul class="todo-list">
        <li san-for="item, index in todos"
            style="border-color: {{item.category.color}}"
            class="{{item.done ? 'todo-done' : ''}}"
        >
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
            <div class="todo-meta">
                <span san-if="item.category">{{ item.category.title }} | </span>
            </div>
            <a class="fa fa-pencil" href="/edit/{{ item.id }}"></a>
            <i class="fa fa-check" on-click="doneTodo(index)"></i>
            <i class="fa fa-trash-o" on-click="rmTodo(index)"></i>
        </li>
    </ul>
</div>
    `,

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
let sanRenderer = san.compileToRenderer(MyComponent);

console.log('----- List SSR Perf (1000 items) -----');

console.time('san');
sanRenderer(data);
console.timeEnd('san');


const app = new Vue({
    template: `
<div class="todos">
    <a href="#/add" class="todo-add"><i class="fa fa-plus-square"></i></a>
    <ul class="filter-category">
        <li
            v-for="item in categories"
            v-bind:style="{ background: item.color }"
        >
            <a :href="'/todos/category/' + item.id">{{ item.title }}</a>
        </li>
    </ul>

    <ul class="todo-list">
        <li v-for="(item, index) in todos"
            v-bind:style="{ 'border-color': item.category.color }"
            v-bind:class="{ 'todo-done': item.done }"
        >
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
            <div class="todo-meta">
                <span v-if="item.category">{{ item.category.title }} | </span>
            </div>
            <a class="fa fa-pencil" :href="'/edit/' + item.id"></a>
            <i class="fa fa-check" v-on:click="doneTodo(index)"></i>
            <i class="fa fa-trash-o" v-on:click="rmTodo(index)"></i>
        </li>
    </ul>
</div>
`,
    data
})

// Step 2: Create a renderer
const renderer = require('vue-server-renderer').createRenderer()

// Step 3: Render the Vue instance to HTML
console.time('vue');
renderer.renderToString(app, (err, html) => {
    if (err) throw err
    console.timeEnd('vue');
    //console.log(html)
})


