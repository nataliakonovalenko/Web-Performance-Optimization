---
sidebar_position: 4
title: 4. Image Optimization
---

# Image Optimization

## How to measure performance of images

Before we dive into measurements let’s iterate through some common rules that are relevant for any performance testing:

* **Always do multiple measurements.** It’s important to make sure that data you collected are consistent. If you can
see a major gap between measurements then something is not right, and therefore, you need to investigate a cause and
repeat a test.
* **Conditions of the tests must be the same.** Every time you are running tests make sure nothing changing externally.
Some examples of external conditions could be the Internet speed, load of test server, etc.
* **Keep source data of load tests.** If your input data is based on the end figures you are computing then it’s better
to save source files as well. It might become important if you realize that your calculations are wrong or there is a
missing metric.
* **Create test report.** At the end of your tests you should have a report that you can store along with source data.
That’s what you can use to compare results.
* **Run tests regularly.** Performance testing shouldn’t be one time thing. Ideally you will want to run them on every
change or on every release.

Our main tool would be Google Chrome which has some powerful developer features that can tell us a lot about what is
going on. The network tab will be our best companion today.

![](/img/image-optimization/images-network-tab-dev-tools.png)

Here is all network requests that have been done during the website load. There is a lot of useful information, such as
**name of the file**, **size of the HTTP response** and **time that it take to load**. So, we can collect all this
information and analyze it. But instead of do it manually we can use another feature of Google Chrome Dev Tools —
**export to HAR**:

![](/img/image-optimization/export-to-har-feature-dev-tools.png)

**HAR** stands for **"HTTP Archive Format"** and describes HTTP requests and responses using JSON format.

#### Example:

```json
{
  "startedDateTime": "2018-03-21T21:16:58.082Z",
  "time": 1851.4560560238315,
  "request": {
    "method": "GET",
    "url": "http://www.midday.coffee/assets/cups/tea-cup-2107599__340.jpg",
    "httpVersion": "HTTP/1.1",
    "headers": [
      {
        "name": "Pragma",
        "value": "no-cache"
      },
      {
        "name": "Accept-Encoding",
        "value": "gzip, deflate"
      },
      {
        "name": "Host",
        "value": "www.midday.coffee"
      }
    ],
    "queryString": [],
    "cookies": [],
    "headersSize": 450,
    "bodySize": 0
  },
  "response": {
    "status": 200,
    "statusText": "OK",
    "httpVersion": "HTTP/1.1",
    "headers": [
      {
        "name": "Date",
        "value": "Wed, 21 Mar 2018 21:16:59 GMT"
      },
      {
        "name": "Content-Length",
        "value": "27930"
      },
      {
        "name": "Content-Type",
        "value": "image/jpeg"
      }
    ],
    "cookies": [],
    "content": {
      "size": 27930,
      "mimeType": "image/jpeg",
      "compression": 0
    },
    "redirectURL": "",
    "headersSize": 681,
    "bodySize": 27930,
    "_transferSize": 28611
  },
  "cache": {},
  "timings": {
    "blocked": 4.464056039112623,
    "dns": -1,
    "ssl": -1,
    "connect": -1,
    "send": 0.06599992047994974,
    "wait": 398.09400006197393,
    "receive": 1450.832000002265,
    "_blocked_queueing": 1447.0560000045225
  },
  "serverIPAddress": "172.217.25.176",
  "connection": "1881782",
  "pageref": "page_1"
}
```

It provides very comprehensive set of data about the request such as **URL of the image**, **all the headers** and what
is the most interesting for us — **timings**. Those HAR files are quite big and we don’t want to analyze them manually
either.

