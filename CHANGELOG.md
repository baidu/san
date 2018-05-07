
ChangeLog
========

3.5.8
-------

+ 【新特性】- 数据的 splice 方法支持 startIndex 参数为负值
+ 【新特性】- 支持 s-bind 指令，用于组件的泛数据传入和元素的泛属性设置
+ 【优化】- element 更新时，普通 attribute 的空值设置为空字符串
+ 【bug修复】- created 中进行数组数据操作，视图在下一个时钟周期被不正确的更新


3.5.7
-------

+ 【优化】- 组件反解时，组件数据信息的 comment 节点前允许包含空白文本节点
+ 【优化】- 新增常用 html entity 的转义支持
+ 【bug修复】- ssr 下 html entity 渲染错误。该问题为 3.5.5 引入



3.5.6
-------

+ 【新特性】- 为更好满足不同的开发者习惯，增加 s-else-if 指令支持，行为与 s-elif 相同
+ 【新特性】- 暴露用于数据存储和表达式计算的 API：Data、evalExpr
+ 【bug修复】- 加减表达式和乘除表达式的解析存在结合性问题
+ 【bug修复】- 多次 splice 操作，其中删除和插入操作混合时，视图更新可能出现错误。该问题为 3.5.2 引入
+ 【bug修复】- svg 标签 class、style 等属性设置可能不生效。该问题在视图更新时一直存在，3.5.4 起视图创建也暴露此问题


3.5.5
-------

+ 【新特性】- data.set 方法添加 force 选项，使设置数据的值与现有值相等时，可以强制更新
+ 【bug修复】- 组件使用 template 标签作为模板声明根元素时，渲染的标签名可能不正确。该问题为 3.5.4 引入
+ 【bug修复】- 内容文本和标签属性的 html entity 转义不正确。该问题为 3.5.4 引入


3.5.4
-------

+ 【优化】- 视图创建使用 createElement 替代 html


3.5.3
-------

+ 【bug修复】- 数值字面量解析错误，导致表达式中的数值后如果无空格，可能产生不期望的运算结果


3.5.2
-------

+ 【bug修复】- 同时调用组件的 detach 和 dispose 方法，组件声明周期无法到达 disposed。该问题为 3.3.0 引入
+ 【bug修复】- 组件的数据绑定名为 bool attribute，并且为静态值时，运行出错。该问题为 3.5.0 引入
+ 【bug修复】- 组件模板非法时，有时候不显示错误提示
+ 【优化】- 优化 bool 属性处理逻辑


3.5.1
-------

+ 【bug修复】- 一个周期内对数组新增的元素再次设置值时，运行出错。该问题为 3.5.0 引入


3.5.0
-------

+ 【变更】- 插值 HTML encode 行为变更为：默认进行 HTML encode，除非最后一个 filter 为 raw
+ 【变更】- 由于插值 HTML encode 行为变更，删除两个 filters：html 和 raw
+ 【变更】- ANode 部分属性从 IndexedList 改为数组，使 ANode 易于 JSON 序列化
+ 【新特性】- 组件声明时增加 delimiters 的支持，可配置插值两侧的分隔符
+ 【新特性】- 给组件默认添加 getComponentType(aNode) 方法，可支持运行时动态的创建组件
+ 【新特性】- 组件支持外部传入 id 做为 root element 的 id
+ 【优化】- 一些性能优化
+ 【优化】- 部分标签（如select、tr等）在老 ie 下不支持设置 html，创建和更新时使用 create + insert 操作做兼容
+ 【优化】- typescript 定义中添加全局 san 对象的定义
+ 【bug修复】- fire 方法会触发父组件使用 native 修饰符声明的事件
+ 【bug修复】- 为枚举值为布尔类型的枚举属性（如 draggable）赋值字符串时输出与期望不符
+ 【bug修复】- 对组件使用 for 时，当一次时钟周期多次数据更新导致未渲染的组件 index 发生变化时，视图更新不正确
+ 【bug修复】- 修复 typescript 定义中 DataTypeCheck 的定义错误
+ 【bug修复】- 修复 typescript 定义中 computed 属性 this 的定义错误

3.4.3
-------

+ 【bug修复】- 更改 template / slot / text 的结构，彻底解决复杂嵌套场景的更新不正确
+ 【bug修复】- ie9 下 input[type=text] 双向绑定，用户输入的值更新失败
+ 【优化】- 为常用 api 添加 typescript 的类型定义

3.4.2
-------

