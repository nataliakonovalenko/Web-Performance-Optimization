---
sidebar_position: 8
title: 8. Loading Performance
---

# Loading Perfromance

## CDN

#### Client-Server Communication

Bandwidth is a measure of how much data can be transferred from one point in a network to another within a specific amount of time. While the data travels from San Francisco to London, it moves with a different speed across different parts of the road, like on the image below:

![](/img/sw-caching/bandwith.png)

We cannot fix the bandwith, but we can make a user from London connect to the server located in London. What we need to do is to copy the files located in San Francisco's server to the London's server. And repeat the process for all the locations where our users live.

There is a service that does it for us automatially - CDN - copies and caches your static resources across their servers around the globe.

If you have users all over the world you ALWAYS will benefit from using CDN. 

#### What is CloudFront

Any CDN provider with the data centers in your target users locations will work. But for our example I'll use AWS CloudFront because AWS provides all kinds of  services that your project can leverage. And it's nice to keep all tools in the same place.

Some theory on CloudFront:

Imagine you're building an Instagram app. That's a lot of images and you have to store them somewhere. Storing them on the private in-house server is not a good idea, because it can break or get out of memory. You'll likely be using a cloud solution. AWS provides S3 for this case. To upload data like video, documents, images etc. we first have to create a bucket in S3 in any of the AWS region (us-east-2, us-west-1, eu-central-1 etc.). Every object stored in Amazon S3 resides in a bucket. We can group different objects using buckets same way like we use the directory for grouping files.

To cache the content of a bucket across all AWS data centers around the globe use Cloud Front. It just reads whatever we have inside the bucket and saves it to the CloudFront servers.

#### How to setup CloudFront

We'll be setting CDN for a React app created by create-react-app.

1) What CloudFront does is it gets static assets from somewhere (usually either s3 buckets or our server that returns our app files) and caches them on the servers around the world.
2) First of all we need to setup either s3 bucket or our server to return the built assets
3) Create an account or sign in to the AWS Console: https://aws.amazon.com/
4) Navigate to the S3 service and click Create Bucket. Make up a clever name for your new bucket, a choose your configuration settings.
5) In the Set Permissions step, deselect the options to block public access — you want users to access the website assets that will live here — then create the bucket.
6) Click on the newly-created bucket. Within the Properties, open the Static Website Hosting tab, and select Use this bucket to host a website. Fill in index.html for both the Index and Error Documents. By setting index.html as the Error Document, we can allow something like react-router to handle routes outside of the root.
![](/img/sw-caching/s3setup.png)
7) Open the Permissions tab, then select Bucket Policy. You may choose to do something more nuanced here, but a good starting point is to provide read-only permissions for anonymous users — a policy provided in the AWS examples. Make sure its your bucket name under the "Resource" key.
![](/img/sw-caching/s3setup1.png)
8) Add the contents of your build directory to this bucket. This can be done by clicking on the bucket and clicking Upload. That’s it! You can find the URL to your application back under the Static Website Hosting tab, labeled Endpoint
9) At this point our website is accessible through the internet. Hovewer, no matter where the user is from, they'll request it from the CND location (usually it's East 1). Let's add Cloud Front to cache the assets on all AWS data centers.
10) Select theCloudFront service in the AWS console, click Create Distribution, then under the web delivery method, click Get Started.
11) Select your Origin Settings. The Origin Domain Name choices pre-populate with S3 buckets. Selecting yours will also populate the Origin ID.
![](/img/sw-caching/createDistribution.png)
12) Within the Distribution Settings, set the Default Root Object to index.html.
13) You may choose to further configure the distribution, but that’s enough to get the job done. Select Create Distribution
14) Click the ID of your newly created distribution to reach its settings page, then click on the Error Pages tab. Select Create Custom Error Response.
15) Select Yes for a custom error response, set/index.html for the response page path and 200: OK for the response code. This custom error page in the CloudFront distribution is analogous to the Error Document on the S3 bucket (and will work on IE, too). When done, click Create.
![](/img/sw-caching/customError.png)
16) That’s it! Give the deployment a handful of minutes, then check out your web app. You can find the URL on the distribution listings page, under the Domain Name column.

## HTTP2

