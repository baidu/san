/**
 * @file 在内部调用 data type 校验时携带的内部标识
 * @author leon <ludafa@outlook.com>
 */


// 这么干是为了防止 data type 被在外部直接调用；
// 因为我们在 production 模式下不进校验，DataTypes 的各个函数只返回空函数

var DATA_TYPES_SECRET = 'SAN_DATA_TYPE_SECRET_DONT_USE_OR_YOU_WILL_BE_FIRED';

module.exports = DATA_TYPES_SECRET;
