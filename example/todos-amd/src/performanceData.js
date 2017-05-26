define(function () {
    var data = {
        "list": [
        ],
        "category": [
            {
                "id": 8,
                "title": "category8",
                "color": "#c23531"
            },
            {
                "id": 7,
                "title": "category7",
                "color": "#314656"
            },
            {
                "id": 6,
                "title": "category6",
                "color": "#dd8668"
            },
            {
                "id": 5,
                "title": "category5",
                "color": "#91c7ae"
            },
            {
                "id": 4,
                "title": "category4",
                "color": "#6e7074"
            },
            {
                "id": 3,
                "title": "category3",
                "color": "#bda29a"
            },
            {
                "id": 2,
                "title": "category2",
                "color": "#44525d"
            },
            {
                "id": 1,
                "title": "category1",
                "color": "#c4ccd3"
            }
        ]
    };

    for (var i = 1000; i > 0; i--) {
        data.list.push({
            "id": i,
            "title": "TodoTitle" + i,
            "desc": "Todo Description" + i,
            "endTime": 1548149025190,
            "categoryId": i % 8 + 1,
            "addTime": 1548062625190,
            "done": i === 1 ? true : false
        });
    }

    return data;
});
