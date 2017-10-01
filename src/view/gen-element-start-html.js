/**
 * @file 生成元素标签起始的html
 * @author errorrik(errorrik@gmail.com)
 */

var evalExpr = require('../runtime/eval-expr');
var isComponent = require('./is-component');
var getPropHandler = require('./get-prop-handler');

/**
 * 生成元素标签起始的html
 *
 * @param {Element} element 元素
 * @param {StringBuffer} buf html串存储对象
 */
function genElementStartHTML(element, buf) {
    if (!element.tagName) {
        return;
    }

    buf.push('<' + element.tagName + ' id="' + element.id + '"');

    element.props.each(function (prop) {
        var value = isComponent(element)
            ? evalExpr(prop.expr, element.data, element)
            : nodeEvalExpr(element, prop.expr, 1);

        buf.push(
            getPropHandler(element, prop.name)
                .input
                .attr(element, prop.name, value)
            || ''
        );
    });

    buf.push('>');
}

exports = module.exports = genElementStartHTML;
