import san from 'san'
import './color-picker.css'

const template = `
<ul class="ui-colorpicker">
    <li
        s-for="item, index in datasource"
        style="background: {{item}}"
        class="{{item == value ? 'selected' : ''}}"
        on-click="itemClick(item)"
    >{{ item.title }}</li>
</ul>
`;

interface ColorPickerData {
    value: string;
    datasource: string[];
}

export default san.defineComponent<ColorPickerData>({
    template,
    
    initData() {
        return {
            datasource: [
                '#c23531', '#314656', '#dd8668', '#91c7ae',
                '#6e7074', '#bda29a', '#44525d', '#c4ccd3'
            ]
        };
    },

    itemClick(item: string) {
        this.data.set('value', item);
    }
});
