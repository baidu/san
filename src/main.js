/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file San 主文件
 */

(function (root) {
    // 人工调整打包代码顺序，通过注释手工写一些依赖
    // require('./util/guid');
    // require('./util/empty');
    // require('./util/extend');
    // require('./util/inherits');
    // require('./util/each');
    // require('./util/bind');
    // require('./browser/on');
    // require('./browser/un');
    // require('./browser/svg-tags');
    // require('./browser/remove-el');
    // require('./util/next-tick');
    // require('./browser/ie');
    // require('./browser/ie-old-than-9');
    // require('./browser/input-event-compatible');
    // require('./browser/auto-close-tags');
    // require('./util/data-types.js');
    // require('./util/create-data-types-checker.js');
    // require('./parser/walker');
    // require('./parser/parse-template');
    // require('./runtime/change-expr-compare');
    // require('./runtime/data-change-type');
    // require('./runtime/default-filters');
    // require('./view/life-cycle');
    // require('./view/node-type');
    // require('./view/get-prop-handler');
    // require('./view/is-data-change-by-element');
    // require('./view/get-event-listener');
    // require('./view/create-node');


    // #[main-dependencies]
    /* eslint-disable no-unused-vars */
    var nextTick = require('./util/next-tick');
    var inherits = require('./util/inherits');
    var parseTemplate = require('./parser/parse-template');
    var parseExpr = require('./parser/parse-expr');
    var ExprType = require('./parser/expr-type');
    var unpackANode = require('./parser/unpack-anode');
    var LifeCycle = require('./view/life-cycle');
    var NodeType = require('./view/node-type');
    var Component = require('./view/component');
    var parseComponentTemplate = require('./view/parse-component-template');
    var defineComponent = require('./view/define-component');
    var defineTemplateComponent = require('./view/define-template-component');
    var createComponentLoader = require('./view/create-component-loader');
    var emitDevtool = require('./util/emit-devtool');
    var Data = require('./runtime/data');
    var evalExpr = require('./runtime/eval-expr');
    var DataTypes = require('./util/data-types');
    var hydrateComponent = require('./view/hydrate-component');


    var san = {
        /**
         * san版本号
         *
         * @type {string}
         */
        version: '##version##',

        // #[begin] devtool
        /**
         * 是否开启调试。开启调试时 devtool 会工作
         *
         * @type {boolean}
         */
        debug: true,
        // #[end]

        /**
         * 组件基类
         *
         * @type {Function}
         */
        Component: Component,

        /**
         * 创建组件类
         *
         * @param {Object} proto 组件类的方法表
         * @return {Function}
         */
        defineComponent: defineComponent,
        defineTemplateComponent: defineTemplateComponent,

        // #[begin] hydrate
        /**
         * 组件反解
         * 
         * @param {Function} ComponentClass 组件类
         * @param {Object} options 反解选项
         * @param {HTMLElement} options.el 挂载元素
         */
        hydrateComponent: hydrateComponent,
        // #[end]

        /**
         * 创建组件Loader
         *
         * @param {Object|Function} options 创建组件Loader的参数。为Object时参考下方描述，为Function时代表load方法。
         * @param {Function} options.load load方法
         * @param {Function=} options.placeholder loading过程中渲染的占位组件
         * @param {Function=} options.fallback load失败时渲染的组件
         * @return {ComponentLoader}
         */
        createComponentLoader: createComponentLoader,

        /**
         * 解析组件 template
         *
         * @param {Function} ComponentClass 组件类
         * @return {ANode}
         */
        parseComponentTemplate: parseComponentTemplate,

        /**
         * 解压缩 ANode
         *
         * @param {Array} source ANode 压缩数据
         * @return {Object}
         */
        unpackANode: unpackANode,

        /**
         * 解析 template
         *
         * @inner
         * @param {string} source template 源码
         * @return {ANode}
         */
        parseTemplate: parseTemplate,

        /**
         * 解析表达式
         *
         * @param {string} source 源码
         * @return {Object}
         */
        parseExpr: parseExpr,

        /**
         * 表达式类型枚举
         *
         * @const
         * @type {Object}
         */
        ExprType: ExprType,

        /**
         * 生命周期
         */
        LifeCycle: LifeCycle,

        /**
         * 节点类型
         *
         * @const
         * @type {Object}
         */
        NodeType: NodeType,

        /**
         * 在下一个更新周期运行函数
         *
         * @param {Function} fn 要运行的函数
         */
        nextTick: nextTick,

        /**
         * 数据类
         *
         * @class
         * @param {Object?} data 初始数据
         * @param {Data?} parent 父级数据对象
         */
        Data: Data,

        /**
         * 计算表达式的值
         *
         * @param {Object} expr 表达式对象
         * @param {Data} data 数据对象
         * @param {Component=} owner 组件对象，用于表达式中filter的执行
         * @return {*}
         */
        evalExpr: evalExpr,

        /**
         * 构建类之间的继承关系
         *
         * @param {Function} subClass 子类函数
         * @param {Function} superClass 父类函数
         */
        inherits: inherits,

        /**
         * DataTypes
         *
         * @type {Object}
         */
        DataTypes: DataTypes
    };

    // export
    if (typeof exports === 'object' && typeof module === 'object') {
        // For CommonJS
        exports = module.exports = san;
    }
    else if (typeof define === 'function' && define.amd) {
        // For AMD
        define('san', [], san);
    }
    else {
        // For <script src="..."
        root.san = san;
    }

    // #[begin] devtool
    emitDevtool.start(san);
    // #[end]
})(this);
