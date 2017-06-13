/**
 * @file data types
 * @author leon <ludafa@outlook.com>
 */

var bind = require('./bind');
var empty = require('./empty');
var extend = require('./extend');
var ANONYMOUS_CLASS_NAME = '<<anonymous>>';
var DATA_TYPES_SECRET = require('./data-types-secret');

function getDataType(obj) {
    return Object.prototype.toString
        .call(obj)
        .slice(8, -1)
        .toLowerCase();
}

function createChainableChecker(validate) {

    var checkType = empty;

    // 只在 error 功能启用时才有实际上的 dataTypes 检测
    // #[begin] error
    checkType = function (isRequired, data, dataName, componentName, fullDataName, secret) {

        var dataValue = data[dataName];
        var dataType = getDataType(dataValue);

        componentName = componentName || ANONYMOUS_CLASS_NAME;

        if (secret !== DATA_TYPES_SECRET) {
            throw new Error(''
                + 'Calling DataTypes validators directly is not supported. '
                + 'Use `san.checkDataTypes` to call them.'
            );
        }

        if (dataValue == null) {
            return isRequired
                ? new Error(''
                    + 'The `' + dataName + '` '
                    + 'is marked as required in `' + componentName + '`, '
                    + 'but its value is ' + dataType
                )
                : null;
        }

        return validate(data, dataName, componentName, fullDataName, secret);

    };
    // #[end]

    var chainedChecker = bind(checkType, null, false);

    chainedChecker.isRequired = bind(checkType, null, true);

    return chainedChecker;

}

function createPrimaryTypeChecker(type) {

    return createChainableChecker(function (data, dataName, componentName, fullDataName, secret) {

        var dataValue = data[dataName];
        var dataType = getDataType(dataValue);

        if (dataType !== type) {
            return new Error(''
                + 'Invalid ' + componentName + ' data `' + fullDataName + '` of type'
                + '(' + dataType + ' supplied to ' + componentName + ', '
                + 'expected ' + type + ')'
            );
        }

    });

}

function createArrayOfChecker(arrayItemChecker) {

    return createChainableChecker(function (data, dataName, componentName, fullDataName, secret) {

        if (typeof arrayItemChecker !== 'function') {
            return new Error(''
                + 'Data `' + dataName + '` of `' + componentName + '` has invalid '
                + 'DataType notation inside `arrayOf`, expected `function`'
            );
        }

        var dataValue = data[dataName];
        var dataType = getDataType(dataValue);

        if (dataType !== 'array') {
            return new Error(''
                + 'Invalid ' + componentName + ' data `' + fullDataName + '` of type'
                + '(' + dataType + ' supplied to ' + componentName + ', '
                + 'expected array)'
            );
        }

        for (var i = 0, len = dataValue.length; i < len; i++) {
            var itemError = arrayItemChecker(
                dataValue,
                i,
                componentName,
                fullDataName + '[' + i + ']',
                secret
            );

            if (itemError instanceof Error) {
                return itemError;
            }
        }

        return null;

    });

}

function createInstanceChecker(expectedClass) {

    return createChainableChecker(function (data, dataName, componentName, fullDataName, secret) {

        var dataValue = data[dataName];

        if (dataValue instanceof expectedClass) {
            return null;
        }

        var dataValueClassName = dataValue.constructor && dataValue.constructor.name
            ? dataValue.constructor.name
            : ANONYMOUS_CLASS_NAME;

        var expectedClassName = expectedClass.name || ANONYMOUS_CLASS_NAME;

        return new Error(''
            + 'Invalid ' + componentName + ' data `' + fullDataName + '` of type'
            + '(' + dataValueClassName + ' supplied to ' + componentName + ', '
            + 'expected instance of ' + expectedClassName + ')'
        );


    });

}

