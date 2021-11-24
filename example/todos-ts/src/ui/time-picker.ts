import san from 'san'
import $ from 'jquery';
import './time-picker.css'

import { formatHour } from '../filters';


class Layer extends san.Component<{
    datasource: number[];
    left: number;
    top: number;
    value: number;
}>{
    static filters = {formatHour};
    
    initData() {
        let datasource = [];
        for (let i = 0; i <= 23; i++) {
            datasource.push(i);
        }

        return {
            datasource,
            left: -1000,
            top: 0
        };
    }
    
    itemClick(value: number) {
        this.data.set('value', value);
        this.fire('valueChange', value);
        this.hide();
    }
    
    hide() {
        this.data.set('left', -1000);
    }
    
    show(pos: {left:number; top:number}) {
        this.data.set('left', pos.left);
        this.data.set('top', pos.top);
    }
    
    isHide() {
        return this.data.get('left') < 0;
    }
}

interface Pos {
    left: number;
    top: number;
}

export default class TimePicker extends san.Component<{value: number}> {
    static template = `<div on-click="mainClick" class="ui-timepicker">{{ value | formatHour }}</div>`;

    static filters = {formatHour};

    layer?: Layer;
    _docClicker?: (e:MouseEvent) => void;

    initLayer() {
        let layer = new Layer();
        layer.data.set('value', this.data.get('value'));

        this.layer = layer;
        this.layer.attach(document.body);

        layer.on('valueChange', (value: number) => {
            this.data.set('value', value);
        });

        this._docClicker = (e:MouseEvent) => {
            let target = e.target as Element;
            if (this.el && this.layer && this.layer.el 
                && target !== this.el
                && $(target).closest(this.el).length === 0
                && $(target).closest(this.layer.el).length === 0
            ) {
                this.hideLayer();
            }
        };

        document.addEventListener('click', this._docClicker);
    }

    mainClick() {
        if (this.layer) {
            this.layer.isHide() ? this.showLayer() : this.hideLayer();
        }
        else {
            this.initLayer();
        }
    }

    showLayer() {
        if (this.el) {
            let pos = $(this.el).offset() as Pos;
            this.layer && this.layer.show({
                left: pos.left,
                top: pos.top + (this.el as HTMLElement).offsetHeight + 1
            });
        }
    }

    hideLayer() {
        this.layer && this.layer.hide();
    }

    disposed() {
        if (this.layer) {
            this.layer.dispose();
            this._docClicker && document.removeEventListener('click', this._docClicker);
        }
    }
}