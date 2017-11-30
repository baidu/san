

var each = require('../util/each');
var evalExpr = require('../runtime/eval-expr');

function evalArgs(args, data, owner) {
    var result = [];

    each(args, function (arg) {
        result.push(evalExpr(arg, data, owner));
    });

    return result;
}

exports = module.exports = evalArgs;
