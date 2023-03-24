/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 反解
 */

function getTargetComponentClass(path, rootComponentClass) {
    var pathArr = path.split('/');
    var componentClass = rootComponentClass;
    for (var index = 0; index < pathArr.length; index++) {
        var key = pathArr[index];
        componentClass = componentClass.prototype.components[key];
    }
    return componentClass;
}

function hydrateComponent(ComponentClass, options) {
    var el = options.el;

    if (!el) {
        // #[begin] error
        throw new Error('[SAN FATAL] el is required in hydrateComponent.');
        // #[end]
        return {};
    }

    if (el.getAttribute('data-sanssr') !== 'render-only') {
        return new ComponentClass(options);
    }

    var stack = [];
    var stackIndex = -1;
    var currEl = el;
    var hydrateRootEls = [];

    while (1) {
        if (!currEl) {
            if (stackIndex <= 0) {
                break;
            }

            currEl = stack[stackIndex--].nextSibling;
        }
        else {
            switch (currEl.nodeType) {
                case 1:
                    if (currEl.hasAttribute('data-sanssr-cmpt')) {
                        hydrateRootEls.push(currEl);
                    }

                    var firstChild = currEl.firstChild;
                    if (firstChild) {
                        stack[++stackIndex] = currEl;
                        currEl = firstChild;
                    }
                    else {
                        currEl = currEl.nextSibling;
                    }
                    break;

                default:
                    currEl = currEl.nextSibling;
            }
        }
    }

    var index;
    var instances = {};
    for (index = 0; index < hydrateRootEls.length; index++) {
        var cmptEl = hydrateRootEls[index];
        var cmptPath = cmptEl.getAttribute('data-sanssr-cmpt');
        var cmptClass = getTargetComponentClass(cmptPath, ComponentClass);
        var cmpt = new cmptClass({
            el: cmptEl
        });

        if (!instances[cmptPath]) {
            instances[cmptPath] = [];
        }
        instances[cmptPath].push(cmpt);
    }

    return instances;
}

exports = module.exports = hydrateComponent;
