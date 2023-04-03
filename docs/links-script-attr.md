---
sidebar_position: 3
title: 3. Link and Script tag attributes
---

# Link and Script attributes

## The Main Thread

One of the most important points to consider when discussing about performance optimization on the web has to do with
optimization of the performance of the main thread.

A web page in the browser performs all it’s obligations on a single thread in the browser called the main thread, which
is responsible for loading resources and processing user events, which might change what the user sees on the page.

![](/img/links-script-attr/main-thread-model.png)

## Main Thread and Frames

![](/img/links-script-attr/main-thread-and-frames.png)

A Frame is simply a full page render. In principle the human eye can process about **12** frames in one second, and if
an image is displayed in about **12** times in one second, the illusion of motion is created, howbeit discreet, but when
it is increased more than that, the motion illusion tends to become more smooth and less discreet or blurry.

## Rendering target of 60fps

![](/img/links-script-attr/rendering-process.png)

The browser has to meet a target of **60fps** for we know that we need to meet 60fs to achieve the best rendering
performance in accordance to today’s web standards. So all of these steps ranging from the event handling to the
execution of JavaScript and recalculation of styles and then determination of new layout position up until repainting
and composition, has to happen 60 times in one second to be considered high performant, and the main thread is
responsible for running these tasks.

So if the main thread is blocked in anyway, rendering performance is not going to be able to meet up with the **60fps**
standard.

## What tasks could block browser rendering?

Because of the nature of the main thread, if the following actions occur, the main thread will be busy with attending to
them and these might block rendering performance on the web page.

* Making API calls
* Fetching Fonts 
* Fetching Images
* Executing Scripts

So for example if dynamically some resource was requested for, the main thread will be blocked by default until that
request for said resource is met making our 60fps goal even more impossible to attain and even worse, we might end up
with a frozen page if we have a multitude of such requests simultaneously.

There are several ways to solve these problems. Firstly we can use resource hints via the link attributes and then we
can use some script tag attributes. But we will pay attention to script tag attributes later.

![](/img/links-script-attr/resource-hints.png)

**Resource hints** is the process of telling the browser in advance of some resources which may be loaded later so that
it loads it using the worker (background) threads and stores this resource in the browser cache.

Hence not disturbing the main thread flow. And then when the main thread get’s to the point when it needs to load that
resource, rather than waiting for a new request, it get’s the preloaded resource from the browser cache, thus optimizing
the rendering performance by not blocking the main thread.

Basically, we specify resource hints using the link attributes

## Performance Optimization using link attributes

There are many ways to increase the performance of a web page. One of them is by setting various values to the rel
attribute of the `<link>` tag. Basically there are five main values to optimizing performance via the rel attribute of
the link tag:

* Preload
* Prefetch
* DNS-prefetch
* Prerender
* Preconnect

## Preloading content with rel="preload"

The preload value of the `<link>` elements **rel** attribute lets you declare fetch requests in the HTML’s `<head>`,
specifying resources that your page will need very soon, which you want to start loading early in the page lifecycle,
before browsers main rendering machinery knows it. This ensures that they are available earlier and are less likely to
block the page’s render, improving performance.

```html
<link rel="preload" href="styles/main.css">
```
### Specifying Resource types using the "as" attribute

There are several resources which the **browser knows** how to **preload** when it sees certain values being passed into
the `as` attribute of the `<href>` tag:

* script
* style
* audio
* document
* embed
* fetch
* image
* object
* script
* style
* track
* worker
* video

Using `as` to specify the **type** of **content** to be **preloaded** allows the **browser** to:

* **Priortize** resource download more accurately
* **Store** in the cache for future requests, reusing the resourrce if appropriate.
* **Apply** the correct content security policy to the resource.
* **Set** the correct Accept request headers for it

#### Resource type

* **Audio**: Audio File, as typically used in `<audio>`
* **Document**: An HTML document intended to be embedded by a `<frame>` of `<iframe>`
* **Embed**: A resourses to be embedded inside an `<embed>` element
* **Fetch**: Resource to be accessed by a fetch or **XHR** request, such as ArrayBuffer or **JSON** file. 
* **Font**: Font file
* **Image**: Image file
* **Object**: A resource to be embedded inside an `<object>` element
* **Script**: JS file
* **Style**: Css stylesheet
* **Track**: WebVTTfile
* **Worker**: A JavaScript web worker or shared worker

