/**
 * @file 解析模板
 * @author errorrik(errorrik@gmail.com)
 */


var createANode = require('./create-a-node');
var Walker = require('./walker');
var ExprType = require('./expr-type');
var integrateAttr = require('./integrate-attr');
var autoCloseTags = require('../browser/auto-close-tags');

/**
 * 解析 template
 *
 * @param {string} source template 源码
 * @return {ANode}
 */
function parseTemplate(source) {
    var rootNode = createANode();

    if (typeof source !== 'string') {
        return rootNode;
    }

    source = source.replace(/<!--([\s\S]*?)-->/mg, '').replace(/(^\s+|\s+$)/g, '');
    var walker = new Walker(source);

    var tagReg = /<(\/)?([a-z0-9-]+)\s*/ig;
    var attrReg = /([-:0-9a-z\(\)\[\]]+)(=(['"])([^\3]*?)\3)?\s*/ig;

    var tagMatch;
    var currentNode = rootNode;
    var beforeLastIndex = 0;

    while ((tagMatch = walker.match(tagReg)) != null) {
        var tagEnd = tagMatch[1];
        var tagName = tagMatch[2].toLowerCase();

        pushTextNode(source.slice(
            beforeLastIndex,
            walker.index - tagMatch[0].length
        ));

        // 62: >
        // 47: /
        if (tagEnd && walker.currentCode() === 62) {
            // 满足关闭标签的条件时，关闭标签
            // 向上查找到对应标签，找不到时忽略关闭
            var closeTargetNode = currentNode;
            while (closeTargetNode && closeTargetNode.tagName !== tagName) {
                closeTargetNode = closeTargetNode.parent;
            }

            closeTargetNode && (currentNode = closeTargetNode.parent);
            walker.go(1);
        }
        else if (!tagEnd) {
            var aElement = createANode({
                tagName: tagName,
                parent: currentNode
            });
            var tagClose = autoCloseTags[tagName];

            // 解析 attributes

            /* eslint-disable no-constant-condition */
            while (1) {
            /* eslint-enable no-constant-condition */

                var nextCharCode = walker.currentCode();

                // 标签结束时跳出 attributes 读取
                // 标签可能直接结束或闭合结束
                if (nextCharCode === 62) {
                    walker.go(1);
                    break;
                }
                else if (nextCharCode === 47
                    && walker.charCode(walker.index + 1) === 62
                ) {
                    walker.go(2);
                    tagClose = 1;
                    break;
                }

                // 读取 attribute
                var attrMatch = walker.match(attrReg);
                if (attrMatch) {
                    integrateAttr(
                        aElement,
                        attrMatch[1],
                        attrMatch[2] ? attrMatch[4] : ''
                    );
                }
            }

            // match if directive for else/elif directive
            var elseDirective = aElement.directives.get('else') || aElement.directives.get('elif');
            if (elseDirective) {
                var parentChildsLen = currentNode.childs.length;

                while (parentChildsLen--) {
                    var parentChild = currentNode.childs[parentChildsLen];
                    if (parentChild.isText) {
                        currentNode.childs.splice(parentChildsLen, 1);
                        continue
                    }

                    var childIfDirective = parentChild.directives.get('if');

                    // #[begin] error
                    if (!childIfDirective) {
                        throw new Error('[SAN FATEL] else not match if.');
                    }
                    // #[end]

                    parentChild.elses = parentChild.elses || [];
                    parentChild.elses.push(aElement);

                    break;
                }
            }
            else {
                currentNode.childs.push(aElement);
            }

            if (!tagClose) {
                currentNode = aElement;
            }
        }

        beforeLastIndex = walker.index;
    }

    pushTextNode(walker.cut(beforeLastIndex));

    return rootNode;

    /**
     * 在读取栈中添加文本节点
     *
     * @inner
     * @param {string} text 文本内容
     */
    function pushTextNode(text) {
        if (text) {
            currentNode.childs.push(createANode({
                isText: 1,
                text: text,
                parent: currentNode
            }));
        }
    }
}

exports = module.exports = parseTemplate;
