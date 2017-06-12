/**
 * @file 在 console 中打警告
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable no-console */
function warn(message) {
    console && console.error && console.error(message);
}
/* eslint-enable no-console */

module.exports = warn;
