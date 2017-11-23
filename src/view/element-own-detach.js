/**
 * @file 将元素从页面上移除
 * @author errorrik(errorrik@gmail.com)
 */

var removeEl = require('../browser/remove-el');
var elementLeaveTo = require('./element-leave-to');

/**
 * 将元素从页面上移除
 */
function elementOwnDetach(options) {
    var me = this;
    me._doneLeave = me._doneLeave || function () {
        if (me.lifeCycle.attached) {
            removeEl(me._getEl());
            me._toPhase('detached');
        }
    };

    elementLeaveTo(this, options);
}



exports = module.exports = elementOwnDetach;