``` json
<link rel="preload" as="style" href="example.css">
<link rel="preload" as="script" href="example.js">
<link rel="preload" as="image" href="example.png">
<link rel="preload" as="font" href="example.woff">
```

### Optimizations on mobile devices

One nice attribute of `<link>` element is it’s ability to accept media attributes. These can accept media-type or
full-blown media-queries allowing you to do responsive preloading. The example below uses media queries to responsively
prefetch resources which boosts performance on mobile devices.

```html
<head>
  <link rel="preload" href="my-img.png" as="image" type="image/png" media="(max-width: 600px)">
</head>
<body>
  <script>
    var mediaQueryList = window.matchMedia('(max-width: 600px)');
    if(mediaQueryList.matches) {
      header.style.backgroundImage = "url(my-img.png)";
    }
  </script>
</body>
```

### When to use

The preload attribute is used when we want to make use of some resource soon after the page downloads and we want to
start loading it earlier. For example if we want to use some fonts in a stylesheets. For example:

By default the page will only download the comic-sans.woff2 file when it loads the index.css. Instead of waiting for it
that long, use `<link rel="preload">` to initiate the download sooner:
`<link rel="preload" href="comic-sans.woff2" as="font" />`.

``` json
  <link rel="stylesheet" href="index.css">
  <style>
    @font-face {
      font-family: 'comic-sans';
      src: url('comic-sans.woff2') format('woff2');
    }
  </style>
```

### Including a MIME Type

`<link>` elements can accept a **type** attribute, which contains the **MIME** type of the resource the element points
to. This is especially useful when **preloading** resources – the browser will use the type attribute value to work out
if it supports that resource, and will only download it if so, ignoring if not. 

#### Example:

```html
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preload" href="video.mp4" as="video" type="video/mp4">
</head>

<body>
  <video controls>
    <source src="video.mp4" type="video/mp4">
  </video>
</body>
```

## Using Prefetch for downloading resources for later use

While **preload** fetches resources which are to be used immediately on the same page, just after the page downloads,
**prefetch** is helpful when you know you’ll need that resource on a subsequent page, and you want to cache it ahead of
time. This way loading the cached page would be quicker. The browser gives more priority to **preload** than to
prefetch, because what is to be used on the same page is more important than the next page which the user hasn’t opened
yet.

### The as attribute
The `as` attribute works just as it does on it’s **preload** counterpart with same values and same reasons for
non-omission.

### When to use:
You have an e-commerce site, and 40% of your users go from the home page to a product page. Use `<link rel="prefetch">`
to download **CSS** and **JS** files responsible for rendering product pages.

You have a single-page app, and you code-split it so that different pages load different bundles. When a user visits
some page, ask your router what other pages it links to, and use `<link rel="prefetch">` to preload bundles for those
pages.

## Speed up connection with preconnect

A browser has to set up a connection when it loads resource from a third-party domain. And the process of setting up a
connection typically could take 100s of milliseconds. So rather than wait for this delay, we can use
`<link rel="preconnect"/>` to connect to this resource before hand.

### Examples:
You want to load react from a cdn from your domain. Setting up the connection will take a few milliseconds per domain,
but if you want to open the connection prior to when it will be needed, you can use this:

`<link rel="preconnect" href="https://cdn.reactjs.com" />`

### When to Use:
Use it to slightly speed up some third-party script or style. If you have a third-party resource in the page that you
really need to load sooner, add `<link rel="preconnect" />` for that domain. It will instruct the browser to setup
connection for that domain sooner.

## Speeding up DNS Resolution with dns-prefetch

Before browsers load a resource from a third party origin, it performs dns resolution of the domain name to the ip
address of the web-server.
It does this on demand, when the browser encounters a link from a different origin.
For each new domain, resolving the DNS record usually takes around 20-120 ms. It only affects the first resource
downloaded from that domain, but it still matters. If you perform a DNS resolution in advance, you’ll save that time and
load that resource faster.

### Example:

To resolve the domain name of `https://api.my-app.com` prior to it being loaded, use the following syntax:
`<link rel="dns-prefetch" href="https://api.my-app.com" />`

### When to Use:

Use it for domains that you’ll require shortly. So that the first request would be faster when you need it. Due to the
domain name resolution already having been performed prior to the point when it is needed.

## Speed up page render using prerender

