define(function (require) {
    var san = require('san-core');

    var $ = require('jquery');
    var layerTemplate = require('tpl!./TimePickerLayer.html');
    var Layer = san.defineComponent({
        template: layerTemplate,

        tagName: 'ul',

        itemClick: function (item) {
            this.data.set('value', item.value);
        }
    });


    return san.defineComponent({
        template: '<template on-click="mainClick()" class="ui-timepicker">{{ value | valueText }}</template>',

        filters: {
            valueText: function (value) {
                var datasource = this.data.get('datasource');
                var i = datasource.length;

                while (i--) {
                    var item = datasource[i];
                    if (item.value == value) {
                        return item.text;
                    }
                }

                return '';
            }
        },

        initData: function () {
            return {
                datasource: [
                    {text: '12:00am', value: 0},
                    {text: '1:00am', value: 1},
                    {text: '2:00am', value: 2},
                    {text: '3:00am', value: 3},
                    {text: '4:00am', value: 4},
                    {text: '5:00am', value: 5},
                    {text: '6:00am', value: 6},
                    {text: '7:00am', value: 7},
                    {text: '8:00am', value: 8},
                    {text: '9:00am', value: 9},
                    {text: '10:00am', value: 10},
                    {text: '11:00am', value: 11},
                    {text: '12:00pm', value: 12},
                    {text: '1:00pm', value: 13},
                    {text: '2:00pm', value: 14},
                    {text: '3:00pm', value: 15},
                    {text: '4:00pm', value: 16},
                    {text: '5:00pm', value: 17},
                    {text: '6:00pm', value: 18},
                    {text: '7:00pm', value: 19},
                    {text: '8:00pm', value: 20},
                    {text: '9:00pm', value: 21},
                    {text: '10:00pm', value: 22},
                    {text: '11:00pm', value: 23}
                ],
                left: -1000,
                top: 0
            };
        },


        attached: function () {
            if (!this.layer) {
                var layer = new Layer();
                layer.data.set('left', this.data.get('left'));
                layer.data.set('top', this.data.get('top'));
                layer.data.set('value', this.data.get('value'));
                layer.data.set('datasource', this.data.get('datasource'));

                this.layer = layer;

                var timePicker = this;
                layer.watch('value', function (value) {
                    timePicker.data.set('value', value);
                });

                this.watch('value', function (value) {
                    layer.data.set('value', value);
                });

                this.watch('left', function (left) {
                    layer.data.set('left', left);
                });

                this.watch('top', function (top) {
                    layer.data.set('top', top);
                });

                this.layer.attach(document.body);

                this._docClicker = this.docClicker.bind(this);
                $(document).on('click', this._docClicker);
            }
        },

        docClicker: function (e) {
            var target = e.target || e.srcElement;
            if (target !== this.el && $(target).closest(this.el).length === 0) {
                this.data.set('left', -1000);
            }
        },


        mainClick: function () {
            var left = this.data.get('left');
            if (left > 0) {
                this.data.set('left', -1000);
            }
            else {
                var pos = $(this.el).offset();
                this.data.set('left', pos.left);
                this.data.set('top', pos.top + this.el.offsetHeight + 1);
            }
        },

        disposed: function () {
            if (this.layer) {
                this.layer.dispose();
                this.layer = null;
                $(document).off('click', this._docClicker);
                this._docClicker = null;
            }
        }
    });
});
