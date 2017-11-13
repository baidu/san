/**
 * @file 判断方法是否是原生的方法
 * @author zhanglei55(zhanglei55@baidu.com)
 */

/**
 * 判断方法是否是原生的方法
 *
 * @param {Function} method 要判断的函数
 * @return {boolean}
 */
function isNative(method) {
  return typeof method === 'function' && /native code/.test(method.toString())
}

exports = module.exports = isNative;
