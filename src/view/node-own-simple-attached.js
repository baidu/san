/**
 * @file 执行完成attached状态的行为
 * @author errorrik(errorrik@gmail.com)
 */


/**
 * 执行完成attached状态的行为
 */
function nodeOwnSimpleAttached() {
    this._toPhase('attached');
}

exports = module.exports = nodeOwnSimpleAttached;
