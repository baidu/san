define(function (require) {

    var router = require('./router');

    var List = require('./todo/List-perf');
    var Form = require('./todo/Form');
    var AddCategory = require('./category/Add');
    var EditCategory = require('./category/Edit');

    router.route('/', List);
    router.route(/^\/todos\/category\/([0-9]+)$/, List);
    router.route(/^\/add$/, Form);
    router.route(/^\/edit\/([0-9]+)$/, Form);
    router.route(/^\/category\/add$/, AddCategory);
    router.route(/^\/category\/edit$/, EditCategory);

    return {
        init: function () {
            router.start();
        }
    };

});
