/**
 * @file 生成元素标签起始的html
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

var BOOL_ATTRIBUTES = {};
each(
    'checked,readonly,selected,multiple,disabled'.split(','),
    function (key) {
        BOOL_ATTRIBUTES[key] = 1;
    }
);

/**
 * 生成元素标签起始的html
 *
 * @param {Element} element 元素
 * @param {Object} buf html串存储对象
 */
function genElementStartHTML(element, buf) {
    var tagName = element.tagName;
    if (!tagName) {
        return;
    }

    htmlBufferPush(buf, '<' + tagName);

    each(element.props, function (prop) {
        var attr = prop.attr;
        var value;

        if (!attr) {
            value = isComponent(element)
                ? evalExpr(prop.expr, element.data, element)
                : nodeEvalExpr(element, prop.expr, 1);

            if (!BOOL_ATTRIBUTES[prop.name] && prop.x) {
                value = escapeHTML(value);
            }

            attr = getPropHandler(element, prop.name).attr(element, prop.name, value);
        }

        htmlBufferPush(buf, attr || '');
    });

    var idProp = getPropAndIndex(element, 'id');
    if (idProp) {
        element._elId = isComponent(element)
            ? evalExpr(idProp.expr, element.data, element)
            : nodeEvalExpr(element, idProp.expr, 1);
    }

    var id = element._elId || element.id;
    htmlBufferPush(buf, ' id="' + id + '"' + '>');
    if (!autoCloseTags[tagName]) {
        htmlBufferTagStart(buf, id);
    }
}

exports = module.exports = genElementStartHTML;
