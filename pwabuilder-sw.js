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
  //new info: start_url must be "./" for PWA to work... and it takes a long time for your to get the prompt again after accepting(2 days on mobile)
  "vendor/font-awesome/css/font-awesome.min.css",
  "vendor/bootstrap/css/bootstrap.min.css",
  "vendor/magnific-popup/magnific-popup.css",
  "css/freelancer.min.css",

  "img/mobile_icons/iOS/Icon-64.png",
  "img/mobile_icons/iOS/Icon-16.png",
  "img/mobile_icons/iOS/Icon-20.png",
  "img/mobile_icons/iOS/Icon-29.png",
  "img/mobile_icons/iOS/Icon-32.png",
  "img/mobile_icons/iOS/Icon-40.png",
  "img/mobile_icons/iOS/Icon-48.png",
  "img/mobile_icons/iOS/Icon-50.png",
  "img/mobile_icons/iOS/Icon-55.png",
  "img/mobile_icons/iOS/Icon-57.png",
  "img/mobile_icons/iOS/Icon-58.png",
  "img/mobile_icons/iOS/Icon-60.png",
  "img/mobile_icons/iOS/Icon-64.png",
  "img/mobile_icons/iOS/Icon-72.png",
  "img/mobile_icons/iOS/Icon-76.png",
  "img/mobile_icons/iOS/Icon-80.png",
  "img/mobile_icons/iOS/Icon-87.png",
  "img/mobile_icons/iOS/Icon-88.png",
  "img/mobile_icons/iOS/Icon-100.png",
  "img/mobile_icons/iOS/Icon-114.png",
  "img/mobile_icons/iOS/Icon-120.png",
  "img/mobile_icons/iOS/Icon-128.png",
  "img/mobile_icons/iOS/Icon-144.png",
  "img/mobile_icons/iOS/Icon-152.png",
  "img/mobile_icons/iOS/Icon-167.png",
  "img/mobile_icons/iOS/Icon-172.png",
  "img/mobile_icons/iOS/Icon-180.png",
  "img/mobile_icons/iOS/Icon-196.png",
  "img/mobile_icons/iOS/Icon-256.png",
  "img/mobile_icons/iOS/Icon-512.png",
  "img/mobile_icons/iOS/Icon-1024.png",
  "img/mobile_icons/Android/Icon-36.png",
  "img/mobile_icons/Android/Icon-96.png",
  "img/mobile_icons/Android/Icon-192.png",
  "img/mobile_icons/Watch/Icon-88.png",
  "img/mobile_icons/Windows/responsive_r00_70x70.png",
  "img/mobile_icons/Windows/responsive_r00_150x150.png",
  "img/mobile_icons/Windows/responsive_r00_310x310.png",
  "img/mobile_icons/iOS/Windows/responsive_r00_310x150.png",
  "browserconfig.xml",
  "img/mobile_icons/xxhdpi_144x144.png",
  "img/mobile_icons/favicon-16x16.png",
  "img/mobile_icons/favicon-32x32.png",
  "img/mobile_icons/favicon.ico",
  "img/mobile_icons/safari-pinned-tab.svg",
  "img/mobile_icons/Icon-Small_29x29.png",
  "img/mobile_icons/Icon-Small_40x40.png",
  "img/mobile_icons/Icon-Small_50x50.png",
  "img/mobile_icons/Icon_57x57.png",
  "img/mobile_icons/Icon-Small@2x_58x58.png",
  "img/mobile_icons/Icon-72_72x72.png",
  "img/mobile_icons/Icon-76_76x76.png",
  "img/mobile_icons/Icon-Small-40@2x_80x80.png",
  "img/mobile_icons/Icon-Small-50@2x_100x100.png",
  "img/mobile_icons/Icon@2x_114x114.png",
  "img/mobile_icons/Icon-60@2x_120x120.png",
  "img/mobile_icons/Icon-72@2x_144x144.png",
  "img/mobile_icons/Icon-76@2x_152x152.png",
  "img/mobile_icons/Icon-60@3x_180x180.png",
  "img/mobile_icons/iTunesArtwork_512x512.png",
  "img/mobile_icons/iTunesArtwork@2x_1024x1024.png",
  "img/mobile_icons/Icon-83.5@2x_167x167.png",
  "img/mobile_icons/Icon-Small@3x_87x87.png",
  "img/mobile_icons/Icon-Notification_20x20.png",
  "img/mobile_icons/Icon-Notification@3x_60x60.png",
  "img/mobile_icons/AppIcon24x24@2x_48x48.png",
  "img/mobile_icons/AppIcon27.5x27.5@2x_55x55.png",
  "img/mobile_icons/AppIcon40x40@2x_80x80.png",
  "img/mobile_icons/AppIcon44x44@2x_88x88.png",
  "img/mobile_icons/AppIcon86x86@2x_172x172.png",
  "img/mobile_icons/AppIcon98x98@2x_196x196.png",
  "img/mobile_icons/ldpi_36x36.png",
  "img/mobile_icons/mdpi_48x48.png",
  "img/mobile_icons/hdpi_72x72.png",
  "img/mobile_icons/xhdpi_96x96.png",
  "img/mobile_icons/xxhdpi_144x144.png",
  "img/mobile_icons/xxxhdpi_192x192.png",
  "img/mobile_icons/GooglePlayStore_512x512.png",
  "img/mobile_icons/mstile-150x150.png",

  "img/profile.png",

  "img/portfolio/cabin.png",
  "img/portfolio/cake.png",
  "img/portfolio/circus.png",
  "img/portfolio/game.png",
  "img/portfolio/safe.png",
  "img/portfolio/submarine.png",
  "img/portfolio/inspirationalquotegenerator1.png",
  "img/portfolio/inspirationalquotegenerator2.png",

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