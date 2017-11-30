

var each = require('../util/each');
var evalExpr = require('../runtime/eval-expr');

function findMethod(source, nameExpr, data) {
    var method = source;
    each(nameExpr.paths, function (pathExpr) {
        method = method[evalExpr(pathExpr, data)];
        return method != null;
    });

    return method;
}

exports = module.exports = findMethod;
