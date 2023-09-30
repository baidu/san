/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 元素子节点遍历操作类
 */

var removeEl = require('../browser/remove-el');

// #[begin] hydrate
/**
 * 元素子节点遍历操作类
 *
 * @inner
 * @class
 * @param {HTMLElement} el 要遍历的元素
 * @param {HTMLElement} onlyCurrent 当作为根时使用
 */
function DOMChildrenWalker(el, onlyCurrent) {
    this.index = 0;
    this.target = el;
    this.doc = el.ownerDocument;
    
    if (onlyCurrent) {
        this.children = [onlyCurrent, onlyCurrent.nextSibling];
        this.current = onlyCurrent;
        this.next = this.children[1];
    }
    else {
        this.children = [];
        var child = el.firstChild;
        var next;
        while (child) {
            next = child.nextSibling;

            switch (child.nodeType) {
                case 3:
                case 1:
                case 8:
                    this.children.push(child);
            }

            child = next;
        }

        this.current = this.children[0];
        this.next = this.children[1];
    }
}

/**
 * 往下走一个元素
 */
DOMChildrenWalker.prototype.goNext = function () {
    this.current = this.children[++this.index];
    this.next = this.children[this.index + 1];
};
// #[end]

exports = module.exports = DOMChildrenWalker;
