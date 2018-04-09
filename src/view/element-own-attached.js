/**
 * @file 完成元素 attached 后的行为
 * @author errorrik(errorrik@gmail.com)
 */


var bind = require('../util/bind');
var empty = require('../util/empty');
var isBrowser = require('../browser/is-browser');
var trigger = require('../browser/trigger');
var NodeType = require('./node-type');
var elementGetTransition = require('./element-get-transition');
var eventDeclarationListener = require('./event-declaration-listener');
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
                            ('oninput' in this.el) ? 'input' : 'propertychange',
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

    // bind events
    var events = isComponent
        ? this.aNode.events.concat(this.nativeEvents)
        : this.aNode.events;

    for (var i = 0, l = events.length; i < l; i++) {
        var eventBind = events[i];
        var owner = isComponent ? this : this.owner;

        // 判断是否是nativeEvent，下面的warn方法和事件绑定都需要
        // 依此指定eventBind.expr.name位于owner还是owner.owner上
        if (eventBind.modifier.native) {
            owner = owner.owner;
            data = this.scope || owner.data;
        }

        // #[begin] error
        warnEventListenMethod(eventBind, owner);
        // #[end]

        this._onEl(
            eventBind.name,
            bind(
                eventDeclarationListener,
                owner,
                eventBind,
                0,
                data
            ),
            eventBind.modifier.capture
        );
    }

    this._toPhase('attached');


    if (this._isInitFromEl) {
        this._isInitFromEl = false;
    }
    else {
        var transition = elementGetTransition(this);
        if (transition && transition.enter) {
            transition.enter(this.el, empty);
        }
    }
}

exports = module.exports = elementOwnAttached;
