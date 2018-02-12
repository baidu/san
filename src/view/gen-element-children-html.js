/**
 * @file 生成子元素html
 * @author errorrik(errorrik@gmail.com)
 */

var escapeHTML = require('../runtime/escape-html');
var htmlBufferPush = require('../runtime/html-buffer-push');
var each = require('../util/each');
var createNode = require('./create-node');
var nodeEvalExpr = require('./node-eval-expr');

/**
 * 生成子元素html
 *
 * @param {Element} element 元素
 * @param {Object} buf html串存储对象
 */
function genElementChildrenHTML(element, buf) {
    if (element.tagName === 'textarea') {
        var valueProp = element.props.get('value');
        if (valueProp) {
            htmlBufferPush(buf, escapeHTML(nodeEvalExpr(element, valueProp.expr)));
        }
    }
    else {
        var htmlDirective = element.aNode.directives.get('html');

        if (htmlDirective) {
            htmlBufferPush(buf, nodeEvalExpr(element, htmlDirective.value));
        }
        else {
            each(element.aNode.children, function (aNodeChild) {
                var child = createNode(aNodeChild, element);
                element.children.push(child);
                child._attachHTML(buf);
            });
        }
    }
}

exports = module.exports = genElementChildrenHTML;
