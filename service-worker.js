/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/sanarchives/2018/03/index.html","2ba146e7896ade8c007b1c2c64f8b886"],["/sanarchives/2018/03/page/2/index.html","19de7e4a17c46c691b2f5bd72c3b2afa"],["/sanarchives/2018/03/page/3/index.html","7180f0781680a242c48d62812c92f5bc"],["/sanarchives/2018/06/index.html","476cf0a9600a17973d191fa8ab3ad78b"],["/sanarchives/2018/10/index.html","48c787d5ed5a12df5780522e98e1dc3d"],["/sanarchives/2018/11/index.html","c460f756605ef18911cddbb13c4d88e1"],["/sanarchives/2018/12/index.html","2ba004412f10a6ee9126eb9615030c76"],["/sanarchives/2018/index.html","298a541338f9740955d01753cd94adb4"],["/sanarchives/2018/page/2/index.html","573adde12e78fa148ca6daf40305f98f"],["/sanarchives/2018/page/3/index.html","8fea7d5a73eccb4ea96c018f0e1e4683"],["/sanarchives/2018/page/4/index.html","b6bc6e58c4c3d4579a832ffe3de632e6"],["/sanarchives/2018/page/5/index.html","9fa44281cec4e11e4fdcba233b62b5de"],["/sanarchives/2019/02/index.html","9cf2aba2d8fb407ce3667895221e5760"],["/sanarchives/2019/03/index.html","8ce8943a1afe316a0a161231941314cf"],["/sanarchives/2019/04/index.html","f58b82c1acd3561b3e0c17d1a5097124"],["/sanarchives/2019/06/index.html","88138d00daa7ee0ec3c3a1dd5a7c7699"],["/sanarchives/2019/index.html","a3152fa3f884cd99bc1b3513451618d0"],["/sanarchives/2019/page/2/index.html","fe9a59d1e3e719c1b9424dad0b98a2f8"],["/sanarchives/2020/01/index.html","a2ce05798a8400ebb9ad30896dff2139"],["/sanarchives/2020/05/index.html","4fbabd63506ac5c46c80dbc14d15b775"],["/sanarchives/2020/07/index.html","4539f05a722389ff5db5c0b2ade46ae1"],["/sanarchives/2020/09/index.html","e081d01eaaa30f3b2ef8b3616255a605"],["/sanarchives/2020/index.html","f4b653651cde347819384929bf366640"],["/sanarchives/2020/page/2/index.html","2d085482bd09818ac94b9c64fec5b38e"],["/sanarchives/index.html","e03c8024647a17a5a4a83311f7abbd44"],["/sanarchives/page/2/index.html","4d4ea58e2178235d1fb44bcb9c9313d5"],["/sanarchives/page/3/index.html","0d160d32624bfd36b1a74a23fba987f2"],["/sanarchives/page/4/index.html","a2a9f8ad9055d159f4bb827fd0b80393"],["/sanarchives/page/5/index.html","548a2d9977e70bd28ead4b37ddf202ed"],["/sanarchives/page/6/index.html","68887eeb66f7a332de417322d6f5ae63"],["/sanarchives/page/7/index.html","4800714db140daae685d3177f9bdc472"],["/sanarchives/page/8/index.html","d277e11b0569bde4baf21c062196ae6d"],["/sancategories/doc/index.html","8f5a028c351f770620e6291a6493b9e2"],["/sancategories/practice/index.html","2da06a89a0ef4089a87492d382ed1e92"],["/sancategories/practice/page/2/index.html","871aa0cb9ea746f56726df797adc6d1c"],["/sancategories/practice/page/3/index.html","bafaca72af5f83ff2ab1bdf490811a3e"],["/sancategories/practice/page/4/index.html","f93b9fefc1c494fd525ab8cfa167b326"],["/sancategories/tutorial/index.html","58d5f34d9bba1debee2e09b2c9dc6233"],["/sancategories/tutorial/page/2/index.html","0c9c6afcba415e586e9dac51118d5f96"],["/sancategories/tutorial/page/3/index.html","840ac2d1d7c4ece0cad16f328b03bbdf"],["/sancategories/tutorial/page/4/index.html","1edd4ead42212affb1f567e93a49f028"],["/sancss/article.css","1466f88ac23ec652897ede3fb6d7aeb6"],["/sancss/bootstrap.min.css","920f984bd041d7ab8cceade3e5805efc"],["/sancss/code.css","dbd2986caea443e5aaae6275e1b7ed14"],["/sancss/codemirror.css","288352df06a67ee35003b0981da414ac"],["/sancss/font-awesome.min.css","bb53ad7bffecc0014d64553e96501dce"],["/sancss/site.css","f62c50f25880e89e16fe7348218eacde"],["/sancss/style.css","d7c9feb685b822297cba8540448e2e04"],["/sandoc/api/index.html","91327bd98cd5556ee1f91b36083f235c"],["/sandoc/main-members/index.html","c96fadd2cd1825772ef8203867bda8e4"],["/sanen/doc/api/index.html","28785befde6e753a8c308700a0bd8cf9"],["/sanen/doc/main-members/index.html","731e7fd1642b64115e168dd2e7f7c3f0"],["/sanen/example/index.html","c08f0262194a140e3e1becf9fa68c80f"],["/sanen/index.html","3a46c7d7c63449f39baee3308c93e800"],["/sanen/practice/array-deep-updates-trigger-view/index.html","585b101bc2ba45ada9f1b9487127c428"],["/sanen/practice/auto-camel/index.html","9604d34f6500261b95e3bcb2f446f319"],["/sanen/practice/can-we-use-dom/index.html","ca310a1d7b670d86adff80cadba6dbba"],["/sanen/practice/child-to-grandparent/index.html","87025f889b52ee7d9ce16be23802c28f"],["/sanen/practice/child-to-parent/index.html","763182371f46756fea971adb564c829d"],["/sanen/practice/data-invalid/index.html","e73404e68e045180742bdae1b3e61ebb"],["/sanen/practice/data-valid/index.html","489f668a3984bd862ae0ec121800e6bb"],["/sanen/practice/dynamic-parent-child/index.html","695d4bb8956670f15280220e68c133f0"],["/sanen/practice/how-to-show-or-hide-an-element/index.html","5436064ff8470397b74696a815c0dfe7"],["/sanen/practice/index.html","2dae71192a30043fd4a72fae3123f39a"],["/sanen/practice/parent-to-child/index.html","fe6a9b63127c043010f4f2df33cd9dcd"],["/sanen/practice/position-absolute-dom/index.html","72af6f10ffd1b13748d388f5adbc2804"],["/sanen/practice/question-and-answer/index.html","b039b7f32fe6ba37897768209d8e6c04"],["/sanen/practice/san-router-spa/index.html","96cee3a5637ada36fb6cb9f22d5408d9"],["/sanen/practice/san-store-spa/index.html","2be6f4cbaf0e16fe5037cdc18652fdd1"],["/sanen/practice/traverse-object/index.html","c93707a06f2b60088a324d8f7ee59064"],["/sanen/tutorial/background/index.html","274f4d4ad38af09402b25a18ea95970e"],["/sanen/tutorial/component/index.html","ffaf9b4731c6f9283d3f7691e2718755"],["/sanen/tutorial/data-checking/index.html","65b42b457a8f9c07715b07496aea559c"],["/sanen/tutorial/data-method/index.html","072946521fb3075675c985541112c155"],["/sanen/tutorial/event/index.html","460ddb60a2fe45611f2cf68bbf613595"],["/sanen/tutorial/for/index.html","8e3b7a5e75bf7bb6d725dc6ad9781585"],["/sanen/tutorial/form/index.html","01fd4b45062e73c57710b56af5f39faf"],["/sanen/tutorial/if/index.html","3fb72f408abc4f58ca2be8a2ea71a049"],["/sanen/tutorial/reverse-flag/index.html","4c19b0e363531a3a433ef5242f92c193"],["/sanen/tutorial/reverse/index.html","57f571892c39d416746e6ccb3c61d355"],["/sanen/tutorial/setup/index.html","1a774cf0d7f5a4e627040d29d3f994b9"],["/sanen/tutorial/slot/index.html","66a25facf056d47bd63e2418efc663bb"],["/sanen/tutorial/ssr-before-3.8/index.html","438ff697dbe810cae15abed3dc0b5f25"],["/sanen/tutorial/ssr/index.html","35e2b0644a993babe299085f448cc4a2"],["/sanen/tutorial/start/index.html","ca7b4ce5df68458176f173160e8073ce"],["/sanen/tutorial/style/index.html","bc91643b9c572d99ac49f15c40e78dd7"],["/sanen/tutorial/template/index.html","0c2d6843a282ab5fdb2f35245b297612"],["/sanen/tutorial/transition/index.html","5b06c1f5a6f19119040ccb2620ba00e9"],["/sanexample/index.html","7547d473e2ceae32696c5f681e9c28d7"],["/sanfonts/fontawesome-webfont.eot","25a32416abee198dd821b0b17a198a8f"],["/sanfonts/fontawesome-webfont.svg","d7c639084f684d66a1bc66855d193ed8"],["/sanfonts/fontawesome-webfont.ttf","1dc35d25e61d819a9c357074014867ab"],["/sanfonts/fontawesome-webfont.woff","c8ddf1e5e5bf3682bc7bebf30f394148"],["/sanimg/1.svg","d77034c37b417ef76096294de4c111bb"],["/sanimg/2.svg","fbf700664340cb41d83923a47b6e5160"],["/sanimg/3.svg","8989fb841451b7664ee31e1eda9b352b"],["/sanimg/4.svg","c7877b3cdf76c4e42dc841b1475145cc"],["/sanimg/5.svg","15c4e12ae689624dd1fb60b41a6d1ab1"],["/sanimg/6.svg","6fa71561eebdb75f7130e6d27c0d4402"],["/sanimg/7.svg","2f9f621f0455799eee836216db3cd585"],["/sanimg/8.svg","4730d9e16181617f8a75217e0a2ac23e"],["/sanimg/9.svg","28caa5650d8cbc6013f0ce9f8e6c6458"],["/sanimg/Search.svg","085ea4ef80349f1f33dc700b59932d20"],["/sanimg/Shape.svg","63ce11af494c6a2b84a5408a67814ba6"],["/sanimg/b_api.svg","e46ba603c241202ed66faef1bcb089b4"],["/sanimg/b_compass.svg","c8e132fa14a6c3328be175332c9a645b"],["/sanimg/b_design.svg","9c210ba39ad228a5c8cffa3db043b04b"],["/sanimg/b_mater.svg","9f8ad7d278d795f199bdf96c71243095"],["/sanimg/b_router.svg","8558806bc930f0ccc5d30050fe05fe07"],["/sanimg/b_store.svg","6ee10d6029b0e2a0fc6344e493efc248"],["/sanimg/b_trail.svg","6c3f8673381087390064c8d5394816ba"],["/sanimg/b_update.svg","3f30b8e8a5d022e2bb2dbeb0f72a0dee"],["/sanimg/banner-md.png","1bcfe22f30df09874804ebbad7eb0330"],["/sanimg/banner-santd.png","e237ae4ffeadae5f9aac8842f5383bef"],["/sanimg/github.svg","ab014a9cc0591bda97b2225753dc6c16"],["/sanimg/github2.svg","8f9a62a9b2f440411f490122cfc00090"],["/sanimg/icons/icon-128x128.png","360e8b077017ca3f8faffb1d2dc964c5"],["/sanimg/icons/icon-144x144.png","2cac5e49e8deb470ef8d695fed8a0784"],["/sanimg/icons/icon-152x152.png","ff8a6e62206508f799e4e33dfc23a6d1"],["/sanimg/icons/icon-192x192.png","b82502d56ce18f3c4a5cbb34aab37312"],["/sanimg/icons/icon-384x384.png","52fa46d5e222a4ec290f9ba93377f606"],["/sanimg/icons/icon-512x512.png","89dc6cdd8d62328a43c8f7be5bde8841"],["/sanimg/icons/icon-72x72.png","8f98a06550f027282907ac005cafb3f0"],["/sanimg/icons/icon-96x96.png","49b0e139682345a8f578f0546a56bfba"],["/sanimg/life-cycle.png","a42f7cf9b1dd363efe19ddf6cbcc11c2"],["/sanimg/logo-colorful.svg","25149c80cd625edfedcc6115dda17775"],["/sanimg/logo.svg","1bdf6b3d2b668fe5062e473e2b1860ff"],["/sanimg/logo2.png","50f59e2d6f907dbdf5720270ac745812"],["/sanimg/lowpoly.jpg","cfee0ad50ba60a1525c5b2dc3c020ac7"],["/sanimg/macbook.png","8d96db30d032572134832662ca85fc0b"],["/sanimg/pen.svg","86c390dc94bb381ac836b3635f25f47a"],["/sanimg/san-perf.png","a80f3a58d1c6a7c44b33ed90d56ff89c"],["/sanimg/search02.svg","7d27bda890fcbd9decd5d246a01c3a42"],["/sanindex.html","1035f4ec521e3930a05e3e66141e2719"],["/sanjs/bodymovin.min.js","40163e612f8d80acaac737f25b3641a2"],["/sanjs/codemirror.js","11af3980de7da80eacd742ecd9c37cf7"],["/sanjs/jquery-1.10.2.js","e3f24f23b859cf718282e3806ed5ce38"],["/sanjs/layout_control.js","84758cffe8e45f3a6723064605f2e5c3"],["/sanjs/script.js","536985cb34cdea52711130cb34549ace"],["/sanjs/stickUp.min.js","2a407130f9ed2b66cdd21407c203c149"],["/sanpage/2/index.html","2bf209993fd8adcbf8cb73cecc6f729e"],["/sanpage/3/index.html","3133f26209c382cf7c7a1c763987b7ce"],["/sanpage/4/index.html","84cc016e600d1d7057b35722c7191937"],["/sanpage/5/index.html","ec4d6fcc1db658a4244199f26354a8de"],["/sanpage/6/index.html","9b1d7b7d840446b9515c992c341c857d"],["/sanpage/7/index.html","84dd30c7cb68c04df35e74512ad3c107"],["/sanpage/8/index.html","6b00c496c0958cbb23fe805292582488"],["/sanpractice/array-deep-updates-trigger-view/index.html","7880b663ec173126ebd322e8853af96e"],["/sanpractice/auto-camel/index.html","bcad4b70f864cc05f48db6b19f7b1b2b"],["/sanpractice/can-we-use-dom/index.html","bf6c5a1efa863ef21b85cccc369ab379"],["/sanpractice/child-to-grandparent/index.html","777bc1ad9057c85516b2ca463757e1a9"],["/sanpractice/child-to-parent/index.html","aba248082e409449a9b96f1cfff52b5b"],["/sanpractice/data-invalid/index.html","0dd391b50c377fcf01b9921222132898"],["/sanpractice/data-valid/index.html","931d4372cc6f0eb05faac28168aa90a1"],["/sanpractice/dynamic-parent-child/index.html","9f5e347ae9e80a4bdec19859306feb32"],["/sanpractice/how-to-show-or-hide-an-element/index.html","44ea7b60200329904cdb17b6befa470c"],["/sanpractice/ie-compatibility/index.html","fc1d3eb39b503bf1ef09009319fd0a09"],["/sanpractice/index.html","a3ee5f8bf53032e8958816e7699577e4"],["/sanpractice/parent-to-child/index.html","2e57be73049307c96dba000115965ded"],["/sanpractice/position-absolute-dom/index.html","eefbbd7c515bb9933f2d9ca5dcbfb2a5"],["/sanpractice/question-and-answer/index.html","07005bda0008d23e59c68d7286f865bb"],["/sanpractice/san-router-spa/index.html","adff2c181f3ee7adaa3c256bff721deb"],["/sanpractice/san-store-spa/index.html","70ef5adca3fcd53d172622b653627f17"],["/sanpractice/traverse-object/index.html","52c9f9694782276b1dd081f6f96d8501"],["/santutorial/background/index.html","175317d1b3f9410582a46bbdb4fdd46f"],["/santutorial/component/index.html","d2efede9854ebf58f575ff51aa30ed0b"],["/santutorial/data-checking/index.html","31315c516082144074069fb59c4ab162"],["/santutorial/data-method/index.html","be9e059accb2e019433aff2d3153fc27"],["/santutorial/event/index.html","8e9ef01e58a043fe817feedfd15f521b"],["/santutorial/for/index.html","14f75034081fc5ff9d9cda4ed19e539b"],["/santutorial/form/index.html","641c0f115ddfb2934470478719667969"],["/santutorial/if/index.html","f51b4838e6b6107aa2345531fe08b42c"],["/santutorial/reverse-flag/index.html","13940e6f941de8cb289aa54aa9b401fd"],["/santutorial/reverse/index.html","16a4921b62a4e6cafb0af96b6a931312"],["/santutorial/setup/index.html","ba1e62ee6ff914e7dbb2ff4244b6b1f9"],["/santutorial/slot/index.html","13d2f19914d588b6188e46a7de84cd85"],["/santutorial/ssr-before-3.8/index.html","0acc2e2c8727fbdfe05bfd8a6d1119d0"],["/santutorial/ssr/index.html","7d10b48504c7acabaa87ee092de27553"],["/santutorial/start/index.html","5b628a8535a4a41279debf4f90bd99b8"],["/santutorial/style/index.html","44d936fac36c1acd2f69bb9b06a0e8b0"],["/santutorial/template/index.html","5484aa8b0f139dd7db979110f1491677"],["/santutorial/transition/index.html","1d66cb8243dfaff5129ff5685d853df6"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







