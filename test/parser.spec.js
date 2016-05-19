describe("parser", function() {
    it("is exist", function() {
        expect(typeof parser).toBe('object');
    });

});

var interpolation = tpl('interpolation');

var component = new Component({
    template: interpolation,
    methods: {
        doneTodo: function (item, index) {
            console.log(item, index, this.get('name'))
        }
    },

    filters: {
        up: function (source, first) {
            if (first) {
                return source.charAt(0).toUpperCase() + source.slice(1)
            }

            return source.toUpperCase();
        }
    }
});
component.set('name', 'errorrik');
component.set('todos', [
        {
            "id": 1000,
            "title": "TodoTitle1000",
            "desc": "Todo Description1000",
            "endTime": 1548149025190,
            "categoryId": 1,
            "addTime": 1548062625190,
            "done": true
        },
        {
            "id": 999,
            "title": "TodoTitle999",
            "desc": "Todo Description999",
            "endTime": 1548062625190,
            "categoryId": 8,
            "addTime": 1547976225190,
            "done": false
        },
        {
            "id": 998,
            "title": "TodoTitle998",
            "desc": "Todo Description998",
            "endTime": 1547976225190,
            "categoryId": 7,
            "addTime": 1547889825190,
            "done": false
        },
        {
            "id": 997,
            "title": "TodoTitle997",
            "desc": "Todo Description997",
            "endTime": 1547889825190,
            "categoryId": 6,
            "addTime": 1547803425190,
            "done": false
        }
    ])
setTimeout(function () {
component.attach(document.body)
}, 100);
