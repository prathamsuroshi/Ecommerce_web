
self.addEventListener("install", function (event) { event.waitUntil(preLoad());
});

var filesToCache = [ '/',
'/cart', '/content.html','/contentDetails.js','/footer.html','/header.html','/orderPlaced','/slider', '/index.html',
];

var preLoad = async function () {
    const cache = await caches.open("offline");
    return await cache.addAll(filesToCache);
};

self.addEventListener("fetch", function (event) { event.respondWith(checkResponse(event.request).catch(function () {
return returnFromCache(event.request);
}));
event.waitUntil(addToCache(event.request));
});

var checkResponse = function (request) { return new Promise(function (fulfill, reject) {
fetch(request).then(function (response) { if (response.status !== 404) {
fulfill(response);
} else {
    reject();
    }
    }, reject);
    });
    };
    
    var addToCache = async function (request) {
    const cache = await caches.open("offline");
        const response = await fetch(request);
        return await cache.put(request, response);
    };
    
    var returnFromCache = async function (request) {
    const cache = await caches.open("offline");
        const matching = await cache.match(request);
        if (!matching || matching.status == 404) {
            return cache.match("index.html");
        } else {
            return matching;
        }
    };
    