/**
 * @file 完成元素 attached 后的行为
 * @author errorrik(errorrik@gmail.com)
 */



var each = require('../util/each');
var bind = require('../util/bind');
var empty = require('../util/empty');
var isBrowser = require('../browser/is-browser');
var trigger = require('../browser/trigger');

var elementGetTransition = require('./element-get-transition');
var eventDeclarationListener = require('./event-declaration-listener');
var isComponent = require('./is-component');
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


/**
 * 完成元素 attached 后的行为
 *
 * @param {Object} element 元素节点
 */
function elementAttached(element) {
    element._toPhase('created');
    var elementIsComponent = isComponent(element);

    var data = elementIsComponent ? element.data : element.scope;

    // 处理自身变化时双向绑定的逻辑
    each(element.aNode.props, function (bindInfo) {
        if (!bindInfo.x) {
            return;
        }

        var el = element._getEl();
        function outputer() {
            getPropHandler(element, bindInfo.name).output(element, bindInfo, data);
        }


        switch (bindInfo.name) {
            case 'value':
                switch (element.tagName) {
                    case 'input':
                    case 'textarea':
                        if (isBrowser && window.CompositionEvent) {
                            element._onEl('change', inputOnCompositionEnd);
                            element._onEl('compositionstart', inputOnCompositionStart);
                            element._onEl('compositionend', inputOnCompositionEnd);
                        }

                        element._onEl(
                            ('oninput' in el) ? 'input' : 'propertychange',
                            function (e) {
                                if (!this.composing) {
                                    outputer(e);
                                }
                            }
                        );

                        break;

                    case 'select':
                        element._onEl('change', outputer);
                        break;
                }
                break;

            case 'checked':
                switch (element.tagName) {
                    case 'input':
                        switch (el.type) {
                            case 'checkbox':
                            case 'radio':
                                element._onEl('click', outputer);
                        }
                }
                break;
        }

    });

    // bind events
    var events = elementIsComponent
        ? element.aNode.events.concat(element.nativeEvents)
        : element.aNode.events;

    each(events, function (eventBind) {
        var owner = elementIsComponent ? element : element.owner;
        var data = element.data || element.scope;

        // 判断是否是nativeEvent，下面的warn方法和事件绑定都需要
        // 依此指定eventBind.expr.name位于owner还是owner.owner上
        if (eventBind.modifier.native) {
            owner = owner.owner;
            data = element.scope || owner.data;
        }

        // #[begin] error
        warnEventListenMethod(eventBind, owner);
        // #[end]

        element._onEl(
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
    });

    element._toPhase('attached');


    if (element._isInitFromEl) {
        element._isInitFromEl = false;
    }
    else {
        var transition = elementGetTransition(element);
        if (transition && transition.enter) {
            transition.enter(element._getEl(), empty);
        }
    }
}

exports = module.exports = elementAttached;