+ 【bug修复】- 插值中包含自定义 filter 并且其后为非正常节点时，视图刷新不正确
+ 【bug修复】- 一个页面中包含多个 san 环境，生成的组件可能会冲突

3.4.1
-------

+ 【bug修复】- 初始化组件时，传入 data 中的 undefined 项覆盖了 initData 中的返回项


3.4.0
-------

+ 【新特性】- 数据 Data 对象新增 merge、apply 方法
+ 【变更】- 新的基于模板匹配的组件反解机制，代替原来的标记机制
+ 【bug修复】- 模板解析对 element attribute 的 = 两边不支持空白字符

3.3.2
-------

+ 【优化】- scoped slot 的 数据声明，自动将 - 分割转换成 camel case
+ 【优化】- 组件初始化时，data binding 中的 undefined 项，不覆盖默认 data
+ 【优化】- autofocus 和 required 属性增加 boolean 处理
+ 【bug修复】- for 指令位于 template 下，视图更新会触发运行时错误
+ 【bug修复】- 文本节点位于 slot 或 template 中，如果父节点有 prev 兄弟元素，更新不正常
+ 【bug修复】- scoped slot 位于 for 中，列表数据删除可能导致运行错误
+ 【bug修复】- 使用 native 修饰符进行事件绑定，参数获取不到数据
+ 【bug修复】- UIWebView 环境下，双向绑定的输入框在输入法打开时可能更新数据失败


3.3.1
-------

+ 【新特性】- slot 声明支持动态的 name
+ 【新特性】- scoped slot 允许访问当前 owner 所在环境的数据
+ 【新特性】- s-ref 指令支持获取 DOM 元素
+ 【优化】- 在 dev 版本中，模板解析提供更丰富的报错信息
+ 【优化】- 模板中允许元素声明 id 属性
+ 【优化】- for 元素更新行为为 clear all 时，保留 transition 效果
+ 【优化】- 事件明确声明为空参数时，不自动添加默认值 $event
+ 【优化】- 模板中声明 slot 属性的元素，DOM 视图中删除 slot attribute
+ 【优化】- 容忍组件反解中对多余的空白文本节点，自动清除
+ 【bug修复】- 带有 transition 的 for item 元素，在快速多次变更时，可能由于 child 不存在产生运行时错误
+ 【bug修复】- 双向绑定时，如果子组件在 inited 时 set data，owner data 未更新
+ 【bug修复】- input value 在双向绑定时可能存在 xss 漏洞
+ 【bug修复】- 文本节点在更新时可能多次转义


3.3.0
-------


+ 【新特性】- 支持 template tag 声明自身不渲染元素只渲染内容
+ 【新特性】- 事件声明参数为空时，默认 $event
+ 【新特性】- 支持通过 native modifier，直接为组件的根元素绑定事件
+ 【新特性】- 支持通过 capture modifier，在捕获阶段绑定事件
+ 【新特性】- 支持 scoped slot
+ 【新特性】- 支持 transition 机制
+ 【新特性】- slot 支持 if 和 for 指令
+ 【新特性】- 组件实例上添加 slot 方法，可以获取组件内部 slot 插入的内容
+ 【新特性】- 组件实例上添加 nextTick 方法，避免组件实现需要 nextTick 必须显式依赖 san
+ 【新特性】- main 上暴露 NodeType 枚举对象
+ 【变更】- parseTemplate 的 ANode 去除 parent 的引用。消除循环引用后可以 JSON.stringify
+ 【变更】- ANode 上子节点命名由 childs 变更为 children
+ 【变更】- 组件 LifeCycle 对象静态化，main 上不再暴露 LifeCycle 类
+ 【优化】- data 的 push 和 unshift 操作返回新数组长度，和 JS Array 保持一致
+ 【优化】- 增加事件绑定到不存在方法时的错误提示
+ 【优化】- 当数组上有非数字索引的成员并发生变更时，添加判断使视图更新时不报错，增加健壮性
+ 【bug修复】- ssr 在多重循环下可能渲染不完整
+ 【bug修复】- input[type=file] 的 multiple 属性由于低级的拼写问题导致不支持
+ 【bug修复】- input value 使用双向绑定时，如果绑定值为 undefined，表单内容未自动转为空串



3.2.10
-------

+ 【bug修复】- slot name 可能侵入全局，并且在 this 不存在时可能导致出错。该问题为 3.2.5 引入


3.2.9
-------


+ 【bug修复】- attr 值为空 string 时，保留 attr，不删除
+ 【bug修复】- 一次时钟周期同时 set 列表数据项 和 非列表数据项时，列表视图可能有部分不更新


