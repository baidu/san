

var each = require('../util/each');

function splitStr2Obj(source) {
    var result = {};
    each(
        source.split(','),
        function (key) {
            result[key] = 1;
        }
    );
    return result;
}

exports = module.exports = splitStr2Obj;