`<link rel="prerender">` asks the browser to load a URL and render it in an invisible tab. When a user clicks on a link
to that `URL`, the page should be rendered immediately. It’s helpful when you’re really sure a user will visit a
specific page next, and you want to render it faster.

But due to it’s power as well as the system costs in resources to properly function, it has bad support from main stream
browsers.

### When to use:

When you’re really sure a user will go to some page next. If you have a conversion funnel where **70%** of visitors go
from page **A** to page **B**, `<link rel="prerender" />` in page **A** might help to render page **B** super-quickly.
Don’t overuse it. **Pre-rendering** a page is extremely costly – both in terms of traffic and memory. Don’t use
`<link rel="prerender" />` for more than one page.

## Resource priority

When a **browser** downloads a **resource**, the **resource** is assigned a **priority**. By default, the priority depends
on the resource type. For example in `Chrome`, **CSS** loaded in typical fashion via the `<link>` element in the
`<head>` will be assigned a **priority** of **highest**, as it blocks rendering. `Images in the viewport` may be
assigned a **priority** of **high**, whereas `images outside the viewport` may be assigned a **priority** of **low**. A
`<script>` loaded at the end of the document may receive a priority assignment of medium or low, but this can be
influenced by `defer` and `async`.

![](/img/links-script-attr/resource-priority.png)

As it can be seen above the css files has the highest priority as they can block rendering.

Prior to the introduction of `<link rel=“preload” />` developers had little control of this default behavior. But now
using the importance attribute on `<link/>` tags, developers can now prioritize some resources before others. At the same
time, rel=preload doesn't reprioritize the resource, but only sets it the default priority for that particular resource
type. Regardless, there are times when browsers prioritize resources in undesirable ways in specific situations: async
scripts may be assumed to be of low priority when that may not have been the author's intent, images may be of higher
priority than, e.g., non-critical stylesheets, etc. These are the kind of situations Priority Hints can help developers
address

Priority hints may be specified by setting the **importance** attribute for `<img/>`, `<script>`, `<link>` elements. The
following values specified priority hints:

* `High`: The resource may be prioritized, if the browser's own heuristics don't prevent that from happening.
* `Low`: The resource may be deprioritized, if the browser's heuristics permit.
* `Auto`: Let the browser decide what priority is appropriate for a resource. This is the default value.

Because `<link>` elements are affected by the `importance` attribute, this means priority can be changed not only for
typical stylesheet includes, but also for `rel=preload` hints:

```html
<link rel="preload" href="/js/script.js" as="script" importance="low">
```
The example above initiates an early fetch for a resource but also deprioritizes it.

Browsers make a best-effort to assign a reasonable fetch priority to images so those in-viewport appear as soon as
possible. In many cases, this will not cause issues, however, what if some above-the-fold imagery is not as critical as
others? Priority Hints can assist here.

```html
<ul class="carousel">
  <!-- The first image is visible -->
  <img src="img/carousel-1.jpg">
  <!-- The other carousel images are not -->
  <img src="img/carousel-2.jpg">
  <img src="img/carousel-3.jpg">
</ul>
```

Browser heuristics may cause all four images to be fetched with a high priority, despite three of them not initially
being visible. This may cause these fetches to delay the first image from completing fetching or content with fetches
for other in-viewport resources. And if the developer uses rel=preload, the first image would be priortized above
everything else, and if that image is large, it may block rendering as even stylesheets may end up waiting for that
image to complete downloading.

## Priority Hints to the rescue

When we assign the off-screen images low importance, this will create less contention between the remaining high
priority images and other high priority resources

```html
<ul class="carousel">
  <!-- The first image is visible -->
  <img src="img/carousel-1.jpg" importance="high">
  <!-- The other carousel images are not -->
  <img src="img/carousel-2.jpg" importance="low">
  <img src="img/carousel-3.jpg" importance="low">
</ul>
```

This is just one of the many benefits of priority hints

## Browser Support

