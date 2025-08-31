import san, { Component, ComponentDefineOptions } from "../index";



interface ColorPickerData {
    data: string;
    datasource: Array<{name:string}>;
    value: string;
}

class ColorPicker extends Component<ColorPickerData> {
    static template = '' 
        + '<ul class="ui-colorpicker">'
        + '<li '
        + 'san-for="item in datasource" '
        + 'style="cursor:pointer; background: {{item}};{{item == value ? \'border:2px solid #ccc;\' : \'\'}}" '
        + 'on-click="itemClick(item)"'
        + '>click</li>'
        + '</ul>';

    itemClick(item: string) {
        // AutoComplete: this.data
        this.data.set('value', item);

        // AutoComplete: this.d
        // type check
        this.d.value = item;
    }

    // AutoComplete: attached
    attached() {
        const me = this;
        let nextValue: string;
        const value = this.data.get('value') as string;
        const datasource = this.data.get('datasource');
        for (let i = 0; i < 4; i++) {
            // AutoComplete: datasource[i].name
            nextValue = datasource[i].name;  
            if (nextValue !== value) {
                break;
            }
        }
    
        setTimeout(function () { me.itemClick(nextValue) }, 20);
    }

    // AutoComplete: initData
    initData() { 
        return {
            // AutoComplete: datasource
            datasource: [ 
                {name:'red'}, 
                {name:'blue'}, 
                {name:'yellow'}, 
                {name:'green'}
            ],
            
            value: '22'
        };
    }

    
}

export default ColorPicker;

let colorPicker = new ColorPicker();
let item2 = colorPicker.data.get('datasource[0]');
let datasource2 = colorPicker.data.get('datasource');
item2.name // Auto Complete
datasource2[0].name  // Auto Complete

let item = colorPicker.d.datasource[0]
let datasource = colorPicker.d.datasource
item.name // Auto Complete
datasource[0].name  // Auto Complete

colorPicker.itemClick // Auto Complete