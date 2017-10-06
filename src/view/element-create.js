
var nodeEvalExpr = require('./node-eval-expr');

function elementCreate(node) {
    node.lifeCycle.set('painting');
    node.el = createEl(node.tagName);
    node.el.id = node.id;

    node.props.each(function (prop) {
        var value = isComponent(node)
            ? evalExpr(prop.expr, node.data, node)
            : nodeEvalExpr(node, prop.expr, 1);

        var match = /^\s+([a-z0-9_-]+)=(['"])([^\2]*)\2$/i.exec(
            getPropHandler(node, prop.name).attr(node, prop.name, value)
        );

        if (match) {
            node.el.setAttribute(match[1], match[3]);
        }
    });
}

exports = module.exports = elementCreate;
