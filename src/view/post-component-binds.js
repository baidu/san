/**
 * @file 将组件的绑定信息进行后处理
 * @author errorrik(errorrik@gmail.com)
 */


/**
 * 将组件的绑定信息进行后处理
 *
 * 扁平化：
 * 当 text 解析只有一项时，要么就是 string，要么就是 interp
 * interp 有可能是绑定到组件属性的表达式，不希望被 eval text 成 string
 * 所以这里做个处理，只有一项时直接抽出来
 *
 * bool属性：
 * 当绑定项没有值时，默认为true
 *
 * @param {IndexedList} binds 组件绑定信息集合对象
 */
function postComponentBinds(binds) {
    binds.each(function (bind) {
        var expr = bind.expr;

        if (expr.type === ExprType.TEXT) {
            switch (expr.segs.length) {
                case 0:
                    bind.expr = {
                        type: ExprType.BOOL,
                        value: true
                    };
                    break;

                case 1:
                    expr = bind.expr = expr.segs[0];
                    if (expr.type === ExprType.INTERP && expr.filters.length === 0) {
                        bind.expr = expr.expr;
                    }
            }
        }
    });
}

exports = module.exports = postComponentBinds;
