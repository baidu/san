/**
 * San
 * Copyright 2016 Baidu Inc. All rights reserved.
 *
 * @file 主文件
 * @author errorrik(errorrik@gmail.com)
 *         otakustay(otakustay@gmail.com)
 *         junmer(junmer@foxmail.com)
 */

(function (root) {
    // #[main-dependencies]
    /* eslint-disable no-unused-vars */
    var nextTick = require('./util/next-tick');
    var inherits = require('./util/inherits');
    var parseTemplate = require('./parser/parse-template');
    var parseExpr = require('./parser/parse-expr');
    var ExprType = require('./parser/expr-type');
    var LifeCycle = require('./view/life-cycle');
    var TextNode = require('./view/text-node');
    var Element = require('./view/element');
    var Component = require('./view/component');
    var SlotElement = require('./view/slot-element');
    var IfDirective = require('./view/if-directive');
    var ElseDirective = require('./view/else-directive');
    var ForDirective = require('./view/for-directive');
    var defineComponent = require('./view/define-component');
    var emitDevtool = require('./util/emit-devtool');


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
         * 生命周期类
         *
         * @class
         */
        LifeCycle: LifeCycle,

        /**
         * 在下一个更新周期运行函数
         *
         * @param {Function} fn 要运行的函数
         */
        nextTick: nextTick,

        /**
         * 构建类之间的继承关系
         *
         * @param {Function} subClass 子类函数
         * @param {Function} superClass 父类函数
         */
        inherits: inherits
    };

    // export
    if (typeof exports === 'object' && typeof module === 'object') {
        // For CommonJS
        exports = module.exports = san;
    }
    else if (typeof define === 'function' && define.amd) {
        // For AMD
        define([], san);
    }
    else {
        // For <script src="..."
        root.san = san;
    }

    // #[begin] devtool
    emitDevtool('san', san);
    // #[end]
})(this);
