ANode 压缩结构设计
=======


提前将 template 编译成 ANode，可以避免在浏览器端进行 template 解析，提高初始装载性能。ANode 是个 JSON Object，stringify 后体积较大，需要设计一种压缩，让其体积更小，网络传输成本更低。

ANode 压缩，简称 APack


总体设计
------

设计目标和约束有：

1. 体积较小
2. 解压缩过程快

基于以上，基本方案为：

1. 使用一维 JS Array 作为压缩后的对象。符合 JS 能解析，解压缩过程一次遍历完成。
2. 对不同类型的节点对象，包含的属性是固定的。通过 `{number}head` 标识类型，然后依次读取，节点对象中的属性名完全被删除。
3. 空的数组、对象等值，以 undefined 忽略，数组中形态可能是 `[1,,]`，进一步减少体积。
4. 自己实现 stringify。JSON 中不包含 undefined 类型，使用 JSON stringify 会把 undefined 输出成 null。
5. 对于 ANode 中数组类型的值，压缩后第一项为数组长度，然后依次为数组 item。
6. 泛属性节点（普通属性、双向绑定属性、指令、事件、var）由 `{number}head` 独立标识。
7. 根据 ANode 中出现的频度，以 0 和 1 标识模板节点，以 2 标识 普通属性节点，3-32 为表达式节点，33-99 为特殊泛属性节点（双向绑定属性、指令、事件、var）。
8. bool true 以 1 表示，bool false 以 undefined 表示，compressed 为空



模板节点
------

### 文本节点

- head: 0
- 编码序: `{Node}textExpr`

```js
aPack = [,9,,2,3,"Hello ",7,,6,1,3,"name",]
/*
{
    "textExpr": {
        "type": 7,
        "segs": [
            {
                "type": 1,
                "value": "Hello "
            },
            {
                "type": 5,
                "expr": {
                    "type": 4,
                    "paths": [
                        {
                            "type": 1,
                            "value": "name"
                        }
                    ]
                },
                "filters": []
            }
        ]
    }
}
*/
```

### 元素节点

- head: 1
- 编码序: `{string?}tagName, {Array<Node>}propsAndChildren, {Array<Node>?}elses`

```js
aPack = [1,"dd",3,38,6,1,3,"list",37,"item",,,6,1,3,"list",,9,,1,7,,6,1,3,"item",,]
/*
{
    "directives": {
        "if": {
            "value": {
                "type": 4,
                "paths": [
                    {
                        "type": 1,
                        "value": "list"
                    }
                ]
            }
        },
        "for": {
            "item": "item",
            "value": {
                "type": 4,
                "paths": [
                    {
                        "type": 1,
                        "value": "list"
                    }
                ]
            }
        }
    },
    "props": [],
    "events": [],
    "children": [
        {
            "textExpr": {
                "type": 7,
                "segs": [
                    {
                        "type": 5,
                        "expr": {
                            "type": 4,
                            "paths": [
                                {
                                    "type": 1,
                                    "value": "item"
                                }
                            ]
                        },
                        "filters": []
                    }
                ]
            }
        }
    ],
    "tagName": "dd"
}
*/
```


表达式节点
-------

### STRING

- head: 3
- 编码序: `{string}value`

```js
aPack = [3,"Hello"]
/*
{
    "type": 1,
    "value": "Hello"
}
*/
```

### NUMBER

- head: 4
- 编码序: `{number}value`

```js
aPack = [4,10]
/*
{
    "type": 2,
    "value": 10
}
*/
```

### BOOL

- head: 5
- 编码序: `{bool}value`

```js
aPack = [5,1]
/*
{
    "type": 3,
    "value": true
}
*/
```

### ACCESSOR

- head: 6
- 编码序: `{Array}paths`

```js
aPack = [6,1,3,"name"]
/*
{
    "type": 4,
    "paths": [
        {
            "type": 1,
            "value": "name"
        }
    ]
}
*/
```

### INTERP

- head: 7
- 编码序: `{bool}original, {Node}expr, {Array<Node>}filters`

```js
aPack = [7,,6,1,3,"name",]
/*
{
    "type": 5,
    "expr": {
        "type": 4,
        "paths": [
            {
                "type": 1,
                "value": "name"
            }
        ]
    },
    "filters": []
}
*/
```

### CALL

- head: 8
- 编码序: `{Node}name, {Array<Node>}args`

