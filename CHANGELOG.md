
ChangeLog
========



3.0.2
-------

+ 【bug修复】- 包含 slot 的组件位于循环中，slot 插槽内容渲染的数据环境不正确
+ 【bug修复】- 子组件编译过程，外部传入的结构在组件编译阶段会被覆盖，多次渲染时在 slot 环境会产生不期望的结果


3.0.1
-------

+ 【新特性】- 支持使用一个 Plain Object 在 components 中声明子组件类型，将自动使用该 Plain Object defineComponent
+ 【新特性】- 暴露 _callHook 方法，使组件扩展时，生命周期可以增加。此方法应慎用
+ 【bug修复】- slot 的更新中有一个未声明的变量可能导致溢出或错误
