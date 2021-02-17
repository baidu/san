/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 异步组件类
 */

var guid = require('../util/guid');
var each = require('../util/each');
var insertBefore = require('../browser/insert-before');
var nodeOwnCreateStump = require('./node-own-create-stump');
var nodeOwnSimpleDispose = require('./node-own-simple-dispose');


/**
 * 异步组件类
 *
 * @class
 * @param {Object} options 初始化参数
 * @param {Object} loader 组件加载器
 */
function AsyncComponent(options, loader) {
    this.options = options;
    this.loader = loader;
    this.id = guid++;
    this.children = [];

    // #[begin] reverse
    var reverseWalker = options.reverseWalker;
    if (reverseWalker) {
        var PlaceholderComponent = this.loader.placeholder;
        if (PlaceholderComponent) {
            this.children[0] = new PlaceholderComponent(options);
        }

        this._create();
        insertBefore(this.el, reverseWalker.target, reverseWalker.current);

        var me = this;
        this.loader.start(function (ComponentClass) {
            me.onload(ComponentClass);
        });
    }
    options.reverseWalker = null;
    // #[end]
}

AsyncComponent.prototype._create = nodeOwnCreateStump;
AsyncComponent.prototype.dispose = nodeOwnSimpleDispose;

/**
 * attach到页面
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
AsyncComponent.prototype.attach = function (parentEl, beforeEl) {
    var PlaceholderComponent = this.loader.placeholder;
    if (PlaceholderComponent) {
        var component = new PlaceholderComponent(this.options);
        this.children[0] = component;
        component.attach(parentEl, beforeEl);
    }

    this._create();
    insertBefore(this.el, parentEl, beforeEl);

    var me = this;
    this.loader.start(function (ComponentClass) {
        me.onload(ComponentClass);
    });
};

AsyncComponent.prototype._getElAsRootNode = function () {
    var child = this.children[0];
    return child && child.el;
};


/**
 * loader加载完成，渲染组件
 *
 * @param {Function=} ComponentClass 组件类
 */
AsyncComponent.prototype.onload = function (ComponentClass) {
    if (this.el && ComponentClass) {
        var component = new ComponentClass(this.options);
        component.attach(this.el.parentNode, this.el);

        var parent = this.options.parent;

        // 如果异步组件时root节点，则更新为root节点
        if (parent._rootNode === this) {
            parent._rootNode = component;
            component._getElAsRootNode && (parent.el = component._getElAsRootNode());
        } else {
            // 原本的逻辑
            var parentChildren = parent.children;
            if (this.parentIndex == null || parentChildren[this.parentIndex] !== this) {
                each(parentChildren, function (child, index) {
                    if (child instanceof AsyncComponent) {
                        child.parentIndex = index;
                    }
                });
            }

            parentChildren[this.parentIndex] = component;
        }
    }

    this.dispose();
};

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
AsyncComponent.prototype._update = function (changes) {
    this.children[0] && this.children[0]._update(changes);
};

exports = module.exports = AsyncComponent;
