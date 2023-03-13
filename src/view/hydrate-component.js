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

    // #[begin] error
    if (!el) {
        throw new Error('[SAN FATAL] el is required in hydrateComponent.');
    }
    // #[end]

    if (el.getAttribute('data-sanssr')  !== 'render-only') {
        var component = new ComponentClass({
            el: el
        });

        return {
            '': component
        };
    }

    var els = el.querySelectorAll('[data-sanssr-cmpt]');
    if (el.getAttribute('data-sanssr-cmpt')) {
        els = Array.prototype.slice.call(els);
        els.push(el);
    }
    var index;
    var instances = {};
    for (index = 0; index < els.length; index++) {
        var cmptEl = els[index];
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