function createShapeChecker(shapeTypes) {

    return createChainableChecker(function (data, dataName, componentName, fullDataName, secret) {

        if (getDataType(shapeTypes) !== 'object') {
            return new Error(''
                + 'Data `' + fullDataName + '` of `' + componentName + '` has invalid '
                + 'DataType notation inside `shape`, expected `object`'
            );
        }

        var dataValue = data[dataName];
        var dataType = getDataType(dataValue);

        if (dataType !== 'object') {
            return new Error(''
                + 'Invalid ' + componentName + ' data `' + fullDataName + '` of type'
                + '(' + dataType + ' supplied to ' + componentName + ', '
                + 'expected object)'
            );
        }

        for (var shapeKeyName in shapeTypes) {
            if (shapeTypes.hasOwnProperty(shapeKeyName)) {
                var checker = shapeTypes[shapeKeyName];
                if (typeof checker !== 'function') {
                    continue;
                }
                var error = checker(
                    dataValue,
                    shapeKeyName,
                    componentName,
                    fullDataName + '.' + shapeKeyName,
                    secret
                );
                if (error instanceof Error) {
                    return error;
                }
            }
        }

        return null;

    });

}

function createOneOfChecker(expectedEnumValues) {

    return createChainableChecker(function (data, dataName, componentName, fullDataName) {

        if (getDataType(expectedEnumValues) !== 'array') {
            return new Error(''
                + 'Data `' + fullDataName + '` of `' + componentName + '` has invalid '
                + 'DataType notation inside `oneOf`, array is expected.'
            );
        }

        var dataValue = data[dataName];

        for (var i = 0, len = expectedEnumValues.length; i < len; i++) {
            if (dataValue === expectedEnumValues[i]) {
                return null;
            }
        }

        return new Error(''
            + 'Invalid ' + componentName + ' data `' + fullDataName + '` of value'
            + '(`' + dataValue + '` supplied to ' + componentName + ', '
            + 'expected one of ' + expectedEnumValues.join(',') + ')'
        );

    });

}

function createEnumOfTypeChecker(expectedEnumOfTypeValues) {

    return createChainableChecker(function (data, dataName, componentName, fullDataName, secret) {

        if (getDataType(expectedEnumOfTypeValues) !== 'array') {
            return new Error(''
                + 'Data `' + dataName + '` of `' + componentName + '` has invalid '
                + 'DataType notation inside `oneOf`, array is expected.'
            );
        }

        var dataValue = data[dataName];

        for (var i = 0, len = expectedEnumOfTypeValues.length; i < len; i++) {

            var checker = expectedEnumOfTypeValues[i];

            if (typeof checker !== 'function') {
                continue;
            }

            if (!checker(data, dataName, componentName, fullDataName, secret)) {
                return null;
            }

        }

        return new Error(''
            + 'Invalid ' + componentName + ' data `' + dataName + '` of value'
            + '(`' + dataValue + '` supplied to ' + componentName + ')'
        );

    });

}

function createObjectOfChecker(typeChecker) {

    return createChainableChecker(function (data, dataName, componentName, fullDataName, secret) {

        if (typeof typeChecker !== 'function') {
            return new Error(''
                + 'Data `' + dataName + '` of `' + componentName + '` has invalid '
                + 'DataType notation inside `objectOf`, expected function'
            );
        }

        var dataValue = data[dataName];
        var dataType = getDataType(dataValue);

        if (dataType !== 'object') {
            return new Error(''
                + 'Invalid ' + componentName + ' data `' + dataName + '` of type'
                + '(' + dataType + ' supplied to ' + componentName + ', '
                + 'expected object)'
            );
        }

        for (var dataKeyName in dataValue) {

            if (dataValue.hasOwnProperty(dataKeyName)) {

                var error = typeChecker(
                    dataValue,
                    dataKeyName,
                    componentName,
                    fullDataName + '.' + dataKeyName,
                    secret
                );

                if (error instanceof Error) {
                    return error;
                }

            }

        }

        return null;


    });

}

