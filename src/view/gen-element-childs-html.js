/**
 * @file 生成子元素html
 * @author errorrik(errorrik@gmail.com)
 */

var escapeHTML = require('../runtime/escape-html');
var each = require('../util/each');
var createNode = require('./create-node');

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
            buf.push(escapeHTML(element.evalExpr(valueProp.expr)));
        }
    }
    else {
        var htmlDirective = element.aNode.directives.get('html');

        if (htmlDirective) {
            buf.push(element.evalExpr(htmlDirective.value));
        }
        else {
            each(element.aNode.childs, function (aNodeChild) {
                var child = createNode(aNodeChild, element);
                if (!child._static) {
                    element.childs.push(child);
                }
                child.genHTML(buf);
            });
        }
    }
}

exports = module.exports = genElementChildsHTML;
