define(function (require) {
    var defineComponent = require('../defineComponent');

    var $ = require('jquery');
    var moment = require('moment');
    var layerTemplate = require('tpl!./CalendarLayer.html');
    var Layer = defineComponent({
        template: layerTemplate,

        filters: {
            isSelected: function (date, value) {
                return date === value.getDate()
                    && this.data.get('viewMonth') === value.getMonth()
                    && this.data.get('viewYear') === value.getFullYear();
            }
        },

        updateViewState: function () {
            var viewYear = this.data.get('viewYear');
            var viewMonth = this.data.get('viewMonth');


            var viewDate = new Date(viewYear, viewMonth, 1);
            viewYear = viewDate.getFullYear();
            viewMonth = viewDate.getMonth();
            this.data.set('viewYear', viewYear);
            this.data.set('viewMonth', viewMonth);

            var dates = [];
            var day = viewDate.getDay() - 1;
            for (; day % 7; day--) {
                dates.push('');
            }
            var nextMonth = new Date(viewYear, viewMonth + 1, 1);
            var days = (nextMonth - viewDate) / 24 / 60 / 60 / 1000;
            for (var i = 1; i <= days; i++) {
                dates.push(i);
            }

            this.data.set('dates', dates);
        },

        hide: function () {
            this.data.set('left', -1000);
        },

        show: function (pos) {console.log(pos)
            this.data.set('left', pos.left);
            this.data.set('top', pos.top);

            var value = this.data.get('value');
            this.data.set('viewYear', value.getFullYear());
            this.data.set('viewMonth', value.getMonth());

            this.updateViewState();
        },

        isHide: function () {
            return this.data.get('left') < 0;
        },

        presanonth: function () {
            var viewMonth = this.data.get('viewMonth');
            this.data.set('viewMonth', viewMonth - 1);
            this.updateViewState();
        },

        nextMonth: function () {
            var viewMonth = this.data.get('viewMonth');
            this.data.set('viewMonth', viewMonth + 1);
            this.updateViewState();
        },

        select: function (date) {
            this.data.set('value', new Date(
                this.data.get('viewYear'),
                this.data.get('viewMonth'),
                date
            ));
            this.hide();
        }
    });


    return defineComponent({
        template: '<template on-click="mainClick()" class="ui-calendar">{{ value | valueText }}</template>',

        initData: {
            value: new Date()
        },

        initLayer: function () {
            if (!this.layer) {
                var layer = new Layer({
                    initData: {
                        left: -1000,
                        top: 0,
                        value: this.data.get('value')
                    }
                });
                this.layer = layer;

                var calendar = this;
                layer.watch('value', function (value) {
                    calendar.data.set('value', value);
                });

                this.watch('value', function (value) {
                    layer.data.set('value', value);
                });

                this.layer.attach(document.body);

                this._docClicker = this.docClicker.bind(this);
                $(document).on('click', this._docClicker);
            }
        },

        docClicker: function (e) {
            var target = e.target || e.srcElement;
            if (target !== this.el
                && $(target).closest(this.el).length === 0
                && $(target).closest(this.layer.el).length === 0
            ) {
                this.hideLayer();
            }
        },


        mainClick: function () {
            this.initLayer();
            if (this.layer.isHide()) {
                this.showLayer();
            }
            else {
                this.hideLayer();
            }
        },

        showLayer: function () {
            var pos = $(this.el).offset();
            this.layer.show({
                left: pos.left,
                top: pos.top + this.el.offsetHeight + 1
            });
        },

        hideLayer: function () {
            this.layer && this.layer.hide();
        },

        disposed: function () {
            if (this.layer) {
                this.layer.dispose();
                this.layer = null;
                $(document).off('click', this._docClicker);
                this._docClicker = null;
            }
        },

        filters: {
            valueText: function (value) {
                if (value instanceof Date) {
                    return moment(value).format('YYYY-MM-DD');
                }

                return '';
            }
        }
    });
});
