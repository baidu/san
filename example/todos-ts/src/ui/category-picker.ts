import {Component} from 'san'
import './category-picker.css'

import Category from '../category/model'


interface CategoryPickerData {
    value: number;
    datasource: Category[];
}


export default class CategoryPicker extends Component<CategoryPickerData> {
    static template = `
    <ul class="ui-categorypicker">
        <li
            s-for="item, index in datasource"
            style="background: {{item.color}}"
            class="{{item.id == value ? 'selected' : ''}}"
            on-click="itemClick(item.id)"
        >{{ item.title }}</li>
    </ul>
    `;

    initData() {
        return {datasource: []};
    }

    itemClick(id: number) {
        this.data.set('value', id);
    }
}
