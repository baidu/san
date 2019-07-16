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

var precacheConfig = [["/sanarchives/2018/03/index.html","b387e069971db8562acb3160ac337a01"],["/sanarchives/2018/03/page/2/index.html","7b2cbc5c94b82687aba02125b609f22e"],["/sanarchives/2018/03/page/3/index.html","f187f2a19a5c69f33174f4c8d9c3e129"],["/sanarchives/2018/06/index.html","e4ad4e322c7ce99345a8d9740d7dae34"],["/sanarchives/2018/10/index.html","46a81ec0824bb118ba34c6a6cbf77905"],["/sanarchives/2018/11/index.html","8fe8861204de43376515ed9b78efafff"],["/sanarchives/2018/12/index.html","80f715b78f9f0fa19487f20b837e5d93"],["/sanarchives/2018/index.html","982ef029fc0fcb5277e6977d9185ba14"],["/sanarchives/2018/page/2/index.html","11cc6fa5aa02d2dfe7d049face780c43"],["/sanarchives/2018/page/3/index.html","9d0b3d63853e73a1c34b9e2cbec4dc88"],["/sanarchives/2018/page/4/index.html","858db669b11aa1bff70e4e92088582c1"],["/sanarchives/2018/page/5/index.html","a1984cbbcc07141756dd2f83938ae544"],["/sanarchives/2019/02/index.html","314c7ce3f4e316b9ad2e9d27dbed42b7"],["/sanarchives/2019/02/page/2/index.html","a7a82d0b79896f7a9d198f32d9e087a4"],["/sanarchives/2019/03/index.html","62d94cc1f541b947910b11ac4073e676"],["/sanarchives/2019/04/index.html","6bb70f849dbdb2d9af68141bff6c20ac"],["/sanarchives/2019/06/index.html","d25aea92f9c7af33fbb529a0e1b3b038"],["/sanarchives/2019/index.html","ee8264b1a562a5e7d88097afe2e0ae88"],["/sanarchives/2019/page/2/index.html","85c5b4cc32d29ec8cd046e45565cd824"],["/sanarchives/2019/page/3/index.html","a57f87e1b03d615aabecb4b633519f17"],["/sanarchives/index.html","1b10e0829729db99246d80f27a8d7fb5"],["/sanarchives/page/2/index.html","3fcb3db341d1d2479da9d6ed05de984a"],["/sanarchives/page/3/index.html","4d06fe546e180e0dd392ed1a1de8e25c"],["/sanarchives/page/4/index.html","c9ca6b1f3fcea42c5f52174651b91109"],["/sanarchives/page/5/index.html","b518036d67f7ee5cd3fcdb55ed925ab8"],["/sanarchives/page/6/index.html","e4f1cfd87ef6c05a2539c6db841931af"],["/sanarchives/page/7/index.html","c33fc6ad56c1b257b47f49c2cf5fb2d0"],["/sancategories/doc/index.html","e11900c772cbf86e684847a1bbcf4867"],["/sancategories/practice/index.html","5552c7b0651e1fac540fd59040bdf082"],["/sancategories/practice/page/2/index.html","44e094d64e39567b24890b23fb333ac6"],["/sancategories/practice/page/3/index.html","4223218dcaa1619d87001577d211adff"],["/sancategories/practice/page/4/index.html","76d9b02f6718c59fb307436716c1d235"],["/sancategories/tutorial/index.html","71a4166d4914eacf276d2b5e22f19da2"],["/sancategories/tutorial/page/2/index.html","cb161e3e12a1bcc1c90e003a98e4c68c"],["/sancategories/tutorial/page/3/index.html","2047880a57b628a6e7cb703917ab7b0e"],["/sancategories/tutorial/page/4/index.html","9fbf1b2a6bbeca43db11947a65f15575"],["/sancss/article.css","1466f88ac23ec652897ede3fb6d7aeb6"],["/sancss/bootstrap.min.css","920f984bd041d7ab8cceade3e5805efc"],["/sancss/code.css","dbd2986caea443e5aaae6275e1b7ed14"],["/sancss/codemirror.css","288352df06a67ee35003b0981da414ac"],["/sancss/font-awesome.min.css","bb53ad7bffecc0014d64553e96501dce"],["/sancss/site.css","0571a8ba6f9364b70777ded914a0a50e"],["/sancss/style.css","a097fb6f4a2e28e9bb40cd883982c54d"],["/sandoc/api/index.html","2d0339f01bf631a380c4ee0e66648964"],["/sandoc/main-members/index.html","e6c497ccf8b9eeb046c6db60faae2748"],["/sanen/doc/api/index.html","4d963ecb7c69ef0fea2710a9452d71f8"],["/sanen/doc/main-members/index.html","62f87ebae0b11688de9725f8cea52eb9"],["/sanen/example/index.html","f04c87d5ad2fa3009d0151f986ca62ee"],["/sanen/index.html","0b2b55d391792e9dd86a4335d7dccec6"],["/sanen/practice/array-deep-updates-trigger-view/index.html","aedac4d0d6108e3baaf4451be39a4b54"],["/sanen/practice/auto-camel/index.html","00d2aa42381f78dba485d64820bdbacc"],["/sanen/practice/can-we-use-dom/index.html","8ed5ad36d45f2055a519905c3abce787"],["/sanen/practice/child-to-grandparent/index.html","45ebae6e3df8661fa5c8c7291912be04"],["/sanen/practice/child-to-parent/index.html","187b9fb090566200aeb92f9caf5bb900"],["/sanen/practice/data-invalid/index.html","67dc8413aef51dbf081314fdb8723f2d"],["/sanen/practice/data-valid/index.html","3aae43c48447f1d30bd99160e9dbbedc"],["/sanen/practice/dynamic-parent-child/index.html","8e44a16e4b395748a9d28b56b86c2bee"],["/sanen/practice/how-to-show-or-hide-an-element/index.html","705bae9bce0e0dbfe259cd9b676bb382"],["/sanen/practice/index.html","be7236fa28ccb932a097c6d0e9757ffb"],["/sanen/practice/parent-to-child/index.html","218bf8c238346b3ad163b1399d41f794"],["/sanen/practice/position-absolute-dom/index.html","f86023f859a713242cbf6177b2a17f51"],["/sanen/practice/question-and-answer/index.html","01820eb98e2d803ed3b0d6785847ef69"],["/sanen/practice/san-router-spa/index.html","1157cb8dab17b44a54cc83cdfc58e99f"],["/sanen/practice/san-store-spa/index.html","a6af800511e03cc402acc5edef1d0306"],["/sanen/practice/traverse-object/index.html","ab2cc8cc20709b80e60728a26f91032f"],["/sanen/tutorial/background/index.html","f991ddb59416ffd3f10f93aa63efa827"],["/sanen/tutorial/component/index.html","92ff842badf809054d4d9c7cba0b9a71"],["/sanen/tutorial/data-checking/index.html","ca36552d1230f5cbd8f6804c68a42d79"],["/sanen/tutorial/data-method/index.html","9e063cc62d0619663c5daa20dd10c4b1"],["/sanen/tutorial/event/index.html","db367925942895f72b5dc5bb73c1de13"],["/sanen/tutorial/for/index.html","0170a8c8191c87759241f0c3eb9da6bf"],["/sanen/tutorial/form/index.html","6f0e467dcb39532cd0abcc46d3137c1b"],["/sanen/tutorial/if/index.html","9849547c8d281f94e8a8fab3f2b17f0c"],["/sanen/tutorial/reverse-flag/index.html","40d29cdd2cfb361ef89b268e0206507b"],["/sanen/tutorial/reverse/index.html","dd55d16703fcfce9c23afc91efd49fe5"],["/sanen/tutorial/setup/index.html","75983cd4570b0d58948597f3df071d52"],["/sanen/tutorial/slot/index.html","66dbb159546981233deb26f2e8dca854"],["/sanen/tutorial/ssr/index.html","5e970b74763e876008e1eeb5ae7aec61"],["/sanen/tutorial/start/index.html","5826f87d96cac09f0dce6f500e26dfb4"],["/sanen/tutorial/style/index.html","68ded0aa4310f3b95ad18b72302932a4"],["/sanen/tutorial/template/index.html","5fb1b6685075e885e1d8b0725dd650a0"],["/sanen/tutorial/transition/index.html","5cff679c453228b4a16d7f2000e97db3"],["/sanexample/index.html","6825dcc44179d22473f5ca509b71457e"],["/sanfonts/fontawesome-webfont.eot","25a32416abee198dd821b0b17a198a8f"],["/sanfonts/fontawesome-webfont.svg","d7c639084f684d66a1bc66855d193ed8"],["/sanfonts/fontawesome-webfont.ttf","1dc35d25e61d819a9c357074014867ab"],["/sanfonts/fontawesome-webfont.woff","c8ddf1e5e5bf3682bc7bebf30f394148"],["/sanimg/1.svg","d77034c37b417ef76096294de4c111bb"],["/sanimg/2.svg","fbf700664340cb41d83923a47b6e5160"],["/sanimg/3.svg","8989fb841451b7664ee31e1eda9b352b"],["/sanimg/4.svg","c7877b3cdf76c4e42dc841b1475145cc"],["/sanimg/5.svg","15c4e12ae689624dd1fb60b41a6d1ab1"],["/sanimg/6.svg","6fa71561eebdb75f7130e6d27c0d4402"],["/sanimg/7.svg","2f9f621f0455799eee836216db3cd585"],["/sanimg/8.svg","4730d9e16181617f8a75217e0a2ac23e"],["/sanimg/9.svg","28caa5650d8cbc6013f0ce9f8e6c6458"],["/sanimg/Search.svg","085ea4ef80349f1f33dc700b59932d20"],["/sanimg/Shape.svg","63ce11af494c6a2b84a5408a67814ba6"],["/sanimg/b_api.svg","e46ba603c241202ed66faef1bcb089b4"],["/sanimg/b_compass.svg","c8e132fa14a6c3328be175332c9a645b"],["/sanimg/b_design.svg","9c210ba39ad228a5c8cffa3db043b04b"],["/sanimg/b_mater.svg","9f8ad7d278d795f199bdf96c71243095"],["/sanimg/b_router.svg","8558806bc930f0ccc5d30050fe05fe07"],["/sanimg/b_store.svg","6ee10d6029b0e2a0fc6344e493efc248"],["/sanimg/b_trail.svg","6c3f8673381087390064c8d5394816ba"],["/sanimg/b_update.svg","3f30b8e8a5d022e2bb2dbeb0f72a0dee"],["/sanimg/banner-md.png","1bcfe22f30df09874804ebbad7eb0330"],["/sanimg/github.svg","ab014a9cc0591bda97b2225753dc6c16"],["/sanimg/github2.svg","8f9a62a9b2f440411f490122cfc00090"],["/sanimg/icons/icon-128x128.png","360e8b077017ca3f8faffb1d2dc964c5"],["/sanimg/icons/icon-144x144.png","2cac5e49e8deb470ef8d695fed8a0784"],["/sanimg/icons/icon-152x152.png","ff8a6e62206508f799e4e33dfc23a6d1"],["/sanimg/icons/icon-192x192.png","b82502d56ce18f3c4a5cbb34aab37312"],["/sanimg/icons/icon-384x384.png","52fa46d5e222a4ec290f9ba93377f606"],["/sanimg/icons/icon-512x512.png","89dc6cdd8d62328a43c8f7be5bde8841"],["/sanimg/icons/icon-72x72.png","8f98a06550f027282907ac005cafb3f0"],["/sanimg/icons/icon-96x96.png","49b0e139682345a8f578f0546a56bfba"],["/sanimg/life-cycle.png","a42f7cf9b1dd363efe19ddf6cbcc11c2"],["/sanimg/logo-colorful.svg","25149c80cd625edfedcc6115dda17775"],["/sanimg/logo.svg","1bdf6b3d2b668fe5062e473e2b1860ff"],["/sanimg/logo2.png","50f59e2d6f907dbdf5720270ac745812"],["/sanimg/lowpoly.jpg","cfee0ad50ba60a1525c5b2dc3c020ac7"],["/sanimg/macbook.png","8d96db30d032572134832662ca85fc0b"],["/sanimg/pen.svg","86c390dc94bb381ac836b3635f25f47a"],["/sanimg/san-perf.png","a80f3a58d1c6a7c44b33ed90d56ff89c"],["/sanimg/search02.svg","7d27bda890fcbd9decd5d246a01c3a42"],["/sanindex.html","f1b218eeb167c7c999c2585a10cc9d74"],["/sanjs/bodymovin.min.js","40163e612f8d80acaac737f25b3641a2"],["/sanjs/codemirror.js","11af3980de7da80eacd742ecd9c37cf7"],["/sanjs/jquery-1.10.2.js","e3f24f23b859cf718282e3806ed5ce38"],["/sanjs/layout_control.js","84758cffe8e45f3a6723064605f2e5c3"],["/sanjs/script.js","536985cb34cdea52711130cb34549ace"],["/sanjs/stickUp.min.js","2a407130f9ed2b66cdd21407c203c149"],["/sanpage/2/index.html","140e815d2797ce6c0b28c4d9568efc3e"],["/sanpage/3/index.html","ceadf8d6b129e052962f935c29e0f0c7"],["/sanpage/4/index.html","5f4fd55d81a9665b8057db7ffbedd567"],["/sanpage/5/index.html","2562a2acb7774e2e2948acb95698f721"],["/sanpage/6/index.html","f2681eeb86253f467e1aa8211d25e0ad"],["/sanpage/7/index.html","b3b1773a1b6b305e5367fc3353e3fbfd"],["/sanpractice/array-deep-updates-trigger-view/index.html","5a95128b82e9414bf9a265c66b1b1733"],["/sanpractice/auto-camel/index.html","cd717dd4891bc4eb3761c1d67eca6316"],["/sanpractice/can-we-use-dom/index.html","3a3e3a66522875a2f0ffe1df02c13d8d"],["/sanpractice/child-to-grandparent/index.html","97690b650564bbd47dd731f2e5154966"],["/sanpractice/child-to-parent/index.html","15c72d8af18bee788f7edb489ef070d4"],["/sanpractice/data-invalid/index.html","5f7beaaafcd735c092707eb2c8fc2870"],["/sanpractice/data-valid/index.html","5e4887162c3b1a403c76d1d97136672f"],["/sanpractice/dynamic-parent-child/index.html","768e721a9961c3248a5dc869818145cd"],["/sanpractice/how-to-show-or-hide-an-element/index.html","7c8d4c88d64d11c0a5fa6aa795912d0f"],["/sanpractice/ie-compatibility/index.html","4f613b4a74dfb6a35b07fb2ce653f433"],["/sanpractice/index.html","4c15fd1b5514f371075862775d570618"],["/sanpractice/parent-to-child/index.html","a9b3c3f7dfed03733d421a7b6cc080f2"],["/sanpractice/position-absolute-dom/index.html","bde9b81dfd2749cea33d0b5bf2c45102"],["/sanpractice/question-and-answer/index.html","418dde6c4449b7dde95eb4b56eb736e8"],["/sanpractice/san-router-spa/index.html","fe15905beca7e9f146550baba09ab190"],["/sanpractice/san-store-spa/index.html","8900d133b4bbec2911480c129526a787"],["/sanpractice/traverse-object/index.html","6cb7aaac5a327f95d91a42f6b5b91db8"],["/santutorial/background/index.html","c468d4d897a9e7e755bd56e030158751"],["/santutorial/component/index.html","2f9d49668b8afe33e05148b9a7da2fd4"],["/santutorial/data-checking/index.html","462d7ad7d40fdf38cab109814c6a31b3"],["/santutorial/data-method/index.html","de693af80a59bed16e0d0ae9c3f9b7df"],["/santutorial/event/index.html","4f83bdc0a69ac82650126d5ea5c462b6"],["/santutorial/for/index.html","fbdf6854f5f8633982862143995c9ee0"],["/santutorial/form/index.html","68078393e1a660f05f0997ace22b1cf6"],["/santutorial/if/index.html","050117d8c17b1915bd4c65bc861cd186"],["/santutorial/reverse-flag/index.html","e557efd8bde2b2c53610aa629f6030e4"],["/santutorial/reverse/index.html","cd1f2a727e2787a6052b827dd9171ecb"],["/santutorial/setup/index.html","db625f94725349511eff04a23f006fef"],["/santutorial/slot/index.html","f689598687012938fd1c6ea56b7a2b51"],["/santutorial/ssr/index.html","7aa99f794430040be9cc03c17b6c3208"],["/santutorial/start/index.html","026dbb121255024ad03eb10063802b41"],["/santutorial/style/index.html","8c941569cecefe9db94658c8fc264ba4"],["/santutorial/template/index.html","bb402616fbc094a6bcd68f9278714f21"],["/santutorial/transition/index.html","5a804fd1ef15283d71a31a0d0021a83e"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
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

var createCacheKey = function (originalUrl, paramName, paramValue,
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

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
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

var stripIgnoredUrlParameters = function (originalUrl,
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







