todos-ts
===

> todos demo use `typescript`

## Prepare

```
$ npm i
```

## Dev

First, run dev script:

```
$ npm start
```

## Notice

本示例项目中，使用了不同的写法，以演示可以如何使用 typescript 编写组件。

- [defineComponent](src/todo/form.ts#L16)
- [defineComponent<DataT>](src/ui/calendar.ts#L12)
- [defineComponent<DataT, ICmpt>](src/todo/list.ts#L56)
- [extends Component](src/todo/form.ts#L49)
- [extends Component<DataT>](src/category/add.ts#L9)

san 的类型支持允许在 typescript 中不定义任何类型就定义组件，但这不意味着我们认为这样做就很好。明确的类型对开发时有很大的帮助，这也是使用 typescript 而不是 anyscript 的理由。因此，我们推荐：

- 在一个项目中，尽量使用一致的组件定义方式
- 定义组件前，先定义组件的 data
- 如果使用 `defineComponent` 可以定义组件的方法。使用 `defineComponent<DataT, ICmpt>` 定义组件
- 如果使用 `extends`，使用 `extends Component<DataT>` 定义组件

