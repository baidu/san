define(function (require) {


    var san = require('san-core')
    san.addFilter('formatDate', function (value, format) {
        return require('moment')(value).format(format);
    });

    san.register('ui-categorypicker', require('./ui/CategoryPicker'));
    san.register('ui-timepicker', require('./ui/TimePicker'));
    san.register('ui-calendar', require('./ui/Calendar'));
    san.register('ui-colorpicker', require('./ui/ColorPicker'));

    var router = require('./router');

    var List = require('./todo/List');
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
