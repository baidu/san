/**
 * @file attach 元素的 HTML
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');
var evalExpr = require('../runtime/eval-expr');
var htmlBufferPush = require('../runtime/html-buffer-push');
var htmlBufferTagStart = require('../runtime/html-buffer-tag-start');
var escapeHTML = require('../runtime/escape-html');
var evalExpr = require('../runtime/eval-expr');
var autoCloseTags = require('../browser/auto-close-tags');
var getANodeProp = require('./get-a-node-prop');
var isComponent = require('./is-component');
var handleProp = require('./handle-prop');
var genElementChildrenHTML = require('./gen-element-children-html');
var attachings = require('./attachings');
var LifeCycle = require('./life-cycle');

var BOOL_ATTRIBUTES = {};
each(
    'checked,readonly,selected,multiple,disabled'.split(','),
    function (key) {
        BOOL_ATTRIBUTES[key] = 1;
    }
);

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

    var elementIsComponent = isComponent(this);
    htmlBufferPush(buf, '<' + this.tagName + this.aNode.hotspot.staticAttr);

    var props = this.aNode.hotspot.dynamicProps;
    for (var i = 0, l = props.length; i < l; i++) {
        var prop = props[i];
        var value = elementIsComponent
            ? evalExpr(prop.expr, this.data, this)
            : evalExpr(prop.expr, this.scope, this.owner, 1);

        if (prop.x && !BOOL_ATTRIBUTES[prop.name]) {
            value = escapeHTML(value);
        }

        htmlBufferPush(buf, handleProp.attr(this, prop.name, value) || '');
    }

    var idProp = getANodeProp(this.aNode, 'id');
    if (idProp) {
        this._elId = elementIsComponent
            ? evalExpr(idProp.expr, this.data, this)
            : evalExpr(idProp.expr, this.scope, this.owner, 1);
    }

    var id = this._elId || this.id;
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
