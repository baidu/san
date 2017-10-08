/**
 * @file 将 binds 的 name 从 kebabcase 转换成 camelcase
 * @author errorrik(errorrik@gmail.com)
 */

var kebab2camel = require('../util/kebab2camel');
var IndexedList = require('../util/indexed-list');

/**
 * 将 binds 的 name 从 kebabcase 转换成 camelcase
 *
 * @param {IndexedList} binds binds集合
 * @return {IndexedList}
 */
function camelComponentBinds(binds) {
    var result = new IndexedList();
    binds.each(function (bind) {
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
