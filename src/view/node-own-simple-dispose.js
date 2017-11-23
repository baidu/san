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
function nodeOwnSimpleDispose(options) {
    elementDisposeChildren(this, options);

    if (!options || !options.dontDetach) {
        removeEl(this._getEl());
    }

    nodeDispose(this);
    if (this._ondisposed) {
        this._ondisposed();
    }
}

exports = module.exports = nodeOwnSimpleDispose;
