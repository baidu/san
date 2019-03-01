/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 将元素从页面上移除
 */


/**
 * 将元素从页面上移除
 */
function elementOwnDetach() {
    var lifeCycle = this.lifeCycle;
    if (lifeCycle.leaving) {
        return;
    }

    if (this.disposeNoTransition) {
        this._doneLeave();
    }
    else {
        var transition = elementGetTransition(this);

        if (transition && transition.leave) {
            this._toPhase('leaving');
            var me = this;
            transition.leave(this.el, function () {
                me._doneLeave();
            });
        }
        else {
            this._doneLeave();
        }
    }
}


exports = module.exports = elementOwnDetach;
