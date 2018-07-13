/**
 * @file 解析模板
 * @author errorrik(errorrik@gmail.com)
 */


var createANode = require('./create-a-node');
var Walker = require('./walker');
var integrateAttr = require('./integrate-attr');
var parseText = require('./parse-text');
var autoCloseTags = require('../browser/auto-close-tags');

// #[begin] error
function getXPath(stack, currentTagName) {
    var path = ['ROOT'];
    for (var i = 1, len = stack.length; i < len; i++) {
        path.push(stack[i].tagName);
    }
    if (currentTagName) {
        path.push(currentTagName);
    }
    return path.join('>');
}
// #[end]

/* eslint-disable fecs-max-statements */

/**
 * 解析 template
 *
 * @param {string} source template源码
 * @param {Object?} options 解析参数
 * @param {string?} options.trimWhitespace 空白文本的处理策略。none|blank|all
 * @param {Array?} options.delimiters 插值分隔符列表
 * @return {ANode}
 */
function parseTemplate(source, options) {
    options = options || {};
    options.trimWhitespace = options.trimWhitespace || 'none';

    var rootNode = createANode();

    if (typeof source !== 'string') {
        return rootNode;
    }

    source = source.replace(/<!--([\s\S]*?)-->/mg, '').replace(/(^\s+|\s+$)/g, '');
    var walker = new Walker(source);

    var tagReg = /<(\/)?([a-z0-9-]+)\s*/ig;
    var attrReg = /([-:0-9a-z\(\)\[\]]+)(\s*=\s*(['"])([^\3]*?)\3)?\s*/ig;

    var tagMatch;
    var currentNode = rootNode;
    var stack = [rootNode];
    var stackIndex = 0;
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
        // 处理 </xxxx >
        if (tagEnd && walker.currentCode() === 62) {
            // 满足关闭标签的条件时，关闭标签
            // 向上查找到对应标签，找不到时忽略关闭
            var closeIndex = stackIndex;

            // #[begin] error
            // 如果正在闭合一个自闭合的标签，例如 </input>，报错
            if (autoCloseTags[tagName]) {
                throw new Error(''
                    + '[SAN ERROR] ' + getXPath(stack, tagName) + ' is a `auto closed` tag, '
                    + 'so it cannot be closed with </' + tagName + '>'
                );
            }

            // 如果关闭的 tag 和当前打开的不一致，报错
            if (
                stack[closeIndex].tagName !== tagName
                // 这里要把 table 自动添加 tbody 的情况给去掉
                && !(tagName === 'table' && stack[closeIndex].tagName === 'tbody')
            ) {
                throw new Error('[SAN ERROR] ' + getXPath(stack) + ' is closed with ' + tagName);
            }
            // #[end]

            while (closeIndex > 0 && stack[closeIndex].tagName !== tagName) {
                closeIndex--;
            }

            if (closeIndex > 0) {
                stackIndex = closeIndex - 1;
                currentNode = stack[stackIndex];
            }
            walker.go(1);
        }

        // #[begin] error
        // 处理 </xxx 非正常闭合标签
        else if (tagEnd) {

            // 如果闭合标签时，匹配后的下一个字符是 <，即下一个标签的开始，那么当前闭合标签未闭合
            if (walker.currentCode() === 60) {
                throw new Error(''
                    + '[SAN ERROR] ' + getXPath(stack)
                    + '\'s close tag not closed'
                );
            }

            // 闭合标签有属性
            throw new Error(''
                + '[SAN ERROR] ' + getXPath(stack)
                + '\'s close tag has attributes'
            );

        }
        // #[end]

        else if (!tagEnd) {
            var aElement = createANode({
                tagName: tagName
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
                // 遇到 /> 按闭合处理
                else if (nextCharCode === 47
                    && walker.charCode(walker.index + 1) === 62
                ) {
                    walker.go(2);
                    tagClose = 1;
                    break;
                }

                // #[begin] error
                // 在处理一个 open 标签时，如果遇到了 <， 即下一个标签的开始，则当前标签未能正常闭合，报错
                if (nextCharCode === 60) {
                    throw new Error('[SAN ERROR] ' + getXPath(stack, tagName) + ' is not closed');
                }
                // #[end]

                // 读取 attribute
                var attrMatch = walker.match(attrReg);
                if (attrMatch) {

                    // #[begin] error
                    // 如果属性有 =，但没取到 value，报错
                    if (
                        walker.charCode(attrMatch.index + attrMatch[1].length) === 61
                        && !attrMatch[2]
                    ) {
                        throw new Error(''
                            + '[SAN ERROR] ' + getXPath(stack, tagName) + ' attribute `'
                            + attrMatch[1] + '` is not wrapped with ""'
                        );
                    }
                    // #[end]

                    integrateAttr(
                        aElement,
                        attrMatch[1],
                        attrMatch[2] ? attrMatch[4] : '',
                        options
                    );
                }

            }

            // match if directive for else/elif directive
            var elseDirective = aElement.directives['else'] || aElement.directives.elif; // eslint-disable-line dot-notation
            if (elseDirective) {
                var parentChildrenLen = currentNode.children.length;

                while (parentChildrenLen--) {
                    var parentChild = currentNode.children[parentChildrenLen];
                    if (parentChild.textExpr) {
                        currentNode.children.splice(parentChildrenLen, 1);
                        continue;
                    }

                    // #[begin] error
                    if (!parentChild.directives['if']) { // eslint-disable-line dot-notation
                        throw new Error('[SAN FATEL] else not match if.');
                    }
                    // #[end]

                    parentChild.elses = parentChild.elses || [];
                    parentChild.elses.push(aElement);

                    break;
                }
            }
            else {
                if (aElement.tagName === 'tr' && currentNode.tagName === 'table') {
                    var tbodyNode = createANode({
                        tagName: 'tbody'
                    });
                    currentNode.children.push(tbodyNode);
                    currentNode = tbodyNode;
                    stack[++stackIndex] = tbodyNode;
                }

                currentNode.children.push(aElement);
            }

            if (!tagClose) {
                currentNode = aElement;
                stack[++stackIndex] = aElement;
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
        switch (options.trimWhitespace) {
            case 'blank':
                if (/^\s+$/.test(text)) {
                    text = null;
                }
                break;

            case 'all':
                text = text.replace(/(^\s+|\s+$)/g, '');
                break;
        }

        if (text) {
            currentNode.children.push(createANode({
                textExpr: parseText(text, options.delimiters)
            }));
        }
    }
}

/* eslint-enable fecs-max-statements */

exports = module.exports = parseTemplate;
