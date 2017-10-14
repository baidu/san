/**
 * @file 初始化 element 节点的必须属性
 * @author errorrik(errorrik@gmail.com)
 */

var LifeCycle = require('./life-cycle');
var IndexedList = require('../util/indexed-list');

/**
 * 初始化 element 节点的必须属性
 *
 * @param {Object} element 节点对象
 */
function elementInitProps(element) {
    element.lifeCycle = new LifeCycle();
    element.childs = [];
    element.slotChilds = [];
    element._elFns = {};
    element._propVals = {};
    element.dynamicProps = new IndexedList();
}

exports = module.exports = elementInitProps;
