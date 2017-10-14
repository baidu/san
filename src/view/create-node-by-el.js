/**
 * @file 通过存在的 el 创建节点的工厂方法
 * @author errorrik(errorrik@gmail.com)
 */

var parseTemplate = require('../parser/parse-template');
var parseANodeFromEl = require('../parser/parse-anode-from-el');

var NodeType = require('./node-type');
var isComponent = require('./is-component');
var createText = require('./create-text');
var createElement = require('./create-element');
var createIf = require('./create-if');
var createFor = require('./create-for');
var createSlot = require('./create-slot');

// #[begin] reverse
/**
 * 通过存在的 el 创建节点
 *
 * @param {HTMLElement} el 页面中存在的元素
 * @param {Node} parent 父亲节点
 * @param {DOMChildsWalker} elWalker 遍历元素的功能对象
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
            option.stumpText = stumpMatch[2] ? stumpMatch[2].slice(1) : '';

            switch (stumpMatch[1]) {
                case 'text':
                    return createText(option);

                case 'for':
                    return createFor(option);

                case 'slot':
                    return createSlot(option);

                case 'if':
                    return createIf(option);


                case 'else':
                case 'elif':
                    createNodeByElseStump(option, stumpMatch[1]);
                    return;

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


    if (childANode.directives.get('if')) {
        return createIf(option);
    }

    if (childANode.directives.get('else')) {
        return createNodeByElseEl(option, 'else');
    }

    if (childANode.directives.get('elif')) {
        return createNodeByElseEl(option, 'elif');
    }


    // as Component
    if (ComponentClass) {
        return new ComponentClass(option);
    }

    // as Element
    return createElement(option);
}

function createNodeByElseEl(option, type) {
    var parentChilds = option.parent.childs;
    var len = parentChilds.length;

    matchif: while (len--) {
        var ifNode = parentChilds[len];
        switch (ifNode._type) {
            case NodeType.TEXT:
                continue matchif;

            case NodeType.IF:
                if (!ifNode.aNode.elses) {
                    ifNode.aNode.elses = [];
                }
                ifNode.aNode.elses.push(option.aNode);
                ifNode.elseIndex = ifNode.aNode.elses.length - 1;

                option.el.removeAttribute('san-' + type);
                option.el.removeAttribute('s-' + type);

                var elseChild = createNodeByEl(option.el, ifNode, option.elWalker);
                ifNode.childs[0] = elseChild;
                option.aNode.childs = option.aNode.childs.slice(0);
                break matchif;
        }

        throw new Error('[SAN FATEL] ' + type + ' not match if.');
    }
}

function createNodeByElseStump(option, type) {
    var parentChilds = option.parent.childs;
    var len = parentChilds.length;

    matchif: while (len--) {
        var ifNode = parentChilds[len];
        switch (ifNode._type) {
            case NodeType.TEXT:
                continue matchif;

            case NodeType.IF:
                if (!ifNode.aNode.elses) {
                    ifNode.aNode.elses = [];
                }

                var elseANode;
                switch (type) {
                    case 'else':
                        elseANode = parseTemplate(
                            option.stumpText.replace('san-else', '').replace('s-else', '')
                        ).childs[0];
                        elseANode.directives.push({
                            value: 1,
                            name: type
                        });

                        break;

                    case 'elif':
                        elseANode = parseTemplate(
                            option.stumpText.replace('san-elif', 's-if').replace('s-elif', 's-if')
                        ).childs[0];

                        var ifDirective = elseANode.directives.get('if');
                        elseANode.directives.remove('if');
                        ifDirective.name = 'elif';
                        elseANode.directives.push(ifDirective);

                        break;
                }

                ifNode.aNode.elses.push(elseANode);
                break matchif;
        }

        throw new Error('[SAN FATEL] ' + type + ' not match if.');
    }
}
// #[end]

exports = module.exports = createNodeByEl;
