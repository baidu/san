
var elementDisposeChilds = require('./element-dispose-childs');
var nodeDispose = require('./node-dispose');

/**
 * 销毁释放元素的行为
 */
function elementDispose(element, dontDetach) {
    elementDisposeChilds(element, true);
    
    // el 事件解绑
    for (var key in element._elFns) {
        var nameListeners = element._elFns[key];
        var len = nameListeners && nameListeners.length;

        while (len--) {
            un(element._getEl(), key, nameListeners[len]);
        }
    }
    element._elFns = null;

    
    if (!dontDetach) {
        element.detach();
    }
    else if (element._toPhase) {
        element._toPhase('detached');
    }

    element.props = null;
    element.binds = null;
    element._propVals = null;

    // 这里不用挨个调用 dispose 了，因为 childs 释放链会调用的
    element.slotChilds = null;
}