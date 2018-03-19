/**
 * @file 是否 IE 并且小于 9
 * @author errorrik(errorrik@gmail.com)
 */

var ie = require('./ie');

// HACK:
// 1. IE8下，设置innerHTML时如果以html comment开头，comment会被自动滤掉
//    为了保证stump存在，需要设置完html后，createComment并appendChild/insertBefore
// 2. IE8下，innerHTML还不支持custom element，所以需要用div替代，不用createElement
// 3. 虽然IE8已经优化了字符串+连接，碎片化连接性能不再退化
//    但是由于上面多个兼容场景都用 < 9 判断，所以字符串连接也沿用
//    所以结果是IE8下字符串连接用的是数组join的方式

// #[begin] allua
/**
 * 是否 IE 并且小于 9
 */
var ieOldThan9 = ie && ie < 9;
// #[end]

exports = module.exports = ieOldThan9;
