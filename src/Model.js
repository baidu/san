// define(function () {
    function Model(parent) {
        this.parent = parent;
        this.data = {};
    }

    Model.prototype.set = function (expr, value) {
        if (typeof expr === 'string') {
            expr = parser.expr(expr);
        }

        var data = this.data;
        switch (expr.type) {
            case ExprType.IDENT:
                this.data[expr.name] = value;
                break;

            case ExprType.PROP_ACCESSOR:
                var paths = expr.paths;
                for (var i = 0; i < paths.length - 1; i++) {
                    var path = paths[i];
                    var pathValue = accessorItemValue(path, this);

                    data = data[pathValue];
                    if (!data) {
                        data = data[pathValue] = {};
                    }
                }

                data[accessorItemValue(paths[i], this)] = value;
        }
    };

    Model.prototype.get = function (expr) {
        if (typeof expr === 'string') {
            expr = parser.expr(expr);
        }

        switch (expr.type) {
            case ExprType.IDENT:
                return this.data[expr.name];

            case ExprType.PROP_ACCESSOR:
                var paths = expr.paths;
                var value = this.data[paths[0].name];

                for (var i = 1; value && i < paths.length; i++) {
                    var path = paths[i];
                    var pathValue = accessorItemValue(path, this);

                    value = value[pathValue];
                }

                if (value == null && this.parent) {
                    return this.parent.get(target);
                }

                return value;
        }

        return null;
    };

    function accessorItemValue(expr, model) {
        return expr.type === ExprType.IDENT
            ? expr.name
            : evalExpr(expr, model);
    }

// });
