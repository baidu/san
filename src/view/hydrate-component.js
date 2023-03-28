/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 反解
 */

var preprocessComponents = require('./preprocess-components');


function hydrateComponent(ComponentClass, options) {
    var el = options.el;

    if (!el) {
        // #[begin] error
        throw new Error('[SAN FATAL] el is required in hydrateComponent.');
        // #[end]
        return {};
    }

    if (el.getAttribute('data-sanssr') !== 'render-only') {
        return {
            instance: new ComponentClass(options)
        };
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

    var components = {};
    for (var i = 0, l = hydrateRootEls.length; i < l; i++) {
        var cmptEl = hydrateRootEls[i];
        var cmptPath = cmptEl.getAttribute('data-sanssr-cmpt');

        var cmptPathSegs = cmptPath.split('/');
        var TargetComponent = ComponentClass;
        for (var j = 0, sl = cmptPathSegs.length; j < sl; j++) {
            var cmptProto = TargetComponent.prototype;
            if (!cmptProto.hasOwnProperty('_cmptReady')) {
                preprocessComponents(TargetComponent);
            }

            TargetComponent = cmptProto.components[cmptPathSegs[j]];
        }
        
        var componentsBucket = components[cmptPath];
        if (!componentsBucket) {
            componentsBucket = components[cmptPath] = [];
        }
        componentsBucket.push(new TargetComponent({
            el: cmptEl
        }));
    }

    return {
        renderOnly: true,
        components: components
    };
}


exports = module.exports = hydrateComponent;
