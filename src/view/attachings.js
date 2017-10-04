
var attachingNodes = [];

var attachings = {
    add: function (node) {
        attachingNodes.push(node);
    },

    done: function () {
        for (var i = 0, l = attachingNodes.length; i < l; i++) {
            var node = attachingNodes[i];
            node._attached();
        }

        attachingNodes = [];
    }
};

exports = module.exports = attachings;

