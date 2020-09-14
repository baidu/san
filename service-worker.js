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

var precacheConfig = [["/sanarchives/2018/03/index.html","01f858debabe627246e3ae20b87a386f"],["/sanarchives/2018/03/page/2/index.html","b170d991ce22f8ce3342826885f0552e"],["/sanarchives/2018/03/page/3/index.html","84b73b1457957a1888190da1663d1640"],["/sanarchives/2018/06/index.html","cdbc663536a119a3f9118004332879a9"],["/sanarchives/2018/10/index.html","49f3c5f60d44d0889970bbebe1a41216"],["/sanarchives/2018/11/index.html","06c1bea7eda744e8dbcff35f52c839dd"],["/sanarchives/2018/12/index.html","d6f907e95ca7f9122f2c042c7ee05ede"],["/sanarchives/2018/index.html","48bedf75774829da2dfd69fffde1e833"],["/sanarchives/2018/page/2/index.html","5679b25771fcc487205965f9c033dbda"],["/sanarchives/2018/page/3/index.html","c89f689e73e10eabce0faad9ce0c6d94"],["/sanarchives/2018/page/4/index.html","e1e249bf9f696521b399c527e55f27e9"],["/sanarchives/2018/page/5/index.html","5b4e27af404e77b9f124d66e5df34813"],["/sanarchives/2019/02/index.html","97b2419d28d11ebb2e25f46cc3d05652"],["/sanarchives/2019/03/index.html","608afe0524df87afcbd4b8c18b358723"],["/sanarchives/2019/04/index.html","72f0966824fe1024d3d3345850ead220"],["/sanarchives/2019/06/index.html","35b8adb21317f831c8d27826d7d2879b"],["/sanarchives/2019/index.html","2f1ac80c5bc49f73da87fca458dbf1d7"],["/sanarchives/2019/page/2/index.html","78578f38857ef7dcdc46bdbb503aa85a"],["/sanarchives/2020/01/index.html","ebbd2c44d4cc2d75bee2e5d7e5756588"],["/sanarchives/2020/05/index.html","7b3a0c5ee0801cd165ad572ce5e7e27c"],["/sanarchives/2020/07/index.html","bac4c4bb77384c60ec1f8b42837228ad"],["/sanarchives/2020/09/index.html","561697693c1420575116ebea8043f57c"],["/sanarchives/2020/index.html","69683c88a606c41e2332f147f2e4ee77"],["/sanarchives/2020/page/2/index.html","e860dac15f51396e1392d81485857775"],["/sanarchives/index.html","594672d732430dfd7da207cc99e926c3"],["/sanarchives/page/2/index.html","7eaf503dfa3e2988ac2f102ca5c5c6b6"],["/sanarchives/page/3/index.html","db52a34fa5965662ea581f8831fdfb5c"],["/sanarchives/page/4/index.html","0133a1e27edcd3aa1f71ba32dfe01367"],["/sanarchives/page/5/index.html","50d116bf82de41a7167e4ce2f30e0436"],["/sanarchives/page/6/index.html","be82c9e0f1e07f4e37c1d7ff8ad7912f"],["/sanarchives/page/7/index.html","fd127490b5a59dd1661a5962bae9258a"],["/sanarchives/page/8/index.html","cf33785518c2536e5a6bd52527184f25"],["/sancategories/doc/index.html","d23880d5a588214f5a2a3f06d5c86575"],["/sancategories/practice/index.html","69ef78be67be5e32fcb93b208abce510"],["/sancategories/practice/page/2/index.html","ba32ec27afe590411fe8a0b02140187c"],["/sancategories/practice/page/3/index.html","c0f51a99be8d0bb0c62ab80415a0b48d"],["/sancategories/practice/page/4/index.html","a66d4685462e8a35aad8292840a52cfd"],["/sancategories/tutorial/index.html","c1d2c2f73e636243f49dbe181545a82c"],["/sancategories/tutorial/page/2/index.html","ba95f509492e476659d4bf3789ed857b"],["/sancategories/tutorial/page/3/index.html","1ad43fe17741d4f4e3b36ae4a755e346"],["/sancategories/tutorial/page/4/index.html","8f35fdc3190e26ee78e8cce832315641"],["/sancss/article.css","1466f88ac23ec652897ede3fb6d7aeb6"],["/sancss/bootstrap.min.css","920f984bd041d7ab8cceade3e5805efc"],["/sancss/code.css","dbd2986caea443e5aaae6275e1b7ed14"],["/sancss/codemirror.css","288352df06a67ee35003b0981da414ac"],["/sancss/font-awesome.min.css","bb53ad7bffecc0014d64553e96501dce"],["/sancss/site.css","f62c50f25880e89e16fe7348218eacde"],["/sancss/style.css","d7c9feb685b822297cba8540448e2e04"],["/sandoc/api/index.html","7db1e10f12cca36b87bd3e1cb6fa1cd0"],["/sandoc/main-members/index.html","90d26e7d771f15ec2a48f4ce14f95469"],["/sanen/doc/api/index.html","2187fee1b419e194e7da8392fe586690"],["/sanen/doc/main-members/index.html","f5d8a64af23e64698ce1dcd1a1dae4ea"],["/sanen/example/index.html","2acf667ebd10fcbfbb6cb8174fb7beb8"],["/sanen/index.html","46a4feb667a4ac47b8d16446eaa91137"],["/sanen/practice/array-deep-updates-trigger-view/index.html","26a391480de17e8911bd1853e38d242b"],["/sanen/practice/auto-camel/index.html","ff67aa2e1908e4f369b589cfc056ed98"],["/sanen/practice/can-we-use-dom/index.html","e9e7c57d7e01882694671ea7048d5486"],["/sanen/practice/child-to-grandparent/index.html","76721c7b46fce30b508b622ea15063de"],["/sanen/practice/child-to-parent/index.html","45c4053bf47928bf43aad7b61c953ce8"],["/sanen/practice/data-invalid/index.html","b73af045791e3d3aaeb332216e78823d"],["/sanen/practice/data-valid/index.html","50895fbc6624e16d300b38db7d8c0f59"],["/sanen/practice/dynamic-parent-child/index.html","c4cab9d0581be30c3cf9c58d7bcafdb2"],["/sanen/practice/how-to-show-or-hide-an-element/index.html","459006805d2e85fc4f8cb0dc152e30f5"],["/sanen/practice/index.html","7887220e641d28cd1e4cfcf6be7c6f22"],["/sanen/practice/parent-to-child/index.html","7f46b395be3c05cf3cbed7863b813697"],["/sanen/practice/position-absolute-dom/index.html","a54de4481006049e41cae163d606c546"],["/sanen/practice/question-and-answer/index.html","58cf5c239fd8f6f67600ad9a69c4d27f"],["/sanen/practice/san-router-spa/index.html","a58ab7d48d760906e775017beb6e46e5"],["/sanen/practice/san-store-spa/index.html","42a991ccdd52e865591e6adc74e71ff6"],["/sanen/practice/traverse-object/index.html","fa10c9cd265b82c80dbf34ddd69a2c7e"],["/sanen/tutorial/background/index.html","a538472d550b3126fcc31db97a107f4f"],["/sanen/tutorial/component/index.html","72ad587bcbcb88fefd06a7fdb4172ca0"],["/sanen/tutorial/data-checking/index.html","a7bf974b97e951d70103513bb8974834"],["/sanen/tutorial/data-method/index.html","5c31ff3fc961f3774b7cf7514bd1da9d"],["/sanen/tutorial/event/index.html","0ab3b30ab5ae88346487ef53be74243f"],["/sanen/tutorial/for/index.html","5e14ee4a6d6a0523d674a55c273b3dc3"],["/sanen/tutorial/form/index.html","0954df60386c85686fd48e0fd13149cb"],["/sanen/tutorial/if/index.html","8e87eb934c92cc9fb80798b01398b9f3"],["/sanen/tutorial/reverse-flag/index.html","86b8345e888cb721439c8f1904fd59f4"],["/sanen/tutorial/reverse/index.html","d88699a8dc657c039ccee69c4e109e4a"],["/sanen/tutorial/setup/index.html","97ad6c3db5c8568f9aafea7768909d66"],["/sanen/tutorial/slot/index.html","0fc5f6b987e3ee5a32a5488b85bce32e"],["/sanen/tutorial/ssr-before-3.8/index.html","d1da0ef29fbd3eb4630268c82d0b07d6"],["/sanen/tutorial/ssr/index.html","1b166fcab01215d6d61e459f55a5115f"],["/sanen/tutorial/start/index.html","6601ec5743e7fb96a97f6b1119fda650"],["/sanen/tutorial/style/index.html","b87d2b457434bb2fd88ace931d7de413"],["/sanen/tutorial/template/index.html","a2746dd18ee087a2c9289edb874a141f"],["/sanen/tutorial/transition/index.html","eaef5f5300f42d892a553081ca32fc6e"],["/sanexample/index.html","2d62ecf4b0f77c45319f7e7e8b4af2b0"],["/sanfonts/fontawesome-webfont.eot","25a32416abee198dd821b0b17a198a8f"],["/sanfonts/fontawesome-webfont.svg","d7c639084f684d66a1bc66855d193ed8"],["/sanfonts/fontawesome-webfont.ttf","1dc35d25e61d819a9c357074014867ab"],["/sanfonts/fontawesome-webfont.woff","c8ddf1e5e5bf3682bc7bebf30f394148"],["/sanimg/1.svg","d77034c37b417ef76096294de4c111bb"],["/sanimg/2.svg","fbf700664340cb41d83923a47b6e5160"],["/sanimg/3.svg","8989fb841451b7664ee31e1eda9b352b"],["/sanimg/4.svg","c7877b3cdf76c4e42dc841b1475145cc"],["/sanimg/5.svg","15c4e12ae689624dd1fb60b41a6d1ab1"],["/sanimg/6.svg","6fa71561eebdb75f7130e6d27c0d4402"],["/sanimg/7.svg","2f9f621f0455799eee836216db3cd585"],["/sanimg/8.svg","4730d9e16181617f8a75217e0a2ac23e"],["/sanimg/9.svg","28caa5650d8cbc6013f0ce9f8e6c6458"],["/sanimg/Search.svg","085ea4ef80349f1f33dc700b59932d20"],["/sanimg/Shape.svg","63ce11af494c6a2b84a5408a67814ba6"],["/sanimg/b_api.svg","e46ba603c241202ed66faef1bcb089b4"],["/sanimg/b_compass.svg","c8e132fa14a6c3328be175332c9a645b"],["/sanimg/b_design.svg","9c210ba39ad228a5c8cffa3db043b04b"],["/sanimg/b_mater.svg","9f8ad7d278d795f199bdf96c71243095"],["/sanimg/b_router.svg","8558806bc930f0ccc5d30050fe05fe07"],["/sanimg/b_store.svg","6ee10d6029b0e2a0fc6344e493efc248"],["/sanimg/b_trail.svg","6c3f8673381087390064c8d5394816ba"],["/sanimg/b_update.svg","3f30b8e8a5d022e2bb2dbeb0f72a0dee"],["/sanimg/banner-md.png","1bcfe22f30df09874804ebbad7eb0330"],["/sanimg/banner-santd.png","e237ae4ffeadae5f9aac8842f5383bef"],["/sanimg/github.svg","ab014a9cc0591bda97b2225753dc6c16"],["/sanimg/github2.svg","8f9a62a9b2f440411f490122cfc00090"],["/sanimg/icons/icon-128x128.png","360e8b077017ca3f8faffb1d2dc964c5"],["/sanimg/icons/icon-144x144.png","2cac5e49e8deb470ef8d695fed8a0784"],["/sanimg/icons/icon-152x152.png","ff8a6e62206508f799e4e33dfc23a6d1"],["/sanimg/icons/icon-192x192.png","b82502d56ce18f3c4a5cbb34aab37312"],["/sanimg/icons/icon-384x384.png","52fa46d5e222a4ec290f9ba93377f606"],["/sanimg/icons/icon-512x512.png","89dc6cdd8d62328a43c8f7be5bde8841"],["/sanimg/icons/icon-72x72.png","8f98a06550f027282907ac005cafb3f0"],["/sanimg/icons/icon-96x96.png","49b0e139682345a8f578f0546a56bfba"],["/sanimg/life-cycle.png","a42f7cf9b1dd363efe19ddf6cbcc11c2"],["/sanimg/logo-colorful.svg","25149c80cd625edfedcc6115dda17775"],["/sanimg/logo.svg","1bdf6b3d2b668fe5062e473e2b1860ff"],["/sanimg/logo2.png","50f59e2d6f907dbdf5720270ac745812"],["/sanimg/lowpoly.jpg","cfee0ad50ba60a1525c5b2dc3c020ac7"],["/sanimg/macbook.png","8d96db30d032572134832662ca85fc0b"],["/sanimg/pen.svg","86c390dc94bb381ac836b3635f25f47a"],["/sanimg/san-perf.png","a80f3a58d1c6a7c44b33ed90d56ff89c"],["/sanimg/search02.svg","7d27bda890fcbd9decd5d246a01c3a42"],["/sanindex.html","70f66045bee81a926053aa1bee899d46"],["/sanjs/bodymovin.min.js","40163e612f8d80acaac737f25b3641a2"],["/sanjs/codemirror.js","11af3980de7da80eacd742ecd9c37cf7"],["/sanjs/jquery-1.10.2.js","e3f24f23b859cf718282e3806ed5ce38"],["/sanjs/layout_control.js","84758cffe8e45f3a6723064605f2e5c3"],["/sanjs/script.js","536985cb34cdea52711130cb34549ace"],["/sanjs/stickUp.min.js","2a407130f9ed2b66cdd21407c203c149"],["/sanpage/2/index.html","00f3e503aba3428d2306ef3202a7cac3"],["/sanpage/3/index.html","51faf4d44080e651cf633e23a49f7509"],["/sanpage/4/index.html","2e827c684ebd3f14c94488815f5d6de0"],["/sanpage/5/index.html","f2e8f7b2f1d54bf4c6d60ea06e86dcaf"],["/sanpage/6/index.html","09996f996d6dab487827c038fc12281d"],["/sanpage/7/index.html","5ec6ec17f4311721fa9fa22ca4b17585"],["/sanpage/8/index.html","2c1181270203a5926a37457592bc4921"],["/sanpractice/array-deep-updates-trigger-view/index.html","6e0685e9ede9abefb60bf149338e1067"],["/sanpractice/auto-camel/index.html","09febeb2809d9fdc1f1e7c89d90bcc2c"],["/sanpractice/can-we-use-dom/index.html","4541db4b443a84b0e89acbd42dc892b1"],["/sanpractice/child-to-grandparent/index.html","f9805ee3ebe23a15e066c5551eea3bee"],["/sanpractice/child-to-parent/index.html","b2c89b0f10927585600506e385a2f454"],["/sanpractice/data-invalid/index.html","8ca7f9529fbd55e5adcf1570b7c2f1ff"],["/sanpractice/data-valid/index.html","219ac324f474d6cb296e034a5eb7085a"],["/sanpractice/dynamic-parent-child/index.html","556bbda4ce60d66862cf3f1d5feccbd3"],["/sanpractice/how-to-show-or-hide-an-element/index.html","7cdfa30e7d3597253cf736c08bdb438a"],["/sanpractice/ie-compatibility/index.html","a54f9626ce85f54fa2c1f47d7924cb13"],["/sanpractice/index.html","a771a25c693d423ec53df56a01026a59"],["/sanpractice/parent-to-child/index.html","a754c026e089fb28e7f522a30f97542f"],["/sanpractice/position-absolute-dom/index.html","49e1ea0fdf29aa7c98d099701b36e466"],["/sanpractice/question-and-answer/index.html","2922faf958695b975122c6a54e4e5b2a"],["/sanpractice/san-router-spa/index.html","0c71c7e97730290f6a8a1071e8cbdbaf"],["/sanpractice/san-store-spa/index.html","c47c264717848f2f93b5b04c407f08c9"],["/sanpractice/traverse-object/index.html","5be808e3cbd7ea5d7ed618ae95dac886"],["/santutorial/background/index.html","2a67d0fb100ea4f392f954e5a05d7ce3"],["/santutorial/component/index.html","c88a78e5260ddf32f173da346f63a205"],["/santutorial/data-checking/index.html","5444a8b00829693b121844b84475f4b5"],["/santutorial/data-method/index.html","9eeaad838a81d63f59f13462b6f250f2"],["/santutorial/event/index.html","fb87d4321de11e4f6796a79c07640082"],["/santutorial/for/index.html","1a86abb6a967e3ed0700f53039e4b6b0"],["/santutorial/form/index.html","1ae951354fda4e044b45311f0e67610e"],["/santutorial/if/index.html","6bff9b36d8f65f95abbab42e25e27c58"],["/santutorial/reverse-flag/index.html","6cafd219cc8fa4793e2ff3514180a732"],["/santutorial/reverse/index.html","2b551ded948e5cefbd9d375f98cef3c5"],["/santutorial/setup/index.html","80f69e98b90693c7dedda6f9e9cc955a"],["/santutorial/slot/index.html","6691f307bdf961d8dbe0ea9a225b765f"],["/santutorial/ssr-before-3.8/index.html","05e818b6c0ee0fc28d912d58a78f6c8f"],["/santutorial/ssr/index.html","126050359cab89078e767273cf9f2969"],["/santutorial/start/index.html","50b5d32b67915bef4cadb06b3a6dfd3a"],["/santutorial/style/index.html","cfd70d5d4e69cd83f21f6e2220705ac2"],["/santutorial/template/index.html","d0f3331ec65eff88f65486d638de1c5f"],["/santutorial/transition/index.html","ef2edbe27662b3e32598a6b55edffb8d"]];
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







