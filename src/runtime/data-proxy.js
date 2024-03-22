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

    function getPropProxy(data, basePaths, prop) {
        var proxyWrap = proxies;

        if (prop) {
            for (var i = 0; i < basePaths.length; i++) {
                proxyWrap = proxyWrap.items[basePaths[i].value];
            }

            if (!proxyWrap.items[prop]) {
                proxyWrap.items[prop] = {items: {}};
            }

            proxyWrap = proxyWrap.items[prop];
        }
        else {
            data.listen(function (e) {
                proxies.items[e.expr.paths[0].value] = null;
            });
        }


        if (proxyWrap.proxy != null) {
            return proxyWrap.proxy;
        }

        var paths = basePaths 
            ? basePaths.concat({type: ExprType.STRING, value: prop})
            : [];

        var obj = basePaths
            ? data.get({type: ExprType.ACCESSOR, paths: paths})
            : data.raw;

        if (obj != null && typeof obj === 'object') {
            var handlers = {
                set: function (obj, prop, value) {
                    var expr = {
                        type: ExprType.ACCESSOR,
                        paths: paths.concat({type: ExprType.STRING, value: prop})
                    };
                    data.set(expr, value);
                }
            };

            handlers.get = obj instanceof Array
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

                    return getPropProxy(data, paths, prop);
                }
                : function (obj, prop) {
                    return getPropProxy(data, paths, prop);
                };

            proxyWrap.proxy = new Proxy(obj, handlers);
            return proxyWrap.proxy;
        }
        else {
            proxyWrap.proxy = obj;
            return obj;
        }

    }
}

exports = module.exports = dataProxy;
