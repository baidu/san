ANode 参考
============


ANode 全名抽象节点，是 San 组件框架 template 解析的返回结果。本文档对 ANode 进行说明。


[template 简述](#user-content-template-简述)

　　[插值](#user-content-插值)

　　[普通属性](#user-content-普通属性)

　　[双向绑定](#user-content-双向绑定)

　　[指令](#user-content-指令)

[表达式](#user-content-表达式)

　　[表达式类型](#user-content-表达式类型)

　　[STRING](#user-content-string)

　　[NUMBER](#user-content-number)

　　[IDENT](#user-content-ident)

　　[PROP_ACCESSOR](#user-content-prop_accessor)

　　[INTERPOLATION](#user-content-interpolation)

　　[CALL](#user-content-call)

　　[TEXT](#user-content-text)

　　[BINARY](#user-content-binary)

　　[UNARY](#user-content-unary)

[ANode 与相关类型结构](#user-content-anode-与相关类型结构)

　　[ANode](#user-content-anode)

　　[IndexedList](#user-content-indexedlist)

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

表达式
-----

San 的 template 支持多种形式的表达式，表达式信息在 template 解析过程中会被解析并以 Object 格式保存在 ANode 中。下面是一个简单字符串表达式的信息形式：

```javascript
exprInfo = {
    "type": 1,
    "value": "hello"
}
```

本章对保存在 ANode 中的表达式信息进行相应说明。在下面的描述中，用 `exprInfo` 代替表达式信息对象。

### 表达式类型

从源码中下面枚举类型的声明，可以看出 San 支持的表达式类型。

```javascript
var ExprType = {
    STRING: 1,
    NUMBER: 2,
    IDENT: 3,
    PROP_ACCESSOR: 4,
    INTERPOLATION: 5,
    CALL: 6,
    TEXT: 7,
    BINARY: 8,
    UNARY: 9
};
```

exprInfo 中必须包含 type 属性，值为上面类型值之一。下面不再对 type 属性赘述。


### STRING

字符串表达式

```javascript
// value - 字符串的值
// literal - 字符串声明式，实际值需要再次计算
// 通常 value 和 literal 只会存在一个
exprInfo = {
    type: ExprType.STRING,
    value: '你好',
    literal: '"\\u4f60\\u597d"'
}
```

### NUMBER

数值表达式

```javascript
// literal - 数值的声明式，实际值需要再次计算
exprInfo = {
    type: ExprType.NUMBER,
    literal: '123.456'
}
```

### IDENT

一个数据项名称，代表对一个数据项的引用

```javascript
// name - 数据项名称
exprInfo = {
    type: ExprType.IDENT,
    name: 'user'
}
```

### PROP_ACCESSOR

属性访问表达式，比如 `a.b.c` 或 `a[index]`，代表对一个深层数据项的引用

```javascript
// paths - 属性路径。数组，里面每一项是一个表达式对象，第一项必须是一个 IDENT
exprInfo = {
    type: ExprType.PROP_ACCESSOR,
    paths: [
        {type: ExprType.IDENT, name: 'user'},
        {type: ExprType.STRING, value: 'phones'},
        {
            type: ExprType.PROP_ACCESSOR,
            paths: [
                {type: ExprType.IDENT, name: 'DefaultConfig'},
                {type: ExprType.STRING, name: 'PHONE-INDEX'}
            ]
        }
    ]
}
```

### INTERPOLATION

插值。解析器为了方便解析和求值，将插值看成一种表达式

```javascript
// expr - 数据访问部分表达式信息，一个表达式对象
// filters - 过滤器部分信息。数组，其中每一项是一个 CALL 表达式对象
exprInfo = {
    type: ExprType.INTERPOLATION,
    expr: {
        type: ExprType.PROP_ACCESSOR,
        paths: [
            {type: ExprType.IDENT, name: 'user'},
            {type: ExprType.STRING, value: 'phones'}
        ]
    },
    filters: [
        {
            type: ExprType.CALL,
            name: {type: ExprType.IDENT, name: 'comma'},
            args: [
                {type: ExprType.NUMBER, literal: '3'}
            ]
        }
    ]
}
```

### CALL

调用表达式，表示对方法或过滤器的调用。调用表达式一般出现在插值的过滤器列表，或事件绑定信息中。

```javascript

// name - 过滤器或方法信息，必须是一个 IDENT 表达式信息
// args - 调用参数列表。数组，其中每一项是一个表达式对象
exprInfo = {
    type: ExprType.CALL,
    name: {type: ExprType.IDENT, name: 'comma'},
    args: [
        {type: ExprType.NUMBER, literal: '3'}
    ]
}
```



### TEXT

文本。文本是一段由静态字符串和插值表达式组成的复杂内容，通常用于 text 节点与属性绑定。

```javascript

// segs - 文本组成片段。数组，其中每一项是一个 STRING 或 INTERPOLATION表达式对象
exprInfo = {
    type: ExprType.TEXT,
    segs: [
        {type: ExprType.STRING, value: 'Hello '},
        {
            type: ExprType.INTERPOLATION,
            expr: {
                type: ExprType.IDENT,
                name: 'whoAmI'
            },
            filters: []
        },
        {type: ExprType.STRING, value: '!'}
    ]
}
```

### BINARY

二元表达式，支持多种计算和比较，包括 `+ | - | * | ／ | && | || | == | != | === | !== | > | >= | < | <=` 

```javascript
// operator - 操作符。数值，值为操作符各个 char 的 ascii 之和。比如 == 操作符的 operator 为 61 + 61 = 122
// segs - 包含两个表达式对象的数组
exprInfo = {
    type: ExprType.BINARY,
    operator: BinaryOp[248],
    segs: [expr, readLogicalORExpr(walker)]
}
```

### UNARY

一元表达式，其实现在就只支持 `!` 的逻辑否定。

```javascript
exprInfo = {
    type: ExprType.UNARY,
    expr: {
        type: ExprType.PROP_ACCESSOR,
        paths: [
            {type: ExprType.IDENT, name: 'user'},
            {type: ExprType.STRING, value: 'isLogin'}
        ]
    }
}
```

ANode 与相关类型结构
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




