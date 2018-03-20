

// #[begin] allua
function isSetHTMLNotAllow(node) {
    node = node.parent;
    while (node) {debugger
        switch (node.nodeType) {
            case NodeType.ELEM:
            case NodeType.CMPT:
                return node.aNode.hotspot.noSetHTML;
        }

        node = node.parent;
    }
}
// #[end]

exports = module.exports = isSetHTMLNotAllow;
