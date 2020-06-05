ANode 压缩结构设计
=======


提前将 template 编译成 ANode，可以避免在浏览器端进行 template 解析，提高初始装载性能。ANode 是个 JSON Object，stringify 后体积较大，需要设计一种压缩，让其体积更小，网络传输成本更低。


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
- 编码序: {Node}textExpr

### 元素节点

- head: 1
- 编码序: {string?}tagName, {Array<Node>}children, {...}props



表达式节点
-------

### STRING

- head: 3
- 编码序: {string}value

### NUMBER

- head: 4
- 编码序: {number}value

### BOOL

- head: 5
- 编码序: {bool}value

### ACCESSOR

- head: 6
- 编码序: {Array}paths

### INTERP

- head: 7
- 编码序: {bool}original, {Node}expr, {Array<Node>}filters

### CALL

- head: 8
- 编码序: {Node}name, {Array<Node>}args

### TEXT

- head: 9
- 编码序: {bool}original, {Array<Node>}segs

### BINARY

- head: 10
- 编码序: {number}operator, {Array<Node>}segs

### UNARY

- head: 11
- 编码序: {number}operator, {Node}expr

### TERTIARY

- head: 12
- 编码序: {Array<Node>}segs

### OBJECT

- head: 13
- 编码序: {Array<Node>}items

### OBJECT ITEM UNSPREAD

- head: 14
- 编码序: {Node}name, {Node}expr

### OBJECT ITEM SPREAD

- head: 15
- 编码序: {Node}name, {Node}expr

### ARRAY

- head: 16
- 编码序: {Array<Node>}items

### ARRAY ITEM UNSPREAD

- head: 17
- 编码序: {Node}expr

### ARRAY ITEM SPREAD

- head: 18
- 编码序: {Node}expr

### NULL

- head: 19
- 编码序: 无


泛属性节点
-------

### 普通属性

- head: 2
- 编码序: {string}name, {Node}expr

### NOVALUE 属性

- head: 33
- 编码序: {string}name, {Node}expr

### 双向绑定属性

- head: 34
- 编码序: {string}name, {Node}expr

### 事件

- head: 35
- 编码序: {string}name, {Node}expr, {ObjectAsArray}modifier

### var

- head: 36
- 编码序: {string}name, {Node}expr


### 指令 for

- head: 37
- 编码序: {string}item, {string?}index, {string?}trackByRaw, {Node}value
- 注: trackBy 通过 trackByRaw 二次解析


### 指令 if

- head: 38
- 编码序: {Node}value, {Array<Node>?}elses


### 指令 elif

- head: 39
- 编码序: {Node}value


### 指令 else

- head: 40
- 编码序: 无
- 注: 为保持一直，自生成 `{value:{}}`


### 指令 ref

- head: 41
- 编码序: {Node}value


### 指令 bind

- head: 42
- 编码序: {Node}value


### 指令 html

- head: 43
- 编码序: {Node}value


### 指令 transition

- head: 44
- 编码序: {Node}value




