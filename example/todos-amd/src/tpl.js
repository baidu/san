
/* global ActiveXObject */
define(
    function (require) {
        return {
            load: function (resourceId, req, load) {
                var xhr = window.XMLHttpRequest
                    ? new XMLHttpRequest()
                    : new ActiveXObject('Microsoft.XMLHTTP');

                xhr.open('GET', req.toUrl(resourceId), true);

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            var source = xhr.responseText;
                            load(source);
                        }

                        /* jshint -W054 */
                        xhr.onreadystatechange = new Function();
                        /* jshint +W054 */
                        xhr = null;
                    }
                };

                xhr.send(null);
            }
        };
    }
);
