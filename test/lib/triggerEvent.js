window.triggerEvent = function() {

    function nodeName(elem, name) {
        return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    }

    return function(elem, type, data, onlyHandlers) {

        if (typeof elem === 'string') {
            elem = document.querySelector(elem);
        }

        // Don't do events on text and comment nodes
        if (elem.nodeType === 3 || elem.nodeType === 8) {
            return;
        }

        var ontype = 'on' + type;

        // hack input
        if (type === 'input') {
            elem.value = data;
            type = ontype in elem ? type : 'change';
        }

        // hack checkbox
        if (elem.type === 'checkbox' && elem.click && nodeName(elem, 'input')) {
            elem.click();
            return false;
        }

        try {

            var event;

            if (document.createEventObject) {
                event = document.createEventObject();
                return elem.fireEvent(ontype, event);
            }

            event = document.createEvent('HTMLEvents');
            event.initEvent(type, true, true);
            return !elem.dispatchEvent(event);
        }
        catch (ex) {}


    };

}();
