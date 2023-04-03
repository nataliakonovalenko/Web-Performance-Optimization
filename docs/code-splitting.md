---
sidebar_position: 7
title: 7. Code Splitting
---

# Code Splitting

## PRPL

[PRPL](https://web.dev/apply-instant-loading-with-prpl/) is an acronym that describes a pattern used to make web pages
load and become interactive, faster:

* **Push** (or preload) the most important resources.
* **Render** the initial route as soon as possible.
* **Pre-cache** remaining assets.
* **Lazy** load other routes and non-critical assets.

### Preload

The browser caches preloaded resources so they are available immediately when needed. You can preload resources by
adding a `<link>` tag with `rel="preload"` to the head of your HTML document:

```html
<link rel="preload" as="script" href="critical.js">
```

Unused preloads trigger a **Console warning** in **Chrome**, approximately **3 seconds** after the load event.

![](/img/code-splitting/preload.png)

### Render

To speed up rendering, you can add inline critical JavaScript similar to CSS and defer the rest with async. This
improves performance by eliminating round-robin calls to the server to obtain render-blocking resources. However, inline
code is harder to maintain from a development perspective, and the browser cannot cache it separately.

```html
<script src= "index.js" async />
```

### Pre-cache

The next step is caching. It consists in the fact that we can retrieve resources directly from the cache, and not from
the server on repeat visits. This not only allows users to use your app when they are offline, but it also reduces page
load times on repeat visits. However, this approach is useful only after the first visit and is not felt in any way for
a new user.

![](/img/code-splitting/pre-cache-illustration.png)

### Lazy load

The last step in this approach is lazy loading. This step is based on the fact that after we loaded critical resources in
the first step as early as possible and cached this data in order not to load them in the future, we need to load the
rest of the data as needed and so that they do not slow down the page.

![](/img/code-splitting/lazy-loading-illustration.png)

## Code splitting

[Code splitting](https://webpack.js.org/guides/code-splitting/) is one of the most compelling features of webpack. This
feature allows you to split your code into various bundles which can then be loaded on demand or in parallel. It can be
used to achieve smaller bundles and control resource load prioritization which, if used correctly, can have a major
impact on load time.

Webpack presents multiple ways to create separate chunks. 
To apply any of them we should change webpack config file.

There are three general approaches to code splitting available:

* [Entry Points](https://webpack.js.org/guides/code-splitting/#entry-points): Manually split code using
  [entry](https://webpack.js.org/configuration/entry-context/) configuration.
* [Prevent Duplication](https://webpack.js.org/guides/code-splitting/#prevent-duplication): Use
  [Entry dependencies](https://webpack.js.org/configuration/entry-context/#dependencies) or
  [SplitChunksPlugin](https://webpack.js.org/plugins/split-chunks-plugin/) to dedupe and split chunks.
* [Dynamic Imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports): Split code via inline function calls
  within modules.

## Tree Shaking & Webpack Bundle Analyzer

### Webpack Bundle Analyzer

[Webpack bundle analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) is a **NPM** package for **Webpack**
that visualizes size of bundle files with an interactive **zoomable treemap**.

This module will help you:

1. Realize what's really inside your bundle
2. Find out what modules make up the most of its size
3. Find modules that got there by mistake
4. Find duplication of modules

#### Usage

Pre requirements:

* Webpack, webpack-cli package
* Webpack-dev-server
* Webpack config file

```javascript
module.exports = {
  entry: {
    index: './src/index.js',
    second: './src/second-entrance.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new BundleAnalyzerPlugin()
  ]
}
```

You can analyze an existing bundle if you have a webpack stats JSON file. If you don have one, you can generate it using
a command below:

```text
webpack --profile --json > stats.json
```

Then you run the CLI tool:

```text
webpack-bunble-analyzer bundle/**/stats.json
```

#### Webpack Bundle Analyzer Options

| **Name**          | **Type**                                       |
|-------------------|------------------------------------------------|
| analyzerMode      | One of: `server`, `static`, `json`, `disabled` |
| analyzerHost      | `{ String }`                                   |
| analyzerPort      | `{ Number }` or `auto`                         |
| reportFileName    | `{ String }`                                   |
| defaultSizes      | One of: `stat`, `parsed`, `gzip`               |
| openAnalyzer      | `{ Boolean }`                                  |
| generateStatsFile | `{ Boolean }`                                  |
| statsFilename     | `{ String }`                                   |
| statsOptions      | `Null` or `{ Object }`                         |
| logLevel          | One of: `info`, `warn`, `error`, `silent`      |

#### Lodash issue

To understand all advantages of using **Webpack Bundle Analyze**, we can analyze a popular JS library **Lodash**.
**Lodash** library is built in such a way, that importing a single function using path **lodash** would lead to getting
the whole library into final bundle. It happened due to specifics of **Lodash** library, which main file contains all
functions definitions and exports them at once. To fix the issue, use specific path for each function you need. For
example: `lodash/fill`

```javascript
lodash.after = after;
lodash.ary = ary;
lodash.assign = assign;
lodash.assignIn = assignIn;
lodash.assignInWith = assignInWith;
lodash.assignWith = assignWith;
lodash.at = at;
lodash.before = before;
lodash.bind = bind;
lodash.bindAll = bindAll;
lodash.bindKey = bindKey;
lodash.castArray = castArray;
lodash.chain = chain;
lodash.chunk = chunk;
lodash.compact = compact;
lodash.concat = concat;
lodash.cond = cond;
lodash.conforms = conforms;
lodash.constant = constant;
lodash.countBy = countBy;
lodash.create = create;
```

##### Before

![](/img/code-splitting/tree-map-example-2.png)

##### After

![](/img/code-splitting/tree-map-example-1.png)


### Webpack Tree Shaking

![](/img/code-splitting/tree-shaking.png)

**Tree shaking** is a term commonly used within a **JavaScript** context to describe the removal of dead code.

It relies on the **import** and **export** statements in **ES2015** to detect if code modules are exported and imported
for use between **JavaScript** files.

In modern JavaScript applications, we use module bundlers (e.g., webpack or Rollup) to automatically remove dead code
when bundling multiple JavaScript files into single files. This is important for preparing code that is production
ready, for example with clean structures and minimal file size.

### Benefits of dead code elimination during bundling

| Webpack’s tree shaking          | Simple bundling                               |
|---------------------------------|-----------------------------------------------|
| No unused code in final bundle  | All unused code is present in final bundle    |
| Removing logging function calls | Logging calls are present                     |
| Fast script loading             | Slow script loading due to large bundle sizes |

The **webpack 2** release came with built-in support for **ES2015** modules as well as unused module export detection.
The new **webpack 4** release expands on this capability with a way to provide hints to the compiler via the *
sideEffects* in **package.json** property to denote which files in your project are "pure" and therefore safe to prune
if unused.

Pure files are files without side effects, meaning the don’t perform any special behavior when imported, other than
exposing one or more exports. An example of this are:

* Style files
* Polyfills
* Images and etc

Tree shaking in Webpack depends on *optimization.usedExports*  and *optimization.providedExports* flags. First tells
webpack to figure out which exports are provided by modules to generate more efficient code, second tells webpack to
determine used exports for each module. Using this information webpack can use it for efficient dead code elimination.

### Problem of dead code detection

Looking in bundle **JS** file, you can see a special comment `/*unused harmony export...*/`. It tells **webpack** that
this should be excluded from, production build.

However, it is not always possible for **Webpack** to identify files with side effects. What if excluding on file would
break the whole application?

To help **webpack** you can use special hints to tell him which files have side effects and which functions are pure and
can be eliminated without consequences.

### Special hints for Webpack dead code elimination process

Adding special flag *sideEffects* in your `package.json` could help **Webpack** to determine in which files side effect
are present, so it wont accidently exclude it from bundle.

```json
{
  "scripts": {
    "build": "webpack",
    "serve": "webpack-dev-server"
  },
  "sideEffects": false
}
```

`/*#_PURE_*/` annotation tells **Webpack** that this function call without side effects and can be excluded from bundle.
Arguments passed to the function are not being marked by the annotation and may need to be marked individually.
This behavior is enabled when `optimization.innerGraph` is set to **true**.

```javascript
import '../styles.css';
console.log("Visible in Production and Development builds");
/*#__PURE__*/console.log("Visible in Development builds");
```