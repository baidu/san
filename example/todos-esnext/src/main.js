import san from 'san'

// style
require('font-awesome/css/font-awesome.min.css')
require('./main.css')

// route
import List from './components/todo/List'
import Form from './components/todo/Form'
import AddCategory from './components/category/Add'
import EditCategory from './components/category/Edit'

import {router} from 'san-router'

router.add({rule: '/', Component: List, target: '#app'});
router.add({rule: '/todos/category/:category', Component: List, target: '#app'});
router.add({rule: '/add', Component: Form, target: '#app'});
router.add({rule: '/edit/:id', Component: Form, target: '#app'});


// router.route('/', List)
// router.route(/^\/todos\/category\/([0-9]+)$/, List)
// router.route(/^\/add$/, Form)
// router.route(/^\/edit\/([0-9]+)$/, Form)
// router.route(/^\/category\/add$/, AddCategory)
// router.route(/^\/category\/edit$/, EditCategory)

// start
router.start()