| Value        | Chrome | Edge | Firefox               | IE         | Opera | Safari     | Chrome For Android | Firefox for Android   | Opera      | Safari     |
|--------------|--------|------|-----------------------|------------|-------|------------|--------------------|-----------------------|------------|------------|
| Preload      | 50     |      | No support from 56-57 | No support | 37    | No support | 50                 | No support from 56-57 | No support | No support |
| Prefetch     | 8      | 12   | 2                     | 11         | 15    | No support | 18                 | 4                     | 14         | No support |
| Prerender    | 13     | 79   | No support            | 11         | 15    | No support | 18                 | No support            | 14         | No support |
| Preconnect   | 46     | 79   | 39                    | No support | 33    | 11.1       | 46                 | 39                    | 33         | 11.3       |
| DNS-prefetch | 46     | 79   | 3                     | No support | 33    | No support | Yes                | 4                     | No support | No support |

## Async and Defer

One of the main factors of the slow rendering of **DOM** is the strategy with which we load the JavaScript because
**JS** blocks the parsing of **HTML** and that’s why the **DOM** performance highly depends on it.

However, few keywords can be used with `<script>` tag to boost the performance:

* async
* defer

As soon as the browser encounters the `<script>` tag, the **HTML** parsing is blocked and will only start up again after
the **JavaScript** is fetched from the server and executed. While the **JavaScript** is loading, the building up of the
**DOM** is paused and that reduces the performance and loading time of the webpage.

![](/img/links-script-attr/approach-without-attributes.png)

As it can be seen, when we do not set any special attributes to the script tag, at first, the **HTML** is parsed until
the **script** tags and then **HTML** parsing is blocked, then the **script** is fetched while **HTML** parsing is
blocked, and only after it is fetched, it starts getting executed and then after execution, **HTML** parsing is resumed.

This has it’s disadvantage of showing a blank screen for some time until all **HTML** has been properly parsed.

![](/img/links-script-attr/approach-async-attribute.png)

```html
<script async src="example.js"></script>
```

Using `async` attribute downloads the script files **asynchronously** during  **HTML** parsing (in the background).
After it finished downloading, only then it paused the **HTML** parsing and start executing the script file but before
the Window’s load event.

The `async` attribute does not gurantee the order of execution of **script** files. The **script** files will be
executed **asynchronously** or in **random order**.

![](/img/links-script-attr/approach-defer-attribute.png)

```html
<script defer src="example.js"></script>
```

The `defer` attribute also downloads the **script** file during **HTML** parsing (in the background) but will only
execute it after the **HTML** parsing is completed but before **DOMContentLoaded** event.

Using `defer` in the **script** tag also assures that the scrpts will be executed in the same order as they appear in
the file. This is very much useful in the scenario when one script depends on another script.

And another important fact of using defer against async is that defer never blocks the DOM rendering

### Similarities and Differences

| Similarities                                                                                                                          | Differences                                                                                                 |
|---------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| Both defer and async attribute downloads the script in background while the HTML parsing is going on                                  | Defer causes script execution to start after HTML parsing is finished but before the DOMContentLoaded event |
| Downloading of scripts this way does not block the rendering of DOM and as a result, user can see the webpage instead of white screen | Async causes script execution to start after they finish downloading but before window’s load event         |

### General Considerations and Takeaways

* If the script files are dependent on each other, then use `defer` attribute.
* `async` attribute is useful when we don’t care when the **script** loads and scripts do not rely on each other.
* `defer` maintains the order of execution of **script** but `async` doesn't.

# Identify target browsers

There are **3** main reasons why you need to determine which browser the user is using:

| You trying to work around a specific bug in some version of a browser | You trying to check for the existence of a specific feature | You want to provide different HTML depending on which browser is being used |
|-----------------------------------------------------------------------|-------------------------------------------------------------|-----------------------------------------------------------------------------|

## Browser popularity:

Speaking of browsers, it's worth touching on their popularity. Of course, they are divided into mobile and desktop. In
both cases, Chrome is leading by a wide margin. Safari, Firefox and Edge are also popular for computers. And in the
West, IE is still actively used, so there is a possibility that it will also have to be supported. On mobile platforms,
Chrome and Safari are worth highlighting.

### Mobile:

![](/img/target-browsers/mobile-browser-popularity.png)

### Desktop:

![](/img/target-browsers/desktop-browser-popularity.png)

## Browser comparison

