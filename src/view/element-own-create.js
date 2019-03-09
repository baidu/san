/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 创建节点对应的 HTMLElement 主元素
 */


var evalExpr = require('../runtime/eval-expr');
var createEl = require('../browser/create-el');
var NodeType = require('./node-type');
var getPropHandler = require('./get-prop-handler');

var emptyPropWhenCreate = {
    'class': 1,
    'style': 1,
    'id': 1
};

/**
 * 创建节点对应的 HTMLElement 主元素
 */
function elementOwnCreate() {
    if (!this.el) {
        var isComponent = this.nodeType === NodeType.CMPT;
        var sourceNode = this.aNode.hotspot.sourceNode;
        var props = this.aNode.props;

        if (sourceNode) {
            this.el = sourceNode.cloneNode(false);
            props = this.aNode.hotspot.dynamicProps;
        }
        else {
            this.el = createEl(this.tagName);
        }

        for (var key in this._sbindData) {
            if (this._sbindData.hasOwnProperty(key)) {
                getPropHandler(this.tagName, key).prop(
                    this.el,
                    this._sbindData[key],
                    key,
                    this
                );
            }
        }

        for (var i = 0, l = props.length; i < l; i++) {
            var prop = props[i];
            var propName = prop.name;
            var value = isComponent
                ? evalExpr(prop.expr, this.data, this)
                : evalExpr(prop.expr, this.scope, this.owner);

            if (value || !emptyPropWhenCreate[propName]) {
                getPropHandler(this.tagName, propName).prop(this.el, value, propName, this, prop);
            }
        }

        this._toPhase('created');
    }

    if (!this.lifeCycle.created) {
        this._toPhase('created');
    }
}

exports = module.exports = elementOwnCreate;
