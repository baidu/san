/**
 * @file 获取节点对应的主元素id
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 获取节点对应的主元素id
 *
 * @return {string}
 */
function elementOwnGetElId() {
    var id;
    if (this.aNode.hotspot.idProp) {
        id = this.nodeType === NodeType.CMPT
            ? evalExpr(this.aNode.hotspot.idProp.expr, this.data, this)
            : evalExpr(this.aNode.hotspot.idProp.expr, this.scope, this.owner, 1);
    }

    return (this._elId = id || this.id);
}


exports = module.exports = elementOwnGetElId;
