/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 完成元素 attached 后的行为
 */


var empty = require('../util/empty');
var isBrowser = require('../browser/is-browser');
var trigger = require('../browser/trigger');
var NodeType = require('./node-type');
var elementGetTransition = require('./element-get-transition');
var getEventListener = require('./get-event-listener');
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

function getXPropOutputer(element, xProp, data) {
    return function () {
        xPropOutput(element, xProp, data);
    };
}

function getInputXPropOutputer(element, xProp, data) {
    return function () {
        if (!this.composing) {
            xPropOutput(element, xProp, data);
        }
    };
}

// #[begin] allua
/* istanbul ignore next */
function getInputFocusXPropHandler(element, xProp, data) {
    return function () {
        element._inputTimer = setInterval(function () {
            xPropOutput(element, xProp, data);
        }, 16);
    };
}

/* istanbul ignore next */
function getInputBlurXPropHandler(element) {
    return function () {
        clearInterval(element._inputTimer);
        element._inputTimer = null;
    };
}
// #[end]

function xPropOutput(element, bindInfo, data) {
    /* istanbul ignore if */
    if (!element.lifeCycle.created) {
        return;
    }

    var el = element.el;

    if (element.tagName === 'input' && bindInfo.name === 'checked') {
        var bindValue = getANodeProp(element.aNode, 'value');
        var bindType = getANodeProp(element.aNode, 'type');

        if (bindValue && bindType) {
            switch (el.type.toLowerCase()) {
                case 'checkbox':
                    data[el.checked ? 'push' : 'remove'](bindInfo.expr, el.value);
                    return;

                case 'radio':
                    el.checked && data.set(bindInfo.expr, el.value, {
                        target: {
                            node: element,
                            prop: bindInfo.name
                        }
                    });
                    return;
            }
        }
    }

    data.set(bindInfo.expr, el[bindInfo.name], {
        target: {
            node: element,
            prop: bindInfo.name
        }
    });
}

/**
 * 完成元素 attached 后的行为
 *
 * @param {Object} element 元素节点
 */
function elementOwnAttached() {
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

                            // #[begin] allua
                            /* istanbul ignore else */
                            if ('oninput' in this.el) {
                            // #[end]
                                this._onEl('input', getInputXPropOutputer(this, xProp, data));
                            // #[begin] allua
                            }
                            else {
                                this._onEl('focusin', getInputFocusXPropHandler(this, xProp, data));
                                this._onEl('focusout', getInputBlurXPropHandler(this));
                            }
                            // #[end]

                            break;

                        case 'select':
                            this._onEl('change', getXPropOutputer(this, xProp, data));
                            break;
                    }
                    break;

                case 'checked':
                    switch (this.tagName) {
                        case 'input':
                            switch (this.el.type) {
                                case 'checkbox':
                                case 'radio':
                                    this._onEl('click', getXPropOutputer(this, xProp, data));
                            }
                    }
                    break;
            }
        }

        var owner = isComponent ? this : this.owner;
        for (var i = 0, l = this.aNode.events.length; i < l; i++) {
            var eventBind = this.aNode.events[i];

            // #[begin] error
            warnEventListenMethod(eventBind, owner);
            // #[end]

            this._onEl(
                eventBind.name,
                getEventListener(eventBind.expr, owner, data),
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

    if (this.el.nodeType === 1) {
        var transition = elementGetTransition(this);
        if (transition && transition.enter) {
            transition.enter(this.el, empty);
        }
    }
}

exports = module.exports = elementOwnAttached;
