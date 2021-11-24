import {Component} from 'san'

import service from '../service'
import ColorPicker from '../ui/color-picker'
import Category from './model'

import './edit.css'


export default class Edit extends Component<{
    categories: Category[]
}> {
    static template = `
    <ul class="edit-category-list">
        <li san-for="item, index in categories">
            <input type="text" value="{= item.title =}" class="form-title">
            <ui-colorpicker value="{= item.color =}"></ui-colorpicker>
            <i class="fa fa-check" on-click="edit(index)"></i>
            <i class="fa fa-trash" on-click="rm(index)"></i>
        </li>
    </ul>
    `;

    static components = {
        'ui-colorpicker': ColorPicker
    };

    initData() {
        return {
            categories: []
        };
    }

    attached() {
        this.data.set('categories', service.categories());
    }

    rm(index: number) {
        let category = this.data.get('categories')[index];

        if (category.id != null) {
            service.rmCategory(category.id);
            this.data.removeAt('categories', index);
            this.fire('rm');
        }
    }

    edit(index: number) {
        let category = this.data.get('categories')[index];
        service.editCategory(category);
        this.fire('edit');
    }
}