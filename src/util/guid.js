/**
 * @file 生成唯一id
 * @author errorrik(errorrik@gmail.com)
 */


/**
 * 唯一id的起始值
 *
 * @inner
 * @type {number}
 */
var guidIndex = 1;

/**
 * 获取唯一id
 *
 * @inner
 * @return {string} 唯一id
 */
function guid() {
    return '_san_' + (guidIndex++);
}

exports = module.exports = guid;
