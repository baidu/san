/**
 * @file 完成元素 attached 后的行为
 * @author errorrik(errorrik@gmail.com)
 */



var each = require('../util/each');
var bind = require('../util/bind');
var isBrowser = require('../browser/is-browser');

var elementGetTransition = require('./element-get-transition');
var eventDeclarationListener = require('./event-declaration-listener');
var isComponent = require('./is-component');
var getPropHandler = require('./get-prop-handler');
var warnEventListenMethod = require('./warn-event-listen-method');

/**
 * 完成元素 attached 后的行为
 *
 * @param {Object} element 元素节点
 */
function elementAttached(element) {
    element._toPhase('created');

    var data = isComponent(element) ? element.data : element.scope;

    // 处理自身变化时双向绑定的逻辑
    var xBinds = isComponent(element) ? element.props : element.binds;
    xBinds && xBinds.each(function (bindInfo) {
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
                            element._onEl('compositionstart', function () {
                                this.composing = 1;
                            });
                            element._onEl('compositionend', function () {
                                this.composing = 0;

                                var event = document.createEvent('HTMLEvents');
                                event.initEvent('input', true, true);
                                this.dispatchEvent(event);
                            });
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
    each(element.aNode.events, function (eventBind) {
        var owner = isComponent(element) ? element : element.owner;

        // 判断是否是nativeEvent，下面的warn方法和事件绑定都需要
        // 依此指定eventBind.expr.name位于owner还是owner.owner上
        if (eventBind.modifier === 'native') {
            owner = owner.owner;
        }

        // #[begin] error
        warnEventListenMethod(
            eventBind.name,
            owner,
            eventBind.expr.name
        );
        // #[end]

        element._onEl(
            eventBind.name,
            bind(
                eventDeclarationListener,
                owner,
                eventBind,
                0,
                element.data || element.scope
            )
        );
    });

    element._toPhase('attached');


    var transition = elementGetTransition(element);
    if (transition) {
        transition.enter(element._getEl(), empty);
    }
}

exports = module.exports = elementAttached;
