/**
 * @file 获取属性处理对象
 * @author errorrik(errorrik@gmail.com)
 */

var contains = require('../util/contains');
var empty = require('../util/empty');
var svgTags = require('../browser/svg-tags');
var evalExpr = require('../runtime/eval-expr');
var getANodeProp = require('./get-a-node-prop');
var NodeType = require('./node-type');


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
    'for': 'htmlFor'
};

/**
 * 默认的元素的属性设置的变换方法
 *
 * @inner
 * @type {Object}
 */
var defaultElementPropHandler = {
    attr: function (element, value, name) {
        if (value != null) {
            return ' ' + name + '="' + value + '"';
        }
    },

    prop: function (element, value, name) {
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

var boolPropHandler = {
    attr: function (element, value, name, prop) {
        // 因为元素的attr值必须经过html escape，否则可能有漏洞
        // 所以这里直接对假值字符串形式进行处理
        // NaN之类非主流的就先不考虑了
        if (prop && prop.raw === ''
            || value && value !== 'false' && value !== '0'
        ) {
            return ' ' + name;
        }
    },

    prop: function (element, value, name, prop) {
        var propName = HTML_ATTR_PROP_MAP[name] || name;
        element.el[propName] = !!(prop && prop.raw === ''
            || value && value !== 'false' && value !== '0');
    }
};

/* eslint-disable fecs-properties-quote */
/**
 * 默认的属性设置变换方法
 *
 * @inner
 * @type {Object}
 */
var defaultElementPropHandlers = {
    style: {
        attr: function (element, value) {
            if (value) {
                return ' style="' + value + '"';
            }
        },

        prop: function (element, value) {
            element.el.style.cssText = value;
        }
    },

    'class': { // eslint-disable-line
        attr: function (element, value) {
            if (value) {
                return ' class="' + value + '"';
            }
        },

        prop: function (element, value) {
            element.el.className = value;
        }
    },

    slot: {
        attr: empty,
        prop: empty
    },

    readonly: boolPropHandler,
    disabled: boolPropHandler,
    autofocus: boolPropHandler,
    required: boolPropHandler,

    // draggable attribute 是枚举类型，但 property 接受 boolean
    draggable: {
        attr: defaultElementPropHandler.attr,
        prop: boolPropHandler.prop
    }
};
/* eslint-enable fecs-properties-quote */

var analInputChecker = {
    checkbox: contains,
    radio: function (a, b) {
        return a === b;
    }
};

function analInputCheckedState(element, value, oper) {
    var bindValue = getANodeProp(element.aNode, 'value');
    var bindType = getANodeProp(element.aNode, 'type');

    if (bindValue && bindType) {
        var type = evalExpr(bindType.expr, element.scope, element.owner);

        if (analInputChecker[type]) {
            var bindChecked = getANodeProp(element.aNode, 'checked');
            if (!bindChecked.hintExpr) {
                bindChecked.hintExpr = bindValue.expr;
            }

            return !!analInputChecker[type](
                value,
                evalExpr(bindValue.expr, element.scope, element.owner)
            );
        }
    }
}

var elementPropHandlers = {
    input: {
        multiple: boolPropHandler,
        checked: {
            attr: function (element, value, name, prop) {
                var state = analInputCheckedState(element, value);

                return boolPropHandler.attr(
                    element,
                    state != null ? state : value,
                    'checked',
                    prop
                );
            },

            prop: function (element, value) {
                var state = analInputCheckedState(element, value);

                boolPropHandler.prop(
                    element,
                    state != null ? state : value,
                    'checked'
                );
            },

            output: function (element, bindInfo, data) {
                var el = element.el;
                var bindValue = getANodeProp(element.aNode, 'value');
                var bindType = getANodeProp(element.aNode, 'type') || {};

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
            attr: function (element, value) {
                return ' value="' + (value || '') + '"'
                    + (isOptionSelected(element, value) ? 'selected' : '');
            },

            prop: function (element, value, name) {
                defaultElementPropHandler.prop(element, value, name);

                if (isOptionSelected(element, value)) {
                    element.el.selected = true;
                }
            }
        }
    },

    select: {
        value: {
            attr: empty,
            prop: function (element, value) {
                element.el.value = value || '';
            },

            output: defaultElementPropHandler.output
        }
    }
};

function isOptionSelected(element, value) {
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

        if ((prop = getANodeProp(parentSelect.aNode, 'value'))
            && (expr = prop.expr)
        ) {
            selectValue = parentSelect.nodeType === NodeType.CMPT
                ? evalExpr(expr, parentSelect.data, parentSelect)
                : evalExpr(expr, parentSelect.scope, parentSelect.owner)
                || '';
        }

        if (selectValue === value) {
            return 1;
        }
    }
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
