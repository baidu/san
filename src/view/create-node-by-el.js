/**
 * @file 通过存在的 el 创建节点的工厂方法
 * @author errorrik(errorrik@gmail.com)
 */


var parseANodeFromEl = require('../parser/parse-anode-from-el');


var isComponent = require('./is-component');
var createText = require('./create-text');
var createElement = require('./create-element');
var createIf = require('./create-if');
var createFor = require('./create-for');
var createSlot = require('./create-slot');
var createTemplate = require('./create-template');

// #[begin] reverse
/**
 * 通过存在的 el 创建节点
 *
 * @param {HTMLElement} el 页面中存在的元素
 * @param {Node} parent 父亲节点
 * @param {DOMChildrenWalker} elWalker 遍历元素的功能对象
 * @param {Model=} scope 所属数据环境
 * @return {Node}
 */
function createNodeByEl(el, parent, elWalker, scope) {
    var owner = isComponent(parent) ? parent : parent.owner;
    scope = scope || (isComponent(parent) ? parent.data : parent.scope);

    var option = {
        owner: owner,
        scope: scope,
        parent: parent,
        el: el,
        elWalker: elWalker
    };

    // comment as stump
    if (el.nodeType === 8) {
        var stumpMatch = el.data.match(/^\s*s-([a-z]+)(:[\s\S]+)?$/);

        if (stumpMatch) {
            option.stumpType = stumpMatch[1];
            option.stumpText = stumpMatch[2] ? stumpMatch[2].slice(1) : '';

            switch (option.stumpType) {
                case 'text':
                    return createText(option);

                case 'for':
                    return createFor(option);

                case 'slot':
                    return createSlot(option);

                case 'if':
                    return createIf(option);

                case 'tpl':
                    return createTemplate(option);

                case 'data':
                    // fill component data
                    var data = (new Function(
                        'return ' + option.stumpText.replace(/^[\s\n]*/, '')
                    ))();

                    /* eslint-disable guard-for-in */
                    for (var key in data) {
                        owner.data.set(key, data[key]);
                    }
                    /* eslint-enable guard-for-in */

                    return;
            }
        }

        return;
    }

    // element as anything
    var tagName = el.tagName.toLowerCase();
    var childANode = parseANodeFromEl(el);
    option.aNode = childANode;

    // find component class
    var ComponentClass = null;
    if (tagName.indexOf('-') > 0) {
        ComponentClass = owner.components[tagName];
    }

    var componentName = el.getAttribute('s-component');
    if (componentName) {
        ComponentClass = owner.components[componentName];
        childANode.tagName = componentName;
    }


    // as Component
    if (ComponentClass) {
        return new ComponentClass(option);
    }

    // as Element
    return createElement(option);
}

// #[end]

exports = module.exports = createNodeByEl;
