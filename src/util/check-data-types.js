/**
 * @file 检查数据是否符合 data types
 * @author leon<ludafa@outlook.com>
 */


var DATA_TYPES_SECRET = require('./data-types-secret');
var loggedTypeFailures = {};
var warn = require('./warn');

/**
 * 校验 data 是否满足 data types 的格式
 *
 * @param  {Object} dataTypes     数据格式
 * @param  {Object} data          数据
 * @param  {string} componentName 组件名
 */
function checkDataTypes(dataTypes, data, componentName) {

    for (var dataTypeName in dataTypes) {

        if (dataTypes.hasOwnProperty(dataTypeName)) {

            var dataTypeChecker = dataTypes[dataTypeName];

            if (typeof dataTypeChecker !== 'function') {
                warn(''
                    + componentName + ':' + dataTypeName + ' is invalid; '
                    + 'it must be a function, usually from san.DataTypes'
                );
                continue;
            }

            var error = dataTypeChecker(
                data,
                dataTypeName,
                componentName,
                dataTypeName,
                DATA_TYPES_SECRET
            );

            if (
                error instanceof Error
                && !(error.message in loggedTypeFailures)
            ) {
                loggedTypeFailures[error.message] = true;
                warn('Failed data type: ' + error.message);
            }

        }
    }

}

module.exports = checkDataTypes;
