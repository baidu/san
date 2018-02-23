/**
 * 获取唯一id
 *
 * @inner
 * @return {Object}
 */
function getPropAndIndex(source, name) {
    if (!source._props) {
        source._props = {};
        each(source.props, function (value, index) {
            source._props[value.name] = index;
        });
    }

    var index = source._props[name];
    if (index != null) {
        return source.props[index];
    }
}

exports = module.exports = getPropAndIndex;
