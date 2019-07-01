import '@babel/polyfill';
import san from 'san'

// style
require('font-awesome/css/font-awesome.min.css')
require('./main.css')

// actions
import './todo/action'
import './category/action'

// route
import List from './todo/List'
import Form from './todo/Form'
import AddCategory from './category/Add'
import EditCategory from './category/Edit'

import {router} from 'san-router'

router.add({rule: '/', Component: List, target: '#app'});
router.add({rule: '/todos/category/:category', Component: List, target: '#app'});
router.add({rule: '/add', Component: Form, target: '#app'});
router.add({rule: '/edit/:id', Component: Form, target: '#app'});
router.add({rule: '/category/add', Component: AddCategory, target: '#app'});
router.add({rule: '/category/edit', Component: EditCategory, target: '#app'});

// start
router.start();
