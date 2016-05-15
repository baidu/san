// define(function () {
    /**
     * 对象属性拷贝
     *
     * @inner
     * @param {Object} target 目标对象
     * @param {Object} source 源对象
     * @return {Object} 返回目标对象
     */
    function extend(target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }

        return target;
    }

    /**
     * 构建类之间的继承关系
     *
     * @inner
     * @param {Function} subClass 子类函数
     * @param {Function} superClass 父类函数
     */
    function inherits(subClass, superClass) {
        /* jshint -W054 */
        var F = new Function();
        F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;
        /* jshint +W054 */
        // 由于引擎内部的使用场景都是inherits后，逐个编写子类的prototype方法
        // 所以，不考虑将原有子类prototype缓存再逐个拷贝回去
    }

    /**
     * 将项为 {name:string, value:any} 的数组转换成对象
     *
     * @inner
     * @return {Object}
     */
    function listToMap(list) {
        var result = {};
        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            result[item.name] = item.value;
        }

        return result;
    }

    /**
     * 唯一id的起始值
     *
     * @inner
     * @type {number}
     */
    var guidIndex = 1;

    /**
     * 获取唯一id
     *
     * @inner
     * @return {string} 唯一id
     */
    function guid() {
        return '_san-vm_' + (guidIndex++);
    }

    function tagIsAutoClose(tagName) {
        return /^(img|input)$/.test(tagName)
    }

    var ieVersionMatch = typeof navigator !== 'undefined'
        && navigator.userAgent.match(/msie\s*([0-9]+)/i);
    var isCompatStringMethod = ieVersionMatch && ieVersionMatch[1] - 0 < 8;


    function StringBuffer() {
        this.raw = isCompatStringMethod ? [] : '';
    }

    StringBuffer.prototype.toString = function () {
        return isCompatStringMethod ? this.raw.join('') : this.raw;
    };

    StringBuffer.prototype.push = isCompatStringMethod
        ? function (source) {
            this.raw.push(source);
        }
        : function (source) {
            this.raw += source;
        };

    var util = {
        extend: extend,
        inherits: inherits,
        listToMap: listToMap,
        guid: guid,
        tagIsAutoClose: tagIsAutoClose,
        StringBuffer: StringBuffer
    };
// })
