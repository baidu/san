define(function (require) {
    return {
        formatDate: function (value, format) {
            return require('moment')(value).format(format);
        }
    };
});
