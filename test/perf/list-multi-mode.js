const san = require('../../dist/san.ssr');


var App = san.defineComponent({
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

const TodoItem = san.defineComponent({
    template: `
        <li style="border-color: {{item.category.color}}"
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
    `
})

const ItemAsComponentApp = san.defineComponent({
    components: {
        'x-item': TodoItem
    },
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
        <x-item item="{{item}}" index="{{index}}" s-for="item, index in todos"/>
    </ul>
</div>
    `
});

const ItemPanel = san.defineComponent({
    template: `
        <li style="border-color: {{item.category.color}}"
            class="{{item.done ? 'todo-done' : ''}}"
        >
            <slot/>
        </li>
    `
});

const SlotApp = san.defineComponent({
    components: {
        'p-item': ItemPanel
    },
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
        <p-item item="{{item}}" s-for="item, index in todos">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
            <div class="todo-meta">
                <span san-if="item.category">{{ item.category.title }} | </span>
            </div>
            <a class="fa fa-pencil" href="/edit/{{ item.id }}"></a>
            <i class="fa fa-check" on-click="doneTodo(index)"></i>
            <i class="fa fa-trash-o" on-click="rmTodo(index)"></i>
        </p-item>
    </ul>
</div>
    `
});

const SItemPanel = san.defineComponent({
    template: `
        <li style="border-color: {{item.category.color}}"
            class="{{item.done ? 'todo-done' : ''}}"
        >
            <slot var-item="{{item}}"/>
        </li>
    `
});

const SSlotApp = san.defineComponent({
    components: {
        'p-item': SItemPanel
    },
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
        <p-item item="{{todo}}" s-for="todo in todos">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
            <div class="todo-meta">
                <span san-if="item.category">{{ item.category.title }} | </span>
            </div>
            <a class="fa fa-pencil" href="/edit/{{ item.id }}"></a>
            <i class="fa fa-check"></i>
            <i class="fa fa-trash-o"></i>
        </p-item>
    </ul>
</div>
    `
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

var renderer = san.compileToRenderer(App);
var itemComponentRenderer = san.compileToRenderer(ItemAsComponentApp);
var slotRenderer = san.compileToRenderer(SlotApp);
var sslotRenderer = san.compileToRenderer(SSlotApp);

console.time('san');
for (var i = 0; i < 100; i++) {
    renderer(data, true);
}
console.timeEnd('san');

console.time('san(item as component)');
for (var i = 0; i < 100; i++) {
    itemComponentRenderer(data, true);
}
console.timeEnd('san(item as component)');

console.time('san(item as component, slot contented)');
for (var i = 0; i < 100; i++) {
    slotRenderer(data, true);
}
console.timeEnd('san(item as component, slot contented)');

console.time('san(item as component, scoped slot)');
for (var i = 0; i < 100; i++) {
    sslotRenderer(data, true);
}
console.timeEnd('san(item as component, scoped slot)');
// console.log(san.compileToSource(SSlotApp))
