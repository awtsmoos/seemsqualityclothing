//B"H

var CACHE_NAME = "nesnaeil"
console.log("Start")
self.addEventListener('fetch', function(event) {
  // Check if the fetch request URL matches the pattern of Firebase Storage URLs, and does not include 'indexes'
  const url = new URL(event.request.url);
  const isFirebaseStorageUrl = url.hostname === 'firebasestorage.googleapis.com';
  const isInIndexesFolder = url.pathname.includes(encodeURIComponent('/indexes/'));

  if (isFirebaseStorageUrl && !isInIndexesFolder) {
     // console.log("Found in cache",event.request.url)
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
          //    console.log("Got it in cache",event.request.url)
            return response;
          }
          return fetch(event.request).then(
            function(response) {
         //       console.log("Trying response")
              // Check if we received a valid response
              if(!response || response.status !== 200 ) {
                  console.log("returing",response,event.request.url)
                return response;
              }

               // console.log("not returend")

              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              var responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then(function(cache) {
                //    console.log("Adding to cache",CACHE_NAME,event.request.url);
                  cache.put(event.request, responseToCache);
                });

              return response;
            }
          );
        })
    );
  } else {
     // console.log("NOT in cache",event.request.url)
  }
});

