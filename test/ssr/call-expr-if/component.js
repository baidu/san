var san = require('../../..');
var MyComponent = san.defineComponent({
    template: '<div><u s-if="isWorking(time)">work</u><b s-else>rest</b></div>',

    isWorking: function (time) {
        if (time < 9 || time > 18) {
            return false;
        }

        return true;
    }
});

exports = module.exports = MyComponent;
