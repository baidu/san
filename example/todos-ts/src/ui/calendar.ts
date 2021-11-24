import san from 'san'
import $ from 'jquery'
import { formatDate } from '../filters'

import "./calendar.css"

interface Pos {
    left: number;
    top: number;
}

const Layer = san.defineComponent<{
    viewYear: number;
    viewMonth: number;
    value: Date;

    left: number;
    top: number;
}>({
    template: `
    <div class="ui-layer ui-calendar-layer" style="left: {{left}}px; top: {{top}}px">
        <div class="ui-calendar-func">
            <i class="fa fa-angle-left" on-click="prevMonth"></i>
            <b>{{ viewYear }}-{{ viewMonth + 1 }}</b>
            <i class="fa fa-angle-right" on-click="nextMonth"></i>
        </div>
        <ol class="date-head">
            <li>一</li>
            <li>二</li>
            <li>三</li>
            <li>四</li>
            <li>五</li>
            <li>六</li>
            <li>日</li>
        </ol>
        <ol>
            <li s-for="item in dates" on-click="select(item)"
                class="{{ item | selectedClass(value)}}">{{item}}</li>
        </ol>
    </div>
    `,

    filters: {
        selectedClass(date: number, value: Date) {
            return date === value.getDate()
                && this.data.get('viewMonth') === value.getMonth()
                && this.data.get('viewYear') === value.getFullYear()
                ? 'selected'
                : '';
        }
    },

    updateViewState() {
        let viewYear = this.data.get('viewYear');
        let viewMonth = this.data.get('viewMonth');

        let viewDate = new Date(viewYear, viewMonth, 1);
        viewYear = viewDate.getFullYear();
        viewMonth = viewDate.getMonth();
        this.data.set('viewYear', viewYear);
        this.data.set('viewMonth', viewMonth);

        let dates = [];
        let day = viewDate.getDay() - 1;

        for (; day % 7; day--) {
            dates.push('');
        }
        let nextMonth = new Date(viewYear, viewMonth + 1, 1);
        let days = (nextMonth.getTime() - viewDate.getTime()) / 24 / 60 / 60 / 1000;
        for (let i = 1; i <= days; i++) {
            dates.push(i);
        }
        this.data.set('dates', dates);
    },

    hide() {
        this.data.set('left', -1000);
    },

    show(pos: Pos) {
        this.data.set('left', pos.left);
        this.data.set('top', pos.top);

        let value = this.data.get('value');
        this.data.set('viewYear', value.getFullYear());
        this.data.set('viewMonth', value.getMonth());

        this.updateViewState();
    },

    isHide() {
        return this.data.get('left') < 0;
    },

    prevMonth() {
        let viewMonth = this.data.get('viewMonth');
        this.data.set('viewMonth', viewMonth - 1);
        this.updateViewState();
    },

    nextMonth() {
        let viewMonth = this.data.get('viewMonth');
        this.data.set('viewMonth', viewMonth + 1);
        this.updateViewState();
    },

    select(date: number) {
        let newDate = new Date(
            this.data.get('viewYear'),
            this.data.get('viewMonth'),
            date
        );
        this.data.set('value', newDate);
        this.fire('select', newDate);

        this.hide();
    }
});


export default san.defineComponent<{value: Date}>({
    template: `
    <div on-click="mainClick" class="ui-calendar">
        {{ value | formatDate('YYYY-MM-DD') }}
    </div>
    `,

    initData() {
        return {
            value: new Date()
        };
    },

    filters: {
        formatDate
    },

    initLayer() {
        let layer = new Layer();
        layer.data.set('left', -1000);
        layer.data.set('top', 0);
        layer.data.set('value', this.data.get('value'));

        this.layer = layer;
        this.layer.attach(document.body);

        layer.on('select', (value: Date) => {
            this.data.set('value', value);
        });

        this._docClicker = (e: MouseEvent) => {
            let target = e.target as HTMLElement;
            if (this.el && target !== this.el
                && $(target).closest(this.el).length === 0
                && $(target).closest(this.layer.el).length === 0
            ) {
                this.hideLayer();
            }
        };
        $(document).on('click', this._docClicker);
    },

    mainClick() {
        this.layer || this.initLayer();
        this.layer.isHide() ? this.showLayer() : this.hideLayer();
    },

    showLayer() {
        let pos = $(this.el as HTMLElement).offset() as Pos;
        this.layer.show({
            left: pos.left,
            top: pos.top + (this.el as HTMLElement).offsetHeight + 1
        });
    },

    hideLayer() {
        this.layer && this.layer.hide();
    },

    disposed() {
        if (this.layer) {
            this.layer.dispose();
            this.layer = null;
            $(document).off('click', this._docClicker);
            this._docClicker = null;
        }
    }
});
