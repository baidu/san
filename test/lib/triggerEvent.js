window.triggerEvent = function() {

    function nodeName(elem, name) {
        return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    }

    function byBrowser(elem, type, value) {

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
            elem.value = elem.value + value;
            type = ontype in elem ? type : 'change';
        }

        // hack checkbox
        if ((elem.type === 'checkbox' || elem.type === 'radio')
            && elem.click && nodeName(elem, 'input')
        ) {
            elem.click();
            return false;
        }

        // hack select
        if (type === 'select') {
            type = 'change';
            ontype = 'onchange';
            if (value !== undefined) {
                elem.selectedIndex = value;
            }
        }

        try {

            var event;

            if (document.createEvent) {
                event = document.createEvent('HTMLEvents');
                event.initEvent(type, true, true);
                return !elem.dispatchEvent(event);
            }

            if (document.createEventObject) {
                if ((nodeName(elem, 'input') || nodeName(elem, 'textarea'))
                    && ontype === 'oninput'
                ) {
                    elem.fireEvent('onfocusin', document.createEventObject());
                }

                event = document.createEventObject();
                return elem.fireEvent(ontype, event);
            }
        }
        catch (ex) {}


    }

    var acts = {
        click: 'click',
        input: 'addValue',
        select: 'selectByIndex'
    };

    function byWebDriver(elem, type, value) {

        var act = acts[type];

        if (act) {

            var action = [
                act,
                ':',
                elem,
                value !== undefined ? ('|' + value) : ''
            ].join('');

            window.WDBridge.send('action', action);

        }
    }

    if (location.search.indexOf('trigger=no') > -1) {
        return function() {};
    }

    if (location.search.indexOf('trigger=wd') > -1) {
        return byWebDriver;
    }

    return byBrowser;

}();
