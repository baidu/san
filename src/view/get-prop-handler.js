/**
 * @file 获取属性处理对象
 * @author errorrik(errorrik@gmail.com)
 */

var contains = require('../util/contains');
var empty = require('../util/empty');
var getPropAndIndex = require('../util/get-prop-and-index');
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
        if (value != null) {
            return ' ' + name + '="' + value + '"';
        }
    },

    prop: function (element, name, value) {
        var propName = HTML_ATTR_PROP_MAP[name] || name;
        var el = element.el;

        // input 的 type 是个特殊属性，其实也应该用 setAttribute
        // 但是 type 不应该运行时动态改变，否则会有兼容性问题
        // 所以这里直接就不管了
        if (svgTags[element.tagName] || !(propName in el)) {
            el.setAttribute(name, value);
        }
        else {
            el[propName] = value == null ? '' : value;
        }

        // attribute 绑定的是 text，所以不会出现 null 的情况，这里无需处理
        // 换句话来说，san 是做不到 attribute 时有时无的
        // if (value == null) {
        //     el.removeAttribute(name);
        // }
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
            if (value != null) {
                return ' style="' + value + '"';
            }
        },

        prop: function (element, name, value) {
            element.el.style.cssText = value;
        }
    },

    slot: {
        attr: empty,
        prop: empty
    },

    draggable: genBoolPropHandler('draggable'),
    readonly: genBoolPropHandler('readonly'),
    disabled: genBoolPropHandler('disabled'),
    autofocus: genBoolPropHandler('autofocus'),
    required: genBoolPropHandler('required')
};

var checkedPropHandler = genBoolPropHandler('checked');
var analInputChecker = {
    checkbox: contains,
    radio: function (a, b) {
        return a === b;
    }
};

function analInputCheckedState(element, value, oper) {
    var bindValue = getPropAndIndex(element, 'value');
    var bindType = getPropAndIndex(element, 'type');

    if (bindValue && bindType) {
        var type = nodeEvalExpr(element, bindType.expr);

        if (analInputChecker[type]) {
            var bindChecked = getPropAndIndex(element, 'checked');
            if (!bindChecked.hintExpr) {
                bindChecked.hintExpr = bindValue.expr;
            }

            var checkedState = analInputChecker[type](
                value,
                nodeEvalExpr(element, bindValue.expr)
            );

            switch (oper) {
                case 'attr':
                    return checkedState ? ' checked="checked"' : '';

                case 'prop':
                    element.el.checked = checkedState;
                    return;
            }
        }
    }

    return checkedPropHandler[oper](element, 'checked', value);
}

var elementPropHandlers = {
    input: {
        multiple: genBoolPropHandler('multiple'),
        checked: {
            attr: function (element, name, value) {
                return analInputCheckedState(element, value, 'attr');
            },

            prop: function (element, name, value) {
                analInputCheckedState(element, value, 'prop');
            },

            output: function (element, bindInfo, data) {
                var el = element.el;
                var bindValue = getPropAndIndex(element, 'value');
                var bindType = getPropAndIndex(element, 'type') || {};

                if (bindValue && bindType) {
                    switch (bindType.raw) {
                        case 'checkbox':
                            data[el.checked ? 'push' : 'remove'](bindInfo.expr, el.value);
                            return;

                        case 'radio':
                            el.checked && data.set(bindInfo.expr, el.value, {
                                target: {
                                    id: element.id,
                                    prop: bindInfo.name
                                }
                            });
                            return;
                    }
                }

                defaultElementPropHandler.output(element, bindInfo, data);
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

                    if ((prop = getPropAndIndex(parentSelect, 'value'))
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
    return {
        attr: function (element, name, value) {
            // 因为元素的attr值必须经过html escape，否则可能有漏洞
            // 所以这里直接对假值字符串形式进行处理
            // NaN之类非主流的就先不考虑了
            var prop = getPropAndIndex(element, name);
            if (prop && prop.raw === ''
                || value && value !== 'false' && value !== '0'
            ) {
                return ' ' + attrName;
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
