ANode 参考
============


ANode 全名抽象节点，是 San 组件框架 template 解析的返回结果。本文档对 ANode 进行说明。


[template 简述](#user-content-template-简述)  
　　[插值语法](#user-content-插值语法)  
　　[普通属性语法](#user-content-普通属性)  
　　[双向绑定语法](#user-content-双向绑定)  
　　[指令语法](#user-content-指令)  
[表达式](#user-content-表达式)  
　　[表达式类型](#user-content-表达式类型)  
　　[STRING](#user-content-string)  
　　[NUMBER](#user-content-number)  
　　[BOOL](#user-content-bool)  
　　[ACCESSOR](#user-content-accessor)  
　　[INTERP](#user-content-interp)  
　　[CALL](#user-content-call)  
　　[TEXT](#user-content-text)  
　　[BINARY](#user-content-binary)  
　　[UNARY](#user-content-unary)  
　　[TERTIARY](#user-content-tertiary)  
　　[ARRAY LITERAL](#user-content-array-literal)  
　　[OBJECT LITERAL](#user-content-object-literal)  
　　[PARENTHESIZED](#user-content-parenthesized)  
[ANode 的结构](#user-content-anode-的结构)  
[模板解析结果](#user-content-模板解析结果)  
　　[文本](#user-content-文本)  
　　[属性](#user-content-属性)  
　　[双向绑定](#user-content-双向绑定)  
　　[复杂的插值](#user-content-复杂的插值)  
　　[事件绑定](#user-content-事件绑定)  
　　[条件指令](#user-content-条件指令)  
　　[循环指令](#user-content-循环指令)  



template 简述
------------

在 San 中，template 是一个符合 HTML 语法规则的字符串。在 template 中，数据绑定与事件的声明通过以下形式：

### 插值语法

文本中通过 `{{...}}` 声明插值，插值内部支持表达式和过滤器的声明。

`插值语法`

```
{{ expr [[| filter-call1] | filter-call2...] }}
```

`示例`

```html
<p>Hello {{name}}!</p>
```

### 普通属性语法

属性内部可以出现插值语法。

`示例`

```html
<span title="This is {{name}}">{{name}}</span>
```

属性声明根据不同形式，处理成不同的绑定表达式：

- 复杂形式的值，处理成[TEXT表达式](#user-content-text)。如 `title="This is {{name}}"`
- 只包含单一插值，并且无 filter 时，插值内部的表达式会被抽取出来。如 `title="{{name}}"`


### 双向绑定语法

San 认为 template 应该尽量保持 HTML 的语法简洁性，所以双向绑定方式在属性的值上做文章：属性值形式为 `{= expression =}` 的认为是双向绑定。

`示例`

```html
<input type="text" value="{= name =}">
```

双向绑定仅支持普通变量和属性访问表达式。


### 指令语法

以 `s-` 为前缀的属性，将被解析成指令。常见的指令有 for、if 等。

`示例`


```html
<span s-if="isOnline">Hello!</span>
<span s-else>Offline</span>

<dl>
    <dt>name - email</dt>
    <dd s-for="p in persons" title="{{p.name}}">{{p.name}}({{dept}}) - {{p.email}}</dd>
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
    BOOL: 3,
    ACCESSOR: 4,
    INTERP: 5,
    CALL: 6,
    TEXT: 7,
    BINARY: 8,
    UNARY: 9,
    TERTIARY: 10,
    ARRAY: 11,
    OBJECT: 12
};
```

exprInfo 中必须包含 type 属性，值为上面类型值之一。下面不再对 type 属性赘述。


### STRING

字符串字面量

```javascript
// value - 字符串的值
exprInfo = {
    type: ExprType.STRING,
    value: '你好'
}
```

### NUMBER

数值字面量

```javascript
// value - 数值的值
exprInfo = {
    type: ExprType.NUMBER,
    value: 123.456
}
```

### BOOL

布尔字面量

```javascript
// value - 数值的值
exprInfo = {
    type: ExprType.BOOL,
    value: true
}
```


### ACCESSOR

数据访问表达式，比如 `a` ／ `a.b.c` ／ `a[index]`，代表对一个数据项的引用

```javascript
// paths - 属性路径。数组，里面每一项是一个表达式对象
exprInfo = {
    type: ExprType.ACCESSOR,
    paths: [
        {type: ExprType.STRING, value: 'user'},
        {type: ExprType.STRING, value: 'phones'},
        {
            type: ExprType.ACCESSOR,
            paths: [
                {type: ExprType.STRING, value: 'DefaultConfig'},
                {type: ExprType.STRING, value: 'PHONE-INDEX'}
            ]
        }
    ]
}
```

### INTERP

插值。解析器为了方便解析和求值，将插值看成一种表达式

```javascript
// expr - 数据访问部分表达式信息，一个表达式对象
// filters - 过滤器部分信息。数组，其中每一项是一个 CALL 表达式对象
exprInfo = {
    type: ExprType.INTERP,
    expr: {
        type: ExprType.ACCESSOR,
        paths: [
            {type: ExprType.STRING, value: 'user'},
            {type: ExprType.STRING, value: 'phones'}
        ]
    },
    filters: [
        {
            type: ExprType.CALL,
            name: {
                type: ExprType.ACCESSOR,
                paths: [
                    {type: ExprType.STRING, value: 'comma'}
                ]
            },
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

// name - 调用方法名。字符串
// args - 调用参数列表。数组，其中每一项是一个表达式对象
exprInfo = {
    type: ExprType.CALL,
    name: {
        type: ExprType.ACCESSOR,
        paths: [
            {type: ExprType.STRING, value: 'comma'}
        ]
    },
    args: [
        {type: ExprType.NUMBER, literal: '3'}
    ]
}
```



### TEXT

文本。文本是一段由静态字符串和插值表达式组成的复杂内容，通常用于 text 节点与属性绑定。

```javascript

// segs - 文本组成片段。数组，其中每一项是一个 STRING 或 INTERP表达式对象
exprInfo = {
    type: ExprType.TEXT,
    segs: [
        {type: ExprType.STRING, value: 'Hello '},
        {
            type: ExprType.INTERP,
            expr: {
                type: ExprType.ACCESSOR,
                paths: [
                    {type: ExprType.STRING, value: 'whoAmI'}
                ]
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
    segs: [
        {
            type: ExprType.ACCESSOR,
            paths: [
                {type: ExprType.STRING, value: 'commaLength'}
            ]
        },
        {
            type: ExprType.NUMBER,
            literal: "1"
        }
    ],
    operator: 43
}
```

### UNARY

一元表达式，支持：

- `!` 逻辑否定
- `-` 取负
- `+` 转换成数值

```javascript
// operator - 操作符。数值，值为操作符 char 的 ascii。
exprInfo = {
    type: ExprType.UNARY,
    expr: {
        type: ExprType.ACCESSOR,
        paths: [
            {type: ExprType.STRING, value: 'user'},
            {type: ExprType.STRING, value: 'isLogin'}
        ]
    },
    operator: 33
}
```

### TERTIARY

三元表达式，其实就是 `conditional ? yes-expr : no-expr` 的条件表达式。

```javascript
// segs - 包含3个表达式对象的数组，第一个是条件表达式，第二个是值为真时的表达式，第三个是值为假时的表达式
exprInfo = {
    type: ExprType.TERTIARY,
    segs: [
        {
            type: ExprType.ACCESSOR,
            paths: [
                {type: ExprType.STRING, value: 'user'},
                {type: ExprType.STRING, value: 'isLogin'}
            ]
        },
        {
            type: ExprType.STRING,
            value: 'yes'
        },
        {
            type: ExprType.STRING,
            value: 'no'
        }
    ]
}
```

### ARRAY LITERAL

数组字面量，支持数组展开。

```javascript
// [name, 'text', ...ext, true]
// items - 数组项列表。expr 为数组项表达式，spread 代表是否为展开项
exprInfo = {
    type: ExprType.ARRAY,
    items: [
        {
            "expr": {
                "type": ExprType.ACCESSOR,
                "paths": [
                    {
                        "type": ExprType.STRING,
                        "value": "name"
                    }
                ]
            }
        },
        {
            "expr": {
                "type": ExprType.STRING,
                "value": "text"
            }
        },
        {
            "spread": true,
            "expr": {
                "type": ExprType.ACCESSOR,
                "paths": [
                    {
                        "type": ExprType.STRING,
                        "value": "ext"
                    }
                ]
            }
        },
        {
            "expr": {
                "type": ExprType.BOOL,
                "value": true
            }
        }
    ]
}
```

### OBJECT LITERAL

对象字面量，支持对象展开。

```javascript
// {name: realName, email, ...ext}
// items - 对象项列表。name 为项 name 表达式， expr 为项 value 表达式，spread 代表是否为展开项
exprInfo = {
    "type": ExprType.OBJECT,
    "items": [
        {
            "name": {
                "type": ExprType.STRING,
                "value": "name"
            },
            "expr": {
                "type": ExprType.ACCESSOR,
                "paths": [
                    {
                        "type": ExprType.STRING,
                        "value": "realName"
                    }
                ]
            }
        },
        {
            "name": {
                "type": ExprType.STRING,
                "value": "email"
            },
            "expr": {
                "type": ExprType.ACCESSOR,
                "paths": [
                    {
                        "type": ExprType.STRING,
                        "value": "email"
                    }
                ]
            }
        },
        {
            "spread": true,
            "expr": {
                "type": ExprType.ACCESSOR,
                "paths": [
                    {
                        "type": ExprType.STRING,
                        "value": "ext"
                    }
                ]
            }
        }
    ]
}
```

### PARENTHESIZED

括号表达式不会生成独立的表达式对象。被括号包含的表达式，在其对象上有一个 `parenthesized` 属性，值为 `true`。

```javascript
// (a + b) * c
// a + b 的表达式对象上包含 parenthesized 属性，值为 true
exprInfo = {
    type: ExprType.BINARY,
    segs: [
        {
            type: ExprType.BINARY,
            parenthesized: true,
            segs: [
                {
                    type: ExprType.ACCESSOR,
                    paths: [
                        {type: ExprType.STRING, value: 'a'}
                    ]
                },
                {
                    type: ExprType.ACCESSOR,
                    paths: [
                        {type: ExprType.STRING, value: 'b'}
                    ]
                }
            ],
            operator: 43
        },
        {
            type: ExprType.ACCESSOR,
            paths: [
                {type: ExprType.STRING, value: 'c'}
            ]
        }
    ],
    operator: 42
}
```


ANode 的结构
------

template 的 parse 直接返回一个 ANode 对象。ANode 是一个 JSON Object，不包含任何方法，只有属性。


#### {Object?} textExpr

文本的表达式对象。当前节点为文本节点时该属性存在。

#### {Array.<ANode>} children

ANode 的结构与 HTML 一样，是一个树状结构。children 是当前节点的子节点列表。文本节点该属性无效

#### {Array.<Object>} props

节点的属性绑定信息。文本节点该属性无效

```javascript
// 遍历所有绑定属性
aNode.props.forEach(function (prop) {
});
```


#### {Array.<Object>} events

节点的事件绑定信息。文本节点该属性无效

```javascript
// 遍历所有绑定属性
aNode.events.forEach(function (event) {
});
```

#### {Object} directives

节点的指令绑定信息。文本节点该属性无效

```javascript
// 获取 if 指令信息。该信息是一个特定的指令信息对象
aNode.directives['if'];
```

#### {string} tagName

节点的标签名。文本节点该属性无效

#### {Array.<ANode>?} elses

当节点包含 `if` directive 时，其对应的 `else` 和 `elif` 节点



模板解析结果
----------

模板解析的返回结果是一个标签节点的 ANode 实例，实例中 `children` 包含子节点、`props` 包含属性绑定信息、`events` 包含事件绑定信息、`directives` 包含指令信息、`tagName` 为节点标签名、`elses` 为条件节点结。

本章节通过一些示例说明模板解析的 ANode 结果。其中表达式信息的详细说明请参考 [表达式](#user-content-表达式) 章节，ANode 结构请参考 [ANode 的结构](#user-content-anode-的结构) 章节。


### 文本

文本节点作为 p 标签的子节点存在。

```html
<p>Hello {{name}}!</p>
```

```javascript
aNode = {
    "directives": {},
    "props": [],
    "events": [],
    "children": [
        {
            "textExpr": {
                "type": ExprType.TEXT,
                "segs": [
                    {
                        "type": ExprType.STRING,
                        "value": "Hello "
                    },
                    {
                        "type": ExprType.INTERP,
                        "expr": {
                            "type": ExprType.ACCESSOR,
                            "paths": [
                                {
                                    "type": ExprType.STRING,
                                    "value": "name"
                                }
                            ]
                        },
                        "filters": []
                    }
                ]
            }
        }
    ],
    "tagName": "p"
}
```

### 属性

属性信息是一个 `绑定信息对象`，其中：

- name - 属性名
- expr - 表达式信息对象

下面例子的 title 属性绑定到一个 TEXT 类型的表达式中。

```html
<span title="This is {{name}}">{{name}}</span>
```

```javascript
aNode = {
    "directives": {},
    "props": [
        {
            "name": "title",
            "expr": {
                "type": ExprType.TEXT,
                "segs": [
                    {
                        "type": ExprType.STRING,
                        "value": "This is "
                    },
                    {
                        "type": ExprType.INTERP,
                        "expr": {
                            "type": ExprType.ACCESSOR,
                            "paths": [
                                {
                                    "type": ExprType.STRING,
                                    "value": "name"
                                }
                            ]
                        },
                        "filters": []
                    }
                ]
            }
        }
    ],
    "events": [],
    "children": [
        {
            "textExpr": {
                "type": ExprType.TEXT,
                "segs": [
                    {
                        "type": ExprType.INTERP,
                        "expr": {
                            "type": ExprType.ACCESSOR,
                            "paths": [
                                {
                                    "type": ExprType.STRING,
                                    "value": "name"
                                }
                            ]
                        },
                        "filters": []
                    }
                ]
            }
        }
    ],
    "tagName": "span"
}
```

属性为单一插值并且无 filter 时，插值内部表达式被抽取。

```html
<span title="{{name}}">{{name}}</span>
```

```javascript
aNode = {
    "directives": {},
    "props": [
        {
            "name": "title",
            "expr": {
                "type": ExprType.ACCESSOR,
                "paths": [
                    {
                        "type": ExprType.STRING,
                        "value": "name"
                    }
                ]
            }
        }
    ],
    "events": [],
    "children": [
        {
            "textExpr": {
                "type": ExprType.TEXT,
                "segs": [
                    {
                        "type": ExprType.INTERP,
                        "expr": {
                            "type": ExprType.ACCESSOR,
                            "paths": [
                                {
                                    "type": ExprType.STRING,
                                    "value": "name"
                                }
                            ]
                        },
                        "filters": []
                    }
                ]
            }
        }
    ],
    "tagName": "span"
}
```

### 双向绑定

双向绑定的属性，绑定信息对象上包含 x 属性，值为 true。

```html
<input type="text" value="{= name =}">
```

```javascript
aNode = {
    "directives": {},
    "props": [
        {
            "name": "type",
            "expr": {
                "type": ExprType.STRING,
                "value": "text"
            }
        },
        {
            "name": "value",
            "expr": {
                "type": ExprType.ACCESSOR,
                "paths": [
                    {
                        "type": ExprType.STRING,
                        "value": "name"
                    }
                ]
            },
            "x": 1
        }
    ],
    "events": [],
    "children": [],
    "tagName": "input"
}
```

### 复杂的插值


```html
<p title="result: {{(var1 - var2) / var3 + 'static text' | comma(commaLength + 1)}}"></p>
```

```javascript
    "directives": {},
    "props": [
        {
            "name": "title",
            "expr": {
                "type": ExprType.TEXT,
                "segs": [
                    {
                        "type": ExprType.STRING,
                        "value": "result: "
                    },
                    {
                        "type": ExprType.INTERP,
                        "expr": {
                            "type": ExprType.BINARY,
                            "segs": [
                                {
                                    "type": ExprType.BINARY,
                                    "segs": [
                                        {
                                            "type": ExprType.BINARY,
                                            "segs": [
                                                {
                                                    "type": ExprType.ACCESSOR,
                                                    "paths": [
                                                        {
                                                            "type": ExprType.STRING,
                                                            "value": "var1"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "type": ExprType.ACCESSOR,
                                                    "paths": [
                                                        {
                                                            "type": ExprType.STRING,
                                                            "value": "var2"
                                                        }
                                                    ]
                                                }
                                            ],
                                            "operator": 45
                                        },
                                        {
                                            "type": ExprType.ACCESSOR,
                                            "paths": [
                                                {
                                                    "type": ExprType.STRING,
                                                    "value": "var3"
                                                }
                                            ]
                                        }
                                    ],
                                    "operator": 47
                                },
                                {
                                    "type": 1,
                                    "value": "static text"
                                }
                            ],
                            "operator": 43
                        },
                        "filters": [
                            {
                                "type": ExprType.CALL,
                                "name": {
                                    type: ExprType.ACCESSOR,
                                    paths: [
                                        {type: ExprType.STRING, value: "comma"}
                                    ]
                                },
                                "args": [
                                    {
                                        "type": ExprType.BINARY,
                                        "segs": [
                                            {
                                                "type": ExprType.ACCESSOR,
                                                "paths": [
                                                    {
                                                        "type": ExprType.STRING,
                                                        "value": "commaLength"
                                                    }
                                                ]
                                            },
                                            {
                                                "type": 2,
                                                "value": 1
                                            }
                                        ],
                                        "operator": 43
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    ],
    "events": [],
    "children": [],
    "tagName": "p"
}
```

### 事件绑定

事件绑定信息与属性绑定信息类似，但是事件绑定信息对象的 expr 属性一定是一个 CALL 表达式的表示。

```html
<button type="button" on-click="clicker($event)">click here</button>
```

```javascript
aNode = {
    "directives": {},
    "props": [
        {
            "name": "type",
            "expr": {
                "type": ExprType.STRING,
                "value": "button"
            }
        }
    ],
    "events": [
        {
            "name": "click",
            "expr": {
                "type": ExprType.CALL,
                "name": {
                    type: ExprType.ACCESSOR,
                    paths: [
                        {type: ExprType.STRING, value: "clicker"}
                    ]
                },
                "args": [
                    {
                        "type": ExprType.ACCESSOR,
                        "paths": [
                            {
                                "type": ExprType.STRING,
                                "value": "$event"
                            }
                        ]
                    }
                ]
            }
        }
    ],
    "children": [
        {
            "textExpr": {
                "type": ExprType.TEXT,
                "segs": [
                    {"type": ExprType.STRING, "value": "click here"}
                ]
            }
        }
    ],
    "tagName": "button"
}
```

### 条件指令

if 指令的值是一个表达式信息对象，else 指令的值永远等于 true。else 和 elif 对应的节点会被置于同组的 if 下的 elses 属性中。

```html
<div>
    <span s-if="isOnline">Hello!</span>
    <span s-else>Offline</span>
</div>
```

```javascript
aNode = {
    "directives": {},
    "props": [],
    "events": [],
    "children": [
        {
            "directives": {
                "if": {
                    "value": {
                        "type": ExprType.ACCESSOR,
                        "paths": [
                            {type: ExprType.STRING, value: "isOnline"}
                        ]
                    },
                    "name": "if"
                }
            },
            "props": [],
            "events": [],
            "children": [
                {
                    "textExpr": {
                        "type": ExprType.TEXT,
                        "segs": [
                            {"type": ExprType.STRING, "value": "Hello!"}
                        ]
                    }
                }
            ],
            "tagName": "span",
            "elses": [
                {
                    "directives": {
                        "else": {
                            "value": true,
                            "name": "else"
                        }
                    },
                    "props": [],
                    "events": [],
                    "children": [
                        {
                            "textExpr": {
                                "type": ExprType.TEXT,
                                "segs": [
                                    {"type": ExprType.STRING, "value": "Offline"}
                                ]
                            }
                        }
                    ],
                    "tagName": "span"
                }
            ]
        },

    ],
    "tagName": "div"
}
```

### 循环指令

循环指令对象的信息包括：

- item - 表达式对象，表示循环过程中数据项对应的变量
- index - 表达式对象，表示循环过程中数据索引对应的变量
- value - 表达式对象，表示要循环的数据
- name - 恒为 for

```html
<ul>
    <li s-for="p, index in persons">{{p.name}} - {{p.email}}</li>
</ul>
```

```javascript
aNode = {
    "directives": [],
    "props": [],
    "events": [],
    "children": [
        {
            "textExpr": {
                "type": ExprType.TEXT,
                "segs": [
                    {
                        "type": ExprType.STRING,
                        "value": "\n    "
                    }
                ],
                "value": "\n    "
            }
        },
        {
            "directives": {
                "for": {
                    "item": {
                        type: ExprType.ACCESSOR,
                        paths: [
                            {"type": ExprType.STRING, "value": "p"}
                        ]
                    },
                    "index": {
                        type: ExprType.ACCESSOR,
                        paths: [
                            {"type": ExprType.STRING, "value": "index"}
                        ]
                    }
                    "value": {
                        type: ExprType.ACCESSOR,
                        paths: [
                            {"type": ExprType.STRING, "value": "persons"}
                        ]
                    },
                    "name": "for"
                }
            },
            "props": [],
            "events": [],
            "children": [
                {
                    "textExpr": {
                        "type": ExprType.TEXT,
                        "segs": [
                            {
                                "type": ExprType.INTERP,
                                "expr": {
                                    "type": ExprType.ACCESSOR,
                                    "paths": [
                                        {"type": ExprType.STRING, "value": "p"},
                                        {"type": ExprType.STRING, "value": "name"}
                                    ]
                                },
                                "filters": []
                            },
                            {
                                "type": ExprType.STRING,
                                "value": " - "
                            },
                            {
                                "type": ExprType.INTERP,
                                "expr": {
                                    "type": ExprType.ACCESSOR,
                                    "paths": [
                                        {"type": ExprType.STRING, "value": "p"},
                                        {"type": ExprType.STRING, "value": "email"}
                                    ]
                                },
                                "filters": []
                            }
                        ]
                    }
                }
            ],
            "tagName": "li"
        },
        {
            "textExpr": {
                "type": ExprType.TEXT,
                "segs": [
                    {
                        "type": ExprType.STRING,
                        "value": "\n"
                    }
                ],
                "value": "\n"
            }
        }
    ],
    "tagName": "ul"
}
```

