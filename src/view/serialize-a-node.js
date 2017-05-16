/**
 * @file 序列化一个ANode
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');
var escapeHTML = require('../runtime/escape-html');
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
                str += ' san-else';
            }
            hasElse = 1;

            return;
        }

        str += ' san-' + directive.name + '="' + escapeHTML(directive.raw) + '"';
    });

    // for events
    each(aNode.events, function (event) {
        str += ' on-' + event.name + '="' + escapeHTML(event.raw) + '"';
    });

    // for props
    aNode.props.each(function (prop) {
        str += ' ' + prop.name + '="' + escapeHTML(prop.raw) + '"';
    });

    if (autoCloseTags[tagName]) {
        str += ' />';
    }
    else {
        str += '>';

        // for childs
        each(aNode.childs, function (child) {
            str += serializeANode(child);
        });

        // close tag
        str += '</' + tagName + '>';
    }

    return str;
}
// #[end]

exports = module.exports = serializeANode;
