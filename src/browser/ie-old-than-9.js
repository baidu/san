/**
 * @file 是否 IE 并且小于 9
 * @author errorrik(errorrik@gmail.com)
 */

var ie = require('./ie');

// HACK: IE8下，设置innerHTML时如果以html comment开头，comment会被自动滤掉
//       为了保证stump存在，需要设置完html后，createComment并appendChild/insertBefore
//       IE8下，innerHTML还不支持custom element，所以需要用div替代，不用createElement

/**
 * 是否 IE 并且小于 9
 */
var ieOldThan9 = ie && ie < 9;

exports = module.exports = ieOldThan9;
