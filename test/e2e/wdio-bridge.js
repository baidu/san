/**
 * @file webdriver 之桥
 *       浏览器端，发消息给 webdriver
 *
 * @example
 *     发日志：
 *         WDBridge.send('message', 'message')
 *
 *     发行为：
 *         WDBridge.send('action', 'actname:param1|param2')
 * @see
 *     http://webdriver.io/api/action/click.html
 */

(function (global) {

    /**
     * 一个队
     *
     * @see ecomfe/etpl
     *
     * @inner
     * @constructor
     */
    function Queue() {
        this.raw = [];
        this.length = 0;
    }

    Queue.prototype = {

        /**
         * 发送
         *
         * @param {*} elem 添加项
         */
        send: function (elem) {
            this.raw[this.length++] = elem;
        },

        /**
         * 存在
         *
         * @return {boolean} 结论
         */
        assert: function () {
            return this.length > 0;
        },

        /**
         * 消费
         *
         * @return {*} 底部元素
         */
        consume: function () {
            if (this.length > 0) {
                this.length--;
                return this.raw.shift();
            }
        },

        /**
         * 获取顶部元素
         *
         * @return {*} 顶部元素
         */
        top: function () {
            return this.raw[this.length - 1];
        },

        /**
         * 获取底部元素
         *
         * @return {*} 底部元素
         */
        bottom: function () {
            return this.raw[0];
        },

        /**
         * 根据查询条件获取元素
         *
         * @param {Function} condition 查询函数
         * @return {*} 符合条件的元素
         */
        find: function (condition) {
            var index = this.length;
            while (index--) {
                var item = this.raw[index];
                if (condition(item)) {
                    return item;
                }
            }
        }
    };

    /**
     * 一座桥
     *
     * @type {Object}
     */
    var WDBridge = {

        reset: function () {
            this.message = new Queue();
            this.action = new Queue();
        },

        /**
         * proxy queue
         *
         * @param  {string} type  type
         * @param  {string} value value
         * @return {string}       ret
         */
        getHandler: function(key) {
            var me = this;
            return function (type, value) {
                return me[type][key](value);
            };
        },

        init: function () {

            this.reset();

            // 统一个 API
            var me = this;
            for (var key in Queue.prototype) {
                me[key] = me.getHandler(key);
            }

        },

        nextTick: function (done) {

            var ret = {
                message: '',
                action: ''
            };

            var me = this;

            ['message', 'action'].forEach(function (key) {
                if (me[key].assert()) {
                    ret[key] = me[key].consume();
                }
            });

            done(ret);
        }

    };

    WDBridge.init();

    global.WDBridge = WDBridge;

})(window);

