import service from '../service'
import AddCategory from '../category/add'
import EditCategory from '../category/edit'
import CategoryPicker from '../ui/category-picker'
import TimePicker from '../ui/time-picker'
import Calendar from '../ui/calendar'

import san from 'san'

import './form.css'
import Todo from './model'
import Category from '../category/model'



const AddCategoryDialog = san.defineComponent({
    template: `
    <div class="ui-layer add-category-layer" style="width: {{width}}px; top: {{top}}px; left: {{left}}px;">
        <ui-addcategory san-ref="add" on-finished="finish($event)" />
    </div>`,

    components: {
        'ui-addcategory': AddCategory
    },

    initData() {
        return {
            width: 200,
            top: 100,
            left: -1000
        };
    },

    show() {
        this.data.set('left', document.body.clientWidth / 2 - 100);
    },

    hide() {
        this.data.set('left', -1000);
    },

    finish(e: {returnValue?: boolean}) {
        this.hide();
        this.fire('finished');
        e.returnValue = false;
    }
});

const EditCategoryDialog = san.defineComponent({
    template: `
    <div class="ui-layer edit-category-layer" style="width: {{width}}px; top: {{top}}px; left: {{left}}px;">
        <i class="fa fa-times-circle-o" on-click="hide"></i>
        <ui-editcategory on-rm="edited" on-edit="edited" />
    </div>`,

    components: {
        'ui-editcategory': EditCategory
    },

    initData() {
        return {
            width: 200,
            top: 100,
            left: -1000
        };
    },

    show() {
        this.data.set('left', document.body.clientWidth / 2 - 100);
    },

    hide() {
        this.data.set('left', -1000);
    },

    edited() {
        this.fire('edited');
    }
});


const template = `
<div class="form">
    <input type="text" class="form-title" placeholder="标题" value="{= todo.title =}">
    <textarea class="form-desc" placeholder="备注" value="{= todo.desc =}"></textarea>

    <ui-categorypicker datasource="{{categories}}" value="{= todo.categoryId =}" />
    <i class="fa fa-plus add-category" on-click="startAddCategory"></i>
    <i class="fa fa-pencil edit-category" on-click="startEditCategory"></i>
    <div>预期完成时间： <ui-calendar value="{= endTimeDate =}" /><ui-timepicker value="{= endTimeHour =}" /></div>

    <div class="form-op">
        <button type="button" class="form-ok" on-click="submit"><i class="fa fa-check-circle-o"></i></button>
        <button type="button" class="form-cancel" on-click="cancel"><i class="fa fa-times-circle-o"></i></button>
    </div>
</div>
`;

interface FormData {
    id?: number;
    todo: Todo;
    categories: Category[];
    route?: {
        query: {
            id:string
        }
    };
}

interface IForm {
    joinEndTime: () => void;
    submit: () => void;
    cancel: () => void;
    startAddCategory: () => void;
    startEditCategory: () => void;
    updateCategories: () => void;
}


export default san.defineComponent<FormData, IForm>({
    template,
    
    components: {
        'ui-categorypicker': CategoryPicker,
        'ui-timepicker': TimePicker,
        'ui-calendar': Calendar
    },

    computed: {
        endTimeHour() {
            let endTime = new Date(this.data.get('todo').endTime);
            return endTime.getHours();
        },

        endTimeDate() {
            let endTime = new Date(this.data.get('todo.endTime'));
            return new Date(
                endTime.getFullYear(),
                endTime.getMonth(),
                endTime.getDate()
            );
        }
    },

    created() {
        let id = this.data.get('route.query.id');
        let todo: Todo | null = null;

        if (id) {
            this.data.set('id', +id);
            todo = service.todo(+id);
        }

        if (!todo) {
            todo = {
                id: 0,
                title: '',
                desc: '',
                endTime: new Date().getTime(),
                done: false,
                categoryId: 1
            }
        }

        this.updateCategories();
    },

    joinEndTime() {
        let endTime = new Date(this.data.get('endTimeDate').getTime());
        endTime.setHours(this.data.get('endTimeHour'));
        this.data.set('todo.endTime', endTime.getTime());
    },

    submit() {
        this.joinEndTime();
        let todo = this.data.get('todo');
        if (!todo.id) {
            service.addTodo(todo);
        }
        else {
            service.editTodo(todo);
        }

        history.go(-1);
    },

    cancel() {
        history.go(-1);
    },

    updateCategories() {
        this.data.set('categories', service.categories());
    },

    startAddCategory() {
        if (!this.addCategoryDialog) {
            this.addCategoryDialog = new AddCategoryDialog();
            this.addCategoryDialog.attach(document.body);
            this.addCategoryDialog.on('finished', this.updateCategories.bind(this));
        }
        this.addCategoryDialog.show();
    },

    startEditCategory() {
        if (!this.editCategoryDialog) {
            this.editCategoryDialog = new EditCategoryDialog();
            this.editCategoryDialog.attach(document.body);
            this.editCategoryDialog.on('edited', this.updateCategories.bind(this));
        }
        this.editCategoryDialog.show();
    },

    disposed() {
        if (this.addCategoryDialog) {
            this.addCategoryDialog.dispose();
            this.addCategoryDialog = null;
        }

        if (this.editCategoryDialog) {
            this.editCategoryDialog.dispose();
            this.editCategoryDialog = null;
        }
    }
});
