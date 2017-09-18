/**
 * @file 通过存在的 el 创建节点的工厂方法
 * @author errorrik(errorrik@gmail.com)
 */

var isComponent = require('./is-component');
var TextNode = require('./text-node');
var IfDirective = require('./if-directive');
var ForDirective = require('./for-directive');
var Element = require('./element');
var SlotElement = require('./slot-element');
var Component = require('./component');
var parseANodeFromEl = require('../parser/parse-anode-from-el');

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
                    return new TextNode(option);

                case 'for':
                    return new ForDirective(option);

                case 'slot':
                    return new SlotElement(option);

                case 'if':
                    return new IfDirective(option);
                

                case 'else':
                case 'elif':
                    createNodeByElseStump(option, stumpMatch[1]);
                    return;

                case 'data':
                    // fill component data
                    var data = (new Function(
                        'return ' + option.stumpText.replace(/^[\s\n]*/ ,'')
                    ))();

                    for (var key in data) {
                        owner.data.set(key, data[key]);
                    }

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
        return new IfDirective(option);
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
    return new Element(option);
}

function createNodeByElseEl(option, type) {
    var parentChilds = option.parent.childs;
    var len = parentChilds.length;

    while (len--) {
        var ifNode = parentChilds[len];
        if (ifNode instanceof TextNode) {
            continue;
        }

        if (ifNode instanceof IfDirective) {
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
            break;
        }

        throw new Error('[SAN FATEL] ' + type + ' not match if.');
    }
}

function createNodeByElseStump(option, type) {
    var parentChilds = option.parent.childs;
    var len = parentChilds.length;

    while (len--) {
        var ifNode = parentChilds[len];
        if (ifNode instanceof TextNode) {
            continue;
        }

        if (ifNode instanceof IfDirective) {
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
            break;
        }

        throw new Error('[SAN FATEL] ' + type + ' not match if.');
    }
}
// #[end]

exports = module.exports = createNodeByEl;
