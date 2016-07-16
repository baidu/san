define(function (require) {
    var san = require('san-core');

    return san.Component({
        template: ''
            + '<ul class="ui-colorpicker">'
            +    '<li '
            +        'san-for="item in datasource" '
            +        'style="background: {{item}}" '
            +        'class="{{item == value | yesToBe(\'selected\')}}" '
            +        'on-click="itemClick(item)"'
            +    '></li>'
            + '</ul>',

        initData: {
            datasource: [
                '#c23531', '#314656', '#dd8668', '#91c7ae',
                '#6e7074', '#bda29a', '#44525d', '#c4ccd3'
            ]
        },

        itemClick: function (item) {
            this.data.set('value', item);
        }
    });
});
