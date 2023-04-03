---
sidebar_position: 1
title: 1. Metrics
---

# Metrics

## What is Web Vitals? Why does it matter?

Web Vitals is an initiative by Google to provide unified guidance for quality signals that are essential to delivering a
great user experience on the web.

![](/img/metrics/web-vitals.png)

Optimizing for quality of user experience is key to the long-term success of any site on the web.

## Types of metrics

* **Perceived load speed:** how quickly a page can load and render all of its visual elements to the screen.
* **Load responsiveness:** how quickly a page can load and execute any required JavaScript code in order for components to 
respond quickly to user interaction
* **Runtime responsiveness:** after page load, how quickly can the page respond to user interaction.
* **Visual stability:** do elements on the page shift in ways that users don't expect and potentially interfere with their
interactions?
* **Smoothness:** do transitions and animations render at a consistent frame rate and flow fluidly from one state to the next?

## Important metrics to measure

### CORE

Core Web Vitals are the subset of Web Vitals that apply to all web pages, should be measured by all site owners, and
will be surfaced across all Google tools.

* **LCP** - [Largest Contentful Paint](https://web.dev/lcp/)
* **FID** - [First Input Delay](https://web.dev/fid/)
* **CLS** - [Cumulative Layout Shift](https://web.dev/cls/) (not in the scope of this module)

### OTHER

* **FCP** - [First Contentful Paint](https://web.dev/fcp/)
* **TTI** - [Time to Interactive](https://web.dev/tti/)
* **TBT** - [Total Blocking Time](https://web.dev/tbt/)
* **TTFB** – [Time to First Byte](https://web.dev/time-to-first-byte/)

## Time to First byte (LOADING)

Time to first byte is a metric for determining the responsiveness of a web server. It measures the amount of time
between creating a connection to the server and downloading the contents of a web page.

Connecting to a web server is a multi-step process where each step can potentially lead to delays.

Time to first byte helps us identify weak points in the connection process. By determining where delays occur, we can
tweak our services to perform faster and more reliably. Apart from that, a website’s speed can impact its web search
rankings.

![](/img/metrics/time-to-first-byte.png)

### Ways to measure TTFB:

* [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
* [Lighthouse](https://developers.google.com/web/tools/lighthouse/)

![](/img/metrics/time-to-first-byte-delay.png)

### Measure TTFB in JavaScript

To manually measure TTFB, Resource Timing API to retrieve the raw data from JavaScript. 

``` javascript
performance.getEntriesByType('resource').filter(item => item.name.includes("style.css"))
```

![](/img/metrics/time-to-first-byte-delay-2.png)

### Ways to improve TTFB:

A high **TTFB** reveals one of two primary issues. Either: 

1. Bad network conditions between client and server, or 
2. A slowly responding server application

To address a high **TTFB**, first cut out as much network as possible. Ideally, host the application locally and see if
there is still a big **TTFB**. If there is, then the application needs to be optimized for response speed.

If the **TTFB** is low locally then the networks between your client and the server are the problem. The network
traversal could be hindered by any number of things. There are a lot of points between clients and servers and each one
has its own connection limitations and could cause a problem. The simplest method to test reducing this is to put your
application on another host and see if the **TTFB** improves.

### Ways to improve server response:

![](/img/metrics/server-response-improve.png)

The first step to improving server response is to identify the core conceptual tasks that your server must complete in
order to return page content, and then measure how long each of these tasks takes. Once you've identified the longest
tasks, search for ways to speed them up. 
There are many possible causes of slow server responses, and therefore many possible ways to improve:
* Optimize the server's application logic to prepare pages faster. If you use a server framework, the framework may have
recommendations on how to do this.
* Optimize how your server queries databases, or migrate to faster database systems.
* Upgrade your server hardware to have more memory or CPU.

## First Contentful Paint (LOADING)

The metric measures the time from when the page starts loading to when any part of the page's content is rendered on the
screen. For this metric content refers to text, images (including background images), svg elements, and non-white canvas
elements.

### In Simple Words

"Paint" refers to the time at which the browser displays web page content onto the user's screen. By qualifying it with
"first contentful paint" the expression is probably suggesting that displaying something to the screen is fine but it's
not the end of the story. If a user is on a news website, for example, then it doesn't matter if the first thing to be
painted is the background color. The first contentful paint from the user's perspective is the paint in which any image,
text, title, menu items etc. appear on the screen.

### First Paint vs First Contentful Paint vs First Meaningful Paint

* First Paint: The time when the first pixel is painted onto the screen. For example a background color of the page, a
  border, a card without text, a sidebar without content, hr etc.
* First Contentful Paint: The time when the first content piece from the DOM is painted, i.e. some text, an image, an
  svg, even if it's not the content that you as a user visited a webpage for. For example, menu items, the list of
  logged in users on the sidebar, logo image etc will be considered as contentful paints.
* First Meaningful Paint: The time when the browser paints the content that users are interested in. This is highly
  depends on the page. For example, an article text will be considered as meaningful paint on Techcrunch, and the list
  of profile images - on Instagram.

![](/img/metrics/first-contentful-paint-example-google.jpeg)

### How to measure FCP

#### Field tools

* [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
* [Chrome User Experience Report](https://developers.google.com/web/tools/chrome-user-experience-report)
* [Search Console](https://webmasters.googleblog.com/2019/11/search-console-speed-report.html) (Speed Report)
* [Firebase Performance Monitoring](https://firebase.google.com/docs/perf-mon/get-started-web) (beta)

#### Lab tools

* [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
* [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
* [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)

#### JavaScript tools

The easiest way to measure **FCP** (as well as all Web Vitals
[field metrics](https://web.dev/vitals/#field-tools-to-measure-core-web-vitals) is with the
[web-vitals JavaScript library](https://github.com/GoogleChrome/web-vitals), which wraps all the complexity of manually
measuring **FCP** into a single function:

``` javascript
import {getFCP} from 'web-vitals';

// Measure and log the current FCP value,
// any time it's ready to be reported.

getFCP(console.log);
```

To manually measure FCP, you can use the [Paint Timing API](https://w3c.github.io/paint-timing/).

### Good FCP

![](/img/metrics/img4.jpeg)

To provide a good user experience, sites should strive to have **First Contentful Paint** occur within **1 second** of
the page starting to load. To ensure you're hitting this target for most of your users, a good threshold to measure is
the **75th percentile** of page loads, segmented across mobile and desktop devices.

### How to improve FCP

To improve FCP in general (for any site) except recommendations provided by Lighthouse you can refer to the following
techniques:

* Eliminate render blocking resources
* Serve static assets with an efficient cache policy
* Ensure the text remains visible during webfont load
* Pre-connect to required origins
* Pre-load key requests
* Keep request counts low 
* Avoid enourmous network payloads
* Avoid an excessive DOM size
* Minimize critical request depth
* Minify CSS
* Remove unused CSS
* Reduce server response times
* Avoid multiple page redirects

## Largest Contentful Paint (LOADING)

**Largest Contentful Paint (LCP)** is an important, user-centric metric for measuring perceived load speed because it
marks the point in the page load timeline when the page's main content has likely loaded—a fast **LCP** helps reassure
the user that the page is useful.

The **Largest Contentful Paint (LCP)** metric reports the render time of the largest image or text block visible within
the viewport.

Older metrics like **load** or **DOMContentLoaded** are not good because they don't necessarily correspond to what the
user sees on their screen. And newer, user-centric performance metrics like **First Contentful Paint (FCP)** only
capture the very beginning of the loading experience. If a page shows a splash screen or displays a loading indicator,
this moment is not very relevant to the user.

![](/img/metrics/img.png)

### What elements are considered

As currently specified in the Largest Contentful Paint API, the types of elements considered for Largest Contentful
Paint are:

* `<img>` elements
* `<image>` elements inside an `<svg>` element
* `<video>` elements (the poster image is used)
* An element with a **background image** loaded via the **url()** function (as opposed to a CSS gradient)
* Block-level elements containing text nodes or other inline-level text elements children.

Note, restricting the elements to this limited set was intentional in order to keep things simple in the beginning.
Additional elements (e.g. `<svg>`, `<video>`) may be added in the future as more research is conducted.

### Largest Contentful Paint examples

![](/img/metrics/largest-contentful-paint-example-1.png)
![](/img/metrics/largest-contentful-paint-example-2.png)
![](/img/metrics/largest-contentful-paint-example-3.png)
![](/img/metrics/largest-contentful-paint-example-4.png)

### Why it happens

The longer it takes a browser to receive content from the server, the longer it takes to render anything on the screen.
A faster server response time directly improves every single page-load metric, including LCP.

The most common causes of a poor LCP are:

* Slow server response times
* Render-blocking JavaScript and CSS
* Slow resource load times
* Client-side rendering

### How to measure

#### Field tools

* [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
* [Chrome User Experience Report](https://developers.google.com/web/tools/chrome-user-experience-report)
* [Search Console](https://support.google.com/webmasters/answer/9205520) (Core Web Vitals report)

#### Lab tools

* [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
* [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
* [WebPageTest](https://webpagetest.org/)

#### JavaScript tools

The easiest way to measure **LCP** (as well as all Web Vitals
[field metrics](https://web.dev/vitals/#field-tools-to-measure-core-web-vitals) is with the
[web-vitals JavaScript library](https://github.com/GoogleChrome/web-vitals), which wraps all the complexity of manually
measuring **LCP** into a single function:

``` javascript
import {getLCP} from 'web-vitals';

// Measure and log the current LCP value,
// any time it's ready to be reported.

getLCP(console.log);
```

To manually measure LCP, you can use the [Largest Contentful Paint API](https://wicg.github.io/largest-contentful-paint/).

### Good LCP

![](/img/metrics/lcp.png)

To provide a good user experience, sites should strive to have Largest Contentful Paint occur within the first **2.5
seconds** of the page starting to load. To ensure you're hitting this target for most of your users, a good threshold to
measure is the **75th percentile** of page loads, segmented across **mobile** and **desktop** devices.

### How to improve

* Download and serve the minimal amount of necessary JavaScript
* Inline critical CSS (can be done with Webpack)
* Remove any unused CSS entirely or move it to another stylesheet if used on a separate page of your site
* For any CSS not needed for initial rendering, use loadCSS to load files asynchronously
* Minify CSS (using Webpack, Gulp or equivalent)
* Route users to a nearby CDN
* Cache assets
* Configure reverse proxies (Varnish, nginx) to serve cached content or act as a cache server when installed in front of an application server
* Cache some or all of the HTML page's content and only update the cache when the content has changed with service workers
* Establish third-party connections early. Use rel="preconnect" to inform the browser that your page intends to establish a connection as soon as possible (<link rel="preconnect" href="https://example.com" />). Important resources that are declared or used in a certain CSS or JavaScript file may be fetched later than you would like. Pay close attention to these kinds of resources - fonts, above-the-fold images or videos, and critical-path CSS or JavaScript
* Reduce the sizes on other resources - images, videos, svg etc.

## Time to Interactive (LOADING)

**Time to Interactive (TTI)** is an important [lab metric](https://web.dev/user-centric-performance-metrics/#in-the-lab)
for measuring [load responsiveness](https://web.dev/user-centric-performance-metrics/#types-of-metrics). It helps
identify cases where a page looks interactive but actually isn't. A fast TTI helps ensure that the page
is [usable](https://web.dev/user-centric-performance-metrics/#questions).

![](/img/metrics/time-to-interactive.png)

**Time to Interactive** measures how long it takes a page to become fully interactive. A page is considered fully
interactive when:

* The page displays useful content, which is measured by the **First Contentful Paint**
* Event handlers are registered for most visible page elements
* The page responds to user interactions within 50 milliseconds

To calculate TTI based on a [performance trace](#) of a web page, follow these steps:

1. Start at [First Contentful Paint (FCP)](https://web.dev/fcp/).
2. Search forward in time for a quiet window of at least five seconds, where **quiet window** is defined as: no
   [long tasks](https://web.dev/custom-metrics/#long-tasks-api) and no more than two in-flight network **GET** requests.
3. Search backwards for the last long task before the quiet window, stopping at **FCP** if no long tasks are found.
4. **TTI** is the end time of the last long task before the quiet window (or the same value as **FCP** if no long tasks
   are found).

![](/img/metrics/tti.svg)

### How to measure

**TTI** is a metric that's best measured [in the lab](https://web.dev/user-centric-performance-metrics/#in-the-lab).
The best way to measure **TTI** is to run a **Lighthouse** performance audit on your site.

#### Lab tools

* [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
* [WebPageTest](https://webpagetest.org/)

### Good TTI

![](/img/metrics/time-to-interactive-measures.png)

To provide a good user experience, sites should strive to have a **Time to Interactive** of less than **5 seconds** when
tested on average mobile hardware.

### How to improve

To learn how to improve **TTI** for a specific site, you can run a **Lighthouse** performance audit and pay attention to
any specific [opportunities](https://web.dev/lighthouse-performance/#opportunities) the audit suggests.

To learn how to improve **TTI** in general (for any site), refer to the following performance techniques:

* Minify JavaScript (Webpack, Gulp etc.)
* Preconnect to required origins (use `<link rel="preconnect">`)
* Preload key requests (the browser is aware of the resources it needs to download only after it sees the reference in a
  file. Use `<link rel="preload">` to let the browser know about the resources in advance, so it can preload it)
* Reduce the impact of third-party code (always use **async/defer** for background third party scripts, use
  **requestIdleCallback** for sending analytics and other background activities, use `<link rel="preconnect">`, lazy
  load unneeded scripts/styles)
* Minimize critical request depth (if one request/response causes another request/response - it's not good. Try to
  request only the nesessary data. Mark other resources as **async**)
* Reduce JavaScript execution time (less code, less time to execute)
* Minimize main thread work (use web workers, oursource work to compositor thread, split chunks of work &lt;&equals; 50 ms)
* Keep request counts low and transfer sizes small (actual for HTTP1 only)

## Total Blocking Time (LOADING)

[Total Blocking Time (TBT)](https://web.dev/tbt/) is an
important [lab metric](https://web.dev/user-centric-performance-metrics/#in-the-lab)
for measuring [load responsiveness](https://web.dev/user-centric-performance-metrics/#types-of-metrics) because it helps
quantify the severity of how non-interactive a page is prior to it becoming reliably interactive—a low **TBT** helps
ensure that the page is [usable](https://web.dev/user-centric-performance-metrics/#questions).

The Total Blocking Time (TBT) metric measures the total amount of time
between [First Contentful Paint (FCP)](https://web.dev/fcp/) and
[Time to Interactive (TTI)](https://web.dev/tti/) where the main thread was blocked for long enough to prevent input
responsiveness.

![](/img/metrics/total-blocking-time.png)

The main thread is considered "blocked" any time there's a [Long Task](https://web.dev/custom-metrics/#long-tasks-api) —
a task that runs on the main thread for more than **50 milliseconds (ms)**. We say the main thread is "blocked" because
the browser cannot interrupt a task that's in progress. So in the event that a user does interact with the page in the
middle of a long task, the browser must wait for the task to finish before it can respond.

If the task is long enough (e.g. anything above **50 ms**), it's likely that the user will notice the delay and perceive
the page as sluggish or janky.

The blocking time of a given long task is its duration in excess of **50 ms**. And the total blocking time for a page is
the sum of the blocking time for each long task that occurs between **FCP** and **TTI**.

![](/img/metrics/blocked-thread.png)

### How does TBT relate to TTI

**TBT** is a great companion metric for **TTI** because it helps quantify the severity of how non-interactive a page is
prior it to becoming reliably interactive. **TTI** considers a page "reliably interactive" if the main thread has been
free of long tasks for at least five seconds. This means that three, 51 ms tasks spread out over 10 seconds can push
back **TTI** just as far as a single 10-second long task — but those two scenarios would feel very different to a user
trying to interact with the page. In the first case, three, **51 ms** tasks would have a **TBT** of **3 ms**. Whereas a
single, 10-second long tasks would have a **TBT** of **9950 ms**. The larger TBT value in the second case quantifies the
worse experience.

### How to measure

**TBT** is a metric that should be measured [in the lab](https://web.dev/user-centric-performance-metrics/#in-the-lab).
The best way to measure **TBT** is to run a **Lighthouse** performance audit on your site.

* [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
* [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
* [WebPageTest](https://webpagetest.org/)

Measuring **TBT** in the field is not recommended user interaction can affect your page's **TBT** in ways that lead to
lots of variance in your reports. To understand a page's interactivity in the field, you should measure
[First Input Delay (FID)](https://web.dev/fid/).

### Good TBT

![](/img/metrics/total-blocking-time-measure.png)

To provide a good user experience, sites should strive to have a **Total Blocking Time** of:

* Between the **0 and 300 MS** are good and as labeled **green** in Lighthouse.
* Between the **300 and 600 MS** are moderate and labeled as **orange** in Lighthouse.
* **Over 600 MS** is bad and labeled as **red** in Lighthouse.

### How to improve

* Get rid of long tasks (greater than 50 ms, it can be done in Performance tab in Chrome Dev Tools)
* Reduce the Request Count of the Third-Party Scripts (usually we can delay downloading and executing these scripts)
* Reduce the Size of the Third-Party Scripts (there is well-known pattern to m inimize and bundle all third party scripts into vendor.js bundle. Hovewer be careful, even though the browser might download it once and use cached version until something changes, all vendor scripts are doanloaded even these that are not used on the page. Try to bundle vendor scripts based on route)
* Minimize the Browser’s Main Thread Work (download and execute only the code you must have for the page, avoid layout threashing, outsource complex comutations to web workers, use compositor thread whenever you can)
* Clean the Unused Javascript and CSS Codes (can be done with Webpack)
* Compress the Javascript and CSS Files (can be done with Webpack)
* Implement the Code Splitting for Javascript Assets (lookup Webpack code splitting)

## First Input Delay (INTERACTIVITY)

**First Input Delay (FID)** is an important, user-centric metric for measuring load responsiveness because it quantifies
the experience users feel when trying to interact with unresponsive pages—a low **FID** helps ensure that the page is
usable.

**The First Input Delay (FID)** metric helps measure your user's first impression of your site's interactivity and
responsiveness.

**FID** measures the time from when a user first interacts with a page (i.e. when they click a link, tap on
a button, or use a custom, JavaScript-powered control) to the time when the browser is actually able to begin processing
event handlers in response to that interaction.

It’s like measuring the time from ringing someone’s doorbell to them answering the door. If it takes a long time, there
could be many reasons. For example, maybe the person is far away from the door or maybe they cannot move quickly.
Similarly, web pages may be busy doing other work or the user’s device may be slow.

### Why it happens

In general, input delay (a.k.a. input latency) happens because the browser's main thread is busy doing something else,
so it can't (yet) respond to the user. One common reason this might happen is the browser is busy parsing and executing
a large JavaScript file loaded by your app.

Long first input delays typically occur between **First Contentful Paint (FCP)** and **Time to Interactive (TTI)**
because the page has rendered some of its content but isn't yet reliably interactive. To illustrate how this can
happen, **FCP** and **TTI** have been added to the timeline:

![](https://web-dev.imgix.net/image/admin/krOoeuQ4TWCbt9t6v5Wf.svg)

**FID** measures the delta between when an input event is received and when the main thread is next idle. This means
**FID** is measured even in cases where an event listener has not been registered.

* **FID** is a metric that measures a page's responsiveness during load. As such, it only focuses on input events from 
  discrete actions like clicks, taps, and key presses.
* Other interactions, like scrolling and zooming, are continuous actions and have completely different performance
  constraints (also, browsers are often able to hide their latency by running them on a separate thread).
* To put this another way, **FID** focuses on the R (responsiveness) in the
  [RAIL performance model](https://developers.google.com/web/fundamentals/performance/rail), whereas scrolling and
  zooming are more related to A (animation), and their performance qualities should be evaluated separately.

![](/img/metrics/first-input-delay.png)

### How to measure

**FID** is a metric that can only be measured in the field, as it requires a real user to interact with your page. You
can measure **FID** with the following tools.

#### Field tools

* [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
* [Chrome User Experience Report](https://developers.google.com/web/tools/chrome-user-experience-report)
* [Search Console](https://support.google.com/webmasters/answer/9205520) (Core Web Vitals report)
* [Firebase Performance Monitoring](https://firebase.google.com/docs/perf-mon/get-started-web) (beta)

```javascript

import {getFID} from 'web-vitals';

// Measure and log the current FID value,
// any time it's ready to be reported.
getFID(console.log);
```

To manually measure FID, you can use the [Event Timing API](https://wicg.github.io/event-timing/).

### Good FID

![](/img/metrics/fid.png)

To provide a good user experience, sites should strive to have a First Input Delay of less than **100 milliseconds**. To
ensure you're hitting this target for most of your users, a good threshold to measure is the **75th percentile** of page
loads, segmented across mobile and desktop devices.

### How to improve FID

While **FID** is a field metric (and Lighthouse is a lab metric tool), the guidance for improving FID is the same as
that for improving the lab metric [Total Blocking Time (TBT)](https://web.dev/tbt/).

* Minimize main thread work
* Reduce JavaScript execution time
* Reduce the impact of third-party code
* Keep request counts low and transfer sizes small
