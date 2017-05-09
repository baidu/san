/**
 * @file else指令处理类
 * @author errorrik(errorrik@gmail.com)
 */

var ExprType = require('../parser/expr-type');
var TextNode = require('./text-node');
var IfDirective = require('./if-directive');
var isStump = require('./is-stump');

/**
 * else 指令处理类
 * 不做具体事情，直接归约成 if
 *
 * @class
 * @param {Object} options 初始化参数
 */
function ElseDirective(options) {
    var parentChilds = options.parent.childs;

    var len = parentChilds.length;
    while (len--) {
        var child = parentChilds[len];

        if (child instanceof IfDirective) {
            var directiveValue = {
                name: 'if',
                value: {
                    type: ExprType.UNARY,
                    expr: child.aNode.directives.get('if').value
                },
                isElse: 1
            };
            options.aNode.directives.push(directiveValue);

            // #[begin] reverse
            if (options.el) {
                if (isStump(options.el)) {
                    options.el.setAttribute('san-stump', 'if');
                }
                else {
                    options.el.removeAttribute('san-else');
                }
            }
            // #[end]

            options.ifDirective = directiveValue;
            return new IfDirective(options);
        }

        // #[begin] error
        if (!(child instanceof TextNode)) {
            throw new Error('[SAN FATEL] else not match if.');
        }
        // #[end]
    }
}

exports = module.exports = ElseDirective;
