/**
 * @file 获取对象的props数组中符合name为给予值的项，并建立快捷索引便于多次获取
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('./each');

/**
 * 获取对象的props数组中符合name为给予值的项，并建立快捷索引便于多次获取
 *
 * @param {Object} source 获取源，包含props的对象
 * @param {string} name name属性匹配串
 * @return {Object}
 */
function getPropAndIndex(source, name) {
    if (!source._props) {
        source._props = {};
        each(source.props, function (value, index) {
            source._props[value.name] = index;
        });
    }

    var index = source._props[name];
    if (index != null) {
        return source.props[index];
    }
}

exports = module.exports = getPropAndIndex;
