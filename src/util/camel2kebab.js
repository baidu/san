/**
 * @file 把 camel case 字符串转换成 kebab case
 * @author errorrik(errorrik@gmail.com)
 */

// #[begin] ssr
/**
 * 把 camel case 字符串转换成 kebab case
 *
 * @param {string} source 源字符串
 * @return {string}
 */
function camel2kebab(source) {
    return source.replace(/[A-Z]/g, function (match) {
        return '-' + match.toLowerCase();
    });
}
// #[end]

exports = module.exports = camel2kebab;
