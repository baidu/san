/**
 * @file 多浏览器测试
 *
 */

// sauce
var sauce = [

    // the cool kids
    {

        chrome: {
            browserName: 'chrome',
            platform: 'Windows 7'
        },
        firefox: {
            browserName: 'firefox'
        },
        mac_safari: {
            browserName: 'safari',
            platform: 'OS X 10.10'
        }

    },

    // ie family
    {
        ie_9: {
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '9'
        },
        ie_10: {
            browserName: 'internet explorer',
            platform: 'Windows 8',
            version: '10'
        },
        ie_11: {
            browserName: 'internet explorer',
            platform: 'Windows 8.1',
            version: '11'
        },
        edge: {
            browserName: 'MicrosoftEdge',
            platform: 'Windows 10'
        }
    },

    // mobile
    {
        ios_safari_8: {
            browserName: 'iphone',
            version: '8.4'
        },
        ios_safari_9: {
            browserName: 'iphone',
            version: '9.3'
        },
        android_4_2: {
            browserName: 'android',
            version: '4.2'
        },
        android_5_1: {
            browserName: 'android',
            version: '5.1'
        }
    }

];

function getDesiredCapabilities (options) {

    var desiredCapabilities = Object.assign({
        tags: ['san'],
        name: 'This is an san test',
        'public': true
    }, options);

    return {
        desiredCapabilities: desiredCapabilities,
        host: 'ondemand.saucelabs.com',
        port: 80,
        user: process.env.SAUCE_USERNAME,
        key: process.env.SAUCE_ACCESS_KEY,
        logLevel: 'silent'
    };
}


// standalone
var standalone = {
    chrome: {
        desiredCapabilities: {
            browserName: 'chrome'
        }
    }
};

module.exports.get = function (group) {

    if (!sauce[group]) {
        return standalone;
    }

    var config = {};
    Object.keys(sauce[group]).map(function (name) {
        config[name] = getDesiredCapabilities(sauce[name]);
    });

    return config;
};
