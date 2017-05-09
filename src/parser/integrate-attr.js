/**
 * @file 解析抽象节点属性
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');
var parseExpr = require('./parse-expr');
var parseCall = require('./parse-call');
var parseText = require('./parse-text');
var parseDirective = require('./parse-directive');
var ExprType = require('./expr-type');

/**
 * 解析抽象节点属性
 *
 * @param {ANode} aNode 抽象节点
 * @param {string} name 属性名称
 * @param {string} value 属性值
 * @param {boolean=} ignoreNormal 是否忽略无前缀的普通属性
 */
function integrateAttr(aNode, name, value, ignoreNormal) {
    if (name === 'id') {
        aNode.id = value;
        return;
    }

    var prefixIndex = name.indexOf('-');
    var realName;
    var prefix;

    if (prefixIndex > 0) {
        prefix = name.slice(0, prefixIndex);
        realName = name.slice(prefixIndex + 1);
    }

    switch (prefix) {
        case 'on':
            aNode.events.push({
                name: realName,
                expr: parseCall(value)
            });
            break;

        case 'san':
            var directive = parseDirective(realName, value);
            directive && aNode.directives.push(directive);
            break;

        case 'prop':
            integrateProp(aNode, realName, value);
            break;

        default:
            if (!ignoreNormal) {
                integrateProp(aNode, name, value);
            }
    }
}

/**
 * 解析抽象节点绑定属性
 *
 * @inner
 * @param {ANode} aNode 抽象节点
 * @param {string} name 属性名称
 * @param {string} value 属性值
 */
function integrateProp(aNode, name, value) {
    // parse two way binding, e.g. value="{=ident=}"
    var xMatch = value.match(/^\{=\s*(.*?)\s*=\}$/);

    if (xMatch) {
        aNode.props.push({
            name: name,
            expr: parseExpr(xMatch[1]),
            x: 1,
            raw: value
        });

        return;
    }

    // parse normal prop
    aNode.props.push(textPropExtra({
        name: name,
        expr: parseText(value),
        raw: value
    }));
}

/**
 * 为text类型的属性绑定附加额外的行为，用于一些特殊需求，比如class中插值的自动展开
 *
 * @inner
 * @param {Object} prop 绑定信息
 * @return {Object}
 */
function textPropExtra(prop) {
    // 这里不能把只有一个插值的属性抽取
    // 因为插值里的值可能是html片段，容易被注入
    // 组件的数据绑定在组件init时做抽取
    switch (prop.name) {
        case 'class':
        case 'style':
            each(prop.expr.segs, function (seg) {
                if (seg.type === ExprType.INTERP) {
                    seg.filters.push({
                        type: ExprType.CALL,
                        name: '_' + prop.name,
                        args: []
                    });
                }
            });
            break;
    }

    return prop;
}

exports = module.exports = integrateAttr;
