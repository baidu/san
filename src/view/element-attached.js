
var elementAddElEvent = require('./element-add-el-event');

/**
 * 完成创建元素DOM后的行为
 */
function elementAttached(element) {
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
                            elementAddElEvent(element, 'compositionstart', function () {
                                this.composing = 1;
                            });
                            elementAddElEvent(element, 'compositionend', function () {
                                this.composing = 0;

                                var event = document.createEvent('HTMLEvents');
                                event.initEvent('input', true, true);
                                this.dispatchEvent(event);
                            });
                        }

                        elementAddElEvent(element, 
                            ('oninput' in el) ? 'input' : 'propertychange',
                            function (e) {
                                if (!this.composing) {
                                    outputer(e);
                                }
                            }
                        );

                        break;

                    case 'select':
                    elementAddElEvent(element, 'change', outputer);
                        break;
                }
                break;

            case 'checked':
                switch (element.tagName) {
                    case 'input':
                        switch (el.type) {
                            case 'checkbox':
                            case 'radio':
                            elementAddElEvent(element, 'click', outputer);
                        }
                }
                break;
        }

    });

    // bind events
    each(element.aNode.events, function (eventBind) {
        elementAddElEvent(element, 
            eventBind.name,
            bind(
                eventDeclarationListener,
                isComponent(element) ? element : element.owner,
                eventBind,
                0,
                element.data || element.scope
            )
        );
    });
}


exports = module.exports = elementAttached;
