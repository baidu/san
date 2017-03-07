

define(function (require) {
    var List = require('./todo/List-perf');
    var Form = require('./todo/Form');
    var AddCategory = require('./category/Add');
    var EditCategory = require('./category/Edit');

    var router = require('san-router').router;
    router.add({rule: '/', Component: List, target: '#wrap'});
    router.add({rule: '/todos/category/:category', Component: List, target: '#wrap'});
    router.add({rule: '/add', Component: Form, target: '#wrap'});
    router.add({rule: '/edit/:id', Component: Form, target: '#wrap'});
    router.add({rule: '/category/add', Component: AddCategory, target: '#wrap'});
    router.add({rule: '/category/edit', Component: EditCategory, target: '#wrap'});

    return {
        init: function () {
            router.start();
        }
    };

});

