/**
 * @file 读取ident
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 读取ident
 *
 * @inner
 * @param {Walker} walker 源码读取对象
 * @return {string}
 */
function readIdent(walker) {
    var match = walker.match(/\s*([\$0-9a-z_]+)/ig);
    return match[1];
}

exports = module.exports = readIdent;
