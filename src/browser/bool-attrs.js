/**
 * @file bool属性表
 * @author errorrik(errorrik@gmail.com)
 */


var splitStr2Obj = require('../util/split-str-2-obj');

/**
 * bool属性表
 *
 * @type {Object}
 */
var boolAttrs = splitStr2Obj('checked,readonly,selected,multiple,disabled');

exports = module.exports = boolAttrs;
