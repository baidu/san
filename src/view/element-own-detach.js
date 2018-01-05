/**
 * @file 将元素从页面上移除
 * @author errorrik(errorrik@gmail.com)
 */

var removeEl = require('../browser/remove-el');
var elementLeave = require('./element-leave');

/**
 * 将元素从页面上移除
 */
function elementOwnDetach() {
    var me = this;
    me._doneLeave = me._doneLeave || function () {
        if (me.lifeCycle.attached) {
            removeEl(me._getEl());
            me._toPhase('detached');
        }
    };

    elementLeave(this);
}



exports = module.exports = elementOwnDetach;
