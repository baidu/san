/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 清除多余的有副作用以及异常的 changes
 */

/**
 * 清除多余的有副作用以及异常的 changes
 *
 * @param {Array} changes
 * @return {Array}
 */
function removeExcrescentChanges(changes) {
    var changesLen = changes.length;
    if (changesLen <= 1) {
        return changes;
    }
    
    var changesIndex = {};
    var newChanges = [];

    for (var i = 0; i < changesLen; i++) {
        var change = changes[i];
        var changeExprPaths = change.expr.paths;
        var changeExprPathsLen = changeExprPaths.length;
        var changeIndexItem = changesIndex;

        var j = 0;
        while (j < changeExprPathsLen) {
            var pathValue = changeExprPaths[j].value;
            if (changeIndexItem && changeIndexItem[pathValue] === true) {
                break;
            }

            if (change.type === DataChangeType.SET) {
                if (j === changeExprPathsLen - 1) {
                    changeIndexItem[pathValue] = true;
                }
                else {
                    changeIndexItem = changeIndexItem[pathValue] = changeIndexItem[pathValue] || {};
                }
            }
            else {
                changeIndexItem = changeIndexItem && changeIndexItem[pathValue];
            }
            
            j++;
        }

        if (j === changeExprPathsLen) {
            newChanges.push(change);
        }
    }

    return newChanges;
}

exports = module.exports = removeExcrescentChanges;