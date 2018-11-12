/**
 * @file 覆盖 Component 原型方法的警告
 * @author dafrok(o.o@mug.dog)
 */

var Component = require('../view/component');

// #[begin] error
/**
 * 覆盖 Component 原型方法的警告
 *
 * @param {HTMLElement} instance 组件实例
 */
function warnOverrideSuperPrototype(instance) {

    /* eslint-disable no-console */
    if (typeof console === 'object' && console.warn) {
        for (var key in Component.prototype) {
            if (instance[key] !== Component.prototype[key]) {
                var message = '[SAN WARNING] \`' + key + '\` is a reserved key of san components. '
                    + 'Overriding this property may cause unknown exceptions.';
                console.warn(message);
            }
        }
    }
    /* eslint-disable no-console */

}
// #[end]

exports = module.exports = warnOverrideSuperPrototype;
