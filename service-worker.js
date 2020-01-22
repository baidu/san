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

var precacheConfig = [["/sanarchives/2018/03/index.html","0963566ccf6746b8a973dd7469beb104"],["/sanarchives/2018/03/page/2/index.html","5fbb591486df9ba37be34144a4748db2"],["/sanarchives/2018/03/page/3/index.html","77f85b2df96ad7f704067912ad8541ad"],["/sanarchives/2018/06/index.html","37fd0f9e0effb0209c50eac28353b543"],["/sanarchives/2018/10/index.html","0d3636a0cd2dabf6c3e0fbbf7756c6e6"],["/sanarchives/2018/11/index.html","befe6f26c9bfeb91bd5c87b14391f044"],["/sanarchives/2018/12/index.html","a936d1ba4a8c17fa112f56f266af7f28"],["/sanarchives/2018/index.html","9bd4448d716fa85695db214091eb2654"],["/sanarchives/2018/page/2/index.html","16d861739ca32361aa98235e4517fd7e"],["/sanarchives/2018/page/3/index.html","a508b3bac3ad4c5a5da5376f9b94814b"],["/sanarchives/2018/page/4/index.html","071b8b0f1ebd7708db4f5e214ad24c34"],["/sanarchives/2018/page/5/index.html","2aa5274c93a88a7e402a0264796831f1"],["/sanarchives/2019/02/index.html","f49a68ec466c7c630338e4260fc559d8"],["/sanarchives/2019/02/page/2/index.html","06d2151488b82d77c7ad9456442a461d"],["/sanarchives/2019/03/index.html","bc07a2c185c2985be587eab026981c05"],["/sanarchives/2019/04/index.html","f1062d64d83c5bc7b856d45e938941b0"],["/sanarchives/2019/06/index.html","6661336c36c77808fa13476c7005f433"],["/sanarchives/2019/index.html","741418bc02ea29d290b8a34d43d9ff48"],["/sanarchives/2019/page/2/index.html","92c11f90cd10c679c7c39602793206e0"],["/sanarchives/2019/page/3/index.html","3f6f257dfe2f418c4d29204cfc8a273a"],["/sanarchives/2020/01/index.html","82801de6be8f9b0fb344b2d1aa37d140"],["/sanarchives/2020/index.html","ccaa97ad6ba1ec8bf1cf95143c58cc60"],["/sanarchives/index.html","d31cba6c00c4b5988e304b23b70491c8"],["/sanarchives/page/2/index.html","e386cd81274631e14538dae120b55574"],["/sanarchives/page/3/index.html","b6847c7bbdbe9af85d95dd6cb550052e"],["/sanarchives/page/4/index.html","aed5b7d84379bdb34bf130fa08145414"],["/sanarchives/page/5/index.html","3eb908ea6451c594db31b53795c25d61"],["/sanarchives/page/6/index.html","52f5146bd71267728325c440e9c9898a"],["/sanarchives/page/7/index.html","994350845a787c0a5bc870e39ea8cc29"],["/sanarchives/page/8/index.html","65ac26bc96757e2bbb5a75885eaca61e"],["/sancategories/doc/index.html","bba60423e1bc9557f57b320b42b9a155"],["/sancategories/practice/index.html","26020005e267db75be159dffecbed7ec"],["/sancategories/practice/page/2/index.html","137ee4fba47e6a922c4558dd0367e122"],["/sancategories/practice/page/3/index.html","808e1b753c9177445adb1510426bacad"],["/sancategories/practice/page/4/index.html","594c182b3d56a089b81eb7c80828aa6f"],["/sancategories/tutorial/index.html","942794545f59c9e35e5e156768d8abc9"],["/sancategories/tutorial/page/2/index.html","a06e308ff8f88b2d1d881c175a0a48fb"],["/sancategories/tutorial/page/3/index.html","b7cb86de9b1eb71f84a1da8c9cb58d3b"],["/sancategories/tutorial/page/4/index.html","3e3f4929dab471b22e492ba842ae6918"],["/sancss/article.css","1466f88ac23ec652897ede3fb6d7aeb6"],["/sancss/bootstrap.min.css","920f984bd041d7ab8cceade3e5805efc"],["/sancss/code.css","dbd2986caea443e5aaae6275e1b7ed14"],["/sancss/codemirror.css","288352df06a67ee35003b0981da414ac"],["/sancss/font-awesome.min.css","bb53ad7bffecc0014d64553e96501dce"],["/sancss/site.css","0571a8ba6f9364b70777ded914a0a50e"],["/sancss/style.css","a097fb6f4a2e28e9bb40cd883982c54d"],["/sandoc/api/index.html","e198aafe3d8596bd555c1a88f6bf28df"],["/sandoc/main-members/index.html","83a9dc1bceca5b5bfbe6d68a43e3a11b"],["/sanen/doc/api/index.html","625336bb5fac91d4ffa4f890cac2079c"],["/sanen/doc/main-members/index.html","c4991ed00c97770631db37ed7f0faec0"],["/sanen/example/index.html","e12e9ade0c743df3b6edd951b4306fee"],["/sanen/index.html","e070b27baf39dadca8aa5ac7dbf9ad66"],["/sanen/practice/array-deep-updates-trigger-view/index.html","d5641576a2e9f4bbf486e0e7d0a11af3"],["/sanen/practice/auto-camel/index.html","e6f0087f7ed618528629d6142b2f7e0d"],["/sanen/practice/can-we-use-dom/index.html","bb845c4b33d097df49e8fa20268810c0"],["/sanen/practice/child-to-grandparent/index.html","a5eae08e59da30bce5696eb70d7ce491"],["/sanen/practice/child-to-parent/index.html","40e0856597404e4bdd013ff25346cae6"],["/sanen/practice/data-invalid/index.html","ebcce45e1736ebe2b92b260bb48dc50d"],["/sanen/practice/data-valid/index.html","7cf289f3bc650e73724bc814ab30e0de"],["/sanen/practice/dynamic-parent-child/index.html","50995e5e6076236030723ff1d156ad5b"],["/sanen/practice/how-to-show-or-hide-an-element/index.html","7e40d7594c6491384070220f44bba900"],["/sanen/practice/index.html","862c2c8b87b7c79c35ba072da998aa27"],["/sanen/practice/parent-to-child/index.html","342501e2d4819e4ffafe0779cd8a9bcf"],["/sanen/practice/position-absolute-dom/index.html","95575ad0c4c782d3bbc1f12cc580b133"],["/sanen/practice/question-and-answer/index.html","84730fb2c2ec5b32f73aa9b4c8d2fc7f"],["/sanen/practice/san-router-spa/index.html","55be929399d15e95be93a128fcf16f5c"],["/sanen/practice/san-store-spa/index.html","875df5d9433abe623f108c084c746084"],["/sanen/practice/traverse-object/index.html","2fae5fb8fb277779a9733f2ca8fc0e5d"],["/sanen/tutorial/background/index.html","ad0342c55cbed661f2094fa96da6e195"],["/sanen/tutorial/component/index.html","ae5b1e33b2cb02bf197b98cd31d11912"],["/sanen/tutorial/data-checking/index.html","56eda39725622dc5125fa540de13d24d"],["/sanen/tutorial/data-method/index.html","aca573e7ba03d6cc03753d7a366cb4d8"],["/sanen/tutorial/event/index.html","db7e3c92cefffbfd283fb6302c726c71"],["/sanen/tutorial/for/index.html","a66a658052ec854007f7f6d223a8accc"],["/sanen/tutorial/form/index.html","8de19502e203f638130cdfed7fa266f9"],["/sanen/tutorial/if/index.html","3b39c1b4d5a06d2a4e6f7ed389e16856"],["/sanen/tutorial/reverse-flag/index.html","4305b87d14fa25fa081d5706839f083b"],["/sanen/tutorial/reverse/index.html","831a8b948079203c24db284520638c83"],["/sanen/tutorial/setup/index.html","5556b6a806b9eb2c68eed63519c381cc"],["/sanen/tutorial/slot/index.html","4a7ae2c0614760395564ef83b760d148"],["/sanen/tutorial/ssr-before-3.8/index.html","d7aa03f4f5d253abc923a872d707fc2b"],["/sanen/tutorial/ssr/index.html","1fce9fbcacaebef77fefe6ae47c97444"],["/sanen/tutorial/start/index.html","bc2323d84351831f6cc3a2e9976d9fb1"],["/sanen/tutorial/style/index.html","14c606539c715f17d34e22b79bba5ca3"],["/sanen/tutorial/template/index.html","f084024b3c22fc4899140659de6a185b"],["/sanen/tutorial/transition/index.html","2f92fea95710bf2e993f1879afd1f9e8"],["/sanexample/index.html","37d13509c67cc17ca84e046b9b88a853"],["/sanfonts/fontawesome-webfont.eot","25a32416abee198dd821b0b17a198a8f"],["/sanfonts/fontawesome-webfont.svg","d7c639084f684d66a1bc66855d193ed8"],["/sanfonts/fontawesome-webfont.ttf","1dc35d25e61d819a9c357074014867ab"],["/sanfonts/fontawesome-webfont.woff","c8ddf1e5e5bf3682bc7bebf30f394148"],["/sanimg/1.svg","d77034c37b417ef76096294de4c111bb"],["/sanimg/2.svg","fbf700664340cb41d83923a47b6e5160"],["/sanimg/3.svg","8989fb841451b7664ee31e1eda9b352b"],["/sanimg/4.svg","c7877b3cdf76c4e42dc841b1475145cc"],["/sanimg/5.svg","15c4e12ae689624dd1fb60b41a6d1ab1"],["/sanimg/6.svg","6fa71561eebdb75f7130e6d27c0d4402"],["/sanimg/7.svg","2f9f621f0455799eee836216db3cd585"],["/sanimg/8.svg","4730d9e16181617f8a75217e0a2ac23e"],["/sanimg/9.svg","28caa5650d8cbc6013f0ce9f8e6c6458"],["/sanimg/Search.svg","085ea4ef80349f1f33dc700b59932d20"],["/sanimg/Shape.svg","63ce11af494c6a2b84a5408a67814ba6"],["/sanimg/b_api.svg","e46ba603c241202ed66faef1bcb089b4"],["/sanimg/b_compass.svg","c8e132fa14a6c3328be175332c9a645b"],["/sanimg/b_design.svg","9c210ba39ad228a5c8cffa3db043b04b"],["/sanimg/b_mater.svg","9f8ad7d278d795f199bdf96c71243095"],["/sanimg/b_router.svg","8558806bc930f0ccc5d30050fe05fe07"],["/sanimg/b_store.svg","6ee10d6029b0e2a0fc6344e493efc248"],["/sanimg/b_trail.svg","6c3f8673381087390064c8d5394816ba"],["/sanimg/b_update.svg","3f30b8e8a5d022e2bb2dbeb0f72a0dee"],["/sanimg/banner-md.png","1bcfe22f30df09874804ebbad7eb0330"],["/sanimg/banner-santd.png","e237ae4ffeadae5f9aac8842f5383bef"],["/sanimg/github.svg","ab014a9cc0591bda97b2225753dc6c16"],["/sanimg/github2.svg","8f9a62a9b2f440411f490122cfc00090"],["/sanimg/icons/icon-128x128.png","360e8b077017ca3f8faffb1d2dc964c5"],["/sanimg/icons/icon-144x144.png","2cac5e49e8deb470ef8d695fed8a0784"],["/sanimg/icons/icon-152x152.png","ff8a6e62206508f799e4e33dfc23a6d1"],["/sanimg/icons/icon-192x192.png","b82502d56ce18f3c4a5cbb34aab37312"],["/sanimg/icons/icon-384x384.png","52fa46d5e222a4ec290f9ba93377f606"],["/sanimg/icons/icon-512x512.png","89dc6cdd8d62328a43c8f7be5bde8841"],["/sanimg/icons/icon-72x72.png","8f98a06550f027282907ac005cafb3f0"],["/sanimg/icons/icon-96x96.png","49b0e139682345a8f578f0546a56bfba"],["/sanimg/life-cycle.png","a42f7cf9b1dd363efe19ddf6cbcc11c2"],["/sanimg/logo-colorful.svg","25149c80cd625edfedcc6115dda17775"],["/sanimg/logo.svg","1bdf6b3d2b668fe5062e473e2b1860ff"],["/sanimg/logo2.png","50f59e2d6f907dbdf5720270ac745812"],["/sanimg/lowpoly.jpg","cfee0ad50ba60a1525c5b2dc3c020ac7"],["/sanimg/macbook.png","8d96db30d032572134832662ca85fc0b"],["/sanimg/pen.svg","86c390dc94bb381ac836b3635f25f47a"],["/sanimg/san-perf.png","a80f3a58d1c6a7c44b33ed90d56ff89c"],["/sanimg/search02.svg","7d27bda890fcbd9decd5d246a01c3a42"],["/sanindex.html","39efed8af619f829da1aed95f62e1fcb"],["/sanjs/bodymovin.min.js","40163e612f8d80acaac737f25b3641a2"],["/sanjs/codemirror.js","11af3980de7da80eacd742ecd9c37cf7"],["/sanjs/jquery-1.10.2.js","e3f24f23b859cf718282e3806ed5ce38"],["/sanjs/layout_control.js","84758cffe8e45f3a6723064605f2e5c3"],["/sanjs/script.js","536985cb34cdea52711130cb34549ace"],["/sanjs/stickUp.min.js","2a407130f9ed2b66cdd21407c203c149"],["/sanpage/2/index.html","6a93818f89d5d1ed3f039f5a45c3b528"],["/sanpage/3/index.html","81f2b8d498b534c37acdf09db0c6bb28"],["/sanpage/4/index.html","d8e7def897a286eae0a4ce10506b22d5"],["/sanpage/5/index.html","b8ee50aa46c03788a5d646730ef73f60"],["/sanpage/6/index.html","84d3c9ab54165b79216d0cd56c60fce7"],["/sanpage/7/index.html","f359814a1b95c02ea5402ebbe9f1a5af"],["/sanpage/8/index.html","2a63d55257fa236d97f01a25de716e49"],["/sanpractice/array-deep-updates-trigger-view/index.html","236edb0baf48d5a1276af2e31c3a7a44"],["/sanpractice/auto-camel/index.html","71d87be8c1dd17ee07a3da5e8db4159c"],["/sanpractice/can-we-use-dom/index.html","39b4861bf16631c3267b27668dce9669"],["/sanpractice/child-to-grandparent/index.html","8102b39ee6685b401ab96e6a7ab3ce9d"],["/sanpractice/child-to-parent/index.html","b1ac96a7b880855193fa4797b50854f8"],["/sanpractice/data-invalid/index.html","5e176a699814b14f5c52949549fee8a7"],["/sanpractice/data-valid/index.html","da3f9211c02f729f58d038e2449a70ac"],["/sanpractice/dynamic-parent-child/index.html","6f64a2249430b316c044295ef31b15f0"],["/sanpractice/how-to-show-or-hide-an-element/index.html","33d3edd56fdb3bf1b20d5d272fc3771b"],["/sanpractice/ie-compatibility/index.html","dcdb6e8294d016806fe79d950a8ac0f2"],["/sanpractice/index.html","17c063ba9ba978917322178cd9845f64"],["/sanpractice/parent-to-child/index.html","ba17430639be3d79726a8b4bc91ecff5"],["/sanpractice/position-absolute-dom/index.html","a440583202e89e881b5ac0e6a435f1dc"],["/sanpractice/question-and-answer/index.html","363618351d32e462a556e0749cbea47d"],["/sanpractice/san-router-spa/index.html","7f65fe90180b6b1f0044bad7df4c4201"],["/sanpractice/san-store-spa/index.html","8061fec2a9641008fab41288f8d3194f"],["/sanpractice/traverse-object/index.html","aa84110b3166d86b9ad55faad256558b"],["/santutorial/background/index.html","8262d03cc014fe9f645565af55f01f5d"],["/santutorial/component/index.html","249df92d13609f4b9d4f3c17545308c5"],["/santutorial/data-checking/index.html","fa6de81b3d2f0300dcbc24586c655a64"],["/santutorial/data-method/index.html","58079fc4d7d313bc1c260fdcf52e4824"],["/santutorial/event/index.html","75c0d5c405eef8e145c0fc680c7dea9a"],["/santutorial/for/index.html","4993eb36f5f02a122c5ad8958f51680a"],["/santutorial/form/index.html","1abdb59b3fe951802c29d9de9d670d7d"],["/santutorial/if/index.html","0273e57577867fcce2c494207690691c"],["/santutorial/reverse-flag/index.html","bd23a66d4e6e4cfa9a43813b5e4377b3"],["/santutorial/reverse/index.html","6150f16bd730881694f36ca1575b820e"],["/santutorial/setup/index.html","df129f5e66566cd0af4ae727a00d072b"],["/santutorial/slot/index.html","f5522902767590fcdf853a1462032b9a"],["/santutorial/ssr-before-3.8/index.html","02bc61300c4af3af55aa1262278bcdf1"],["/santutorial/ssr/index.html","fcd1bb76f0d5f12c4b4b310c798b8172"],["/santutorial/start/index.html","b2113d88b592eed02c86c35925ba0d6f"],["/santutorial/style/index.html","54e3acf96abc82ffa9738abc80d34ac5"],["/santutorial/template/index.html","24a7b62fe6c5b095d6d22e175e5a3885"],["/santutorial/transition/index.html","44502cd6d59be522a6541b07aa25fbe5"]];
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