That’s where JQ comes into a game. [JQ](https://stedolan.github.io/jq/) is a command line tool that can process **JSON**
files using special filters. For instance, if we want to print all images that has been loaded then we would write this in command line:

```
jq '.log.entries[] | {"url": .request.url } | select(.url | match("png|jpg|PNG|JPG|jpeg|JPEG|gif|GIF|webp|avif"))' ./har.json
```

* `.log.entries[]` is a selector that will pick every object from "entries" array and pass it down the pipe (|).
* `{"url": .request.url }` will create a new object for every array entry and will contain only URL os the request.
* `select(.url | match("png|jpg|PNG|JPG|jpeg|JPEG|gif|GIF|webp|avif")` will filter images out of all requests

Now we need metrics that will only be related to images and won’t be affected by anything else:

* **Number of images on the page**. By using this number we can track how many images are loaded on the page.
* **Total transferred size of images**. This is a number of bytes that had been downloaded. It’s a good metric, and in 
most cases it can be improved really well by optimizing images or giving them a correct size (resizing or cropping).
* **Time taken for all images to load**. This one shows us how long it takes for all images to load. It doesn’t take
into account the fact that images load in parallel, but just if they would load sequentially. This metric also exclude
queuing time that browser been waiting to start loading a resource.
* **Total time with queuing**. This is the same as above but including queue time. Queue time can be reduced by using
some techniques, for example moving of all assets to separate domain, so that browser can use different thread pool for
loading images.

#### Setting up tests

* It is better to make at least 3 measurements and make sure that deviation is not huge.
* Setup network throttling in Chrome Dev Tools, so that tests won’t depend on the Internet speed.

![](/img/image-optimization/network-throttling-dev-tools.png)

* Disable caching in Chrome Dev Tools:

![](/img/image-optimization/network-throttling-dev-tools.png)

* Make measurements on 3 visual breakpoints: desktop, mobile and tablet.

After that, you can analyze results and find out how fast images loads on pages and how many times it takes. If you
understand that there is a very big amount of images loads one by one or their size abnormal it is a good opportunity
to improve image performance on your website.

## Adaptive images

Adaptive images allows you to set responsive images that the browser can use depending on the pixel density or window
width, according to your preferences. This way, it can only download the resources it needs to render the page, without
downloading a bigger image if it’s on a mobile device, for example. This will reduce page load time, but will require
different sized images.

### Usage: 

```html
<picture>
  <source srcset="image-w480.jpg" media="(max-width: 480px)">
  <source srcset="image-w768.jpg" media="(max-width: 768px)">
  <source srcset="image-w1024.jpg" media="(max-width: 1024px)">
  <img src="image-w1920.jpg"/>
</picture>
```

### or

```html
<img src="image-w480.jpg" media="(max-device-width: 480px)">
  <source src="image-w768.jpg" media="(max-device-width: 768px)">
  <source src="image-w1024.jpg" media="(max-device-width: 1024px)">
</img>
```

### Webpack-images-resizer

Now let's talk about how to cut images. [Webpack-images-resizer](https://www.npmjs.com/package/webpack-images-resizer)
is one of the webpack tools, although there are many. This is an example from the package page in **npm**, here we can
see that objects are added to the list containing the path to the image and the path where the sliced should be put.
Also, there is no need to specify the path separately to each picture, instead, we can specify the path to the folder
with them. And we can specify the width of the image not only as a percentage, but also in pixels. We can also specify
the compression ratio of the image.

```javascript
const path = require('path');
const WebpackImagesResizer = require('webpack-images-resizer');
let list = []; list.push({src: path.resolve(__dirname, 'assets/1.png'), dest: 'assets/1.png'});
list.push({src: path.resolve(__dirname, 'assets/2.png'), dest: 'assets/2.png'});
list.push({src: path.resolve(__dirname, 'assets/dir'), dest: 'assets/dir'});
module.exports = {
  entry: [
    './src/index',
    'webpack-dev-server/client?http://localhost:8080'
  ],
  output: {filename: 'index.js'},
  mode: 'development',
  plugins: [
    new WebpackImagesResizer(list, {width: "50%"})
  ]
};
```

### Sharp

The typical use case for [Sharp](https://www.npmjs.com/package/sharp) plugin is to convert large images in common
formats to smaller, web-friendly JPEG, PNG, AVIF and WebP images of varying dimensions.

As well as image resizing, operations such as rotation, extraction, compositing and gamma correction are available.

```javascript
const sharp = require('sharp');

sharp(inputBuffer)
  .resize(320, 240)
  .toFile('output.webp', (err, info) => {
    //...
  });
```

## Lazy loading

Lazy-loading is a technique that defers loading of non-critical resources at page load time. Instead, these non-critical
resources are loaded at the moment of need. lazy-loading in action goes something like this

![](/img/image-optimization/lazy-load-illustration-google.png)

### How it works:

1. You arrive at a page, and begin to scroll as you read content.
1. At some point, you scroll a placeholder image into the viewport.
1. The placeholder image is suddenly replaced by the final image.

![](/img/image-optimization/lazy-load-illustration.png)

### Why lazy-load images instead of just loading them?

Because it's possible you're loading stuff the user may never see. This is problematic for a couple reasons:

#### 1. It wastes data.

On unmetered connections, this isn't the worst thing that could happen (although you could be using that precious
bandwidth for downloading other resources that are indeed going to be seen by the user). On limited data plans, however,
loading stuff the user never sees could effectively be a waste of their money.

#### 2. It wastes system resources.

After a media resource is downloaded, the browser must decode it and render its content in the viewport.

Lazy-loading images reduces initial page load time, initial page weight, and system resource usage, all of which have
positive impacts on performance.

### Lazy loading types

* Using browser-level lazy-loading
* Using scroll and resize event handlers

### Browser-level lazy loading

Chrome and Firefox both support lazy-loading with the loading attribute. A value of lazy tells the browser to load the
image immediately if it is in the viewport, and to fetch other images when the user scrolls near them.

#### Usage: 

```html
<img src="image.jpg" loading="lazy" alt="..."/>
```

#### Support:

![](/img/image-optimization/browser-lazy-load-caniuse.png)

### Lazy loading using scroll and resize event handlers

To polyfill lazy-loading of `<img>` elements, we use JavaScript to check if they're in the viewport. If they are, their
src (and sometimes srcset) attributes are populated with URLs to the desired image content. If you've written
lazy-loading code before, you may have accomplished your task by using event handlers such as **scroll** or **resize**.

```html
<img class="lazy" src="placeholder-image.jpg"
     data-src="image-to-lazy-load-1x.jpg"
     data-srcset="image-to-lazy-load-2x.jpg 2x, image-to-lazy-load-1x.jpg 1x"
     alt="..."
/>
```

##### There are three relevant pieces of this markup that you should focus on:

* The **class** attribute, which is what you'll select the element with in JavaScript.
* The **src** attribute, which references a placeholder image that will appear when the page first loads.
* The **data-src** and **data-srcset** attributes, which are placeholder attributes containing the URL for the image
  you'll load once the element is in the viewport.

## Bit depth

Bit depth refers to the color information stored in an image. The higher the bit depth of an image, the more colors it
can store.

### Example:

Jpeg has **16** millions colors and it is **8-bit** format

2<sup>x</sup> = colors in 1 channel 

2<sup>x</sup> \* 2<sup>x</sup> \* 2<sup>x</sup> =  potential RGB colors

2<sup>8</sup> = 256

256 **(R)** \* 256 **(G)** \* 256 **(B)** = 16 777 216

### Monochrome gradient comparison

![](/img/image-optimization/monochrome-gradient.png)

## Compression

The file size of the image depends mainly on the resolution of the image and its bitness. Below is the formula for
calculating the weight of an image. We need to calculate the number of pixels, multiply this number by the bit rate and
the number of channels for color transmission. For example, for png, these are 4 channels of 8 bits, we get 4 bytes.
Then divide by the number of bits in one kilobyte and we get the weight in kilobytes. You can also look at the data in
the table. Here is the calculation of the size of a png file based on its resolution. That is, from this we can
understand that in addition to reducing the weight of the image by reducing the image, we can also compress it.

Image size depends mainly on **dimensions of the grid**  and **bit depth**

**100** \* **100** pixel image is composed of **10,000** pixels

**10,000** pixels \* **4** bytes = **40,000** bytes 

**40,000** bytes / **1024** = **39** KB

| **DIMENSIONS** | **PIXELS** | **FILE SIZE** |
|----------------|------------|---------------|
| 100 * 100      | 10,000     | 39 KB         |
| 200 * 200      | 20,000     | 156 KB        |
| 300 * 300      | 30,000     | 351 KB        |
| 500 * 500      | 40,000     | 977 KB        |
| 800 * 800      | 50,000     | 2500 KB       |

### Types of compressions

| **LOSSY**                                                                                                                                                                                             | **LOSSLESS**                                                                                                                                                         |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Lossy – this is a filter that eliminates some of the data. This will degrade the image, so you’ll have to be careful of how much to reduce the image. The file size can be reduced by a large amount. | Lossless – this is a filter that compresses the data. This doesn’t reduce the quality but it will require the images to be uncompressed before they can be rendered. |
| ![](/img/image-optimization/lossy-compression-illustration.png)                                                                                                                                       | ![](/img/image-optimization/lossless-compression-illustration.png)                                                                                                   |

### PNG compression

![](/img/image-optimization/png-compression.png)

### JPG compression

![](/img/image-optimization/jpeg-compression.png)

### Compress-images

[Compress-images](https://www.npmjs.com/package/compress-images) allows to compress images. You can use different
algorithms and methods for compressing images with many options.

* For **JPG**: jpegtran, mozjpeg, webp, guetzli, jpegRecompress, jpegoptim, tinify;
* For **PNG**: pngquant, optipng, pngout, webp, pngcrush, tinify;
* For **SVG**: svgo;
* For **GIF**: gifsicle, giflossy, gif2webp;

## Image formats

The 3 most common image formats on the web are.jpg, .png and .gif. Here’s a brief summary of each image file format and
when you should use it.

| **IMAGE FORMAT** | **CATEGORY**      | **PALETTE**        | **USE FOR**                                                            |
|------------------|-------------------|--------------------|------------------------------------------------------------------------|
| JPG              | Lossy             | Millions of colors | Still Images Photography                                               |
| GIF              | Lossless          | Maximum 256 colors | Simple animations Graphics with flat colors Graphics without gradients |
| PNG-8            | Lossless          | Maximum 256 colors | Still Images Photography                                               |
| PNG-24           | Lossless          | Unlimited colors   | Still Images Photography                                               |
| SVG              | Vector / lossless | Unlimited colors   | Still Images Photography                                               |

### Comparison

#### Flat Color Graphics

![](/img/image-optimization/flat-color.png)

#### Complex Color Images

![](/img/image-optimization/complex-color.png)

![](/img/image-optimization/complex-color-2.png)


## WebP

**WebP** is an image format that was created in 2010 and is currently being developed by Google. This format delivers
lossless and lossy compression for images. Several big names are campaigning for **WebP**, most notably **Google**,
**Facebook** and **eBay**.

           **Pros**            |            **Cons** 
-------------------------------|-------------------------------
Smaller file size              | Weak browser support  
Improved compression algorithm | Artifacting has plastic appearance 
Smoother color gradations      | Poor exporting interface 
Alpha channel mask             |

![](/img/image-optimization/webp-info.png)

### Support:

![](/img/image-optimization/webp-caniuse.png)

### Usage

```html
<picture>
  <source type="image/webp" srcset="image.webp">
  <source type="image/jpeg" srcset="image.jpg">
  <img src="image.jpg" alt="">
</picture>
```

## AVIF

[AVIF](https://jakearchibald.com/2020/avif-has-landed/#progressive-rendering) is a new image format derived from the
keyframes of **AV1** video. It's a royalty-free format, and it's already supported in **Chrome 85** on desktop. **
Android** support will be added soon, **Firefox** and **Apple** are working on
an implementation.

![](/img/image-optimization/image-formats-comparison.png)

### Comparison

![](/img/image-optimization/complex-color-3.png)

![](/img/image-optimization/complex-color-4.png)

![](/img/image-optimization/complex-color-5.png)

### Support:

![](/img/image-optimization/avif-caniuse.png)

### Useful links

* [Resize images](https://sharp.pixelplumbing.com/api-resize)
* [GIF, PNG, JPG or SVG. Which One To Use?](https://www.sitepoint.com/gif-png-jpg-which-one-to-use/)
* [AVIF](https://jakearchibald.com/2020/avif-has-landed/#progressive-rendering)
* [Image formats comparison tool](https://jakearchibald.com/2020/avif-has-landed/demos/compare/?show=f1&img=/c/f1-good-a14c8cc5.avif)
* [Image optimization](https://webdevblog.com/image-optimization/)
* [Web dev](https://web.dev/fast/)
* [Compression](https://kinsta.com/blog/optimize-images-for-web/)

