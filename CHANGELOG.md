
ChangeLog
========

3.0.3
-------

+ 【变更】- 组件 compile 过程明确属于 init，compiled 生命周期在 inited 前到达
+ 【新特性】- 针对希望自建组件渲染体系的需求，暴露新的 API：
    - {Object} ExprType
    - {Class} LifeCycle
    - {ANode} parseTemplate({string} source)
    - {Object} parseExpr({string} source)
+ 【新特性】- 增加对常用 SVG 标签的创建支持
+ 【优化】- 对模板解析结果的结构进行了优化：
    - text 预解析
    - 删除 text 节点上多余的属性：childs、binds、directives、events等
    - 解析阶段计算 number 与 string 表达式实际值
    - property accessor 表达式结构优化
    - binary 表达式结构优化，存储类型信息，不存储 operator 函数
+ 【优化】- 对视图更新过程进行了优化
+ 【优化】- 组件嵌套时，外部声明的子组件绑定信息，不渲染到子组件的主元素属性中
+ 【bug修复】- 部分自闭合标签（br、hr等）渲染错误
+ 【bug修复】- 元素事件可能被绑定 2 次
+ 【bug修复】- 标签属性为空串时解析错误导致后续元素可能被吞掉
+ 【bug修复】- 标签属性不包含值时（如 disabled 等）会被忽略，实际应生效
+ 【bug修复】- 低版本 IE 下 HTML 片段拼接错误
+ 【bug修复】- 组件自定义事件在 fire 无参数或假值参数时，使用 $event 会拿到 DOM Event
+ 【bug修复】- 数据的数组操作，对数组 index 引用部分的视图可能不会刷新
+ 【bug修复】- 多次对 if 指令表达式数据 set 导致表达式的值在同一个周期中不断变化时，视图更新可能产生错误
+ 【bug修复】- 多次对 for 指令表达式以及内部结构使用到的数据在同一个周期中不断变化时，可能产生脚本运行错误


3.0.2
-------

+ 【bug修复】- 包含 slot 的组件位于循环中，slot 插槽内容渲染的数据环境不正确
+ 【bug修复】- 子组件编译过程，外部传入的结构在组件编译阶段会被覆盖，多次渲染时在 slot 环境会产生不期望的结果


3.0.1
-------

+ 【新特性】- 支持使用一个 Plain Object 在 components 中声明子组件类型，将自动使用该 Plain Object defineComponent
+ 【新特性】- 暴露 _callHook 方法，使组件扩展时，生命周期可以增加。此方法应慎用
+ 【bug修复】- slot 的更新中有一个未声明的变量可能导致溢出或错误
