define(function (require) {
    var san = require('san-core');

    function defineComponent(proto) {
        function ComponentClass(option) {
            san.Component.call(this, option);
        }

        ComponentClass.prototype = proto
        san.inherits(ComponentClass, san.Component);

        return ComponentClass;
    }

    return defineComponent;
});
