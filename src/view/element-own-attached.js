/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 完成元素 attached 后的行为
 */


var bind = require('../util/bind');
var empty = require('../util/empty');
var isBrowser = require('../browser/is-browser');
var trigger = require('../browser/trigger');
var NodeType = require('./node-type');
var elementGetTransition = require('./element-get-transition');
var getEventListener = require('./get-event-listener');
var getPropHandler = require('./get-prop-handler');
var warnEventListenMethod = require('./warn-event-listen-method');

/**
 * 双绑输入框CompositionEnd事件监听函数
 *
 * @inner
 */
function inputOnCompositionEnd() {
    if (!this.composing) {
        return;
    }

    this.composing = 0;

    trigger(this, 'input');
}

/**
 * 双绑输入框CompositionStart事件监听函数
 *
 * @inner
 */
function inputOnCompositionStart() {
    this.composing = 1;
}

function xPropOutputer(xProp, data) {
    getPropHandler(this.tagName, xProp.name).output(this, xProp, data);
}

function inputXPropOutputer(element, xProp, data) {
    var outputer = bind(xPropOutputer, element, xProp, data);
    return function (e) {
        if (!this.composing) {
            outputer(e);
        }
    };
}

/**
 * 完成元素 attached 后的行为
 *
 * @param {Object} element 元素节点
 */
function elementOwnAttached() {
    this._toPhase('created');

    if (this.el.nodeType === 1) {
        var isComponent = this.nodeType === NodeType.CMPT;
        var data = isComponent ? this.data : this.scope;

        /* eslint-disable no-redeclare */

        // 处理自身变化时双向绑定的逻辑
        var xProps = this.aNode.hotspot.xProps;
        for (var i = 0, l = xProps.length; i < l; i++) {
            var xProp = xProps[i];

            switch (xProp.name) {
                case 'value':
                    switch (this.tagName) {
                        case 'input':
                        case 'textarea':
                            if (isBrowser && window.CompositionEvent) {
                                this._onEl('change', inputOnCompositionEnd);
                                this._onEl('compositionstart', inputOnCompositionStart);
                                this._onEl('compositionend', inputOnCompositionEnd);
                            }

                            this._onEl(
                                ('oninput' in this.el) ? 'input' : /* istanbul ignore next */ 'propertychange',
                                inputXPropOutputer(this, xProp, data)
                            );

                            break;

                        case 'select':
                            this._onEl('change', bind(xPropOutputer, this, xProp, data));
                            break;
                    }
                    break;

                case 'checked':
                    switch (this.tagName) {
                        case 'input':
                            switch (this.el.type) {
                                case 'checkbox':
                                case 'radio':
                                    this._onEl('click', bind(xPropOutputer, this, xProp, data));
                            }
                    }
                    break;
            }
        }

        for (var i = 0, l = this.aNode.events.length; i < l; i++) {
            var eventBind = this.aNode.events[i];

            // #[begin] error
            warnEventListenMethod(eventBind, isComponent ? this : this.owner);
            // #[end]

            this._onEl(
                eventBind.name,
                getEventListener(eventBind.expr, isComponent ? this : this.owner, data),
                eventBind.modifier.capture
            );
        }

        if (isComponent) {
            for (var i = 0, l = this.nativeEvents.length; i < l; i++) {
                var eventBind = this.nativeEvents[i];

                // #[begin] error
                warnEventListenMethod(eventBind, this.owner);
                // #[end]

                this._onEl(
                    eventBind.name,
                    getEventListener(eventBind.expr, this.owner, this.scope),
                    eventBind.modifier.capture
                );
            }
        }
    }

    this._toPhase('attached');


    if (this.el.nodeType === 1) {
        var transition = elementGetTransition(this);
        if (transition && transition.enter) {
            transition.enter(this.el, empty);
        }
    }
}

exports = module.exports = elementOwnAttached;
