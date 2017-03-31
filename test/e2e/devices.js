/**
 * @file 多浏览器测试
 *
 */

var devices = {

    modern: {

        chrome: {
            browserName: 'chrome',
            platform: 'Windows 7'
        },
        firefox: {
            browserName: 'firefox'
        },
        // mac_safari: {
        //     browserName: 'safari',
        //     platform: 'OS X 10.10'
        // }

    },


    ie_family: {
        // ie_8: {
        //     browserName: 'internet explorer',
        //     platform: 'Windows XP',
        //     version: '8'
        // },
        ie_9: {
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '9'
        },
        // ie_11: {
        //     browserName: 'internet explorer',
        //     platform: 'Windows 8.1',
        //     version: '11'
        // },
        // edge: {
        //     browserName: 'MicrosoftEdge',
        //     platform: 'Windows 10'
        // }
    },


    mobile: {
        // ios_safari_10: {
        //     browserName: 'iphone',
        //     version: '10.0'
        // },
        android_5_1: {
            browserName: 'android',
            version: '5.1'
        }
    }

};



module.exports.devices = devices;
