
ChangeLog
========


3.1.1
-------

+ 【新特性】- 组件数据绑定声明如果不包含值，默认为 true
+ 【bug修复】- 服务端渲染，对包含 s-ref 的组件，s-ref 没有输出


3.1.0
-------


+ 【变更】- for 循环的组件反解协议格式优化（暂时没人用到，就 breaking change 了）
+ 【变更】- 统一调整了 dist 文件的名称
+ 【新特性】- 支持基于组件反解的 node 服务端渲染
+ 【新特性】- 增加对 slot 的组件反解支持
+ 【新特性】- component 组件反解支持初始化数据灌入
+ 【新特性】- 表达式支持 true/false 字面量
+ 【新特性】- 指令支持 s- 前缀，不再推荐 san- 前缀
+ 【新特性】- 支持 s-html 指令，通过数据直接渲染一个元素的内容
+ 【新特性】- 文本节点的插值替换支持复杂 html 形式的数据内容
+ 【新特性】- 组件的数据绑定自动将 kabab 形式的数据项名称转换成 camel 形式
+ 【新特性】- if 指令如果写成一个插值，自动抽取插值内部表达式
+ 【新特性】- 支持 dataTypes，用于在开发时进行数据类型校验
+ 【优化】- 组件内部数据操作机制 immutable 化
+ 【优化】- 文本节点桩定位机制改成相对定位机制，减少桩元素数量
+ 【bug修复】- 将数组设为空时，绑定的 checkbox checked 状态未更新
+ 【bug修复】- for 指令 item 表达式内部子项进行 splice 数据操作时，视图更新错误
+ 【bug修复】- 对 option 为空串的 value 进行绑定处理
+ 【bug修复】- 双向绑定包含动态路径的表达式，更新失效
+ 【bug修复】- 双向绑定表达式包含 for 指令定义的 item 时，更新失效
+ 【bug修复】- 组件在反解时主元素标签声明未生效
+ 【bug修复】- option 在位于 for 或 if 等结构内，selected 状态不生效



3.0.3
-------

+ 【删除】- 删除 3 个自带的 filter：yesToBe / yesOrNoToBe / nullToBe
+ 【变更】- 组件 compile 过程明确属于 init，compiled 生命周期在 inited 前到达
+ 【变更】- 组件初始化传入的 data 与 initData 返回值进行合并，作为组件初始化数据值
+ 【新特性】- 针对希望自建组件渲染体系的需求，暴露新的 API：
    - {Object} ExprType
    - {Class} LifeCycle
    - {ANode} parseTemplate({string} source)
    - {Object} parseExpr({string} source)
+ 【新特性】- 增加组件树中向上传递的消息支持
+ 【新特性】- 支持 (?:) 三元表达式
+ 【新特性】- 增加计算属性的支持
+ 【新特性】- 增加对常用 SVG 标签的创建支持
+ 【新特性】- 支持 components 属性通过字符串 'self' 引用自身作为子组件
+ 【新特性】- 组件属性 template / filters / components / computed / messages 支持 static property
+ 【新特性】- 组件外部声明的 class ／ style 合并到组件的根元素
+ 【新特性】- data.get 方法支持无参获取整个数据
+ 【优化】- 对模板解析结果的结构进行了优化：
    - text 预解析
    - 删除 text 节点上多余的属性：childs、binds、directives、events等
    - 解析阶段计算 number 与 string 表达式实际值
    - property accessor 和 ident 归一为 accessor
    - binary 表达式结构优化，存储类型信息，不存储 operator 函数
+ 【优化】- 对视图更新过程进行了优化
+ 【优化】- 组件嵌套时，外部声明的子组件绑定信息，不渲染到子组件的主元素属性中
+ 【优化】- owner 数据变化时对内部子组件的数据更新粒度更细
+ 【优化】- 忽略无需更新的静态文本节点
+ 【优化】- 改进 select 的 value 处理方式，并处理 option 默认 value 属性
+ 【优化】- 对 DOM 事件和自定义事件处理进行分离，避免 DOM 冒泡导致不期望的事件触发
+ 【bug修复】- 部分自闭合标签（br、hr等）渲染错误
+ 【bug修复】- 元素事件可能被绑定 2 次
+ 【bug修复】- 组件根元素上的 DOM 事件会被外部绑定的同名 DOM 事件覆盖
+ 【bug修复】- 标签属性为空串时解析错误导致后续元素可能被吞掉
+ 【bug修复】- 标签属性名为 xxx- 前缀时，前缀被吞掉
+ 【bug修复】- 标签属性不包含值时（如 disabled 等）会被忽略
+ 【bug修复】- 组件标签属性为多行值时输出错误
+ 【bug修复】- 低版本 IE 下 HTML 片段拼接错误
+ 【bug修复】- 组件自定义事件在 fire 无参数或假值参数时，使用 $event 会拿到 DOM Event
+ 【bug修复】- 数据的数组操作，对数组 index 引用部分的视图可能不会刷新
+ 【bug修复】- 数据的数组操作，对数组 length 引用部分的视图可能不会刷新
+ 【bug修复】- 多次对 if 指令表达式数据 set 导致表达式的值在同一个周期中不断变化时，视图更新可能产生错误
+ 【bug修复】- 多次对 for 指令表达式以及内部结构使用到的数据在同一个周期中不断变化时，可能产生脚本运行错误
+ 【bug修复】- ref 方法无法获取到位于 for 内的组件
+ 【bug修复】- ref 方法无法获取到位于 slot 内的组件
+ 【bug修复】- textarea 在初始化时，绑定的 value 未正确给予
+ 【bug修复】- textarea 在初始化时，内部内容渲染错乱。在数据驱动的组件系统中，应以绑定数据为准，忽略内部内容
+ 【bug修复】- select 对已经 dispose 的元素进行 value 更新导致脚本错误
+ 【bug修复】- 组件绑定中，单一插值的 filter 不起作用
+ 【bug修复】- 对带有 parent 的 Model 进行带有动态属性的数据访问，可能会取不到值
+ 【bug修复】- 双向绑定表达式包含对 index 项的引用时，绑定失效
+ 【bug修复】- 组件继承时，子类 template 和 components 可能不会编译，而使用父类的编译结果


3.0.2
-------

+ 【bug修复】- 包含 slot 的组件位于循环中，slot 插槽内容渲染的数据环境不正确
+ 【bug修复】- 子组件编译过程，外部传入的结构在组件编译阶段会被覆盖，多次渲染时在 slot 环境会产生不期望的结果


3.0.1
-------

+ 【新特性】- 支持使用一个 Plain Object 在 components 中声明子组件类型，将自动使用该 Plain Object defineComponent
+ 【新特性】- 暴露 _callHook 方法，使组件扩展时，生命周期可以增加。此方法应慎用
+ 【bug修复】- slot 的更新中有一个未声明的变量可能导致溢出或错误
