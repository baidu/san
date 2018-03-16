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
 * @param {Object=} options dispose行为参数
 */
function nodeOwnSimpleDispose(noDetach) {
    elementDisposeChildren(this, noDetach, 1);

    if (!noDetach) {
        removeEl(this._getEl());
    }

    nodeDispose(this);
}

exports = module.exports = nodeOwnSimpleDispose;
