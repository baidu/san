var elementAttached = require('./element-attached');

/**
 * 完成创建元素DOM后的行为
 */
function elementOwnAttached() {
    elementAttached(this);
}


exports = module.exports = elementOwnAttached;
