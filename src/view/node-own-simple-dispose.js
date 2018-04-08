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
 * @param {boolean=} noDetach 是否不要把节点从dom移除
 */
function nodeOwnSimpleDispose(noDetach) {
    elementDisposeChildren(this, noDetach, 1);

    if (!noDetach) {
        removeEl(this.el);
    }

    nodeDispose(this);
}

exports = module.exports = nodeOwnSimpleDispose;
