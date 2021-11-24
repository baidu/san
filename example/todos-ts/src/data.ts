
import Todo from './todo/model'
import Category from './category/model'

interface data {
    list: Todo[];
    category: Category[];
}

let mockData: data = {
    "list": [
        {
            "id": 22,
            "title": "阿道夫2",
            "desc": "点点滴滴的2",
            "endTime": 1458928800000,
            "categoryId": 1,
            "addTime": 1458909372504,
            "done": false
        },
        {
            "id": 21,
            "title": "five22",
            "desc": "522",
            "endTime": 1457712000000,
            "categoryId": 4,
            "addTime": 1457565631241,
            "done": true
        },
        {
            "id": 14,
            "title": "de方法",
            "desc": "de",
            "endTime": 1457535600000,
            "categoryId": 9,
            "addTime": 1457536266662,
            "done": true
        },
        {
            "id": 7,
            "title": "去机场接爸妈",
            "desc": "海航",
            "endTime": 1456545600907,
            "categoryId": 2,
            "done": true
        },
        {
            "title": "finish backbone",
            "desc": "不能脱了",
            "endTime": 1455627600056,
            "categoryId": 1,
            "id": 6,
            "addTime": 1455505632350,
            "done": true
        },
        {
            "id": 2,
            "title": "带娃去检查",
            "desc": "42天",
            "endTime": 1452243600000,
            "categoryId": 2,
            "done": true
        },
        {
            "id": 1,
            "title": "2015总结和2016规划PPT",
            "desc": "test",
            "endTime": 1452470400000,
            "categoryId": 1,
            "done": true
        }
    ],
    "category": [
        {
            "id": 1,
            "title": "工作",
            "color": "#c23531"
        },
        {
            "id": 2,
            "title": "家庭",
            "color": "#dd8668"
        },
        {
            "id": 3,
            "title": "学习",
            "color": "#91c7ae"
        },
        {
            "id": 4,
            "title": "娱乐",
            "color": "#bda29a"
        },
        {
            "id": 5,
            "title": "旅行",
            "color": "#91c7ae"
        }
    ]
};

export default mockData;
