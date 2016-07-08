/**
 * ESL (Enterprise Standard Loader)
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file Browser端标准加载器，符合AMD规范
 * @author errorrik(errorrik@gmail.com)
 *         Firede(firede@firede.us)
 */

/* eslint-disable no-unused-vars */
/* jshint ignore:start */
var define;
var require;
var esl;
/* jshint ignore:end */
/* eslint-enable no-unused-vars */

/* eslint-disable guard-for-in */
/* eslint-env amd:false */

(function (global) {
    // "mod"开头的变量或函数为内部模块管理函数
    // 为提高压缩率，不使用function或object包装

    /**
     * 模块容器
     *
     * @inner
     * @type {Object}
     */
    var modModules = {};

    // 模块状态枚举量
    var MODULE_PRE_DEFINED = 1;
    var MODULE_ANALYZED = 2;
    var MODULE_PREPARED = 3;
    var MODULE_DEFINED = 4;

    /**
     * 自动定义的模块表
     *
     * 模块define factory是用到时才执行，但是以下几种情况需要自动马上执行：
     * 1. require([moduleId], callback)
     * 2. plugin module and plugin resource: require('plugin!resource')
     * 3. shim module
     *
     * @inner
     * @type {Object}
     */
    var modAutoDefineModules = {};

    /**
     * 标记模块自动进行定义
     *
     * @inner
     * @param {string} id 模块id
     */
    function modFlagAutoDefine(id) {
        if (!modIs(id, MODULE_DEFINED)) {
            modAutoDefineModules[id] = 1;
        }
    }

    /**
     * 内建module名称集合
     *
     * @inner
     * @type {Object}
     */
    var BUILDIN_MODULE = {
        require: globalRequire,
        exports: 1,
        module: 1
    };

    /**
     * 全局require函数
     *
     * @inner
     * @type {Function}
     */
    var actualGlobalRequire = createLocalRequire();

    // #begin-ignore
    /**
     * 超时提醒定时器
     *
     * @inner
     * @type {number}
     */
    var waitTimeout;
    // #end-ignore

    /**
     * require配置
     *
     * @inner
     * @type {Object}
     */
    var requireConf = {
        baseUrl    : './',
        paths      : {},
        config     : {},
        map        : {},
        packages   : [],
        shim       : {},
        // #begin-ignore
        waitSeconds: 0,
        // #end-ignore
        bundles    : {},
        urlArgs    : {}
    };

    /**
     * 加载模块
     *
     * @param {string|Array} requireId 模块id或模块id数组，
     * @param {Function=} callback 加载完成的回调函数
     * @return {*} requireId为string时返回模块暴露对象
     */
    function globalRequire(requireId, callback) {
        // #begin-ignore
        // #begin assertNotContainRelativeId
        // 确定require的模块id不包含相对id。用于global require，提前预防难以跟踪的错误出现
        var invalidIds = [];

        /**
         * 监测模块id是否relative id
         *
         * @inner
         * @param {string} id 模块id
         */
        function monitor(id) {
            if (id.indexOf('.') === 0) {
                invalidIds.push(id);
            }
        }

        if (typeof requireId === 'string') {
            monitor(requireId);
        }
        else {
            each(
                requireId,
                function (id) {
                    monitor(id);
                }
            );
        }

        // 包含相对id时，直接抛出错误
        if (invalidIds.length > 0) {
            throw new Error(
                '[REQUIRE_FATAL]Relative ID is not allowed in global require: '
                + invalidIds.join(', ')
            );
        }
        // #end assertNotContainRelativeId

        // 超时提醒
        var timeout = requireConf.waitSeconds;
        if (timeout && (requireId instanceof Array)) {
            if (waitTimeout) {
                clearTimeout(waitTimeout);
            }
            waitTimeout = setTimeout(waitTimeoutNotice, timeout * 1000);
        }
        // #end-ignore

        return actualGlobalRequire(requireId, callback);
    }

    /**
     * 版本号
     *
     * @type {string}
     */
    globalRequire.version = '2.1.4';

    /**
     * loader名称
     *
     * @type {string}
     */
    globalRequire.loader = 'esl';

    /**
     * 将模块标识转换成相对的url
     *
     * @param {string} id 模块标识
     * @return {string}
     */
    globalRequire.toUrl = actualGlobalRequire.toUrl;

    // #begin-ignore
    /**
     * 超时提醒函数
     *
     * @inner
     */
    function waitTimeoutNotice() {
        var hangModules = [];
        var missModules = [];
        var hangModulesMap = {};
        var missModulesMap = {};
        var visited = {};

        /**
         * 检查模块的加载错误
         *
         * @inner
         * @param {string} id 模块id
         * @param {boolean} hard 是否装载时依赖
         */
        function checkError(id, hard) {
            if (visited[id] || modIs(id, MODULE_DEFINED)) {
                return;
            }

            visited[id] = 1;
            var mod = modModules[id];
            if (!mod) {
                if (!missModulesMap[id]) {
                    missModulesMap[id] = 1;
                    missModules.push(id);
                }
            }
            else if (hard || !modIs(id, MODULE_PREPARED) || mod.hang) {
                if (!hangModulesMap[id]) {
                    hangModulesMap[id] = 1;
                    hangModules.push(id);
                }

                each(
                    mod.depMs,
                    function (dep) {
                        checkError(dep.absId, dep.hard);
                    }
                );
            }
        }

        for (var id in modAutoDefineModules) {
            checkError(id, 1);
        }

        if (hangModules.length || missModules.length) {
            throw new Error(
                '[MODULE_TIMEOUT]Hang('
                + (hangModules.join(', ') || 'none')
                + ') Miss('
                + (missModules.join(', ') || 'none')
                + ')'
            );
        }


    }
    // #end-ignore

    /**
     * 未预定义的模块集合
     * 主要存储匿名方式define的模块
     *
     * @inner
     * @type {Array}
     */
    var wait4PreDefine = [];

    /**
     * 完成模块预定义，此时处理的模块是匿名define的模块
     *
     * @inner
     * @param {string} currentId 匿名define的模块的id
     */
    function modCompletePreDefine(currentId) {
        // HACK: 这里在IE下有个性能陷阱，不能使用任何变量。
        //       否则貌似会形成变量引用和修改的读写锁，导致wait4PreDefine释放困难
        each(wait4PreDefine, function (mod) {
            modPreDefine(
                currentId,
                mod.deps,
                mod.factory
            );
        });

        wait4PreDefine.length = 0;
    }

    /**
     * 定义模块
     *
     * @param {string=} id 模块标识
     * @param {Array=} dependencies 依赖模块列表
     * @param {Function=} factory 创建模块的工厂方法
     */
    function globalDefine(id, dependencies, factory) {
        // define(factory)
        // define(dependencies, factory)
        // define(id, factory)
        // define(id, dependencies, factory)
        if (factory == null) {
            if (dependencies == null) {
                factory = id;
                id = null;
            }
            else {
                factory = dependencies;
                dependencies = null;
                if (id instanceof Array) {
                    dependencies = id;
                    id = null;
                }
            }
        }

        if (factory == null) {
            return;
        }

        var opera = window.opera;

        // IE下通过current script的data-require-id获取当前id
        if (
            !id
            && document.attachEvent
            && (!(opera && opera.toString() === '[object Opera]'))
        ) {
            var currentScript = getCurrentScript();
            id = currentScript && currentScript.getAttribute('data-require-id');
        }

        if (id) {
            modPreDefine(id, dependencies, factory);
        }
        else {
            // 纪录到共享变量中，在load或readystatechange中处理
            // 标准浏览器下，使用匿名define时，将进入这个分支
            wait4PreDefine[0] = {
                deps: dependencies,
                factory: factory
            };
        }
    }

    globalDefine.amd = {};

    /**
     * 模块配置获取函数
     *
     * @inner
     * @return {Object} 模块配置对象
     */
    function moduleConfigGetter() {
        var conf = requireConf.config[this.id];
        if (conf && typeof conf === 'object') {
            return conf;
        }

        return {};
    }

    /**
     * 预定义模块
     *
     * @inner
     * @param {string} id 模块标识
     * @param {Array.<string>} dependencies 显式声明的依赖模块列表
     * @param {*} factory 模块定义函数或模块对象
     */
    function modPreDefine(id, dependencies, factory) {
        // 将模块存入容器
        //
        // 模块内部信息包括
        // -----------------------------------
        // id: module id
        // depsDec: 模块定义时声明的依赖
        // deps: 模块依赖，默认为['require', 'exports', 'module']
        // factory: 初始化函数或对象
        // factoryDeps: 初始化函数的参数依赖
        // exports: 模块的实际暴露对象（AMD定义）
        // config: 用于获取模块配置信息的函数（AMD定义）
        // state: 模块当前状态
        // require: local require函数
        // depMs: 实际依赖的模块集合，数组形式
        // depMkv: 实际依赖的模块集合，表形式，便于查找
        // depRs: 实际依赖的资源集合
        // ------------------------------------
        if (!modModules[id]) {
            modModules[id] = {
                id         : id,
                depsDec    : dependencies,
                deps       : dependencies || ['require', 'exports', 'module'],
                factoryDeps: [],
                factory    : factory,
                exports    : {},
                config     : moduleConfigGetter,
                state      : MODULE_PRE_DEFINED,
                require    : createLocalRequire(id),
                depMs      : [],
                depMkv     : {},
                depRs      : [],
                hang       : 0
            };
        }
    }

    /**
     * 开始执行模块定义前的准备工作
     *
     * 首先，完成对factory中声明依赖的分析提取
     * 然后，尝试加载"资源加载所需模块"
     *
     * 需要先加载模块的原因是：如果模块不存在，无法进行resourceId normalize化
     *
     * @inner
     * @param {string} id 模块id
     */
    function modPrepare(id) {
        var mod = modModules[id];
        if (!mod || modIs(id, MODULE_ANALYZED)) {
            return;
        }

        var deps = mod.deps;
        var factory = mod.factory;
        var hardDependsCount = 0;

        // 分析function body中的require
        // 如果包含显式依赖声明，根据AMD规定和性能考虑，可以不分析factoryBody
        if (typeof factory === 'function') {
            hardDependsCount = Math.min(factory.length, deps.length);

            // If the dependencies argument is present, the module loader
            // SHOULD NOT scan for dependencies within the factory function.
            !mod.depsDec && factory.toString()
                .replace(/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg, '')
                .replace(/require\(\s*(['"])([^'"]+)\1\s*\)/g,
                    function ($0, $1, depId) {
                        deps.push(depId);
                    }
                );
        }

        var requireModules = [];
        var depResources = [];
        each(deps, function (depId, index) {
            var idInfo = parseId(depId);
            var absId = normalize(idInfo.mod, id);
            var moduleInfo;
            var resInfo;

            if (absId && !BUILDIN_MODULE[absId]) {
                // 如果依赖是一个资源，将其信息添加到module.depRs
                //
                // module.depRs中的项有可能是重复的。
                // 在这个阶段，加载resource的module可能还未defined，
                // 导致此时resource id无法被normalize。
                //
                // 比如对a/b/c而言，下面几个resource可能指的是同一个资源：
                // - js!../name.js
                // - js!a/name.js
                // - ../../js!../name.js
                //
                // 所以加载资源的module ready时，需要遍历module.depRs进行处理
                if (idInfo.res) {
                    resInfo = {
                        id: depId,
                        mod: absId,
                        res: idInfo.res
                    };
                    depResources.push(depId);
                    mod.depRs.push(resInfo);
                }

                // 对依赖模块的id normalize能保证正确性，在此处进行去重
                moduleInfo = mod.depMkv[absId];
                if (!moduleInfo) {
                    moduleInfo = {
                        id: idInfo.mod,
                        absId: absId,
                        hard: index < hardDependsCount
                    };
                    mod.depMs.push(moduleInfo);
                    mod.depMkv[absId] = moduleInfo;
                    requireModules.push(absId);
                }
            }
            else {
                moduleInfo = {absId: absId};
            }

            // 如果当前正在分析的依赖项是define中声明的，
            // 则记录到module.factoryDeps中
            // 在factory invoke前将用于生成invoke arguments
            if (index < hardDependsCount) {
                mod.factoryDeps.push(resInfo || moduleInfo);
            }
        });

        mod.state = MODULE_ANALYZED;
        modInitFactoryInvoker(id);
        nativeAsyncRequire(requireModules);
        depResources.length && mod.require(
            depResources,
            function () {
                each(mod.depRs, function (res) {
                    if (!res.absId) {
                        res.absId = normalize(res.id, id);
                    }
                });
                modAutoDefine();
            }
        );
    }

    /**
     * 对一些需要自动定义的模块进行自动定义
     *
     * @inner
     */
    function modAutoDefine() {
        for (var id in modAutoDefineModules) {
            modPrepare(id);
            modUpdatePreparedState(id);
            modTryInvokeFactory(id);
        }
    }

    /**
     * 更新模块的准备状态
     *
     * @inner
     * @param {string} id 模块id
     */
    function modUpdatePreparedState(id) {
        var updatingModules = {};
        update(id);

        function update(id) {
            modPrepare(id);
            if (!modIs(id, MODULE_ANALYZED)) {
                return false;
            }

            if (modIs(id, MODULE_PREPARED) || updatingModules[id]) {
                return true;
            }

            updatingModules[id] = 1;
            var mod = modModules[id];
            var prepared = true;

            each(
                mod.depMs,
                function (dep) {
                    // return (prepared = update(dep.absId));
                    prepared = update(dep.absId) && prepared;
                }
            );

            // 判断resource是否加载完成。如果resource未加载完成，则认为未准备好
            /* jshint ignore:start */
            prepared && each(
                mod.depRs,
                function (dep) {
                    prepared = !!dep.absId;
                    return prepared;
                }
            );
            /* jshint ignore:end */

            if (prepared && !modIs(id, MODULE_PREPARED)) {
                mod.state = MODULE_PREPARED;
            }
            updatingModules[id] = 0;
            return prepared;
        }
    }

    /**
     * 初始化模块定义时所需的factory执行器
     *
     * @inner
     * @param {string} id 模块id
     */
    function modInitFactoryInvoker(id) {
        var mod = modModules[id];
        var invoking;

        mod.invokeFactory = invokeFactory;

        /**
         * 初始化模块
         *
         * @inner
         */
        function invokeFactory() {
            if (invoking || mod.state !== MODULE_PREPARED) {
                return;
            }

            invoking = 1;

            // 拼接factory invoke所需的arguments
            var factoryReady = 1;
            each(
                mod.factoryDeps,
                function (dep) {
                    var depId = dep.absId;

                    if (!BUILDIN_MODULE[depId]) {
                        modTryInvokeFactory(depId);
                        return (factoryReady = modIs(depId, MODULE_DEFINED));
                    }
                }
            );

            if (factoryReady) {
                try {
                    // 调用factory函数初始化module
                    var factory = mod.factory;
                    var exports = typeof factory === 'function'
                        ? factory.apply(global, modGetModulesExports(
                                mod.factoryDeps,
                                {
                                    require: mod.require,
                                    exports: mod.exports,
                                    module: mod
                                }
                            ))
                        : factory;

                    if (exports != null) {
                        mod.exports = exports;
                    }

                    mod.invokeFactory = null;
                }
                catch (ex) {
                    mod.hang = 1;
                    throw ex;
                }

                // 完成define
                // 不放在try里，避免后续的运行错误被这里吞掉
                modDefined(id);
            }
        }
    }

    /**
     * 判断模块是否完成相应的状态
     *
     * @inner
     * @param {string} id 模块标识
     * @param {number} state 状态码，使用时传入相应的枚举变量，比如`MODULE_DEFINED`
     * @return {boolean} 是否完成相应的状态
     */
    function modIs(id, state) {
        return modModules[id] && modModules[id].state >= state;
    }

    /**
     * 尝试执行模块factory函数，进行模块初始化
     *
     * @inner
     * @param {string} id 模块id
     */
    function modTryInvokeFactory(id) {
        var mod = modModules[id];

        if (mod && mod.invokeFactory) {
            mod.invokeFactory();
        }
    }

    /**
     * 根据模块id数组，获取其的exports数组
     * 用于模块初始化的factory参数或require的callback参数生成
     *
     * @inner
     * @param {Array} modules 模块id数组
     * @param {Object} buildinModules 内建模块对象
     * @return {Array} 模块exports数组
     */
    function modGetModulesExports(modules, buildinModules) {
        var args = [];
        each(
            modules,
            function (id, index) {
                if (typeof id === 'object') {
                    id = id.absId;
                }
                args[index] = buildinModules[id] || modModules[id].exports;
            }
        );

        return args;
    }

    /**
     * 模块定义完成事件监听器容器
     *
     * @inner
     * @type {Object}
     */
    var modDefinedListeners = {};

    /**
     * 添加模块定义完成时间的监听器
     *
     * @inner
     * @param {string} id 模块标识
     * @param {Function} listener 监听函数
     */
    function modAddDefinedListener(id, listener) {
        if (modIs(id, MODULE_DEFINED)) {
            listener();
            return;
        }

        var listeners = modDefinedListeners[id];
        if (!listeners) {
            listeners = modDefinedListeners[id] = [];
        }

        listeners.push(listener);
    }

    /**
     * 模块状态切换为定义完成
     * 因为需要触发事件，MODULE_DEFINED状态切换通过该函数
     *
     * @inner
     * @param {string} id 模块标识
     */
    function modDefined(id) {
        var mod = modModules[id];
        mod.state = MODULE_DEFINED;
        delete modAutoDefineModules[id];

        var listeners = modDefinedListeners[id] || [];
        var len = listeners.length;
        while (len--) {
            // 这里不做function类型的检测
            // 因为listener都是通过modOn传入的，modOn为内部调用
            listeners[len]();
        }

        // 清理listeners
        listeners.length = 0;
        modDefinedListeners[id] = null;
    }

    /**
     * 异步加载模块
     * 内部使用，模块ID必须是经过normalize的Top-Level ID
     *
     * @inner
     * @param {Array} ids 模块名称或模块名称列表
     * @param {Function=} callback 获取模块完成时的回调函数
     * @param {string} baseId 基础id，用于当ids是relative id时的normalize
     */
    function nativeAsyncRequire(ids, callback, baseId) {
        var isCallbackCalled = 0;

        each(ids, function (id) {
            if (!(BUILDIN_MODULE[id] || modIs(id, MODULE_DEFINED))) {
                modAddDefinedListener(id, tryFinishRequire);
                (id.indexOf('!') > 0
                    ? loadResource
                    : loadModule
                )(id, baseId);
            }
        });
        tryFinishRequire();

        /**
         * 尝试完成require，调用callback
         * 在模块与其依赖模块都加载完时调用
         *
         * @inner
         */
        function tryFinishRequire() {
            if (typeof callback === 'function' && !isCallbackCalled) {
                var isAllCompleted = 1;
                each(ids, function (id) {
                    if (!BUILDIN_MODULE[id]) {
                        return (isAllCompleted = !!modIs(id, MODULE_DEFINED));
                    }
                });

                // 检测并调用callback
                if (isAllCompleted) {
                    isCallbackCalled = 1;

                    callback.apply(
                        global,
                        modGetModulesExports(ids, BUILDIN_MODULE)
                    );
                }
            }
        }
    }

    /**
     * 正在加载的模块列表
     *
     * @inner
     * @type {Object}
     */
    var loadingModules = {};

    /**
     * 加载模块
     *
     * @inner
     * @param {string} moduleId 模块标识
     */
    function loadModule(moduleId) {
        // 加载过的模块，就不要再继续了
        if (loadingModules[moduleId] || modModules[moduleId]) {
            return;
        }
        loadingModules[moduleId] = 1;

        // 初始化相关 shim 的配置
        var shimConf = requireConf.shim[moduleId];
        if (shimConf instanceof Array) {
            requireConf.shim[moduleId] = shimConf = {
                deps: shimConf
            };
        }

        // shim依赖的模块需要自动标识为shim
        // 无论是纯正的shim模块还是hybird模块
        var shimDeps = shimConf && (shimConf.deps || []);
        if (shimDeps) {
            each(shimDeps, function (dep) {
                if (!requireConf.shim[dep]) {
                    requireConf.shim[dep] = {};
                }
            });
            actualGlobalRequire(shimDeps, load);
        }
        else {
            load();
        }

        /**
         * 发送请求去加载模块
         *
         * @inner
         */
        function load() {
            /* eslint-disable no-use-before-define */
            var bundleModuleId = bundlesIndex[moduleId];
            createScript(bundleModuleId || moduleId, loaded);
            /* eslint-enable no-use-before-define */
        }

        /**
         * script标签加载完成的事件处理函数
         *
         * @inner
         */
        function loaded() {
            if (shimConf) {
                var exports;
                if (typeof shimConf.init === 'function') {
                    exports = shimConf.init.apply(
                        global,
                        modGetModulesExports(shimDeps, BUILDIN_MODULE)
                    );
                }

                if (exports == null && shimConf.exports) {
                    exports = global;
                    each(
                        shimConf.exports.split('.'),
                        function (prop) {
                            exports = exports[prop];
                            return !!exports;
                        }
                    );
                }

                globalDefine(moduleId, shimDeps, function () { 
                    return exports || {};
                });
            }
            else {
                modCompletePreDefine(moduleId);
            }

            modAutoDefine();
        }
    }

    /**
     * 加载资源
     *
     * @inner
     * @param {string} pluginAndResource 插件与资源标识
     * @param {string} baseId 当前环境的模块标识
     */
    function loadResource(pluginAndResource, baseId) {
        if (modModules[pluginAndResource]) {
            return;
        }

        /* eslint-disable no-use-before-define */
        var bundleModuleId = bundlesIndex[pluginAndResource];
        if (bundleModuleId) {
            loadModule(bundleModuleId);
            return;
        }
        /* eslint-enable no-use-before-define */

        var idInfo = parseId(pluginAndResource);
        var resource = {
            id: pluginAndResource,
            state: MODULE_ANALYZED
        };
        modModules[pluginAndResource] = resource;

        /**
         * plugin加载完成的回调函数
         *
         * @inner
         * @param {*} value resource的值
         */
        function pluginOnload(value) {
            resource.exports = value || true;
            modDefined(pluginAndResource);
        }

        /* jshint ignore:start */
        /**
         * 该方法允许plugin使用加载的资源声明模块
         *
         * @param {string} id 模块id
         * @param {string} text 模块声明字符串
         */
        pluginOnload.fromText = function (id, text) {
            new Function(text)();
            modCompletePreDefine(id);
        };
        /* jshint ignore:end */

        /**
         * 加载资源
         *
         * @inner
         * @param {Object} plugin 用于加载资源的插件模块
         */
        function load(plugin) {
            var pluginRequire = baseId
                ? modModules[baseId].require
                : actualGlobalRequire;

            plugin.load(
                idInfo.res,
                pluginRequire,
                pluginOnload,
                moduleConfigGetter.call({id: pluginAndResource})
            );
        }

        load(actualGlobalRequire(idInfo.mod));
    }

    /**
     * 配置require
     *
     * @param {Object} conf 配置对象
     */
    globalRequire.config = function (conf) {
        if (conf) {
            for (var key in requireConf) {
                var newValue = conf[key];
                var oldValue = requireConf[key];

                if (!newValue) {
                    continue;
                }

                if (key === 'urlArgs' && typeof newValue === 'string') {
                    requireConf.urlArgs['*'] = newValue;
                }
                else {
                    // 简单的多处配置还是需要支持，所以配置实现为支持二级mix
                    if (oldValue instanceof Array) {
                        oldValue.push.apply(oldValue, newValue);
                    }
                    else if (typeof oldValue === 'object') {
                        for (var k in newValue) {
                            oldValue[k] = newValue[k];
                        }
                    }
                    else {
                        requireConf[key] = newValue;
                    }
                }
            }

            createConfIndex();
        }
    };

    // 初始化时需要创建配置索引
    createConfIndex();

    /**
     * paths内部索引
     *
     * @inner
     * @type {Array}
     */
    var pathsIndex;

    /**
     * packages内部索引
     *
     * @inner
     * @type {Array}
     */
    var packagesIndex;

    /**
     * mapping内部索引
     *
     * @inner
     * @type {Array}
     */
    var mappingIdIndex;

    /**
     * bundles内部索引
     *
     * @inner
     * @type {Object}
     */
    var bundlesIndex;

    /**
     * urlArgs内部索引
     *
     * @inner
     * @type {Array}
     */
    var urlArgsIndex;

    /**
     * 将key为module id prefix的Object，生成数组形式的索引，并按照长度和字面排序
     *
     * @inner
     * @param {Object} value 源值
     * @param {boolean} allowAsterisk 是否允许*号表示匹配所有
     * @return {Array} 索引对象
     */
    function createKVSortedIndex(value, allowAsterisk) {
        var index = kv2List(value, 1, allowAsterisk);
        index.sort(descSorterByKOrName);
        return index;
    }

    /**
     * 创建配置信息内部索引
     *
     * @inner
     */
    function createConfIndex() {
        requireConf.baseUrl = requireConf.baseUrl.replace(/\/$/, '') + '/';

        // create paths index
        pathsIndex = createKVSortedIndex(requireConf.paths);

        // create mappingId index
        mappingIdIndex = createKVSortedIndex(requireConf.map, 1);
        each(
            mappingIdIndex,
            function (item) {
                item.v = createKVSortedIndex(item.v);
            }
        );

        var lastMapItem = mappingIdIndex[mappingIdIndex.length - 1];
        if (lastMapItem && lastMapItem.k === '*') {
            each(
                mappingIdIndex,
                function (item) {
                    if (item != lastMapItem) {
                        item.v = item.v.concat(lastMapItem.v);
                    }
                }
            );
        }

        // create packages index
        packagesIndex = [];
        each(
            requireConf.packages,
            function (packageConf) {
                var pkg = packageConf;
                if (typeof packageConf === 'string') {
                    pkg = {
                        name: packageConf.split('/')[0],
                        location: packageConf,
                        main: 'main'
                    };
                }

                pkg.location = pkg.location || pkg.name;
                pkg.main = (pkg.main || 'main').replace(/\.js$/i, '');
                pkg.reg = createPrefixRegexp(pkg.name);
                packagesIndex.push(pkg);
            }
        );
        packagesIndex.sort(descSorterByKOrName);

        // create urlArgs index
        urlArgsIndex = createKVSortedIndex(requireConf.urlArgs, 1);

        // create bundles index
        bundlesIndex = {};
        /* eslint-disable no-use-before-define */
        function bundlesIterator(id) {
            bundlesIndex[resolvePackageId(id)] = key;
        }
        /* eslint-enable no-use-before-define */
        for (var key in requireConf.bundles) {
            each(requireConf.bundles[key], bundlesIterator);
        }
    }

    /**
     * 对配置信息的索引进行检索
     *
     * @inner
     * @param {string} value 要检索的值
     * @param {Array} index 索引对象
     * @param {Function} hitBehavior 索引命中的行为函数
     */
    function indexRetrieve(value, index, hitBehavior) {
        each(index, function (item) {
            if (item.reg.test(value)) {
                hitBehavior(item.v, item.k, item);
                return false;
            }
        });
    }

    /**
     * 将`模块标识+'.extension'`形式的字符串转换成相对的url
     *
     * @inner
     * @param {string} source 源字符串
     * @param {string} baseId 当前module id
     * @return {string} url
     */
    function toUrl(source, baseId) {
        // 分离 模块标识 和 .extension
        var extReg = /(\.[a-z0-9]+)$/i;
        var queryReg = /(\?[^#]*)$/;
        var extname = '';
        var id = source;
        var query = '';

        if (queryReg.test(source)) {
            query = RegExp.$1;
            source = source.replace(queryReg, '');
        }

        if (extReg.test(source)) {
            extname = RegExp.$1;
            id = source.replace(extReg, '');
        }

        if (baseId != null) {
            id = normalize(id, baseId);
        }

        var url = id;

        // paths处理和匹配
        var isPathMap;
        indexRetrieve(id, pathsIndex, function (value, key) {
            url = url.replace(key, value);
            isPathMap = 1;
        });

        // packages处理和匹配
        if (!isPathMap) {
            indexRetrieve(id, packagesIndex, function (value, key, item) {
                url = url.replace(item.name, item.location);
            });
        }

        // 相对路径时，附加baseUrl
        if (!/^([a-z]{2,10}:\/)?\//i.test(url)) {
            url = requireConf.baseUrl + url;
        }

        // 附加 .extension 和 query
        url += extname + query;

        // urlArgs处理和匹配
        indexRetrieve(id, urlArgsIndex, function (value) {
            url += (url.indexOf('?') > 0 ? '&' : '?') + value;
        });

        return url;
    }

    /**
     * 创建local require函数
     *
     * @inner
     * @param {number} baseId 当前module id
     * @return {Function} local require函数
     */
    function createLocalRequire(baseId) {
        var requiredCache = {};

        function req(requireId, callback) {
            if (typeof requireId === 'string') {
                if (!requiredCache[requireId]) {
                    var topLevelId = normalize(requireId, baseId);

                    // 根据 https://github.com/amdjs/amdjs-api/wiki/require
                    // It MUST throw an error if the module has not
                    // already been loaded and evaluated.
                    modTryInvokeFactory(topLevelId);
                    if (!modIs(topLevelId, MODULE_DEFINED)) {
                        throw new Error('[MODULE_MISS]"' + topLevelId + '" is not exists!');
                    }

                    requiredCache[requireId] = modModules[topLevelId].exports;
                }

                return requiredCache[requireId];
            }
            else if (requireId instanceof Array) {
                // 分析是否有resource，取出pluginModule先
                var pureModules = [];
                var normalizedIds = [];

                each(
                    requireId,
                    function (id, i) {
                        var idInfo = parseId(id);
                        var absId = normalize(idInfo.mod, baseId);
                        var resId = idInfo.res;
                        var normalizedId = absId;

                        if (resId) {
                            var trueResId = absId + '!' + resId;
                            if (resId.indexOf('.') !== 0 && bundlesIndex[trueResId]) {
                                absId = normalizedId = trueResId;
                            }
                            else {
                                normalizedId = null;
                            }
                        }

                        normalizedIds[i] = normalizedId;
                        modFlagAutoDefine(absId);
                        pureModules.push(absId);
                    }
                );

                // 加载模块
                nativeAsyncRequire(
                    pureModules,
                    function () {
                        /* jshint ignore:start */
                        each(normalizedIds, function (id, i) {
                            if (id == null) {
                                id = normalizedIds[i] = normalize(requireId[i], baseId);
                                modFlagAutoDefine(id);
                            }
                        });
                        /* jshint ignore:end */

                        // modAutoDefine中，factory invoke可能发生错误
                        // 从而导致nativeAsyncRequire没有被调用，callback没挂上
                        // 所以nativeAsyncRequire要先运行
                        nativeAsyncRequire(normalizedIds, callback, baseId);
                        modAutoDefine();
                    },
                    baseId
                );
                modAutoDefine();
            }
        }

        /**
         * 将[module ID] + '.extension'格式的字符串转换成url
         *
         * @inner
         * @param {string} id 符合描述格式的源字符串
         * @return {string} url
         */
        req.toUrl = function (id) {
            return toUrl(id, baseId || '');
        };

        return req;
    }

    /**
     * id normalize化
     *
     * @inner
     * @param {string} id 需要normalize的模块标识
     * @param {string} baseId 当前环境的模块标识
     * @return {string} normalize结果
     */
    function normalize(id, baseId) {
        if (!id) {
            return '';
        }

        baseId = baseId || '';
        var idInfo = parseId(id);
        if (!idInfo) {
            return id;
        }

        var resourceId = idInfo.res;
        var moduleId = relative2absolute(idInfo.mod, baseId);

        // 根据config中的map配置进行module id mapping
        indexRetrieve(
            baseId,
            mappingIdIndex,
            function (value) {
                indexRetrieve(
                    moduleId,
                    value,
                    function (mdValue, mdKey) {
                        moduleId = moduleId.replace(mdKey, mdValue);
                    }
                );
            }
        );

        moduleId = resolvePackageId(moduleId);

        if (resourceId) {
            var mod = modIs(moduleId, MODULE_DEFINED) && actualGlobalRequire(moduleId);
            resourceId = mod && mod.normalize
                ? mod.normalize(
                    resourceId,
                    function (resId) {
                        return normalize(resId, baseId);
                    }
                  )
                : normalize(resourceId, baseId);

            moduleId += '!' + resourceId;
        }

        return moduleId;
    }

    /**
     * 对id进行package解析
     * 如果是package，则附加主模块id
     *
     * @inner
     * @param {string} id 模块id
     * @return {string} 解析后的id
     */
    function resolvePackageId(id) {
        each(
            packagesIndex,
            function (packageConf) {
                var name = packageConf.name;
                if (name === id) {
                    id = name + '/' + packageConf.main;
                    return false;
                }
            }
        );

        return id;
    }

    /**
     * 相对id转换成绝对id
     *
     * @inner
     * @param {string} id 要转换的相对id
     * @param {string} baseId 当前所在环境id
     * @return {string} 绝对id
     */
    function relative2absolute(id, baseId) {
        if (id.indexOf('.') !== 0) {
            return id;
        }

        var segs = baseId.split('/').slice(0, -1).concat(id.split('/'));
        var res = [];
        for (var i = 0; i < segs.length; i++) {
            var seg = segs[i];

            switch (seg) {
                case '.':
                    break;
                case '..':
                    if (res.length && res[res.length - 1] !== '..') {
                        res.pop();
                    }
                    else { // allow above root
                        res.push(seg);
                    }
                    break;
                default:
                    seg && res.push(seg);
            }
        }

        return res.join('/');
    }

    /**
     * 解析id，返回带有module和resource属性的Object
     *
     * @inner
     * @param {string} id 标识
     * @return {Object} id解析结果对象
     */
    function parseId(id) {
        var segs = id.split('!');

        if (segs[0]) {
            return {
                mod: segs[0],
                res: segs[1]
            };
        }
    }

    /**
     * 将对象数据转换成数组，数组每项是带有k和v的Object
     *
     * @inner
     * @param {Object} source 对象数据
     * @param {boolean} keyMatchable key是否允许被前缀匹配
     * @param {boolean} allowAsterisk 是否支持*匹配所有
     * @return {Array.<Object>} 对象转换数组
     */
    function kv2List(source, keyMatchable, allowAsterisk) {
        var list = [];
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                var item = {
                    k: key,
                    v: source[key]
                };
                list.push(item);

                if (keyMatchable) {
                    item.reg = key === '*' && allowAsterisk
                        ? /^/
                        : createPrefixRegexp(key);
                }
            }
        }

        return list;
    }



    /**
     * 创建id前缀匹配的正则对象
     *
     * @inner
     * @param {string} prefix id前缀
     * @return {RegExp} 前缀匹配的正则对象
     */
    function createPrefixRegexp(prefix) {
        return new RegExp('^' + prefix + '(/|$)');
    }

    /**
     * 循环遍历数组集合
     *
     * @inner
     * @param {Array} source 数组源
     * @param {function(Array,Number):boolean} iterator 遍历函数
     */
    function each(source, iterator) {
        if (source instanceof Array) {
            for (var i = 0, len = source.length; i < len; i++) {
                if (iterator(source[i], i) === false) {
                    break;
                }
            }
        }
    }

    /**
     * 根据元素的k或name项进行数组字符数逆序的排序函数
     *
     * @inner
     * @param {Object} a 要比较的对象a
     * @param {Object} b 要比较的对象b
     * @return {number} 比较结果
     */
    function descSorterByKOrName(a, b) {
        var aValue = a.k || a.name;
        var bValue = b.k || b.name;

        if (bValue === '*') {
            return -1;
        }

        if (aValue === '*') {
            return 1;
        }

        return bValue.length - aValue.length;
    }

    // 感谢requirejs，通过currentlyAddingScript兼容老旧ie
    //
    // For some cache cases in IE 6-8, the script executes before the end
    // of the appendChild execution, so to tie an anonymous define
    // call to the module name (which is stored on the node), hold on
    // to a reference to this node, but clear after the DOM insertion.
    var currentlyAddingScript;
    var interactiveScript;

    /**
     * 获取当前script标签
     * 用于ie下define未指定module id时获取id
     *
     * @inner
     * @return {HTMLScriptElement} 当前script标签
     */
    function getCurrentScript() {
        if (currentlyAddingScript) {
            return currentlyAddingScript;
        }
        else if (
            interactiveScript
            && interactiveScript.readyState === 'interactive'
        ) {
            return interactiveScript;
        }

        var scripts = document.getElementsByTagName('script');
        var scriptLen = scripts.length;
        while (scriptLen--) {
            var script = scripts[scriptLen];
            if (script.readyState === 'interactive') {
                interactiveScript = script;
                return script;
            }
        }
    }

    var headElement = document.getElementsByTagName('head')[0];
    var baseElement = document.getElementsByTagName('base')[0];
    if (baseElement) {
        headElement = baseElement.parentNode;
    }

    function createScript(moduleId, onload) {
        // 创建script标签
        //
        // 这里不挂接onerror的错误处理
        // 因为高级浏览器在devtool的console面板会报错
        // 再throw一个Error多此一举了
        var script = document.createElement('script');
        script.setAttribute('data-require-id', moduleId);
        script.src = toUrl(moduleId + '.js');
        script.async = true;
        if (script.readyState) {
            script.onreadystatechange = innerOnload;
        }
        else {
            script.onload = innerOnload;
        }

        function innerOnload() {
            var readyState = script.readyState;
            if (
                typeof readyState === 'undefined'
                || /^(loaded|complete)$/.test(readyState)
            ) {
                script.onload = script.onreadystatechange = null;
                script = null;

                onload();
            }
        }
        currentlyAddingScript = script;

        // If BASE tag is in play, using appendChild is a problem for IE6.
        // See: http://dev.jquery.com/ticket/2709
        baseElement
            ? headElement.insertBefore(script, baseElement)
            : headElement.appendChild(script);

        currentlyAddingScript = null;
    }

    // 暴露全局对象
    if (!define) {
        define = globalDefine;

        // 可能碰到其他形式的loader，所以，不要覆盖人家
        if (!require) {
            require = globalRequire;
        }

        // 如果存在其他版本的esl，在define那里就判断过了，不会进入这个分支
        // 所以这里就不判断了，直接写
        esl = globalRequire;
    }

    // data-main
    var mainModule;
    (function () {
        var scripts = document.getElementsByTagName('script');
        var len = scripts.length;

        while (len--) {
            var script = scripts[len];
            if ((mainModule = script.getAttribute('data-main'))) {
                break;
            }
        }
    })();

    mainModule && setTimeout(function () {
        globalRequire([mainModule]);
    }, 4);
})(this);
