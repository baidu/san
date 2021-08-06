/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 解析模板
 */


var Walker = require('./walker');
var ExprType = require('./expr-type');
var integrateAttr = require('./integrate-attr');
var parseText = require('./parse-text');
var svgTags = require('../browser/svg-tags');
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

    var rootNode = {
        directives: {},
        props: [],
        events: [],
        children: []
    };

    if (typeof source !== 'string') {
        return rootNode;
    }

    source = source.replace(/<!--([\s\S]*?)-->/mg, '');
    var walker = new Walker(source);
    walker.goUntil();

    var tagReg = /<(\/)?([a-z][a-z0-9-]*)\s*/ig;
    var attrReg = /([-:0-9a-z\[\]_]+)(\s*=\s*(([^'"<>\s]+)|"([^"]*?)"|'([^']*?)'))?\s*/ig;

    var tagMatch;
    var currentNode = rootNode;
    var stack = [rootNode];
    var stackIndex = 0;
    var beforeLastIndex = walker.index;

    while ((tagMatch = walker.match(tagReg)) != null) {
        var tagMatchStart = walker.index - tagMatch[0].length;
        var tagEnd = tagMatch[1];
        var tagName = tagMatch[2];
        if (!svgTags[tagName]) {
            tagName = tagName.toLowerCase();
        }

        // 62: >
        // 47: /
        // 处理 </xxxx >
        if (tagEnd) {
            if (walker.source.charCodeAt(walker.index) === 62) {
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


                pushTextNode(source.slice(beforeLastIndex, tagMatchStart));
                while (closeIndex > 0 && stack[closeIndex].tagName !== tagName) {
                    closeIndex--;
                }

                if (closeIndex > 0) {
                    stackIndex = closeIndex - 1;
                    currentNode = stack[stackIndex];
                }
                walker.index++;
            }
            // #[begin] error
            else {
                // 处理 </xxx 非正常闭合标签

                // 如果闭合标签时，匹配后的下一个字符是 <，即下一个标签的开始，那么当前闭合标签未闭合
                if (walker.source.charCodeAt(walker.index) === 60) {
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
        }
        else {
            var aElement = {
                directives: {},
                props: [],
                events: [],
                children: [],
                tagName: tagName
            };
            var tagClose = autoCloseTags[tagName];

            // 解析 attributes

            /* eslint-disable no-constant-condition */
            while (1) {
            /* eslint-enable no-constant-condition */

                var nextCharCode = walker.source.charCodeAt(walker.index);

                // 标签结束时跳出 attributes 读取
                // 标签可能直接结束或闭合结束
                if (nextCharCode === 62) {
                    walker.index++;
                    break;
                }

                // 遇到 /> 按闭合处理
                if (nextCharCode === 47
                    && walker.source.charCodeAt(walker.index + 1) === 62
                ) {
                    walker.index += 2;
                    tagClose = 1;
                    break;
                }

                // template 串结束了
                // 这时候，说明这个读取周期的所有内容，都是text
                if (!nextCharCode) {
                    pushTextNode(walker.source.slice(beforeLastIndex));
                    aElement = null;
                    break;
                }

                // #[begin] error
                // 在处理一个 open 标签时，如果遇到了 <， 即下一个标签的开始，则当前标签未能正常闭合，报错
                if (nextCharCode === 60) {
                    throw new Error('[SAN ERROR] ' + getXPath(stack, tagName) + ' is not closed');
                }
                // #[end]

                // 读取 attribute
                var attrMatch = walker.match(attrReg, 1);
                if (attrMatch) {
                    integrateAttr(
                        aElement,
                        attrMatch[1],
                        attrMatch[2] ? (attrMatch[5] || attrMatch[6] || attrMatch[4] || '') : void(0),
                        options
                    );
                }
                else {
                    pushTextNode(walker.source.slice(beforeLastIndex, walker.index));
                    aElement = null;
                    break;
                }
            }

            if (aElement) {
                pushTextNode(source.slice(beforeLastIndex, tagMatchStart));

                // handle show directive, append expr to style prop
                if (aElement.directives.show) {
                    // find style prop
                    var styleProp = null;
                    var propsLen = aElement.props.length;
                    while (propsLen--) {
                        if (aElement.props[propsLen].name === 'style') {
                            styleProp = aElement.props[propsLen];
                            break;
                        }
                    }

                    var showStyleExpr = {
                        type: ExprType.TERTIARY,
                        segs: [
                            aElement.directives.show.value,
                            {type: ExprType.STRING, value: ''},
                            {type: ExprType.STRING, value: ';display:none;'}
                        ]
                    };

                    if (styleProp) {
                        if (styleProp.expr.type === ExprType.TEXT) {
                            styleProp.expr.segs.push(showStyleExpr);
                        }
                        else {
                            aElement.props[propsLen].expr = {
                                type: ExprType.TEXT,
                                segs: [
                                    styleProp.expr,
                                    showStyleExpr
                                ]
                            };
                        }
                    }
                    else {
                        aElement.props.push({
                            name: 'style',
                            expr: showStyleExpr
                        });
                    }
                }

                // match if directive for else/elif directive
                var elseDirective = aElement.directives['else'] // eslint-disable-line dot-notation
                    || aElement.directives.elif;

                if (elseDirective) {
                    var parentChildrenLen = currentNode.children.length;
                    var ifANode = null;

                    while (parentChildrenLen--) {
                        var parentChild = currentNode.children[parentChildrenLen];
                        if (parentChild.textExpr) {
                            currentNode.children.splice(parentChildrenLen, 1);
                            continue;
                        }

                        ifANode = parentChild;
                        break;
                    }

                    // #[begin] error
                    if (!ifANode || !parentChild.directives['if']) { // eslint-disable-line dot-notation
                        throw new Error('[SAN FATEL] else not match if.');
                    }
                    // #[end]

                    if (ifANode) {
                        ifANode.elses = ifANode.elses || [];
                        ifANode.elses.push(aElement);
                    }
                }
                else {
                    if (aElement.tagName === 'tr' && currentNode.tagName === 'table') {
                        var tbodyNode = {
                            directives: {},
                            props: [],
                            events: [],
                            children: [],
                            tagName: 'tbody'
                        };
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

        }

        beforeLastIndex = walker.index;
    }

    pushTextNode(walker.source.slice(beforeLastIndex).replace(/^\s+$/, ''));

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
            var expr = parseText(text, options.delimiters);
            var lastChild = currentNode.children[currentNode.children.length - 1];
            var textExpr = lastChild && lastChild.textExpr;

            if (textExpr) {
                if (textExpr.segs) {
                    textExpr.segs = textExpr.segs.concat(expr.segs || expr);
                }
                else if (textExpr.value != null && expr.value != null) {
                    textExpr.value = textExpr.value + expr.value;
                }
                else {
                    lastChild.textExpr = {
                        type: ExprType.TEXT,
                        segs: [textExpr].concat(expr.segs || expr)
                    };
                }
            }
            else {
                currentNode.children.push({
                    textExpr: expr
                });
            }
        }
    }
}

/* eslint-enable fecs-max-statements */

exports = module.exports = parseTemplate;
