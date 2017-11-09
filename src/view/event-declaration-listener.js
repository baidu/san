/**
 * @file 声明式事件的监听函数
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');
var evalExpr = require('../runtime/eval-expr');
var ExprType = require('../parser/expr-type');

/**
 * 声明式事件的监听函数
 *
 * @param {Object} eventBind 绑定信息对象
 * @param {boolean} isComponentEvent 是否组件自定义事件
 * @param {Model} model 数据环境
 * @param {Event} e 事件对象
 */
function eventDeclarationListener(eventBind, isComponentEvent, model, e) {
    var args = [];
    var expr = eventBind.expr;
    if (!expr.args.length) {
        if (!isComponentEvent) {
            args.push(e || window.event);
        }
    }
    else {
        each(expr.args, function (argExpr) {
            args.push(argExpr.type === ExprType.ACCESSOR
                    && argExpr.paths.length === 1
                    && argExpr.paths[0].value === '$event'
                ? (isComponentEvent ? e : e || window.event)
                : evalExpr(argExpr, model)
            );
        });
    }

    var method = this[expr.name];
    if (typeof method === 'function') {
        method.apply(this, args);
    }
}

exports = module.exports = eventDeclarationListener;