function createExactChecker(shapeTypes) {

    return createChainableChecker(function (data, dataName, componentName, fullDataName, secret) {

        if (getDataType(shapeTypes) !== 'object') {
            return new Error(''
                + 'Data `' + dataName + '` of `' + componentName + '` has invalid '
                + 'DataType notation inside `exact`'
            );
        }

        var dataValue = data[dataName];
        var dataValueType = getDataType(dataValue);

        if (dataValueType !== 'object') {
            return new Error(''
                + 'Invalid data `' + fullDataName + '` of type `' + dataValueType + '`'
                + '(supplied to ' + componentName + ', expected `object`)'
            );
        }

        var allKeys = {};

        // 先合入 shapeTypes
        extend(allKeys, shapeTypes);
        // 再合入 dataValue
        extend(allKeys, dataValue);
        // 保证 allKeys 的类型正确

        for (var key in allKeys) {
            if (allKeys.hasOwnProperty(key)) {
                var checker = shapeTypes[key];

                // dataValue 中有一个多余的数据项
                if (!checker) {
                    return new Error(''
                        + 'Invalid data `' + fullDataName + '` key `' + key + '` '
                        + 'supplied to `' + componentName + '`. '
                        + '(`' + key + '` is not defined in `DataTypes.exact`)'
                    );
                }

                if (!(key in dataValue)) {
                    return new Error(''
                        + 'Invalid data `' + fullDataName + '` key `' + key + '` '
                        + 'supplied to `' + componentName + '`. '
                        + '(`' + key + '` is marked `required` in `DataTypes.exact`)'
                    );
                }

                var error = checker(
                    dataValue,
                    key,
                    componentName,
                    fullDataName + '.' + key,
                    secret
                );

                if (error instanceof Error) {
                    return error;
                }

            }
        }

        return null;

    });

}

var PRODUCTION_PRIMARY_TYPE_CHECKER = createChainableChecker(empty);
var PRODUCTION_COMPOUND_TYPE_CHECKER = createChainableChecker;

/* eslint-disable fecs-valid-var-jsdoc */
var DataTypes = {
    array: PRODUCTION_PRIMARY_TYPE_CHECKER,
    object: PRODUCTION_PRIMARY_TYPE_CHECKER,
    func: PRODUCTION_PRIMARY_TYPE_CHECKER,
    string: PRODUCTION_PRIMARY_TYPE_CHECKER,
    number: PRODUCTION_PRIMARY_TYPE_CHECKER,
    bool: PRODUCTION_PRIMARY_TYPE_CHECKER,
    symbol: PRODUCTION_PRIMARY_TYPE_CHECKER,
    any: PRODUCTION_COMPOUND_TYPE_CHECKER,
    arrayOf: PRODUCTION_COMPOUND_TYPE_CHECKER,
    instanceOf: PRODUCTION_COMPOUND_TYPE_CHECKER,
    shape: PRODUCTION_COMPOUND_TYPE_CHECKER,
    oneOf: PRODUCTION_COMPOUND_TYPE_CHECKER,
    oneOfType: PRODUCTION_COMPOUND_TYPE_CHECKER,
    objectOf: PRODUCTION_COMPOUND_TYPE_CHECKER,
    exact: PRODUCTION_COMPOUND_TYPE_CHECKER
};

// #[begin] error
DataTypes = {

    any: createChainableChecker(empty),

    // 类型检测
    array: createPrimaryTypeChecker('array'),
    object: createPrimaryTypeChecker('object'),
    func: createPrimaryTypeChecker('function'),
    string: createPrimaryTypeChecker('string'),
    number: createPrimaryTypeChecker('number'),
    bool: createPrimaryTypeChecker('boolean'),
    symbol: createPrimaryTypeChecker('symbol'),

    // 复合类型检测
    arrayOf: createArrayOfChecker,
    instanceOf: createInstanceChecker,
    shape: createShapeChecker,
    oneOf: createOneOfChecker,
    oneOfType: createEnumOfTypeChecker,
    objectOf: createObjectOfChecker,
    exact: createExactChecker

};
/* eslint-enable fecs-valid-var-jsdoc */
// #[end]


module.exports = DataTypes;
