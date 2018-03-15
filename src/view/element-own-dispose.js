/**
 * @file 销毁释放元素
 * @author errorrik(errorrik@gmail.com)
 */

var elementDispose = require('./element-dispose');
var elementLeave = require('./element-leave');

/**
 * 销毁释放元素
 *
 * @param {Object=} options dispose行为参数
 */
function elementOwnDispose(options) {
    this.leaveOption = {dispose: 1, options: options};
    elementLeave(this, options);
}

exports = module.exports = elementOwnDispose;
