define(function (require) {


    var sanVM = require('san-vm')
    sanVM.addFilter('formatDate', function (value, format) {
        return require('moment')(value).format(format);
    });

    var router = require('./router');

    var List = require('./todo/List');
    router.route('/', List);
    router.route(/\/category\/([0-9]+)$/, List);

    return {
        init: function () {
            router.start();
        }
    }

});
