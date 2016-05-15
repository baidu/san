// define(function () {
    function Model(parent) {
        this.parent = parent;
        this.data = {};
    }

    Model.prototype.set = function (target, value) {
        if (typeof target === 'string') {
            target = parser.expr(target);
        }

        var data = this.data;
        for (var i = 0; i < target.expr.length - 1; i++) {
            data = data[target.expr[i].value];
            if (!data) {
                data = data[target.expr[i].value] = {};
            }
        }

        data[target.expr[i].value] = value;
    };

    Model.prototype.get = function (target) {

        if (typeof target === 'string') {
            target = parser.expr(target);
        }

        var value = evalExprValue(target, this);
        if (value == null && this.parent) {
            return this.parent.get(target);
        }

        return value;
    };

    function evalExprValue(expr, model) {
        switch (expr.type) {
            case 'String':
            case 'Number':
                return (new Function('return ' + expr.value))();

            case 'Identifier':
                return model.data[expr.value];

            case 'PropertyAccessor':
                var value = model.data[expr.value[0].value];
                for (var i = 1; i < value && expr.value.length; i++) {
                    var accessorItem = expr.value[i];
                    var accessorItemValue;
                    if (accessorItem.type === 'Identifier') {
                        accessorItemValue = accessorItem.value;
                    }
                    else {
                        accessorItemValue = evalExprValue(accessorItem, model);
                    }

                    value = value[accessorItemValue];
                }
                return value;
        }
    }

// });
