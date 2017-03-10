define(function (require) {
    var san = require('san');

    return san.defineComponent({
        template: ''
            + '<ul class="ui-colorpicker">'
            +    '<li '
            +        'san-for="item in datasource" '
            +        'style="background: {{item}}" '
            +        'class="{{item == value ? \'selected\' : \'\'}}" '
            +        'on-click="itemClick(item)"'
            +    '></li>'
            + '</ul>',

        initData: function () {
            return {
                datasource: [
                    '#c23531', '#314656', '#dd8668', '#91c7ae',
                    '#6e7074', '#bda29a', '#44525d', '#c4ccd3'
                ]
            };
        },

        itemClick: function (item) {
            this.data.set('value', item);
        }
    });
});
