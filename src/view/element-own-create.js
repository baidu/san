/**
 * @file 创建节点对应的 HTMLElement 主元素
 * @author errorrik(errorrik@gmail.com)
 */

var elementCreate = require('./element-create');

/**
 * 创建节点对应的 HTMLElement 主元素
 */
function elementOwnCreate() {
    if (!this.lifeCycle.is('created')) {
        elementCreate(this);
        this._toPhase('created');
    }
}

exports = module.exports = elementOwnCreate;
