/**
 * @file 在下一个时间周期运行任务
 * @author errorrik(errorrik@gmail.com)
 */

var bind = require('./bind');
var each = require('./each');

/**
 * 下一个周期要执行的任务列表
 *
 * @inner
 * @type {Array}
 */
var nextTasks = [];

/**
 * 执行下一个周期任务的函数
 *
 * @inner
 * @type {Function}
 */
var nextHandler;

/**
 * 在下一个时间周期运行任务
 *
 * @inner
 * @param {Function} fn 要运行的任务函数
 * @param {Object=} thisArg this指向对象
 */
function nextTick(fn, thisArg) {
    if (thisArg) {
        fn = bind(fn, thisArg);
    }
    nextTasks.push(fn);

    if (nextHandler) {
        return;
    }

    nextHandler = function () {
        var tasks = nextTasks.slice(0);
        nextTasks = [];
        nextHandler = null;

        each(tasks, function (task) {
            task();
        });
    };

    if (typeof MutationObserver === 'function') {
        var num = 1;
        var observer = new MutationObserver(nextHandler);
        var text = document.createTextNode(num);
        observer.observe(text, {
            characterData: true
        });
        text.data = ++num;
    }
    else if (typeof setImmediate === 'function') {
        setImmediate(nextHandler);
    }
    else {
        setTimeout(nextHandler, 0);
    }
}

exports = module.exports = nextTick;
