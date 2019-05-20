import { store } from 'san-store'
import { updateBuilder } from 'san-update'
import service from '../service'



store.addAction('fetchCategories', function (payload, {getState, dispatch}) {
    if (!getState('categories')) {
        return service.categories().then(categories => {
            dispatch('fillCategories', categories);
        });
    }
});

store.addAction('fillCategories', function (categories) {
    return updateBuilder().set('categories', categories);
});

store.addAction('startRmCategory', function (id, {getState, dispatch}) {
    return service.rmCategory(id).then(categoryId => {
        let categories = getState('categories');

        let index = -1;
        categories.forEach((item, i) => {
            if (item.id === categoryId) {
                index = i;
            }
        });

        if (index >= 0) {
            dispatch('rmCategory', index);
        }
    });
});

store.addAction('rmCategory', function (index) {
    return updateBuilder().splice('categories', index, 1);
});

store.addAction('startEditCategory', function (category, {getState, dispatch}) {
    return service.editCategory(category).then(editedCategory => {
        let categories = getState('categories');

        let index = -1;
        categories.forEach((item, i) => {
            if (item.id === editedCategory.id) {
                index = i;
            }
        });

        if (index >= 0) {
            dispatch('editCategory', {index, category: editedCategory});
        }
    });
});

store.addAction('editCategory', function (payload) {
    return updateBuilder().set('categories[' + payload.index + ']', payload.category);
});

store.addAction('startAddCategory', function () {
    return updateBuilder()
        .set('addingCategory', {
            title: '',
            color: ''
        })
        .set('addingCategoryFinished', false);
});

store.addAction('submitAddCategory', function (category, {dispatch}) {
    return service.addCategory(category).then(addedCategory => {
        dispatch('addCategory', addedCategory);
    });
});

store.addAction('addCategory', function (category) {
    return updateBuilder()
        .push('categories', category)
        .set('addingCategoryFinished', true);
});
