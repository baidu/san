/**
 * @file 创建节点对应的 HTMLElement 主元素
 * @author errorrik(errorrik@gmail.com)
 */

var createEl = require('../browser/create-el');
var evalExpr = require('../runtime/eval-expr');
var nodeEvalExpr = require('./node-eval-expr');
var isComponent = require('./is-component');
var getPropHandler = require('./get-prop-handler');

/**
 * 创建节点对应的 HTMLElement 主元素
 *
 * @param {Object} element 元素节点
 */
function elementCreate(element) {
    element.lifeCycle.set('painting');
    element.el = createEl(element.tagName);
    element.el.id = element.id;

    element.props.each(function (prop) {
        var value = isComponent(element)
            ? evalExpr(prop.expr, element.data, element)
            : nodeEvalExpr(element, prop.expr, 1);

        var match = /^\s+([a-z0-9_-]+)=(['"])([^\2]*)\2$/i.exec(
            getPropHandler(element, prop.name).attr(element, prop.name, value)
        );

        if (match) {
            element.el.setAttribute(match[1], match[3]);
        }
    });
}

exports = module.exports = elementCreate;
