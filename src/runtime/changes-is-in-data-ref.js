var each = require('../util/each');

/**
 *
 *
 * @param {Array} changes
 * @param {Object} dataRef
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
