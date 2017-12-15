/**
 * @file 生成元素标签起始的html
 * @author errorrik(errorrik@gmail.com)
 */

var evalExpr = require('../runtime/eval-expr');
var pushStrBuffer = require('../runtime/push-str-buffer');
var isComponent = require('./is-component');
var getPropHandler = require('./get-prop-handler');
var nodeEvalExpr = require('./node-eval-expr');

var BOOL_ATTRIBUTES = {};
each(
    'checked,readonly,selected,multiple,draggable,disabled'.split(','),
    function (key) {
        BOOL_ATTRIBUTES[key] = 1;
    }
);

/**
 * 生成元素标签起始的html
 *
 * @param {Element} element 元素
 * @param {Object} buf html串存储对象
 */
function genElementStartHTML(element, buf) {
    if (!element.tagName) {
        return;
    }

    pushStrBuffer(buf, '<' + element.tagName);

    element.props.each(function (prop) {
        var attr = prop.attr;
        var value;

        if (!attr) {
            element.dynamicProps.push(prop);

            value = isComponent(element)
                ? evalExpr(prop.expr, element.data, element)
                : nodeEvalExpr(element, prop.expr, 1);

            if (!BOOL_ATTRIBUTES[prop.name] && prop.x) {
                value = escapeHTML(value);
            }

            attr = getPropHandler(element, prop.name).attr(element, prop.name, value);
        }

        pushStrBuffer(buf, attr || '');
    });

    var idProp = element.props.get('id');
    if (idProp) {
        element._elId = isComponent(element)
            ? evalExpr(idProp.expr, element.data, element)
            : nodeEvalExpr(element, idProp.expr, 1);
    }

    pushStrBuffer(buf, ' id="' + (element._elId || element.id) + '"' + '>');
}

exports = module.exports = genElementStartHTML;
