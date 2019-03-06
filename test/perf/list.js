const san = require('../../dist/san.ssr');
const art = require('art-template');
const swig = require('swig-templates');
const etpl = require('etpl');
const ejs = require('ejs');
const mustache = require('mustache');
const handlebars = require('handlebars');


let artRenderer = art.compile(`
<div class="todos">
    <a href="#/add" class="todo-add"><i class="fa fa-plus-square"></i></a>
    <ul class="filter-category">
        <% for(let i = 0; i < categories.length; i++){ let item = categories[i]; %>
        <li style="background: <%= item.color %>">
            <a href="/todos/category/<%= item.id %>"><%= item.title %></a>
        </li>
        <% } %>
    </ul>

    <ul class="todo-list">
        <% for(let index = 0; index < todos.length; index++){ let item = todos[index]; %>
        <li style="border-color: <%= item.category.color%>"
            class="<%= item.done ? 'todo-done' : ''%>"
        >
            <h3><%=  item.title %></h3>
            <p><%=  item.desc %></p>
            <div class="todo-meta">
                <% if (item.category) { %>
                <span><%=  item.category.title %> | </span>
                <% } %>
            </div>
            <a class="fa fa-pencil" href="/edit/<%=  item.id %>"></a>
            <i class="fa fa-check"></i>
            <i class="fa fa-trash-o"></i>
        </li>
        <% } %>
    </ul>
</div>
`, {cache: false});


let swigRenderer = swig.compile(`
<div class="todos">
    <a href="#/add" class="todo-add"><i class="fa fa-plus-square"></i></a>
    <ul class="filter-category">
        {% for item in categories %}
        <li style="background: {{item.color}}">
            <a href="/todos/category/{{ item.id }}">{{ item.title }}</a>
        </li>
        {% endfor %}
    </ul>

    <ul class="todo-list">
        {% for item in todos %}
        <li style="border-color: {{item.category.color}}"
            class="{{item.done ? 'todo-done' : ''}}"
        >
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
            <div class="todo-meta">
                {% if item.category %}
                <span>{{ item.category.title }} | </span>
                {% endif %}
            </div>
            <a class="fa fa-pencil" href="/edit/{{ item.id }}"></a>
            <i class="fa fa-check></i>
            <i class="fa fa-trash-o"></i>
        </li>
        {% endfor %}
    </ul>
</div>
`);

let etplRenderer = etpl.compile(`
<div class="todos">
    <a href="#/add" class="todo-add"><i class="fa fa-plus-square"></i></a>
    <ul class="filter-category">
        <!-- for: $\{categories} as $\{item} -->
        <li style="background: $\{item.color}">
            <a href="/todos/category/$\{ item.id }">$\{ item.title }</a>
        </li>
        <!-- /for -->
    </ul>

    <ul class="todo-list">
        <!-- for: $\{todos} as $\{item} -->
        <!-- var: className = $\{item.done} ? 'todo-done' : '' -->
        <li style="border-color: $\{item.category.color}"
            class="$\{className}"
        >
            <h3>$\{ item.title }</h3>
            <p>$\{ item.desc }</p>
            <div class="todo-meta">
                <!-- if: $\{item.category} -->
                <span>$\{ item.category.title } | </span>
                <!-- /if -->
            </div>
            <a class="fa fa-pencil" href="/edit/$\{ item.id }"></a>
            <i class="fa fa-check></i>
            <i class="fa fa-trash-o"></i>
        </li>
        <!-- /for -->
    </ul>
</div>
`);

let ejsRenderer = ejs.compile(`
<div class="todos">
    <a href="#/add" class="todo-add"><i class="fa fa-plus-square"></i></a>
    <ul class="filter-category">
        <% for(let i = 0; i < categories.length; i++){ let item = categories[i]; %>
        <li style="background: <%= item.color %>">
            <a href="/todos/category/<%= item.id %>"><%= item.title %></a>
        </li>
        <% } %>
    </ul>

    <ul class="todo-list">
        <% for(let index = 0; index < todos.length; index++){ let item = todos[index]; %>
        <li style="border-color: <%= item.category.color%>"
            class="<%= item.done ? 'todo-done' : ''%>"
        >
            <h3><%=  item.title %></h3>
            <p><%=  item.desc %></p>
            <div class="todo-meta">
                <% if (item.category) { %>
                <span><%=  item.category.title %> | </span>
                <% } %>
            </div>
            <a class="fa fa-pencil" href="/edit/<%=  item.id %>"></a>
            <i class="fa fa-check"></i>
            <i class="fa fa-trash-o"></i>
        </li>
        <% } %>
    </ul>
</div>
`);

let handlebarsRenderer = handlebars.compile(`
<div class="todos">
    <a href="#/add" class="todo-add"><i class="fa fa-plus-square"></i></a>
    <ul class="filter-category">
        {{#categories}}
        <li style="background: {{color}}">
            <a href="/todos/category/{{ id }}">{{ title }}</a>
        </li>
        {{/categories}}
    </ul>

    <ul class="todo-list">
        {{#todos}}
        <li style="border-color: {{category.color}}"
            class="{{#done}}todo-done{{/done}}"
        >
            <h3>{{ title }}</h3>
            <p>{{ desc }}</p>
            <div class="todo-meta">
                {{#category}}
                <span>{{ title }} | </span>
                {{/category}}
            </div>
            <a class="fa fa-pencil" href="/edit/{{ id }}"></a>
            <i class="fa fa-check></i>
            <i class="fa fa-trash-o"></i>
        </li>
        {{/todos}}
    </ul>
</div>
`);



var MyComponent = san.defineComponent({
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

for (var i = 500; i > 0; i--) {
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

var renderer = san.compileToRenderer(MyComponent);

console.log('----- List SSR Perf (500 items x 100 times) -----');

console.time('san');
for (var i = 0; i < 100; i++) {
    renderer(data, true);
}
console.timeEnd('san');

console.time('artTpl');
for (var i = 0; i < 100; i++) {
    artRenderer(data);
}
console.timeEnd('artTpl');

console.time('swig');
for (var i = 0; i < 100; i++) {
    swigRenderer(data);
}
console.timeEnd('swig');

console.time('etpl');
for (var i = 0; i < 100; i++) {
    etplRenderer(data);
}
console.timeEnd('etpl');

console.time('ejs');
for (var i = 0; i < 100; i++) {
    ejsRenderer(data);
}
console.timeEnd('ejs');

console.time('handlebars');
for (var i = 0; i < 100; i++) {
    handlebarsRenderer(data);
}
console.timeEnd('handlebars');

console.time('mustache');
for (var i = 0; i < 100; i++) {
    mustache.render(`
<div class="todos">
    <a href="#/add" class="todo-add"><i class="fa fa-plus-square"></i></a>
    <ul class="filter-category">
        {{#categories}}
        <li style="background: {{color}}">
            <a href="/todos/category/{{ id }}">{{ title }}</a>
        </li>
        {{/categories}}
    </ul>

    <ul class="todo-list">
        {{#todos}}
        <li style="border-color: {{category.color}}"
            class="{{#done}}todo-done{{/done}}"
        >
            <h3>{{ title }}</h3>
            <p>{{ desc }}</p>
            <div class="todo-meta">
                {{#category}}
                <span>{{ title }} | </span>
                {{/category}}
            </div>
            <a class="fa fa-pencil" href="/edit/{{ id }}"></a>
            <i class="fa fa-check></i>
            <i class="fa fa-trash-o"></i>
        </li>
        {{/todos}}
    </ul>
</div>
`, data);
}
console.timeEnd('mustache');

exports = module.exports = MyComponent;
