function tpl(name) {
    var isBrowser = typeof window != 'undefined' && typeof navigator != 'undefined';

    if (isBrowser) {
        var xhr = window.XMLHttpRequest
            ? new XMLHttpRequest()
            : new ActiveXObject( 'Microsoft.XMLHTTP' );
        xhr.open('GET', 'tpl/' + name + '.html?' + (new Date).getTime(), false);
        xhr.send(null);

        if (xhr.status >= 200 && xhr.status < 300) {
            return xhr.responseText;
        }
    }
}
