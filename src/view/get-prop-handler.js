/**
 * @file 获取属性处理对象
 * @author errorrik(errorrik@gmail.com)
 */

var contains = require('../util/contains');
var empty = require('../util/empty');
var svgTags = require('../browser/svg-tags');
/**
 * HTML 属性和 DOM 操作属性的对照表
 *
 * @inner
 * @const
 * @type {Object}
 */
var HTML_ATTR_PROP_MAP = {
    'readonly': 'readOnly',
    'cellpadding': 'cellPadding',
    'cellspacing': 'cellSpacing',
    'colspan': 'colSpan',
    'rowspan': 'rowSpan',
    'valign': 'vAlign',
    'usemap': 'useMap',
    'frameborder': 'frameBorder',
    'for': 'htmlFor',
    'class': 'className'
};

/**
 * 默认的元素的属性设置的变换方法
 *
 * @inner
 * @type {Object}
 */
var defaultElementPropHandler = {
    input: {
        attr: function (element, name, value) {
            if (value) {
                return ' ' + name + '="' + value + '"';
            }
        },

        prop: function (element, name, value) {
            name = HTML_ATTR_PROP_MAP[name] || name;
            if (svgTags[element.tagName]) {
                element.el.setAttribute(name, value);
            }
            else {
                element.el[name] = value;
            }
        }
    },

    output: function (element, bindInfo) {
        element.scope.set(bindInfo.expr, element.el[bindInfo.name], {
            target: {
                id: element.id,
                prop: bindInfo.name
            }
        });
    }
};

var defaultElementPropHandlers = {
    style: {
        input: {
            attr: function (element, name, value) {
                if (value) {
                    return ' style="' + value + '"';
                }
            },

            prop: function (element, name, value) {
                element.el.style.cssText = value;
            }
        }
    },

    readonly: genBoolPropHandler('readonly'),
    disabled: genBoolPropHandler('disabled')
};

function analInputCheckedState(element, value) {
    var bindValue = element.props.get('value');
    var bindType = element.props.get('type');

    if (bindValue && bindType) {
        switch (bindType.raw) {
            case 'checkbox':
                return contains(value, element.evalExpr(bindValue.expr));

            case 'radio':
                return value === element.evalExpr(bindValue.expr);
        }
    }
}

var elementPropHandlers = {
    input: {
        mutiple: genBoolPropHandler('mutiple'),
        checked: {
            input: {
                attr: function (element, name, value) {
                    if (analInputCheckedState(element, value)) {
                        return ' checked="checked"';
                    }
                },

                prop: function (element, name, value) {
                    var checked = analInputCheckedState(element, value);
                    if (checked != null) {
                        element.el.checked = checked;
                    }
                }
            },

            output: function (element, bindInfo) {
                var el = element.el;
                var bindType = element.props.get('type') || {};

                switch (bindType.raw) {
                    case 'checkbox':
                        element.scope[el.checked ? 'push' : 'remove'](bindInfo.expr, el.value);
                        break;

                    case 'radio':
                        el.checked && element.scope.set(bindInfo.expr, el.value, {
                            target: {
                                id: element.id,
                                prop: bindInfo.name
                            }
                        });
                        break;
                }
            }
        }
    },

    textarea: {
        value: {
            input: {
                attr: empty,
                prop: defaultElementPropHandler.input.prop
            },

            output: defaultElementPropHandler.output
        }
    },

    option: {
        value: {
            input: {
                attr: function (element, name, value) {
                    var attrStr = defaultElementPropHandler.input.attr(element, name, value);
                    var parent = element.parent;
                    var parentValueProp;

                    if (parent.tagName === 'select'
                        && (parentValueProp = parent.props.get('value'))
                        && parent.evalExpr(parentValueProp.expr) === value
                    ) {
                        attrStr += ' selected';
                    }

                    return attrStr;
                },

                prop: defaultElementPropHandler.input.prop
            }
        }
    }
};

/**
 * 生成 bool 类型属性绑定操作的变换方法
 *
 * @inner
 * @param {string} attrName 属性名
 * @return {Object}
 */
function genBoolPropHandler(attrName) {
    return {
        input: {
            attr: function (element, name, value) {
                // 因为元素的attr值必须经过html escape，否则可能有漏洞
                // 所以这里直接对假值字符串形式进行处理
                // NaN之类非主流的就先不考虑了
                if (value && value !== 'false' && value !== '0') {
                    return ' ' + attrName + '="' + attrName + '"';
                }
            },

            prop: function (element, name, value) {
                var propName = HTML_ATTR_PROP_MAP[attrName] || attrName;
                element.el[propName] = !!(value && value !== 'false' && value !== '0');
            }
        }
    };
}

/**
 * 获取属性处理对象
 *
 * @param {Element} element 元素实例
 * @param {string} name 属性名
 * @return {Object}
 */
function getPropHandler(element, name) {
    var propHandlers = elementPropHandlers[element.tagName] || {};
    return propHandlers[name] || defaultElementPropHandlers[name] || defaultElementPropHandler;
}

exports = module.exports = getPropHandler;
