/**
 * @file 生成序列化时桩的html
 * @author errorrik(errorrik@gmail.com)
 */

// #[begin] ssr
/**
 * 生成序列化时桩的html
 *
 * @param {string} type 桩类型标识
 * @param {string?} content 桩内的内容
 * @param {string?} extraPropSource 额外的桩元素属性
 * @return {string}
 */
function serializeStump(type, content, extraPropSource) {
    return '<script type="text/san" s-stump="' + type + '"'
        + (extraPropSource || '') + '>'
        + (content || '') + '</script>';
}
// #[end]

exports = module.exports = serializeStump;
