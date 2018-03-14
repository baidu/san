/**
 * @file attaching 的 element 和 component 池
         完成 html fill 后执行 attached 操作，进行事件绑定等后续行为
 * @author errorrik(errorrik@gmail.com)
 */


/**
 * attaching 的 element 和 component 集合
 *
 * @inner
 * @type {Array}
 */
var attachingNodes = [];

/**
 * attaching 操作对象
 *
 * @type {Object}
 */
var attachings = {

    /**
     * 添加 attaching 的 element 或 component
     *
     * @param {Object|Component} node attaching的node
     */
    add: function (node) {
        attachingNodes.push(node);
    },

    /**
     * 执行 attaching 完成行为
     */
    done: function () {
        var nodes = attachingNodes.slice(0);
        attachingNodes = [];

        for (var i = 0, l = nodes.length; i < l; i++) {
            nodes[i]._attached();
        }
    }
};

exports = module.exports = attachings;
