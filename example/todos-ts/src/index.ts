

// style
import 'font-awesome/css/font-awesome.min.css';
import './index.css';

// route
import List from './todo/list'
import Form from './todo/Form'
import AddCategory from './category/add'
import EditCategory from './category/edit'

import {router} from 'san-router'

router.add({rule: '/', Component: List, target: '#app'});
router.add({rule: '/todos/category/:category', Component: List, target: '#app'});
router.add({rule: '/add', Component: Form, target: '#app'});
router.add({rule: '/edit/:id', Component: Form, target: '#app'});
router.add({rule: '/category/add', Component: AddCategory, target: '#app'});
router.add({rule: '/category/edit', Component: EditCategory, target: '#app'});

// start
router.start()
