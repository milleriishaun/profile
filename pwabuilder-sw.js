//This is the service worker with the Cache-first network

var CACHE = 'pwabuilder-precache';
var precacheFiles = [
  // "/",
  // "/index.html",
  // "/index.html?homescreen=1",
  // "/?homescreen=1",

  "vendor/bootstrap/css/bootstrap.min.css",
  "vendor/font-awesome/css/font-awesome.min.css",
  "vendor/magnific-popup/magnific-popup.css",
  "css/freelancer.min.css",

  "Images/2e6dc914-2f0a-62cb-aed2-04b951892d14.webPlatform.png",
  "Images/3a295167-1a97-446e-d0e9-fb770a2c96f2.webPlatform.png",
  "Images/3c283f0c-c1ad-6519-0606-feb469a25855.webPlatform.png",
  "Images/8d085745-1dd0-0b23-8694-4a2f9d6d9536.webPlatform.png",
  "Images/9aeb90fa-c620-6833-50bf-5b3c51989a25.webPlatform.png",
  "Images/581abbac-adec-559f-8558-d9b913810477.webPlatform.png",
  "Images/939df4c4-1bad-3065-28e0-f1b8af7621cf.webPlatform.png",
  "Images/4388dab3-2e5e-e5bb-0969-3afe1ef9e5cb.webPlatform.png",
  "Images/b576374c-f3ef-1eb6-23a7-e83de53f4369.webPlatform.png",
  "Images/c7e9a9c1-ef35-7887-3283-2f080d0c0c31.webPlatform.png",
  "Images/e5fe5ba1-2e9f-25da-5a63-9645694c9bfc.webPlatform.png",

  "img/favicon_32x32_gradient_round_07P_icon.ico",
  "img/favicon_96x96_gradient_round_KiK_icon.ico",
  "img/profile.png",
  "img/portfolio/cabin.png",
  "img/portfolio/cake.png",
  "img/portfolio/circus.png",
  "img/portfolio/game.png",
  "img/portfolio/safe.png",
  "img/portfolio/submarine.png",
  "img/portfolio/tissue_box_icon.png",
  "img/portfolio/inspirationalquotegenerator1.png",
  "img/portfolio/inspirationalquotegenerator2.png",
  "img/mobile_icons/android-icon-36x36_gradient_round.png",
  "img/mobile_icons/android-icon-36x36.png",
  "img/mobile_icons/android-icon-48x48.png",
  "img/mobile_icons/android-icon-72x72.png",
  "img/mobile_icons/android-icon-96x96.png",
  "img/mobile_icons/android-icon-144x144.png",
  "img/mobile_icons/android-icon-192x192.png",
  "img/mobile_icons/apple-icon-57x57_gradient_round.png",
  "img/mobile_icons/apple-icon-57x57.png",
  "img/mobile_icons/apple-icon-60x60.png",
  "img/mobile_icons/apple-icon-72x72.png",
  "img/mobile_icons/apple-icon-76x76.png",
  "img/mobile_icons/apple-icon-114x114.png",
  "img/mobile_icons/apple-icon-120x120.png",
  "img/mobile_icons/apple-icon-144x144.png",
  "img/mobile_icons/apple-icon-152x152.png",
  "img/mobile_icons/apple-icon-180x180.png",
  "img/mobile_icons/apple-icon-precomposed.png",
  "img/mobile_icons/apple-icon.png",
  "img/mobile_icons/favicon-16x16.png",
  "img/mobile_icons/favicon-32x32.png",
  "img/mobile_icons/favicon-96x96_gradient_round.png",
  "img/mobile_icons/favicon-96x96.png",
  "img/mobile_icons/favicon.ico",
  "img/mobile_icons/ms-icon-70x70.png",
  "img/mobile_icons/ms-icon-144x144_gradient_round.png",
  "img/mobile_icons/ms-icon-144x144.png",
  "img/mobile_icons/ms-icon-150x150.png",
  "img/mobile_icons/ms-icon-310x310.png",
  "img/mobile_icons/ms-icon-512x512_gradient_round.png",
  "img/favicon_32x32_gradient_round_07P_icon.ico",
  "img/favicon_32x32_gradient_round_07P_icon.ico",

  /* Add an array of files to precache for your app */
];

let deferredPrompt;

//notify user they can update
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Update UI notify the user they can add to home screen
  btnAdd.style.display = 'block';
});

//Check if the button on the phone is pressed
btnAdd.addEventListener('click', (e) => {
  // hide our user interface that shows our A2HS button
  btnAdd.style.display = 'none';
  // Show the prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
});


//determine if the app was successfully installed
window.addEventListener('appinstalled', (evt) => {
  app.logEvent('a2hs', 'installed');
});

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