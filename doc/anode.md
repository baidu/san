ANode 参考
============


ANode 全名抽象节点，是 San 组件框架 template 解析的返回结果。本文档对 ANode 进行说明。


template 简述
------------

在 San 中，template 是一个符合 HTML 语法规则的字符串。在 template 中，数据绑定与事件的声明通过以下形式：

### 插值

文本中通过 `{{...}}` 声明插值，插值内部支持表达式和过滤器的声明。

`插值语法`

```
{{ expr [[| filter-call1] | filter-call2...] }}
```

`示例`

```html
<p>Hello {{name}}!</p>
```

### 普通属性

属性内部可以出现插值语法。

`示例`

```html
<span title="This is {{name}}">{{name}}</span>
```

template 解析阶段无法预知当前节点将会渲染成一个普通元素还是一个复杂组件，所以，将属性全部处理为是绑定表达式：

- 复杂形式的值，处理成字符串表达式。如 `title="This is {{name}}"`
- 只包含单一插值，处理成插值表达式。如 `title="{{name}}"`


### 双向绑定

San 认为 template 应该尽量保持 HTML 的语法简洁性，所以双向绑定方式在属性的值上做文章：属性值形式为 `{= expression =}` 的认为是双向绑定。

`示例`

```html
<input type="text" value="{= name =}">
```

双向绑定仅支持普通变量和属性访问表达式。


### 指令

以 `san-` 为前缀的属性，将被解析成指令。常见的指令有 for、if 等。

`示例`


```html
<span san-if="isOnline">Hello!</span>
<span san-else>Offline</span>

<dl>
    <dt>name - email</dt>
    <dd san-for="p in persons" title="{{p.name}}">{{p.name}}({{dept}}) - {{p.email}}</dd>
</dl>
```

类型
------

此处只说明解析完成返回结果中可能被访问的实例类型。解析过程中用到的 Walker 等类不做说明。

### ANode

template 的 parse 直接返回一个 ANode 类的实例。实例上不包含任何方法，只有属性。

#### {boolean?} isText

标识当前节点是否为文本节点

#### {string} text

文本节点的文本内容。当 isText 为 true 时有效

#### {Array.<ANode>} childs

ANode 的结构与 HTML 一样，是一个树状结构。childs 是当前节点的子节点列表。文本节点该属性无效

#### {IndexedList} binds

节点的属性绑定信息。文本节点该属性无效

```javascript
// 获取 title 属性绑定信息。该信息是一个表达式
aNode.binds.get('title');

// 遍历所有绑定属性
aNode.binds.each(function (bindItem) {
});
```


#### {IndexedList} events

节点的事件绑定信息。文本节点该属性无效

```javascript
// 获取 click 事件绑定信息。该信息是一个表达式
aNode.events.get('click');

// 遍历所有绑定属性
aNode.events.each(function (eventItem) {
});
```

#### {IndexedList} directives

节点的指令绑定信息。文本节点该属性无效

```javascript
// 获取 if 指令信息。该信息是一个特定的指令信息对象
aNode.directives.get('if');
```

#### {string} tagName

节点的标签名。文本节点该属性无效




### IndexedList

IndexedList 是一个索引列表，添加到列表中的 item，能根据 item 的 name 属性进行索引。IndexedList 提供了一些常用的集合操作的方法。

```javascript
var list = new IndexedList();
list.push({name: 'test', text: 'hello'});

// console log {name: 'test', text: 'hello'}
console.log(list.get('test')); 
```

ANode 的 binds、events、directives 属性因为需要较频繁的根据 name 访问，以及遍历操作，直接使用 Array 或 Object 都会存在弊端，故使用 IndexedList。

#### {void} push({Object} item)

在列表中添加一个 item。

#### {void} each({function(Object, number):boolean}iterator, {Object?}thisArg)

遍历整个索引列表

#### {Object} getAt({number} index)

根据顺序下标获取 item

#### {Object} get({string} name)

根据 name 获取 item

#### {void} removeAt({number} index)

根据顺序下标移除 item

#### {void} remove({string} name)

根据 name 移除 item

#### {IndexedList} concat({IndexedList} other)

连接另外一个 IndexedList，返回一个新的 IndexedList


表达式
-----

ANode 是一个树状结构，每个 ANode 的节点 通过
