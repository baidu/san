/**
 * @file 序列化一个ANode
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');
var autoCloseTags = require('../browser/auto-close-tags');


// #[begin] ssr
/**
 * 序列化一个ANode
 *
 * @param {ANode} aNode aNode对象
 * @return {string}
 */
function serializeANode(aNode) {
    if (aNode.isText) {
        return aNode.text;
    }

    var tagName = aNode.tagName;

    // start tag
    var str = '<' + tagName;

    // for directives
    var hasElse;
    aNode.directives.each(function (directive) {
        if (directive.name === 'else' || directive.name === 'if' && directive.isElse) {
            if (!hasElse) {
                str += ' s-else';
            }
            hasElse = 1;

            return;
        }

        str += ' s-' + directive.name + '="' + directive.raw + '"';
    });

    // for events
    each(aNode.events, function (event) {
        str += ' on-' + event.name + '="' + event.expr.raw + '"';
    });

    // for props
    aNode.props.each(function (prop) {
        str += ' ' + prop.name + '="' + prop.raw + '"';
    });

    // for vars
    each(aNode.vars, function (varItem) {
        str += ' var-' + varItem.name + '="' + varItem.expr.raw + '"';
    });

    if (autoCloseTags[tagName]) {
        str += ' />';
    }
    else {
        str += '>';

        // for children
        each(aNode.children, function (child) {
            str += serializeANode(child);
        });

        // close tag
        str += '</' + tagName + '>';
    }

    if (aNode.directives.get('if')) {
        each(aNode.elses, function (elseANode) {
            str += serializeANode(elseANode);
        });
    }

    return str;
}
// #[end]

exports = module.exports = serializeANode;
