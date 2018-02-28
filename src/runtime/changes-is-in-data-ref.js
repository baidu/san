/**
 * @file 判断变更数组是否影响到数据引用摘要
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');

/**
 * 判断变更数组是否影响到数据引用摘要
 *
 * @param {Array} changes 变更数组
 * @param {Object} dataRef 数据引用摘要
 * @return {boolean}
 */
function changesIsInDataRef(changes, dataRef) {
    var result;

    each(changes, function (change) {
        if (!change.overview) {
            var paths = change.expr.paths;
            change.overview = paths[0].value;

            if (paths.length > 1) {
                change.extOverview = paths[0].value + '.' + paths[1].value;
                change.wildOverview = paths[0].value + '.*';
            }
        }

        result = dataRef[change.overview]
            || change.wildOverview && dataRef[change.wildOverview]
            || change.extOverview && dataRef[change.extOverview];

        return !result;
    });

    return result;
}

exports = module.exports = changesIsInDataRef;
