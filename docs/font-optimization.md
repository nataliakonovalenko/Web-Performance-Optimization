---
sidebar_position: 6
title: 6. Font Optimization
---

# Font Optimization

Custom web fonts are used nowadays on almost all websites around the world, but so many times, sites load these fonts
improperly. This causes a lot of problems for page loading. The most obvious problems which this causes are perforamance
issues, slow loading time, blocked rendering and swapped fonts during navigation.

There are just four steps to consider when loading a custom web font in an optimizing manner and these are what would be
covered in the tenure of this presentation.

* Use the correct font format
* Preload Fonts
* Use the correct font-face declaration
* Avoid invisible text during font loading



A **"full"** WebFont that includes all stylistic variants, which you may not need, plus all the glyphs, which may go
unused, can easily result in a multi-megabyte download.

To address the problem of large files containing all variants, the @font-face CSS rule is specifically designed to allow
you to split the font family into a collection of resources. For example unicode subsets, and distinct style variants.

Given these declarations, the browser figures out the required subsets and variants and downloads the minimal set
required to render the text, which is very convenient. However, if you're not careful, it can also create a performance
bottleneck in the critical rendering path and delay text rendering.

## The default behavior

Lazy loading of fonts carries an important hidden implication that may delay text rendering: the browser
must [construct the render tree](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction)
, which is dependent on the DOM and CSSOM trees, before it knows which font resources it needs in order to render the
text. As a result, font requests are delayed well after other critical resources, and the browser may be blocked from
rendering text until the resource is fetched.

![](/img/font-optimization/default-behaviour.png)

1. The browser requests the HTML document.
2. The browser begins parsing the HTML response and constructing the DOM.
3. The browser discovers CSS, JS, and other resources and dispatches requests.
4. The browser constructs the CSSOM after all of the CSS content is received and combines it with the DOM tree to
   construct the render tree.
   * Font requests are dispatched after the render tree indicates which font variants are needed to render the specified
     text on the page.
5. The browser performs layout and paints content to the screen.
   * If the font is not yet available, the browser may not render any text pixels.
   * After the font is available, the browser paints the text pixels.

The **"race"** between the first paint of page content, which can be done shortly after the render tree is built, and
the request for the font resource is what creates the **"blank text problem"** where the browser might render page
layout but omits any text.

By preloading WebFonts and using `font-display` to control how browsers behave with unavailable fonts, you can prevent
blank pages and layout shifts due to font loading.

## Preload fonts

