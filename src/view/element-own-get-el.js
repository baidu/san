/**
 * @file 获取节点对应的主元素
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 获取节点对应的主元素
 *
 * @return {HTMLElement}
 */
function elementOwnGetEl() {
    if (!this.el) {
        this.el = document.getElementById(this._elId);
    }

    return this.el;
}

exports = module.exports = elementOwnGetEl;