```js
aPack = [8,6,1,3,"showToast",1,6,1,3,"msg"]
/*
{
    "type": 6,
    "name": {
        "type": 4,
        "paths": [
            {
                "type": 1,
                "value": "showToast"
            }
        ]
    },
    "args": [
        {
            "type": 4,
            "paths": [
                {
                    "type": 1,
                    "value": "msg"
                }
            ]
        }
    ]
}
*/
```

### TEXT

- head: 9
- 编码序: `{bool}original, {Array<Node>}segs`

```js
aPack = [9,,2,3,"Hello ",7,,6,1,3,"name",]
/*
{
    "type": 7,
    "segs": [
        {
            "type": 1,
            "value": "Hello "
        },
        {
            "type": 5,
            "expr": {
                "type": 4,
                "paths": [
                    {
                        "type": 1,
                        "value": "name"
                    }
                ]
            },
            "filters": []
        }
    ]
}
*/
```

### BINARY

- head: 10
- 编码序: `{number}operator, {Node}first, {Node}second`

```js
aPack = [10,43,6,1,3,"num",4,1]
/*
{
    "type": 8,
    "operator": 43,
    "segs": [
        {
            "type": 4,
            "paths": [
                {
                    "type": 1,
                    "value": "num"
                }
            ]
        },
        {
            "type": 2,
            "value": 1
        }
    ]
}
*/
```

### UNARY

- head: 11
- 编码序: `{number}operator, {Node}expr`

```js
aPack = [11,33,6,1,3,"exists"]
/*
{
    "type": 9,
    "expr": {
        "type": 4,
        "paths": [
            {
                "type": 1,
                "value": "exists"
            }
        ]
    },
    "operator": 33
}
*/
```

### TERTIARY

- head: 12
- 编码序: `{Node}condExpr, {Node}truthyExpr, {Node}falsyExpr`

```js
aPack = [12,6,1,3,"exists",6,1,3,"num",4,0]
/*
{
    "type": 10,
    "segs": [
        {
            "type": 4,
            "paths": [
                {
                    "type": 1,
                    "value": "exists"
                }
            ]
        },
        {
            "type": 4,
            "paths": [
                {
                    "type": 1,
                    "value": "num"
                }
            ]
        },
        {
            "type": 2,
            "value": 0
        }
    ]
}
*/
```

### OBJECT

- head: 13
- 编码序: `{Array<Node>}items`

### OBJECT ITEM UNSPREAD

- head: 14
- 编码序: `{Node}name, {Node}expr`

### OBJECT ITEM SPREAD

- head: 15
- 编码序: `{Node}expr`

### ARRAY

- head: 16
- 编码序: `{Array<Node>}items`

### ARRAY ITEM UNSPREAD

- head: 17
- 编码序: `{Node}expr`

### ARRAY ITEM SPREAD

- head: 18
- 编码序: `{Node}expr`

### NULL

- head: 19
- 编码序: 无

```js
aPack = [19]
/*
{
    "type": 13
}
*/
```


泛属性节点
-------

### 普通属性

- head: 2
- 编码序: `{string}name, {Node}expr`

### NOVALUE 属性

- head: 33
- 编码序: `{string}name, {Node}expr`

### 双向绑定属性

- head: 34
- 编码序: `{string}name, {Node}expr`

### 事件

- head: 35
- 编码序: `{string}name, {Node}expr, {ObjectAsArray}modifier`

```js
aPack = [35,"click",8,6,1,3,"showToast",1,6,1,3,"msg",]
/*
{
    "name": "click",
    "modifier": {},
    "expr": {
        "type": 6,
        "name": {
            "type": 4,
            "paths": [
                {
                    "type": 1,
                    "value": "showToast"
                }
            ]
        },
        "args": [
            {
                "type": 4,
                "paths": [
                    {
                        "type": 1,
                        "value": "msg"
                    }
                ]
            }
        ]
    }
}
*/
```

### var

- head: 36
- 编码序: `{string}name, {Node}expr`


### 指令 for

- head: 37
- 编码序: `{string}item, {string?}index, {string?}trackByRaw, {Node}value`
- 注: trackBy 通过 trackByRaw 二次解析


### 指令 if

- head: 38
- 编码序: `{Node}value`


### 指令 elif

- head: 39
- 编码序: `{Node}value`


### 指令 else

- head: 40
- 编码序: 无
- 注: 为保持一直，自生成 `{value:{}}`


### 指令 ref

- head: 41
- 编码序: `{Node}value`


### 指令 bind

- head: 42
- 编码序: `{Node}value`


### 指令 html

- head: 43
- 编码序: `{Node}value`


### 指令 transition

- head: 44
- 编码序: `{Node}value`
