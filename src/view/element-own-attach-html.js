/**
 * @file attach 元素的 HTML
 * @author errorrik(errorrik@gmail.com)
 */

var htmlBufferPush = require('../runtime/html-buffer-push');
var htmlBufferTagStart = require('../runtime/html-buffer-tag-start');
var escapeHTML = require('../runtime/escape-html');
var evalExpr = require('../runtime/eval-expr');
var autoCloseTags = require('../browser/auto-close-tags');
var getANodeProp = require('./get-a-node-prop');
var NodeType = require('./node-type');
var handleProp = require('./handle-prop');
var genElementChildrenHTML = require('./gen-element-children-html');
var attachings = require('./attachings');
var LifeCycle = require('./life-cycle');
var boolAttrs = require('../browser/bool-attrs');



/**
 * attach 元素的 HTML
 *
 * @param {Object} buf html串存储对象
 */
function elementOwnAttachHTML(buf) {
    this.lifeCycle = LifeCycle.painting;
    var tagName = this.tagName;

    // tag start
    if (!tagName) {
        return;
    }

    var elementIsComponent = this.nodeType === NodeType.CMPT;
    htmlBufferPush(buf, '<' + tagName + this.aNode.hotspot.staticAttr);

    var props = this.aNode.hotspot.dynamicProps;
    for (var i = 0, l = props.length; i < l; i++) {
        var prop = props[i];
        if (!prop.id) {
            var value = elementIsComponent
                ? evalExpr(prop.expr, this.data, this)
                : evalExpr(prop.expr, this.scope, this.owner, 1);

            if (prop.x && !boolAttrs[prop.name]) {
                value = escapeHTML(value);
            }

            htmlBufferPush(buf, handleProp.attr(this, prop.name, value) || '');
        }
    }

    var id = this._getElId();
    htmlBufferPush(buf, ' id="' + id + '"' + '>');
    if (!autoCloseTags[tagName]) {
        htmlBufferTagStart(buf, id);
    }

    // gen children
    genElementChildrenHTML(this, buf);

    // tag close
    if (!autoCloseTags[tagName]) {
        htmlBufferPush(buf, '</' + tagName + '>');
    }

    attachings.add(this);
}

exports = module.exports = elementOwnAttachHTML;
