
var elementUpdateChilds = require('./element-update-childs');

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
 function elementOwnUpdateView(changes) {
    this._getEl();
    var me = this;

    this.props.each(function (prop) {
        if (prop.expr.value) {
            return;
        }

        each(changes, function (change) {
            if (!isDataChangeByElement(change, me, prop.name)
                && changeExprCompare(change.expr, prop.expr, me.scope)
            ) {
                me.setProp(prop.name, nodeEvalExpr(me, prop.expr));
                return false;
            }
        });
    });

    var htmlDirective = this.aNode.directives.get('html');
    if (htmlDirective) {
        each(changes, function (change) {
            if (changeExprCompare(change.expr, htmlDirective.value, me.scope)) {
                // #[begin] error
                warnSetHTML(me.el);
                // #[end]
                me.el.innerHTML = nodeEvalExpr(me, htmlDirective.value);
                return false;
            }
        });
    }
    else {
        elementUpdateChilds(this, changes);
    }
}


exports = module.exports = elementOwnUpdateView;
