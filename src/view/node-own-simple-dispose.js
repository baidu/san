/**
 * @file 简单执行销毁节点的行为
 * @author errorrik(errorrik@gmail.com)
 */

var removeEl = require('../browser/remove-el');
var nodeDispose = require('./node-dispose');
var elementDisposeChildren = require('./element-dispose-children');

/**
 * 简单执行销毁节点的行为
 *
 * @param {boolean} dontDetach 是否不要将节点移除
 */
function nodeOwnSimpleDispose(dontDetach) {
    elementDisposeChildren(this, dontDetach);

    if (!dontDetach) {
        removeEl(this._getEl());
    }

    nodeDispose(this);
}

exports = module.exports = nodeOwnSimpleDispose;
