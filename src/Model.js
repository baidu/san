// define(function () {
    function Model(parent) {
        this.parent = parent;
        this.changeListeners = [];
        this.data = {};
    }

    Model.prototype.listenChange = function (expr, listener) {
        this.changeListeners.push({expr: expr, listener: listener});
    };

    Model.prototype.fireChange = function (change) {
        var me = this;
        for (var i = 0; i < this.changeListeners.length; i++) {
            var changeListener = this.changeListeners[i];

            if (isItemChange(changeListener.expr, change.expr)) {
                changeListener.listener.call(this, change);
            }
        }

        function isItemChange(listenExpr, changeExpr) {
            var listenSegs = listenExpr.paths;
            var changeSegs = changeExpr.paths;
            if (listenExpr.type !== ExprType.PROP_ACCESSOR) {
                listenSegs = [listenExpr];
            }
            if (changeExpr.type !== ExprType.PROP_ACCESSOR) {
                changeSegs = [changeExpr];
            }

            var listenLen = listenSegs.length;
            var changeLen = changeSegs.length;
            for (var i = 0; i < changeLen; i++) {
                if (i >= listenLen) {
                    return true;
                }

                var changeSeg = changeSegs[i];
                var listenSeg = listenSegs[i];

                if (listenSeg.type === ExprType.PROP_ACCESSOR) {
                    return true;
                }

                if (accessorItemValue(listenSeg, me) != accessorItemValue(changeSeg, me)) {
                    return false;
                }
            }

            return true;
        }
    };

    Model.prototype.set = function (expr, value) {
        if (typeof expr === 'string') {
            expr = parser.expr(expr);
        }

        var data = this.data;
        switch (expr.type) {
            case ExprType.IDENT:
                this.data[expr.name] = value;
                this.fireChange({
                    expr: expr
                });
                break;

            case ExprType.PROP_ACCESSOR:
                var pathValues = [];
                var paths = expr.paths;
                for (var i = 0; i < paths.length - 1; i++) {
                    var path = paths[i];
                    var pathValue = accessorItemValue(path, this);
                    pathValues.push(pathValue);

                    data = data[pathValue];
                    if (!data) {
                        data = data[pathValue] = {};
                    }
                }

                data[accessorItemValue(paths[i], this)] = value;
                this.fireChange({
                    expr: parser.expr(pathValues.join('.'))
                });
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
                    return this.parent.get(expr);
                }

                return value;
        }

        return null;
    };

    Model.prototype.push = function (expr, item) {
        if (typeof expr === 'string') {
            expr = parser.expr(expr);
        }
        var target = this.get(expr);

        if (target instanceof Array) {
            target.push(item);
            this.fireChange({
                expr: expr,
                type: ModelChange.ARRAY_PUSH,
                value: item,
                index: target.length - 1
            });
        }
    };

    Model.prototype.pop = function (expr) {
        if (typeof expr === 'string') {
            expr = parser.expr(expr);
        }
        var target = this.get(expr);

        if (target instanceof Array) {
            var value = target.pop();
            this.fireChange({
                expr: expr,
                type: ModelChange.ARRAY_POP,
                value: value
            });
        }
    };

    Model.prototype.shift = function (expr) {
        if (typeof expr === 'string') {
            expr = parser.expr(expr);
        }
        var target = this.get(expr);

        if (target instanceof Array) {
            var value = target.shift();
            this.fireChange({
                expr: expr,
                type: ModelChange.ARRAY_SHIFT,
                value: value
            });
        }
    };

    Model.prototype.unshift = function (expr, item) {
        if (typeof expr === 'string') {
            expr = parser.expr(expr);
        }
        var target = this.get(expr);

        if (target instanceof Array) {
            target.unshift(item);
            this.fireChange({
                expr: expr,
                type: ModelChange.ARRAY_PUSH,
                value: item
            });
        }
    };

    Model.prototype.splice = function (expr) {
        if (typeof expr === 'string') {
            expr = parser.expr(expr);
        }
        var target = this.get(expr);

        if (target instanceof Array) {
            var value = Array.prototype.splice.apply(
                target,
                Array.prototype.slice.call(arguments, 1)
            );
            this.fireChange({
                expr: expr,
                type: ModelChange.ARRAY_SPLICE,
                value: value
            });
        }
    };


    function accessorItemValue(expr, model) {
        return expr.type === ExprType.IDENT
            ? expr.name
            : evalExpr(expr, model);
    }

// });
