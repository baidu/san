/**
 * 将元素从页面上移除
 */
function elementOwnDetach() {
    if (this.lifeCycle.is('attached')) {
        removeEl(this._getEl());
        this._toPhase('detached');
    }
}

exports = module.exports = elementOwnDetach;