3.2.8
-------

+ 【优化】- slot dispose 时增加是否主动移除 DOM 的判断，增加组件动态创建场景和销毁顺序不正确时的健壮性
+ 【bug修复】- slot 中包含自定义标签时，ssr 下找不到对应组件类，不能正确渲染组件
+ 【bug修复】- 一次时钟周期对列表同时进行 set 和 splice 操作时，渲染不正确


3.2.7
-------

+ 【优化】- bool 型属性值不合法时忽略，增加健壮性
+ 【bug修复】- 元素的自定义属性（如 data-xxx 或 aria-xxx 等）在数据更新时不更新
+ 【bug修复】- if 指令对元素重新创建时，bool 型属性未设置
+ 【bug修复】- if 指令对 for 重新创建时，如果有 text 兄弟节点，for 添加位置可能错误。该问题为 3.2.4 引入
+ 【bug修复】- for 指令 list 对应上级数据整体更新时，视图更新可能不完整。该问题为 3.2.4 引入
+ 【bug修复】- 组件在 attached 中有动态创建组件时，有可能因为生命周期调用时序导致运行出错。该问题为 3.2.5 引入


3.2.6
-------

+ 【优化】- 列表更新性能优化
+ 【优化】- 当 checkbox 或 radio 没有 value 时，checked 直接与数据项本身相关联
+ 【bug修复】- 更新时，如果列表引用数据项为空，可能会报错。该问题为 3.2.4 引入


3.2.5
-------

+ 【新特性】- 组件声明时增加 trimWhitespace 的支持，可配置文本节点中空白字符处理策略
+ 【优化】- 一些微不足道的性能优化
+ 【bug修复】- input[checkbox|radio] value 对应数据被更新，checked状态可能不会同步更新
+ 【bug修复】- 组件 detached 可能会被调用 2 次。该问题为 3.2.4 引入


3.2.4
-------

+ 【优化】- 列表与文本节点的更新性能优化
+ 【bug修复】- 直接位于 table 下 的 tr，如果应用了 for 指令，更新时 DOM 结构可能出错


3.2.3
-------

+ 【新特性】- 表达式增加 % 运算符的支持
+ 【新特性】- 增加 elif 指令的支持
+ 【bug修复】- svg 的 viewBox 之类驼峰属性支持有问题


3.2.2
-------

+ 【优化】- 增加 defineComponent 方法被多次调用的健壮性，传入一个组件将直接返回
+ 【优化】- 增加 insertAdjacentHTML 在 IE 下可能导致问题的提示
+ 【bug修复】- inited 中进行 data 操作，会触发视图更新


3.2.1
-------

+ 【优化】- 提升 for 指令元素全更新时的性能
+ 【优化】- 增加 select/table 等元素设置 innerHTML 在 IE 下可能导致问题的提示
+ 【bug修复】- if 指令元素在 IE 下 update 时位置可能不正确
+ 【bug修复】- for 指令元素初始数据为空，在 IE 下 update 时可能出错或位置不正确
+ 【bug修复】- input 作为组件主元素时，在 IE 下会出现运行时错误
+ 【bug修复】- 由于打包工具的参数问题，导致 dist 下输出的 min 文件不兼容 IE8-



3.2.0
-------

+ 【变更】- 组件反解的标记格式变更，统一使用 comment 标记
+ 【优化】- 使用 comment 替代 script 做为桩元素，避免影响 css selector
+ 【bug修复】- 双向绑定的表单元素做为组件 root，用户输入时数据未更新

3.1.5
-------

+ 【bug修复】- 视图生成时对静态文本节点判定错误可能导致异常退出


3.1.4
-------

+ 【优化】- 组件 dispose 后，如果有异步任务更新组件数据，使其静默失效，不用报错
+ 【bug修复】- 当子组件在 inited 中 dispatch message 导致父组件数据变更时，视图未更新
+ 【bug修复】- select 做为组件根元素时，运行出现错误，option 和 select 无法绑定
+ 【bug修复】- 在 WebPack 下未能通知 DevTool


3.1.3
-------

+ 【优化】- compileToRenderer 方法增加对编译结果缓存
+ 【bug修复】- 在做 data binding 处理前过早地进行了数据校验
+ 【bug修复】- created 生命周期钩子可能被运行两次



3.1.2
-------

+ 【bug修复】- 包含 slot 的组件直接做为 for 循环的主元素时，视图更新失败



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
