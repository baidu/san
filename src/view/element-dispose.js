/**
 * @file 销毁元素节点
 * @author errorrik(errorrik@gmail.com)
 */


var un = require('../browser/un');
var removeEl = require('../browser/remove-el');
var elementDisposeChildren = require('./element-dispose-children');
var nodeDispose = require('./node-dispose');

/**
 * 销毁元素节点
 *
 * @param {Object} element 要销毁的元素节点
 * @param {Object=} options 销毁行为的参数
 */
function elementDispose(element, options) {
    elementDisposeChildren(element, {dontDetach: true, noTransition: true});

    /* eslint-disable guard-for-in */
    // el 事件解绑
    for (var key in element._elFns) {
        var nameListeners = element._elFns[key];
        var len = nameListeners && nameListeners.length;

        while (len--) {
            var fn = nameListeners[len];
            un(element._getEl(), key, fn[0], fn[1]);
        }
    }
    element._elFns = null;
    /* eslint-enable guard-for-in */


    if (!options || !options.dontDetach || !element.parent) {
        removeEl(element._getEl());
    }

    if (element._toPhase) {
        element._toPhase('detached');
    }

    nodeDispose(element);
}


exports = module.exports = elementDispose;