HTTP is a protocol (a set of rules) that defines how client and server must communicate with each other. Client (e.g browser) sends a request to a server based on a specific format. Server (e.g. express) knows how to parse this format and returns the response. Except for the request/response format, HTTP defines how client and server setup communication. A client must perform a 'handshake' with a server before starting conversation. This process requires several networking trips, therefore it's not immediate and takes some time. When they're done with the handshake, the connection is setup and we can send a request though it.

In HTTP 1.1 we're allowed to make a single request at a time through a single connection. The request in progress should return a response before we're able to send the next request. Browsers allow up to 6 concurrent connections to the same origin at a time. If we have to make 7 requests at a time (it's common during the page load), one of them should wait.

HTTP/2 drastically reduces the overhead of multiple requests by using multiplexing. It's now possible to send and receive multiple files at the same time over a single connection. This connection can also be left open for re-use over very extended periods of time. It means that we can send requests and receive response through the same connection, even if they are out of order. 

HTTP2 must be enabled on the server. For example, in express you can use http2 node module:

```javascript
const http2 = require('http2');
const express = require('express');

const app = express();

// app.use('/', ..);

http2
    .raw
    .createServer(app)
    .listen(8000, (err) => {
        if (err) {
            throw new Error(err);
        }

        /* eslint-disable no-console */
        console.log('Listening on port: ' + argv.port + '.');
        /* eslint-enable no-console */
    });
```

# Service Workers & HTTP caching

### What are Caches ?

![](/img/sw-caching/caches.png)

At a high-level, there are two popular types of caching:

* `In-app caching`
* `http-caching`

**In-app caching** can be delivered using **Service Workers** with proper strategies for any cases.

**Http caching** can be delivered using `Browser Cache`, `CDN`, Proxy Cache, `Gateway Cache`, `Load balancers Cache`,
`Reverse proxy Cache`.

## Service Workers

![](/img/sw-caching/pwa.png)

**Service Worker** is a web worker that implements a programmable network proxy that can respond to web/HTTP `GET`
requests of the main document.

Basically, service worker is a JavaScript file that gets registered with the browser and stays with the browser even
when you have no internet connection.

Service worker is a big requirement of `PWA` (Progressive Web Applications), which make it seems more like a native
application.

![](/img/sw-caching/normal-vs-sw-diagram.png)

### More about SWs

1. Works in new thread and in own global context
2. Can be executed without a page.
3. Requires HTTPS for security reasons.
4. Localhost is considered a secure origin.
5. Uses Promises for async operations.
6. Run in the background and don’t have access to DOM.
7. Communication with document via the postMessage interface.
8. A programmable network proxy, allows to control how network request are handled.
9. Is terminated when not in use.
10. Have access to the IndexedDB API.
11. The page can only be controlled by one service worker at a time.

### SWs Lifecycle

![](/img/sw-caching/sw-lifecycle.png)

* `Register`: Registration of SW is done on page’s script. This will cause the browser to start it’s installation 
  process on the background.
* `Install`: On this stage, you can setups worker-specific resources (offline caches). Waiting for clients using other 
  SWs to be closed.
* `Activate`: On this stage, SW finishes the setup. You can clean other worker’s caches on this stage.
* `Handle functional events`: The SW is ready to handle functional events.
* `Redundant`: The SW is being replace by another one.

### Events types

Service worker has two event groups: `lifecycle` and `functional` events. 

**Lifecycle events** are triggered on installation and activation processes of SW. There is also message events, where
the SW receives information from other scrips.

A `fetch` event fires every time any resource controlled by a service worker is fetched, which includes the documents
inside the specified scope, and any resources referenced in those documents.

The `push` event represents a push message that has been received via `Push API`. It contains the information sent from
an application server to a `PushSubscription`.

![](/img/sw-caching/sw-events.png)

### SWs registration

* Any `PWA` enhancement should make our application better and not crash it, so there is a good practice to put safe if
  statement, before using `PWA API’s`.
* The registration of SW should start after load event, so it won’t affect `FCP` (First Contentful Paint). If you use
  any frameworks, then postpone `SW` registration until inner preparations are ready.
* After registration don’t forget to throw an err in catch close. This is done to prevent creation of new `SW` without
  any functionality inside.

```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('../sw_cached_pages.js')
      .then(reg => console.log('SW:Registered'))
      .catch(err => {
        console.log(`Service Worker: Error: ${err}`);
        throw err;
      });
  });
}
```

The registration of SW should start after load event, so it won’t affect `FCP` (First Contentful Paint). If you use any
frameworks, then postpone `SW` registration until inner preparations are ready.

### App Shell

An **app shell** is the minimal `HTML`, `CSS` and `JavaScript` required to power the user interface and when cached
offline can ensure instant, reliably good performance to users on repeat visits. This means the application shell is not
loaded from the network every time user visits, only the necessary content is loaded.

![](/img/sw-caching/app-shell.png)

### When to store resources

There are several moments when you can store your resources:

* On install - as dependency
* On network response

### SWs Caching Strategies

There are multiple caching strategies that can be used with Service Workers:

* Stale-While-Revalidate
* Cache falling back to network
* Network falling back to cache
* Cache Only
* Network Only
* Cache and network race
* Cache then network


#### On install - as dependency

![](/img/sw-caching/picture1.png)

[Service Worker](https://web.dev/service-workers-cache-storage/) gives you an `install` event. You can use this to get
stuff ready, stuff that must be ready before you handle other events. While this happens any previous version of your
Service Worker is still running and serving pages, so the things you do here mustn't disrupt that.

**Ideal for**: `CSS`, `images`, `fonts`, `JS`, `templates`, ... Basically anything you'd consider static to that
**"version"** of your site.

These are things that would make your site entirely non-functional if they failed to be fetched, things an equivalent
platform-specific app would make part of the initial download.

```javascript
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('mysite-static-v3').then(
      function (cache) {
        return cache.addAll([
          '/css/whatever-v3.css',
          '/css/imgs/sprites-v6.png',
          '/css/fonts/whatever-v8.woff',
          '/js/all-min-v4.js',
        ]);
      }
    ),
  );
});
```

`event.waitUntil` takes a promise to define the length and success of the install. If the promise rejects, the
installation is considered a failure and this Service Worker will be abandoned (if an older version is running, it'll be
left intact). `caches.open()` and `cache.addAll()` return **promises**. If any of the resources fail to be fetched, the
`cache.addAll()` call rejects.

#### On install - not as dependency

![](/img/sw-caching/on-install-not-as-dep.png)

**Ideal for**: bigger resources that aren't needed straight away, such as assets for later levels of a game.

```javascript
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('mygame-core-v1').then(function (cache) {
      cache
        .addAll
        // levels 11–20
        ();
      return cache
        .addAll
        // core assets and levels 1–10
        ();
    }),
  );
});
```

The above example does not pass the `cache.addAll` promise for levels **11–20** back to `event.waitUntil`, so even if it
fails, the game will still be available offline. Of course, you'll have to cater for the possible absence of those
levels and reattempt caching them if they're missing.

The **Service Worker** may be killed while levels 11–20 download since it's finished handling events, meaning they won't
be cached. In future the [Web Periodic Background Synchronization API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Periodic_Background_Synchronization_API)
will handle cases like this, and larger downloads such as movies. That API is currently only supported on **Chromium**
forks.

#### On activate

![](/img/sw-caching/on-activate.png)

**Ideal for**: `clean-up`and `migration`.

Once a new Service Worker has installed and a previous version isn't being used, the new one activates, and you get an
`activate` event. Because the old version is out of the way, it's a good time to handle [schema migrations in IndexedDB](https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/indexeddb-best-practices)
and also delete unused caches.

```javascript
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (cacheName) {
            // Return true if you want to remove this cache,
            // but remember that caches are shared across
            // the whole origin
          })
          .map(function (cacheName) {
            return caches.delete(cacheName);
          }),
      );
    }),
  );
});
```

During activation, other events such as `fetch` are put into a queue, so a long activation could potentially block page
loads. Keep your activation as lean as possible, and only use it for things you couldn't do while the old version was
active.

#### On user interaction

![](/img/sw-caching/on-user-interaction.png)

**Ideal for**: when the whole site can't be taken offline, and you chose to allow the user to select the content they
want available offline. E.g. a video on something like **YouTube**, an article on **Wikipedia**, a particular gallery on
**Flickr**.

Give the user a `Read later` or `Save for offline` button. When it's clicked, fetch what you need from the network and
pop it in the cache.

```javascript
document.querySelector('.cache-article').addEventListener('click', function (event) {
  event.preventDefault();

  var id = this.dataset.articleId;
  caches.open('mysite-article-' + id).then(function (cache) {
    fetch('/get-article-urls?id=' + id)
      .then(function (response) {
        // /get-article-urls returns a JSON-encoded array of
        // resource URLs that a given article depends on
        return response.json();
      })
      .then(function (urls) {
        cache.addAll(urls);
      });
  });
});
```

The [caches API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) is available from pages as well as service
workers, meaning you don't need to involve the service worker to add things to the cache.

#### On network response

![](/img/sw-caching/on-network-response.png)

**Ideal for**: frequently updating resources such as a user's inbox, or article contents. Also useful for non-essential
content such as avatars, but care is needed.

If a request doesn't match anything in the cache, get it from the network, send it to the page, and add it to the cache
at the same time.

If you do this for a range of URLs, such as avatars, you'll need to be careful you don't bloat the storage of your
origin. If the user needs to reclaim disk space you don't want to be the prime candidate. Make sure you get rid of items
in the cache you don't need any more.

```javascript
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.open('mysite-dynamic').then(function (cache) {
            return cache.match(event.request).then(function (response) {
                return (
                    response ||
                    fetch(event.request).then(function (response) {
                        cache.put(event.request, response.clone());
                        return response;
                    })
                );
            });
        }),
    );
});
```

To allow for efficient memory usage, you can only read a response/request's body once. The code above uses
[.clone()](https://fetch.spec.whatwg.org/#dom-request-clone) to create additional copies that can be read separately.

#### Stale-While-Revalidate

![](/img/sw-caching/stale-while-revalidate.png)

**Ideal for**: frequently updating resources where having the very latest version is non-essential. Avatars can fall
into this category.

If there's a cached version available, use it, but fetch an update for next time.

```javascript
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        var fetchPromise = fetch(event.request).then(function(networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    }),
  );
});
```

![](/img/sw-caching/picture3.png)

#### On push message

![](/img/sw-caching/on-push-message.png)

The Push API is another feature built on top of Service Worker. This allows the Service Worker to be awoken in response
to a message from the OS's messaging service. This happens even when the user doesn't have a tab open to your site. Only
the Service Worker is woken up. You request permission to do this from a page and the user will be prompted.

**Ideal for**: content relating to a notification, such as a chat message, a breaking news story, or an email. Also
infrequently changing content that benefits from immediate sync, such as a todo list update or a calendar alteration.

The common final outcome is a notification which, when tapped, opens/focuses a relevant page, but for which updating
caches before this happens is extremely important. The user is obviously online at the time of receiving the push
message, but they may not be when they finally interact with the notification, so making this content available offline
is important.

This code updates caches before showing a notification:

```javascript
self.addEventListener('push', function (event) {
  if (event.data.text() == 'new-email') {
    event.waitUntil(
      caches
        .open('mysite-dynamic')
        .then(function (cache) {
          return fetch('/inbox.json').then(function (response) {
            cache.put('/inbox.json', response.clone());
            return response.json();
          });
        })
        .then(function (emails) {
          registration.showNotification('New email', {
            body: 'From ' + emails[0].from.name,
            tag: 'new-email',
          });
        }),
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  if (event.notification.tag == 'new-email') {
    // Assume that all of the resources needed to render
    // /inbox/ have previously been cached, e.g. as part
    // of the install handler.
    new WindowClient('/inbox/');
  }
});
```

#### On background-sync

![](/img/sw-caching/on-background-sync.png)

`Background sync` is another feature built on top of Service Worker. It allows you to request background data
synchronization as a one-off, or on an (extremely heuristic) interval. This happens even when the user doesn't have a
tab open to your site. Only the Service Worker is woken up. You request permission to do this from a page and the user
will be prompted.

**Ideal for**: non-urgent updates, especially those that happen so regularly that a push message per update would be too
frequent for users, such as social timelines or news articles.

```javascript
self.addEventListener('sync', function (event) {
  if (event.id == 'update-leaderboard') {
    event.waitUntil(
      caches.open('mygame-dynamic').then(function (cache) {
        return cache.add('/leaderboard.json');
      }),
    );
  }
});
```

### Cache persistence

Your origin is given a certain amount of free space to do what it wants with. That free space is shared between all
origin storage: [(local) Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage),
[IndexedDB](https://developer.mozilla.org/en-US/docs/Glossary/IndexedDB),
[File System Access](https://web.dev/file-system-access/), and of course
[Caches](https://developer.mozilla.org/en-US/docs/Web/API/Cache).

The amount you get isn't spec'd. It will differ depending on device and storage conditions. You can find out how much
you've got via:

```javascript
navigator.storageQuota.queryInfo('temporary').then(function (info) {
  console.log(info.quota);
  // Result: <quota in bytes>
  console.log(info.usage);
  // Result: <used data in bytes>
});
```

However, like all browser storage, the browser is free to throw away your data if the device comes under storage
pressure. Unfortunately the browser can't tell the difference between those movies you want to keep at all costs, and
the game you don't really care about.

To work around this, use the [StorageManager](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager)
interface:

```javascript
// From a page:
navigator.storage.persist()
.then(function(persisted) {
  if (persisted) {
    // Hurrah, your data is here to stay!
  } else {
   // So sad, your data may get chucked. Sorry.
}});
```

Of course, the user has to grant permission. For this, use the `Permissions API`.

Making the user part of this flow is important, as we can now expect them to be in control of deletion. If their device
comes under storage pressure, and clearing non-essential data doesn't solve it, the user gets to judge which items to
keep and remove.

For this to work, it requires operating systems to treat `durable` origins as equivalent to platform-specific apps in
their breakdowns of storage usage, rather than reporting the browser as a single item.

### Serving Suggestions — responding to requests

It doesn't matter how much caching you do, the service worker won't use the cache unless you tell it when and how. Here
are a few patterns for handling requests:

#### Cache only

![](/img/sw-caching/cache-only.png)

**Ideal for**: anything you'd consider static to a particular "version" of your site. You should have cached these in
the install event, so you can depend on them being there.

```javascript
self.addEventListener('fetch', function (event) {
  // If a match isn't found in the cache, the response
  // will look like a connection error
  event.respondWith(caches.match(event.request));
});
```

...although you don't often need to handle this case specifically, `Cache, falling back to network` covers it.

#### Network only

![](/img/sw-caching/network-only.png)

**deal for**: things that have no offline equivalent, such as analytics pings, non-GET requests.

```javascript
self.addEventListener('fetch', function (event) {
  event.respondWith(fetch(event.request));
  // or simply don't call event.respondWith, which
  // will result in default browser behavior
});
```

...although you don't often need to handle this case specifically, `Cache, falling back to network` covers it.

#### Cache, falling back to network

![](/img/sw-caching/cache-falling-back-to-network.png)

**Ideal for**: building `offline-first`. In such cases, this is how you'll handle the majority of requests. Other
patterns will be exceptions based on the incoming request.

```javascript
self.addEventListener('fetch', function (event) {
  event.respondWith(
    // open cache
    cache.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }),
  );
});
```

This gives you the `cache only` behavior for things in the cache and the `network only` behavior for anything
not-cached (which includes all non-GET requests, as they cannot be cached).

#### Network falling back to cache

![](/img/sw-caching/network-falling-back-to-cache.png)

**Ideal for**: a quick-fix for resources that update frequently, outside of the "version" of the site. E.g. articles,
avatars, social media timelines, and game leader boards.

This means you give online users the most up-to-date content, but offline users get an older cached version. If the
network request succeeds you'll most likely want to update the cache entry.

However, this method has flaws. If the user has an intermittent or slow connection they'll have to wait for the network
to fail before they get the perfectly acceptable content already on their device. This can take an extremely long time
and is a frustrating user experience. See the next pattern, `Cache then network`, for a better solution.

```javascript
self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    }),
  );
});
```

#### Cache and network race

![](/img/sw-caching/cache-and-network-race.png)

**Ideal for**: small assets where you're chasing performance on devices with slow disk access.

With some combinations of older hard drives, virus scanners, and faster internet connections, getting resources from the
network can be quicker than going to disk. However, going to the network when the user has the content on their device
can be a waste of data, so bear that in mind.

```javascript
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    promises = promises.map((p) => Promise.resolve(p));
    promises.forEach((p) => p.then(resolve));
    promises.reduce((a, b) => a.catch(() => b)).catch(() => reject(Error('All failed')));
  });
}
self.addEventListener('fetch', function (event) { 
  event.respondWith(promiseAny([caches.match(event.request), fetch(event.request)]));
});
```

#### Cache then network

![](/img/sw-caching/cache-then-network.png)

**Ideal for**: content that updates frequently. E.g. articles, social media timelines, and games. leaderboards.

This requires the page to make two requests, one to the cache, and one to the network. The idea is to show the cached
data first, then update the page when/if the network data arrives.

Sometimes you can just replace the current data when new data arrives (e.g. game leaderboard), but that can be
disruptive with larger pieces of content. Basically, don't "disappear" something the user may be reading or interacting
with.

**Code in the page:**

```javascript
var networkDataReceived = false;

startSpinner();

// fetch fresh data
var networkUpdate = fetch('/data.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    networkDataReceived = true;
    updatePage(data);
  });

// fetch cached data
caches
  .match('/data.json')
  .then(function (response) {
    if (!response) throw Error('No data');
    return response.json();
  })
  .then(function (data) {
    // don't overwrite newer network data
    if (!networkDataReceived) {
      updatePage(data);
    }
  })
  .catch(function () {
    // we didn't get cached data, the network is our last hope:
    return networkUpdate;
  })
  .catch(showErrorMessage)
  .then(stopSpinner);
```

**Code in the Service Worker:**

You should always go to the network and update a cache as you go.

```javascript
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.open('mysite-dynamic').then(function (cache) {
            return fetch(event.request).then(function (response) {
                cache.put(event.request, response.clone());
                return response;
            });
        }),
    );
});
```

## HTTP Caching

**HTTP caching** is a technique that stores a copy of a given resource and serves it back when requested. When a web
cache has a requested resource in its store, it intercepts the request and returns its copy instead of re-downloading
from the originating server.

*What advantages HTTP-caching gives to a browser user?*

* Fast loading of cached resources
* Saving user traffic
* Ability to get cached resource without internet connection

*What advantages HTTP-caching gives to a server?*

* Ease the load of the server that doesn’t need to serve all client itself.

### Cache categories

`Shared cache` is a cache that stores responses for reuse by more than one user.

![](/img/sw-caching/shared-cache.png)

`Private cache` is a cache dedicated to a single user. This cache is used to make visited documents available for
back/forward navigation, saving, viewing-as-source, etc. without requiring an additional trip to the server. It likewise
improves offline browsing of cached content. It can be disabled in browser’s settings.

![](/img/sw-caching/local-cache.png)

### Controlling cache

The `Cache-Control` HTTP/1.1 general-header field is used to specify directives for caching mechanisms in both requests
and responses. Use this header to define your caching policies with the variety of directives it provides.

`No cache`: **Cache-Control: no-store** - The cache should not store anything about the client request or server
response. A request is sent to the server and a full response is downloaded each time.
    
`Cache but revalidate`: **Cache-Control: no-cache** - A cache will send the request to the origin server for validation
before releasing a cached copy.
    
`Private and public caches`: **Cache-Control: public (private)**
    
`Expiration`: **Cache-Control: max-age=31536000.** - is the maximum amount of time in which a resource will be
considered fresh.
    
`Validation`: **Cache-Control: must-revalidate** - he cache must verify the status of the stale resources before using
it and expired ones should not be used
    
### Cache freshness

![](/img/sw-caching/caching-process.png)

**Cache-Control: max-age=31536000.** – example of setting freshness borders for resource caching.
    
Before this expiration time, the resource is `fresh`, after the expiration time, the resource is stale. Note that a
stale resource is not evicted or ignored. When the cache receives a request for a stale resource, it forwards this
request with a `If-None-Match` to check if it is in fact still fresh and if it is, the server should respond with `304`
Not Modified, so cached resource is considered fresh again and max-age param is reseеted.

### Cache validation

![](/img/sw-caching/cache-validation.png)

Validation should be applied to resource when it’s expiration time has been reached and it considered as a stale
resource. There are two types of validators to use: *weak and strong* validators. Basically, it’s some sort of id for a
specific resource.

Revalidation is. Triggered when the user presses the reload button. It is also triggered under normal browsing if the
cached response includes the must-revalidate header. Also, this can be changed in browser settings. The **ETag**
response header is an opaque-to-the-useragent value that can be used as a strong validator and is much harder to
generate and compare than weak validators. A browser can send a request for cached resource with request headers **
If-Match**, **If-None-Match**, which contain the same value from **Etag** response header, so the server could
revalidate resource and if it’s ok than send back 304 (Not Modified) or 200 (OK).

For weak validator you can use value from response header **Last-Modified**. It is considered weak because it only has
1-second resolution. Request with value from header **Last-Modified** should put it into request header **
If-Modified-Since** to validate the cached document.

