/**
 * @file 生成子元素html
 * @author errorrik(errorrik@gmail.com)
 */

var escapeHTML = require('../runtime/escape-html');
var each = require('../util/each');
var createNode = require('./create-node');
var nodeEvalExpr = require('./node-eval-expr');

/**
 * 生成子元素html
 *
 * @param {Element} element 元素
 * @param {StringBuffer} buf html串存储对象
 */
function genElementChildsHTML(element, buf) {
    if (element.tagName === 'textarea') {
        var valueProp = element.props.get('value');
        if (valueProp) {
            buf.push(escapeHTML(nodeEvalExpr(element, valueProp.expr)));
        }
    }
    else {
        var htmlDirective = element.aNode.directives.get('html');

        if (htmlDirective) {
            buf.push(nodeEvalExpr(element, htmlDirective.value));
        }
        else {
            each(element.aNode.childs, function (aNodeChild) {
                var child = createNode(aNodeChild, element);
                if (!child._static) {
                    child.lifeCycle.set('painting');
                    element.childs.push(child);
                }
                child.genHTML(buf);
            });
        }
    }
}

exports = module.exports = genElementChildsHTML;