In order to understand what the difference between browsers may be, you can go to
the [can I use site](https://caniuse.com/?compare=ie+11,edge+86,firefox+84,chrome+89,safari+14,ios_saf+14,and_chr+86&compareCats=all).
In addition to the difference caused by the difference in platforms, because some functions are special for phones or
for a desktop, there are things that simply did not have time to be implemented in the browser. In the case of **IE**,
they won't be implemented at all. At the bottom there is a link with a configured list of browsers, you can go through
it, there is a lot of everything.

## User agent

![](/img/target-browsers/user-agent.png)

To determine the target browser from JS, the main way is `navigator.user.agent` This property stores the string value of
the user agent for the current browser. It consists of information about the **platform, browser, engines,** and if the
user logs in from a phone or tablet, then information about whether it is **Android or IOS** and a **tablet or mobile**
will also be stored. This can be useful if we need to create functionality for a specific mobile platform.

## Babel

**Babel**, which is included in the application, is the most popular library used to compile code that contains newer
syntax into code that older browsers and environments can understand. It does this in two ways:

| **Polyfills** are included to emulate newer **ES2015+** functions so that their APIs can be used even if it is not supported by the browser. | **Plugins** are used to transform **ES2015+** code into older ES5 syntax. Since these are syntax related changes (such as arrow functions), they cannot be emulated with polyfills. |
|----------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

### package.json:

```json
{
  "dependencies": {
    "@babel/polyfill": "^7.0.0"
  },
  "devDependencies": {
    //...
    "babel-loader": "^8.0.2",
    "@babel/core": "^7.1.0",
    "@babel/preset-env": "^7.1.0"
    //...
  }
}
```

* **@babel/core** is the core Babel compiler. With this, all the Babel configurations are defined in a .babelrc at the
  root of the project.
* **babel-loader** includes Babel in the webpack build process.
* **@babel/polyfill** provides all the necessary polyfills for any newer ECMAScript features so that they can work in
  environments that do not support them.
* **@babel/preset-env** identifies which transforms and polyfills are necessary for any browsers or environments chosen
  as targets.

```json
{
    "presets": [
      [
        "@babel/preset-env",
        {
          "targets": "last 2 versions"
        }
      ]
    ]
}
```

The **targets** attribute in **.babelrc** identifies which browsers are being targeted. **@babel/preset-env** integrates
with **browserslist**, which means you can find a full list of compatible queries that can be used in this field in the
**browserlist documentation**:

```json
{
  "android": "86",
  "chrome": "86",
  "edge": "86", 
  "firefox": "83",
  "ie": "10",
  "ios": "13.4",
  "opera": "71",
  "safari": "13.1",
  "samsung": "12"
}
```

Discontinued browsers, such as **Internet Explorer**, are included in this list. This is a problem because unsupported
browsers won't have newer features added, and Babel continues to transpile specific syntax for them. This unnecessarily
increases the size of your bundle if users are not using this browser to access your site.

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": "last 2 versions",
        "debug": true,
        "useBuiltIns": "entry" 
//or    "useBuiltIns": "usage"
      }
    ]
  ]
}
```

By **default**, **Babel** includes every polyfill needed for a complete **ES2015+** environment when **@babel/polyfill**
is imported into a file. To import specific polyfills needed for the target browsers, add a useBuiltIns: **"entry"**
to the configuration.

Although only needed polyfills for **"last 2 versions"** is now included, it is still a super long list! This is because
polyfills needed for the target browsers for every newer feature is still included. Change the value of the attribute
to **"usage"** to only include those needed for features that are being used in the code.

To maintain separate **@ babel / preset-env** settings for the two versions of the application, we can delete the
**.babelrc** file altogether. Next, **we need to create 2 separate webpack configurations**, in one of which we will use
babel for **browsers that support modules**, and in the second for those that **do not support these modules**. In
combination with **useBuiltIns: "usage"**, we get that the conditional **IE** will receive one js file, which will
contain all the polyfills that are needed, and a modern browser that supports modules will receive a different js file,
which will have a completely different number of polyfills. Thus, we do not force modern browsers to load too much, and
older browsers, although slower, work. Browsers that support modules load and execute a script with a type attribute
equal to module and ignore the nomodule. Browsers that don't support modules do the opposite.

### Example of webpack config:

```javascript
const legacyConfig = {
  entry, 
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].bundle.js"
  }, 
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            ["@babel/preset-env", {
              useBuiltIns: "usage",
              targets: {
                esmodules: false // false for legacy config and true for modern browsers config
              }
            }]
          ]
        }
      },
      cssRule
    ]
  },
  plugins
}
```

### Including in HTML:

```html
<script type="module" src="main.mjs"></script>
<script nomodule src="main.bundle.js" defer></script>
```
