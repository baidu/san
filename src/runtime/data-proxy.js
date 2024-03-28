/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 数据代理
 */

var ExprType = require('../parser/expr-type');


function dataProxy(data) {
    var proxies = {items: {}};
    return getPropProxy(data);

    function getPropProxy(data, target, basePaths, prop) {
        var proxyWrap = proxies;
        var paths;

        if (target) {
            for (var i = 0; i < basePaths.length; i++) {
                proxyWrap = proxyWrap.items[basePaths[i].value];
            }

            if (!proxyWrap.items[prop]) {
                proxyWrap.items[prop] = {items: {}};
            }

            proxyWrap = proxyWrap.items[prop];

            if (proxyWrap.proxy != null) {
                return proxyWrap.proxy;
            }

            paths = basePaths.concat({type: ExprType.STRING, value: prop});
        }
        else {
            target = data.raw;
            paths = [];

            data.listen(function (e) {
                proxies.items[e.expr.paths[0].value] = null;
            });
        }

        var handlers = {
            set: function (obj, prop, value) {
                var expr = {
                    type: ExprType.ACCESSOR,
                    paths: paths.concat({type: ExprType.STRING, value: prop})
                };
                data.set(expr, value);
            },

            get: target instanceof Array
                ? function (arr, prop) {
                    switch (prop) {
                        case 'push':
                            return function () {
                                var arrLen = arr.length;
                                var argLen = arguments.length;

                                data.splice(
                                    {type: ExprType.ACCESSOR, paths: paths}, 
                                    argLen === 1
                                        ? [arrLen, 0, arguments[0]]
                                        : [arrLen, 0].concat(Array.prototype.slice.call(arguments))
                                );
            
                                return arrLen + argLen;
                            };

                        case 'pop':
                            return function () {
                                var arrLen = arr.length;    
                                if (arrLen) {
                                    return data.splice(
                                        {type: ExprType.ACCESSOR, paths: paths}, 
                                        [arrLen - 1, 1]
                                    )[0];
                                }
                            };

                        case 'shift':
                            return function () {
                                return data.splice(
                                    {type: ExprType.ACCESSOR, paths: paths}, 
                                    [0, 1]
                                )[0];
                            };

                        case 'unshift':
                            return function () {
                                var arrLen = arr.length;
                                var argLen = arguments.length;

                                data.splice(
                                    {type: ExprType.ACCESSOR, paths: paths}, 
                                    argLen === 1
                                        ? [0, 0, arguments[0]]
                                        : [0, 0].concat(Array.prototype.slice.call(arguments))
                                );
            
                                return arrLen + argLen;
                            };

                        case 'splice':
                            return function () {
                                return data.splice(
                                    {type: ExprType.ACCESSOR, paths: paths}, 
                                    Array.prototype.slice.call(arguments)
                                );
                            };

                        // case 'remove':
                        //     return function (value) {
                        //         var len = arr.length;
                        //         while (len--) {
                        //             if (arr[len] === value) {
                        //                 data.splice(
                        //                     {type: ExprType.ACCESSOR, paths: paths}, 
                        //                     [len, 1]
                        //                 );
                        //                 break;
                        //             }
                        //         }
                        //     };

                        // case 'removeAt':
                        //     return function (index) {
                        //         data.splice(
                        //             {type: ExprType.ACCESSOR, paths: paths}, 
                        //             [index, 1]
                        //         );
                        //     };

                        case 'length':
                            return arr.length;
                    }

                    var value = arr[prop];
                    if (value && typeof value === 'object') {
                        return getPropProxy(data, value, paths, prop);
                    }

                    return value;
                }
                : function (obj, prop) {
                    var value = obj[prop];
                    if (value && typeof value === 'object') {
                        return getPropProxy(data, value, paths, prop);
                    }

                    return value;
                }
        };

        proxyWrap.proxy = new Proxy(target, handlers);
        return proxyWrap.proxy;
    }
}

exports = module.exports = dataProxy;
