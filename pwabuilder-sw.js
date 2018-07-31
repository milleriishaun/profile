/*
let CACHE_NAME = 'pwabuilder-precache';
let urlsToCache = [
  "img/mobile_icons/favicon-192x192_gradient_round.png",
  "img/mobile_icons/ms-icon-512x512_gradient_round.png"
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    }).catch(function (err) {
      //open precache failed :(
      console.log('SW precache failed to open: ', err);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request));
});
*/




//This is the service worker with the Cache-first network

var CACHE = 'pwabuilder-precache';
var precacheFiles = [
  "?homescreen=1", // may not need homescreen cached
  "?utm=homescreen", //seems functional, must test download of app using addToHomescreen
  //very important formatting in manifest.json... doesn't work if ./milleriishaun/ or "./?utm=homescreen". Must be no comments.
  //new info: start_url must be "./" for PWA to work
  "vendor/bootstrap/css/bootstrap.min.css",
  "vendor/font-awesome/css/font-awesome.min.css",
  "vendor/magnific-popup/magnific-popup.css",
  "css/freelancer.min.css",

  "img/profile.png",

  "img/portfolio/cabin.png",
  "img/portfolio/cake.png",
  "img/portfolio/circus.png",
  "img/portfolio/game.png",
  "img/portfolio/safe.png",
  "img/portfolio/submarine.png",
  "img/portfolio/inspirationalquotegenerator1.png",
  "img/portfolio/inspirationalquotegenerator2.png",

  "img/mobile_icons/xxhdpi_144x144.png",
  "img/mobile_icons/xxxhdpi_192x192.png",
  "img/mobile_icons/GooglePlayStore_512x512.png",
  "img/mobile_icons/iTunesArtwork_512x512.png",
  "img/mobile_icons/Icon-72@2x_144x144.png",
  "img/mobile_icons/Icon@2x_114x114.png",
  "img/mobile_icons/responsive_r16_192x192.png",
  "img/mobile_icons/responsive_r23_144x144.png",
  "img/mobile_icons/responsive_r36_36x36.png",
  "img/mobile_icons/responsive_r36_36x36_favicon_icon.ico",
  "img/mobile_icons/responsive_r80_512x512.png",
  "img/mobile_icons/responsive_r80_1024x1024.png"

  // Add an array of files to precache for your app
];


//Install stage sets up the cache-array to configure pre-cache content
self.addEventListener('install', function (evt) {
  console.log('[PWA Builder] The service worker is being installed.');
  evt.waitUntil(precache().then(function () {
    console.log('[PWA Builder] Skip waiting on install');
    return self.skipWaiting();
  }));
});

//allow sw to control of current page
self.addEventListener('activate', function (event) {
  console.log('[PWA Builder] Claiming clients for current page');
  return self.clients.claim();
});



self.addEventListener('fetch', function (evt) {
  console.log('[PWA Builder] The service worker is serving the asset.' + evt.request.url);
  evt.respondWith(fromCache(evt.request).catch(fromServer(evt.request)));
  evt.waitUntil(update(evt.request));
});

/*
self.addEventListener('fetch', function (evt) {
  console.log('[PWA Builder] The service worker is serving the asset.' + evt.request.url);
  evt.respondWith(caches.match(evt.request)); //fromCache(evt.request).catch(fromServer(evt.request)));
  //evt.waitUntil(update(evt.request));
});
*/

/*
self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request));
});
*/

function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll(precacheFiles);
  }).catch(function (err) {
    //open precache failed :(
    console.log('SW precache failed to open: ', err);
  });
}

function fromCache(request) {
  //we pull files from the cache first thing so we can show them fast
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    }).catch(function (err) {
      //match fromCache(from cache first to show fast) failed :(
      console.log('SW fromCache failed to match + give Promise.reject(no-match)msg: ', err);
    });
  }).catch(function (err) {
    //open cache fromCache(from cache first to show fast) failed :(
    console.log('SW fromCache failed to open cache: ', err);
  });
}

function update(request) {
  //this is where we call the server to get the newest version of the
  //file to use the next time we show view
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    }).catch(function (err) {
      //update(call to server for newest version of file to use the next time we show to view) failed :(
      console.log('SW update failed to fetch: ', err);
    });
  }).catch(function (err) {
    //open cache update(call to server for newest version of file to use the next time we show to view) failed :(
    console.log('SW fromCache failed to open cache: ', err);
  });
}

function fromServer(request) {
  //this is the fallback if it is not in the cache to go to the server and get it
  return fetch(request).then(function (response) {
    return response
  }).catch(function (err) {
    //open precache failed :(
    console.log('SW fromServer fallback(failed to find in cache) which is going to server and getting it: ', err);
  });
}

