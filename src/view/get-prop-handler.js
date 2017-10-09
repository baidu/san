/**
 * @file 获取属性处理对象
 * @author errorrik(errorrik@gmail.com)
 */

var contains = require('../util/contains');
var empty = require('../util/empty');
var svgTags = require('../browser/svg-tags');
var evalExpr = require('../runtime/eval-expr');
var nodeEvalExpr = require('./node-eval-expr');
var isComponent = require('./is-component');


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
    },

    output: function (element, bindInfo, data) {
        data.set(bindInfo.expr, element.el[bindInfo.name], {
            target: {
                id: element.id,
                prop: bindInfo.name
            }
        });
    }
};

/**
 * 默认的属性设置变换方法
 *
 * @inner
 * @type {Object}
 */
var defaultElementPropHandlers = {
    style: {
        attr: function (element, name, value) {
            if (value) {
                return ' style="' + value + '"';
            }
        },

        prop: function (element, name, value) {
            element.el.style.cssText = value;
        }
    },

    draggable: genBoolPropHandler('draggable'),
    readonly: genBoolPropHandler('readonly'),
    disabled: genBoolPropHandler('disabled')
};

function analInputCheckedState(element, value) {
    var bindValue = element.props.get('value');
    var bindType = element.props.get('type');
    var bindChecked = element.props.get('checked');

    if (bindValue && bindType) {
        switch (bindType.raw) {
            case 'checkbox':
                if (bindChecked && !bindChecked.hintExpr) {
                    bindChecked.hintExpr = bindValue.expr;
                }
                return contains(value, nodeEvalExpr(element, bindValue.expr));

            case 'radio':
                if (bindChecked && !bindChecked.hintExpr) {
                    bindChecked.hintExpr = bindValue.expr;
                }
                return value === nodeEvalExpr(element, bindValue.expr);
        }
    }
}

var elementPropHandlers = {
    input: {
        mutiple: genBoolPropHandler('mutiple'),
        checked: {
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
            },

            output: function (element, bindInfo, data) {
                var el = element.el;
                var bindType = element.props.get('type') || {};

                switch (bindType.raw) {
                    case 'checkbox':
                        data[el.checked ? 'push' : 'remove'](bindInfo.expr, el.value);
                        break;

                    case 'radio':
                        el.checked && data.set(bindInfo.expr, el.value, {
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
            attr: empty,
            prop: defaultElementPropHandler.prop,
            output: defaultElementPropHandler.output
        }
    },

    option: {
        value: {
            attr: function (element, name, value) {
                var attrStr = ' value="' + (value || '') + '"';
                var parentSelect = element.parent;
                while (parentSelect) {
                    if (parentSelect.tagName === 'select') {
                        break;
                    }

                    parentSelect = parentSelect.parent;
                }


                if (parentSelect) {
                    var selectValue = null;
                    var prop;
                    var expr;

                    if ((prop = parentSelect.props.get('value'))
                        && (expr = prop.expr)
                    ) {
                        selectValue = isComponent(parentSelect)
                                ? evalExpr(expr, parentSelect.data, parentSelect)
                                : nodeEvalExpr(parentSelect, expr)
                            || '';
                    }

                    if (selectValue === value) {
                        attrStr += ' selected';
                    }
                }

                return attrStr;
            },

            prop: defaultElementPropHandler.prop
        }
    },

    select: {
        value: {
            attr: empty,
            prop: function (element, name, value) {
                element.el.value = value || '';
            },

            output: defaultElementPropHandler.output
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
    var attrLiteral = ' ' + attrName;

    return {
        attr: function (element, name, value) {
            // 因为元素的attr值必须经过html escape，否则可能有漏洞
            // 所以这里直接对假值字符串形式进行处理
            // NaN之类非主流的就先不考虑了
            if (element.props.get(name).raw === ''
                || value && value !== 'false' && value !== '0'
            ) {
                return attrLiteral;
            }
        },

        prop: function (element, name, value) {
            var propName = HTML_ATTR_PROP_MAP[attrName] || attrName;
            element.el[propName] = !!(value && value !== 'false' && value !== '0');
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
    var tagPropHandlers = elementPropHandlers[element.tagName];
    if (!tagPropHandlers) {
        tagPropHandlers = elementPropHandlers[element.tagName] = {};
    }

    var propHandler = tagPropHandlers[name];
    if (!propHandler) {
        propHandler = defaultElementPropHandlers[name] || defaultElementPropHandler;
        tagPropHandlers[name] = propHandler;
    }

    return propHandler;
}

exports = module.exports = getPropHandler;
