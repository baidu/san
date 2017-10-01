var nodeToAttached = require('./node-to-attached');

function nodeOwnToAttached(node) {
    nodeToAttached(this);
}


exports = module.exports = nodeToAttached;