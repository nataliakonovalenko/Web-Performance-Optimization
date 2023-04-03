---
sidebar_position: 5
title: 5. CSS Optimization
---

# Critical CSS

## Troubleshooting

![](/img/css-optimization/critical-css.png)

Before we talk about the critical CSS, we will discuss how we can understand that we need this approach and how
we can detect the problem itself. First, we need to launch lighthouse and go to the performance tab in the **Chrome
DevTools**. Now, if we have a problem with a long delay before rendering the page, then most likely we will find a
tooltip in which it will be written that there are render-blocking resources in the application and that we can split
them into **critical** and **non-critical** to improve the loading speed of our application. Also below we can see that
**DevTools** suggest which file is blocking the download.

To visualize how this CSS blocks rendering:

* Open **DevTools** in **Chrome**
* Open **Performance tab**
* In the **Performance panel** click **Reload**

![](/img/css-optimization/critical-css-troubleshooting.png)

**FCP** marker is placed immediately after the **CSS** finishes loading. This means that the browser needs to wait for
all CSS to load and get processed before painting a single pixel on the screen.

## Optimization

Firstly, you need to know which classes are considered "critical". You can use the the **Coverage Tool** for that:

* In **DevTools**, open the **Coverage section**
* Click the **Reload button**, to reload the page and start capturing the coverage.

![](/img/css-optimization/separation-of-critical-css.png)

There will be 2 types of styles:

| Green (**critical**)                                                                                                     | Red (**non-critical**)                                                                                    |
|--------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| These are the classes the browser needs to render the visible content (like the title, subtitle, and accordion buttons). | These styles apply to content that's not immediately visible (like the paragraphs inside the accordions). |

It is also worth noting that critical CSS should contain styles for absolutely all screen resolutions which the site is designed for. This means that all common styles should be included in the critical css, as well as unique styles for all resolutions (mostly mobile, tablet, desktop). Thus, we will provide the fastest rendering of the top of our page, which the user will see while everything else is being loaded.

## Usage

You need to extract critical CSS inside a `<style>` block at the head of the page:

```html
<style type="text/css"></style>
```

Then, load the rest CSS asynchronously, by applying the following pattern:

```html
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="styles.css"></noscript>
```

The FCP marker appears before the page requests the CSS, which means the browser doesn't need to wait for the CSS to
load before rendering the page:

### Before

![](/img/css-optimization/results.png)

### After

![](/img/css-optimization/results-2.png)

This is not the standard way of loading CSS. Here's how it works:

* `link rel="preload" as="style"` requests the stylesheet asynchronously.
* The `onload` attribute in the `link` allows the CSS to be processed when it finishes loading.
* "nulling" the `onload` handler once it is used helps some browsers avoid re-calling the handler upon switching the rel attribute.
* The reference to the stylesheet inside of a `noscript` element works as a fallback for browsers that don't execute JavaScript.

# CSS Animations

![](/img/css-optimization/animation-performance.png)

In order to enhance the overall interactivity and presentation of the user interface of a website, animations can be
used. But animations can also make a site feel slower and janky if not done correctly. Generally, great user interfaces
should have a frame rate of 60 frames per second (fps). While it is not always possible to maintain 60fps, it is
important to maintain a high and steady frame rate for all animations.

![](/img/css-optimization/css-vs-js-animations.png)

Animation on the web can be done through several means, like `JavaScript`, `CSS`, `SVG`, `<video>`, `animated PNGs` and other
image types etc. But the most popular ways of doing animations are CSS and JavaScript. And CSS animations are lighter
than javascript animations, but the performance cost of animating a CSS property can vary from one property to another,
and animating expensive CSS properties can result in jank as the browser struggles to hit a smooth frame rate.

## Rendering waterfall

![](/img/css-optimization/rendering-waterfall.png)

The process a browser uses to paint changes to a page when the CSS properties of an element is being animated can be
described as a waterfall consisting of the steps shown in the figure to the right. 

1. **Recalculate Style**: when a property for an element changes, the browser must recalculate computed styles.
1. **Layout**: next, the browser uses the computed styles to figure out the position and geometry for the elements. This
operation is labeled `layout` but is also sometimes called `reflow`.
1. **Paint**: finally, the browser needs to repaint the elements to the screen.
1. **Composite Layers**: The page may be split into layers, which are painted independently and then combined in a
process called `Composition`.

All of these stages need to fit into a single frame, since the screen isn’t updated until it is complete

## CSS property cost

In the content of the rendering waterfall, some properties are more expensive than others:

| Property Type            | Cost                                                             | Examples                                                                                      |
|--------------------------|------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| Geometric Properties     | <ol><li>Recalculate Style</li><li>Layout</li><li>Paint</li></ol> | <ol><li>left</li><li>max-width</li><li>border</li><li>margin-left</li><li>font-size</li></ol> |
| Non Geometric Properties | <ol><li>Recalculate Style</li><li>Paint</li></ol>                | <ol><li>color</li></ol>                                                                       |
| Composition Properties   | <ol><li>Recalculate Style</li></ol>                              | <ol><li>transform</li><li>opacity</li></ol>                                                   |
