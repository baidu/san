
/**
 * 将组件的绑定信息进行扁平处理
 *
 * 当 text 解析只有一项时，要么就是 string，要么就是 interp
 * interp 有可能是绑定到组件属性的表达式，不希望被 eval text 成 string
 * 所以这里做个处理，只有一项时直接抽出来
 *
 * @param {IndexedList} binds 组件绑定信息集合对象
 */
function flatComponentBinds(binds) {
    binds.each(function (bind) {
        var expr = bind.expr;

        if (expr.type === ExprType.TEXT && expr.segs.length === 1) {
            expr = bind.expr = expr.segs[0];
            if (expr.type === ExprType.INTERP && expr.filters.length === 0) {
                bind.expr = expr.expr;
            }
        }
    });
}

exports = module.exports = flatComponentBinds;
