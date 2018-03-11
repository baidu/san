/**
 * @file attach 元素的 HTML
 * @author errorrik(errorrik@gmail.com)
 */

var evalExpr = require('../runtime/eval-expr');
var htmlBufferPush = require('../runtime/html-buffer-push');
var htmlBufferTagStart = require('../runtime/html-buffer-tag-start');
var escapeHTML = require('../runtime/escape-html');
var autoCloseTags = require('../browser/auto-close-tags');
var each = require('../util/each');
var getPropAndIndex = require('../util/get-prop-and-index');
var isComponent = require('./is-component');
var getPropHandler = require('./get-prop-handler');
var nodeEvalExpr = require('./node-eval-expr');
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
    htmlBufferPush(buf, '<' + tagName);

    for (var i = 0, l = this.props.length; i < l; i++) {
        var prop = this.props[i];

        var attr = prop.attr;
        var value;

        if (!attr) {
            value = elementIsComponent
                ? evalExpr(prop.expr, this.data, this)
                : nodeEvalExpr(this, prop.expr, 1);

            if (!BOOL_ATTRIBUTES[prop.name] && prop.x) {
                value = escapeHTML(value);
            }

            attr = handleProp.attr(this, prop.name, value);
        }

        htmlBufferPush(buf, attr || '');
    }

    var idProp = getPropAndIndex(this, 'id');
    if (idProp) {
        this._elId = elementIsComponent
            ? evalExpr(idProp.expr, this.data, this)
            : nodeEvalExpr(this, idProp.expr, 1);
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
