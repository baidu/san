/**
 * @file 销毁元素节点
 * @author errorrik(errorrik@gmail.com)
 */

var elementDisposeChildren = require('./element-dispose-children');
var nodeDispose = require('./node-dispose');
var un = require('../browser/un');

/**
 * 销毁元素节点
 *
 * @param {Object} element 要销毁的元素节点
 * @param {boolean} dontDetach 是否不要将节点从DOM移除
 */
function elementDispose(element, dontDetach) {
    elementDisposeChildren(element, true);

    /* eslint-disable guard-for-in */
    // el 事件解绑
    for (var key in element._elFns) {
        var nameListeners = element._elFns[key];
        var len = nameListeners && nameListeners.length;

        while (len--) {
            un(element._getEl(), key, nameListeners[len]);
        }
    }
    element._elFns = null;
    /* eslint-enable guard-for-in */


    if (!dontDetach || !element.parent) {
        element.detach();
    }
    else if (element._toPhase) {
        element._toPhase('detached');
    }

    element.props = null;
    element.dynamicProps = null;
    element.binds = null;
    element._propVals = null;

    nodeDispose(element);
}


exports = module.exports = elementDispose;