If there's a high probability that your page will need a specific WebFont hosted at a URL you know in advance, you can
take advantage of [resource prioritization](https://web.dev/prioritize-resources/). Using `<link rel="preload">` will
trigger a request for the WebFont early in the critical rendering path, without having to wait for the CSSOM to be
created.

```html
<link rel="preload" as="font" href="/fonts/custom-font.woff" type="font/woff2" crossorigin="anonymous">
```

## Customize the text rendering delay

While preloading makes it more likely that a `WebFont` will be available when a page's content is rendered, it offers no
guarantees. You still need to consider how browsers behave when rendering text that uses a `font-family` which is not
yet available.

In the post [Avoid invisible text during font loading](https://web.dev/avoid-invisible-text/) you can see that default
browser behavior is not consistent. However, you can tell modern browsers how you want them to behave by
using [`font-display`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display).

Similar to the existing font timeout behaviors that some browsers implement, `font-display` segments the lifetime of a
font download into three major periods:

1. The first period is the **font block period**. During this period, if the font face is not loaded, any element
   attempting to use it must instead render with an invisible fallback font face. If the font face successfully loads
   during the block period, the font face is then used normally.
2. The **font swap** period occurs immediately after the font block period. During this period, if the font face is not
   loaded, any element attempting to use it must instead render with a fallback font face. If the font face successfully
   loads during the swap period, the font face is then used normally.
3. The **font failure** period occurs immediately after the font swap period. If the font face is not yet loaded when
   this period starts, it's marked as a failed load, causing normal font fallback. Otherwise, the font face is used
   normally.

Understanding these periods means you can use font-display to decide how your font should render depending on whether or
when it was downloaded.

To work with the `font-display` property, add it to your `@font-face` rules:

```css
@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  font-display: auto; /* or block, swap, fallback, optional */
  src: local('Awesome Font'),
       url('/fonts/awesome-l.woff2') format('woff2'), /* will be preloaded */
       url('/fonts/awesome-l.woff') format('woff'),
       url('/fonts/awesome-l.ttf') format('truetype'),
       url('/fonts/awesome-l.eot') format('embedded-opentype');
  unicode-range: U+000-5FF; /* Latin glyphs */
}
```

`font-display` currently supports the following range of values:

* `auto`
* `block`
* `swap`
* `fallback`
* `optional`


For more information on preloading fonts, and the font-display property, see the following post:

* [Controlling font performance using font-display](https://developers.google.com/web/updates/2016/02/font-display)

## The Font Loading API

Used together, `<link rel="preload">` and the **CSS** `font-display` give you a great deal of control over font loading
and rendering, without adding in much overhead. But if you need additional customizations, and are willing to incur the
overhead introduced by running JavaScript, there is another option.

The [Font Loading API](https://www.w3.org/TR/css-font-loading/) provides a scripting interface to define and manipulate
CSS font faces, track their download progress, and override their default lazyload behavior. For example, if you're sure
that a particular font variant is required, you can define it and tell the browser to initiate an immediate fetch of the
font resource:

```javascript
var font = new FontFace("Awesome Font", "url(/fonts/awesome.woff2)", {
  style: 'normal', unicodeRange: 'U+000-5FF', weight: '400'
});

// don't wait for the render tree, initiate an immediate fetch!
font.load().then(function() {
  // apply the font (which may re-render text and cause a page reflow)
  // after the font has finished downloading
  document.fonts.add(font);
  document.body.style.fontFamily = "Awesome Font, serif";

  // OR... by default the content is hidden,
  // and it's rendered after the font is available
  var content = document.getElementById("content");
  content.style.visibility = "visible";

  // OR... apply your own render strategy here...
});
```

Further, because you can check the font status (via the [check()](https://www.w3.org/TR/css-font-loading/#font-face-set-check))
method and track its download progress, you can also define a custom strategy for rendering text on your pages:

* You can hold all text rendering until the font is available.
* You can implement a custom timeout for each font.
* You can use the fallback font to unblock rendering and inject a new style that uses the desired font after the font is
  available.

Best of all, you can also mix and match the above strategies for different content on the page. For example, you can
delay text rendering on some sections until the font is available, use a fallback font, and then re-render after the
font download has finished.

The Font Loading API is [not available in older browsers](https://caniuse.com/font-loading). Consider using
the [FontLoader polyfill](https://github.com/bramstein/fontloader) or the [WebFontloader library](https://github.com/typekit/webfontloader)
to deliver similar functionality, albeit with even more overhead from an additional JavaScript dependency.

## Proper caching is a must

Font resources are, typically, static resources that don't see frequent updates. As a result, they are ideally suited
for a long max-age expiry— ensure that you specify both a [conditional ETag header](https://web.dev/http-cache/#validating-cached-responses-with-etags),
and an [optimal Cache-Control policy](https://web.dev/http-cache/#cache-control) for all font resources.

If your web application uses a `service worker`, serving font resources with a `cache-first strategy` is appropriate for
most use cases.

You should not store fonts using [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
or [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API); each of those has its own set of
performance issues. The browser's HTTP cache provides the best and most robust mechanism to deliver font resources to
the browser.

## Use the correct font-format

There are many font formats that can be used on the web, but onlty two formats are really needed if you don’t have to
support Internet Explorer (IE) 8 or lower: 

*   woff
*   woff2

These are the only two file types which we should use because they are compressed in the gzip format by default. Thus
they are very small in size and are thus optimized for the web, and are fully supported by **IE 9**+ and all other
evergreen web browsers.

### Important

It is of extreme importance that we set crossorigin to **anonymous** when fetching fonts, if not the preloaded font is
ignored by the browser, a new 
Fetch takes place. This is because fonts are expected to be fetched anonymoulsy by the browser, and the preload request
is only made anonymous by using this attribute.

In the above example, the `rel="preload"` `as="font"` attributes will ask the browser to start downloading the required
resource as soon as possible. They also tell the browser that this is a font, so it can appropriately prioritise it in
its resource queue. Using the preload hints will have dramatic impact on web performance and initial page load.

## Correct font-face declaration

Declaring a font-face family is very simple but we must take care with certain things when we do it. Here a correct
example declaring a custom font family:

```css
@font-face {
    font-family: 'Custom Font';
    font-weight: 400;
    font-style: normal;
    font-display: swap; /* Read next point */
    unicode-range: U+000-5FF;
    src: local("Custom Font"), url("/fonts/custom-font.woff2") format("woff2"),
    url("/fonts/custom-font.woff") format("woff");
}
```

As it can be seen, we only use optimised fonts **(woff and woff2)** and we tell the browser to load only the required
glyphs (from U+000 to U+5FF). But this property doesn’t prevent browsers to download the entire font. There are also two
more things to note, the local() function and the font Declaration order.

The local() function allows users to use their local copy of the font if present (e.g the Roboto font is pre-installed
on Android).

## Avoid invisible text during font loading

Fonts are often large files that take awhile to load. To deal with this, some browsers hide text until the font loads (
the "flash of invisible text"). If you're optimizing for performance, you'll want to avoid the "flash of invisible text"
and show content to users immediately using a system font (the "flash of unstyled text").

### Display text immediately

This guide outlines two ways to achieve this: the first approach is very simple but does not have universal browser
[support](https://caniuse.com/?search=font-display). The second approach is more work but has full browser support. The
best choice for you is the one that you'll actually implement and maintain.

### Use font-display

| Before                                   | After                                                        |
|------------------------------------------|--------------------------------------------------------------|
| `@font-face { font-family: Helvetica; }` | `@font-face { font-family: Helvetica; font-display: swap; }` |

[`font-display`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display) is an **API** for specifying
font display strategy. `swap` tells the browser that text using this font should be displayed immediately using a system
font. Once the custom font is ready, the system font is swapped out.

If a browser does not support `font-display`, the browser continues to follow it's default behavior for loading fonts.
Check which browsers support `font-display` [here](https://caniuse.com/?search=font-display).

### Browser default behaviours if a font is not ready

**Edge:** uses a system font until the custom font is ready, then swaps out fonts.

**Chrome:** will hide text for up to 3 seconds. If text is still nor ready, it will use a system font until custom font
is ready

**Firefox:** will hide text for up to 3 seconds. If text is still not ready, it will use a system font until the custom
font is ready.

**Safari:** hides text until the custom font is ready.

### Wait to use custom fonts until they are loaded

With a bit more work, the same behavior can be implemented to work across all browsers.

There are three parts to this approach:

* Don't use a custom font on initial page load. This ensures that the browser displays text immediately using a system
  font.
* Detect when your custom font is loaded. This can be accomplished with a couple lines of JavaScript code, thanks to the
  FontFaceObserver library.
* Update page styling to use the custom font.

Here are the changes you can expect to make in order to implement this:

* Refactor your CSS to not use a custom font on initial page load.
* Add a script to your page. This script detects when the custom font is loaded and then will update the page styling.

## Prevent layout shifting and flashes of invisible text (FOIT)

Combining `<link rel="preload">` with `font-display: optional` is the most effective way to guarantee no layout jank
when rendering custom fonts.

Check out MDN's data for up-to-date cross-browser support information:

* [`<link rel="preload">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload#browser_compatibility)
* [`font-display`](https://developer.mozilla.org/en/docs/Web/CSS/@font-face/font-display#Browser_compatibility)

### Font rendering

Layout shifting, or re-layout, occurs when a resource on a web page changes dynamically, resulting in a "shift" of content. Fetching and rendering web fonts can directly cause layout shifts in one of two ways:

* A fallback font is swapped with a new font ("flash of unstyled text")
* "Invisible" text is shown until a new font is rendered into the page ("flash of invisible text")

The **CSS** [`font-display`](https://font-display.glitch.me/) property provides a way to modify rendering behavior of
custom fonts through a range of different supported values (`auto`, `block`, swap, `fallback`, and `optional`). Choosing
which value to use depends on the preferred behavior for asynchronously loaded fonts. However, every one of these
supported values can trigger re-layout in one of the two ways listed above, until now!

The [Cumulative Layout Shift](https://web.dev/cls/) metric makes it possible to measure the layout instability on a web
page.

### Optional fonts

The `font-display` property uses a timeline of three periods to handle fonts that need to be downloaded before they can
be rendered:

* **Block**: Render **"invisible"** text, but switch to the web font as soon as it finishes loading.
* **Swap**: Render text using a fallback system font, but switch to the web font as soon as it finishes loading.
* **Fail**: Render text using a fallback system font.

Previously, fonts designated with `font-display: optional` had a **100ms** block period and no swap period. This means
that "invisible" text is displayed very briefly before switching to a fallback font. If the font is not downloaded
within **100ms**, then the fallback font is used and no swapping occurs.

`font-display: optional` behavior when font is downloaded **after**r the **100ms** block period:

![](/img/font-optimization/img.png)

Previous 

However, in the case that the font is downloaded before the 100ms block period completes, the custom font is rendered
and used on the page.

`font-display: optional` behavior when font is downloaded **before** the **100ms** block period

![](/img/font-optimization/img_1.png)

Chrome re-renders the page **twice** in both instances, regardless of whether the fallback font is used or if the custom
font finishes loading in time. This causes a slight flicker of invisible text and, in cases when a new font is rendered,
layout jank that moves some of the page's content. This occurs even if the font is stored in the browser's disk cache
and can load well before the block period is complete.

Optimizations have landed in Chrome 83 to entirely remove the first render cycle for optional fonts that are preloaded
with [`<link rel="preload'>`](https://web.dev/codelab-preload-web-fonts/). Instead, rendering is blocked until the
custom font has finished loading or a certain period of time has passed. This timeout period is currently set at 100ms,
but may possibly change in the near future to optimize performance.

New `font-display: optional` behavior in **Chrome** when fonts are preloaded and font is downloaded **after** the
**100ms** block period (no flash of invisible text).

![](/img/font-optimization/img_2.png)

New `font-display: optional` behavior in **Chrome** when fonts are preloaded and font is downloaded **before** the
**100ms** block period (no flash of invisible text)

![](/img/font-optimization/img_3.png)

Preloading optional fonts removes the possibility of layout jank and flash of unstyled text. This matches the
required behavior as specified in `CSS Fonts Module Level 4` where optional fonts should never cause re-layout and user
agents can instead delay rendering for a suitable period of time.

Although it is not necessary to preload an optional font, it greatly improves the chance for it to load before the first
render cycle, especially if it is not yet stored in the browser's cache.
