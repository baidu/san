/**
 * @file 将 binds 的 name 从 kebabcase 转换成 camelcase
 * @author errorrik(errorrik@gmail.com)
 */

var kebab2camel = require('../util/kebab2camel');
var each = require('../util/each');

/**
 * 将 binds 的 name 从 kebabcase 转换成 camelcase
 *
 * @param {Array} binds binds集合
 * @return {Array}
 */
function camelComponentBinds(binds) {
    var result = [];
    each(binds, function (bind) {
        result.push({
            name: kebab2camel(bind.name),
            expr: bind.expr,
            x: bind.x,
            raw: bind.raw
        });
    });

    return result;
}

exports = module.exports = camelComponentBinds;
