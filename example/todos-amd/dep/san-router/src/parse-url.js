export default function parseURL(url) {
    let result = {};

    // parse hash
    result.hash = '';
    let hashStart = url.indexOf('#');
    if (hashStart >= 0) {
        result.hash = url.slice(hashStart + 1);
        url = url.slice(0, hashStart);
    }

    // parse query
    result.queryString = '';
    let query = {};
    result.query = query;
    let queryStart = url.indexOf('?');
    if (queryStart >= 0) {
        result.queryString = url.slice(queryStart + 1);
        url = url.slice(0, queryStart);

        result.queryString.split('&').forEach(querySeg => {
            // 考虑到有可能因为未处理转义问题，
            // 导致value中存在**=**字符，因此不使用`split`函数
            let equalIndex = querySeg.indexOf('=');
            let value = '';
            if (equalIndex > 0) {
                value = querySeg.slice(equalIndex + 1);
                querySeg = querySeg.slice(0, equalIndex);
            }

            let key = decodeURIComponent(querySeg);
            value = decodeURIComponent(value);

            // 已经存在这个参数，且新的值不为空时，把原来的值变成数组
            if (query.hasOwnProperty(key)) {
                query[key] = [].concat(query[key], value);
            }
            else {
                query[key] = value;
            }
        });

    }

    // left path
    result.path = url;

    return result;
}
