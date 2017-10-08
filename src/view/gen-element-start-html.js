/**
 * @file 生成元素标签起始的html
 * @author errorrik(errorrik@gmail.com)
 */

var evalExpr = require('../runtime/eval-expr');
var isComponent = require('./is-component');
var getPropHandler = require('./get-prop-handler');

/**
 * 生成元素标签起始的html
 *
 * @param {Element} element 元素
 * @param {StringBuffer} buf html串存储对象
 */
function genElementStartHTML(element, buf) {
    if (!element.tagName) {
        return;
    }

    var shouldInitDynamicProp;
    if (!element.dynamicProps) {
        shouldInitDynamicProp = 1;
        element.dynamicProps = new IndexedList();
    }
    pushStrBuffer(buf, '<' + element.tagName + ' id="' + element.id + '"');

    element.props.each(function (prop) {
        if (prop.attr) {
            pushStrBuffer(buf, prop.attr);
            return;
        }

        if (shouldInitDynamicProp) {
            element.dynamicProps.push(prop);
        }

        var value = isComponent(element)
            ? evalExpr(prop.expr, element.data, element)
            : nodeEvalExpr(element, prop.expr, 1);

        pushStrBuffer(buf,
            getPropHandler(element, prop.name)
                .attr(element, prop.name, value)
            || ''
        );
    });

    pushStrBuffer(buf, '>');
}

exports = module.exports = genElementStartHTML;
