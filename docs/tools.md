---
sidebar_position: 2
title: 2. Tools
---

# Tools

## Lighthouse

Lighthouse is an open-source, automated tool for improving the quality of web pages. You can run it against any web
page, public or requiring authentication. It has audits for performance, accessibility, progressive web apps, SEO and
more.

![](/img/tools/lighthouse.png)

You can run Lighthouse in Chrome DevTools, from the command line, or as a Node module. You give Lighthouse a URL
to audit, it runs a series of audits against the page, and then it generates a report on how well the page did. From
there, use the failing audits as indicators on how to improve the page. Each audit has a reference doc explaining why
the audit is important, as well as how to fix it.

### Metrics section

The **Metrics** section provides quantitative measurements of the site's performance. Each metric provides insight into a
different aspect of the performance.

* The core metrics + description 
* Overall score
* Loading progress - screenshots

![](/img/tools/metrics.png)

### Opportunities section

Directly affect the Performance score. Includes:

* Suggestions + brief description
* Affection rate
* Specific points for changes (files in this case)

![](/img/tools/opportunities.png)

### Diagnostics section

In-Directly affect the Performance score. Includes:
* Diagnostic + brief description
* Proximate affect or quantitative assessment
* Specific points for changes (categories in this case)

![](/img/tools/diagnostics.png)

### Passed audits

The list of check which were successfully passed.

![](/img/tools/passed-audits.png)

### Export

* Provding the evidances of poor/good perfomance
* Comparing the baseline with the future optimization results

![](/img/tools/export.png)

## Chrome DevTools

![](/img/tools/dev-tools-logo.png)

**Chrome DevTools** is a set of web developer tools built directly into the **Google Chrome browser**. **DevTools** can
help you edit pages on-the-fly and diagnose problems quickly, which ultimately helps you build better websites, faster.

There are many ways to open **DevTools**, because different users want quick access to different parts of the **DevTools
UI**.

* When you want to work with the **DOM** or **CSS**, right-click an element on the page and select Inspect to jump into
  the **Elements panel**. Or press Command+Option+C (Mac) or Control+Shift+C (Windows, Linux, Chrome OS).
* When you want to see logged messages or run JavaScript, press Command+Option+J (Mac) or Control+Shift+J (Windows,
  Linux, Chrome OS) to jump straight into the Console panel.

### Network

In general, use the Network panel when you need to make sure that resources are being downloaded or uploaded as
expected. The most common use cases for the Network panel are:

* Making sure that resources are actually being uploaded or
downloaded at all.
* Inspecting the properties of an individual resource, such as its HTTP headers, content, size, and so
on.
  
![](/img/tools/network.png)

If you're looking for ways to improve page load performance, don't start with the Network panel. There are many
types of load performance issues that aren't related to network activity.

### Default columns

Each row of the Network Log represents a resource. By default the resources are listed chronologically. The top resource
is usually the main HTML document. The bottom resource is whatever was requested last.

Each column represents information about a resource. Figure 6 shows the default columns:
* **Status**. The HTTP response code.
* **Type**. The resource type.
* **Initiator**. What caused a resource to be requested. Clicking a link in the Initiator column takes you to the source 
  code that caused the request.
* **Time**. How long the request took.
* **Waterfall**. A graphical representation of the different stages of the request. Hover over a Waterfall to see a
  breakdown.

![](/img/tools/default-columns.png)

### Resource details

1. Click on resource. The Headers tab is shown. You can use this tab to inspect HTTP headers.
2. Click the Preview tab. A basic rendering of the HTML is shown.
3. Click the Response tab. The HTML source code is shown.
4. Click the Timing tab. A breakdown of the network activity for this resource is shown.

![](/img/tools/resource-details.png)

### More columns

The columns of the Network Log are configurable. You can hide columns that you're not using. There are also many columns
that are hidden by default which you may find useful. 

Right-click the header of the Network Log table and select Domain. The domain of each resource is now shown.

![](/img/tools/more-columns.png)

### Simulate Slow Connection

Network simulation helps developers or QAs simulate the performance of a website in different bandwidths like 2G, 3G,
4G, etc. This is extremely useful from a testing standpoint as testers get a sense of how the website loads andfunctions
when accessed from different internet connections.

1. Click the **Throttling** dropdown, which is set to **Online** by default
2. Select **Slow 3G**
3. Long-press **Reload** and then select **Empty Cache and Hard Reload**

![](/img/tools/simulate-slow-connection.png)

**Empty Cache and Hard Reload** forces the browser to go the network for all resources. This is helpful when you want to
see how a first-time visitor experiences a page load.

### Search headers and responses

Open the Network panel then press Command+F (Mac) or Control+F (Windows, Linux, Chrome OS) to open the new Network
Search pane.

![](/img/tools/network-search.png)

### Filter resources

* The Filter text box supports many different types of filtering:
* Plain text 
* Regular expression 
* Negative text (with "-" prefix: "-main.css" means everything except files which includes it)
* Type: domain:raw.githubusercontent.com will filter out any resource with a URL that does not match this domain.
* Type of file

![](/img/tools/filter-resources.png)


### Block Requests

How does a page look and behave when some of its resources aren't available? Does it fail completely, or is it still
somewhat functional? Block requests to find out:

1. Press Control+Shift+P or Command+Shift+P (Mac) to open the Command Menu.
1. Type block, select Show Request Blocking, and press Enter.
1. Click Add Pattern + Add a pattern to block request.
1. Reload the page.

![](/img/tools/block-requests.png)

### Coverage

The Coverage tab in Chrome DevTools can help you find unused JavaScript and CSS code. Removing unused code can speed up
your page load and save your mobile users cellular data.

* Red – was not executed
* Strip comments
* Isolated the all code that is trully needed for loading the page

![](/img/tools/coverage.png)

### How to generate Coverage Report

1. Open Chrome Devtools and press Cmd + Shift + P ( Ctrl + Shift + P on windows )
2. Start typing coverage, select the Show Coverage command, and then press Enter to run the command. The Coverage tab opens in the Drawer.
3. Click one of the following buttons in the Coverage tab:
  Click Start Instrumenting Coverage And Reload Page Reload if you want to see what code is needed to load the page.
  Click Instrument Coverage Record if you want to see what code is used after interacting with the page.
4. Click Stop Instrumenting Coverage And Show Results Stop when you want to stop recording code coverage.

![image](https://user-images.githubusercontent.com/13795445/114621654-a2d7d700-9cb5-11eb-8505-333512ed33b3.png)

## Performance

The trace shows activity chronologically, from left to right. The FPS, CPU, and NET charts at the top give you an
overview of frames per second, CPU activity, and network activity. The wall of yellow that you see means that the CPU
was completely busy with scripting activity. This is a clue that you may be able to speed up page load by doing less
JavaScript work. 

* Limit Network to Fast 3G
* Slowdown CPU

![](/img/tools/performance.png)

### Main Section

The **Main** section is used to view activity that occurred on the page's main thread.

**DevTools** represents main thread activity with a flame chart. The x-axis represents the recording over time. The
y-axis represents the call stack. The events on top cause the events below it.

**DevTools** assigns scripts random colors.

![](/img/tools/perf-main.png)

### Summary Section

Click on an event to view more information about it in the **Summary** tab. DevTools outlines the selected event in
blue.

The **Self Time** value represents the aggregated time spent directly in that activity, across all of its occurrences.
The **Total Time** value represents aggregated time spent in that activity or any of its children.

### View Activities and Call Tree

DevTools provides three tabular views for analyzing activities. Each view gives you a different perspective on the
activities:

* When you want to view the root activities that cause the most work, use the **Call Tree** tab.
* When you want to view the activities where the most time was directly spent, use the **Bottom-Up** tab.
* When you want to view the activities in the order in which they occurred during the recording, use the **Event Log** tab.

Each tab only displays activities during the selected portion of the recording.

The top-level of items in the **Activity** column, such as **Event**, **Paint**, and **Composite Layers** are root
activities. The nesting represents the call stack.

Click **Show Heaviest Stack** to reveal another table to the right of the **Activity table**. Click on an activity to
populate the **Heaviest Stack** table. The **Heaviest Stack** table shows you which children of the selected activity
took the longest time to execute.

![](/img/tools/perf-activities.png)

### Bottom-Up tab

In the **Main** section flame chart, you can see that almost practically all of the time was spent executing the three
calls to wait(). Accordingly, the top activity in the **Bottom-Up** tab is wait. In the flame chart, the yellow below
the calls to wait are actually thousands of Minor GC calls. Accordingly, you can see that in the **Bottom-Up** tab, the
next most expensive activity is Minor GC.

![](/img/tools/bottom-up.png)

### Event Log tab

The **Start Time** column represents the point at which that activity started, relative to the start of the recording. For
example, the start time of 1573.0 ms for the selected item means that activity started 1573 ms after the recording
started.

Use the **Duration** menu to filter out any activities that took less than 1 ms or 15 ms. By default the **Duration**
menu is set to **All**, meaning all activities are shown.

![](/img/tools/perf-event-log.png)

### Save/Load

In case if you need Save/Load recording, just right-click in performance tab and select needed option.

![](/img/tools/perf-save-load.png)

### How to find long tasks
Tasks (shown in gray) have red flags if they are Long Tasks. To find them:

* Record a trace in the Performance panel of loading up a web page.
* Look for a red flag in the main thread view. You should see tasks are now gray ("Task").
* Hovering over a bar will let you know the duration of the task and if it was considered "long".

![image](https://user-images.githubusercontent.com/13795445/114625285-a9b51880-9cba-11eb-8fc2-7401f492c11b.png)

To discover what is causing a long task, select the gray Task bar. In the drawer beneath, select Bottom-Up and Group by
Activity. This allows you to see what activities contributed the most (in total) to the task taking so long to complete.

### GPU activity & Raster

To analyze the **GPU load**, you can use the **GPU section**, in the picture on the right, and the **Raster** section to
understand when the browser is directly rendering the elements, in the picture on the left.

![](/img/tools/perf-gpu-activity.png)

### Interactions

Use the **Interactions** section to find and analyze user interactions that happened during the recording.

A red line at the bottom of an interaction represents time spent waiting for the main thread.

Click an interaction to view more information about it in the **Summary** tab.

![](/img/tools/interactions.png)

### Frames per second

DevTools provides numerous ways to analyze frames per second:

* Use the **FPS** chart to get an overview of **FPS** over the duration of the recording. 
* Use the **Frames** section to view how long a particular frame took. 
* Use the **Frame Rendering Stats** for a realtime estimate of **FPS** as the page runs.

The **FPS** chart provides an overview of the frame rate across the duration of a recording. In general, the higher the
green bar, the better the frame rate.

A red bar above the FPS chart is a warning that the frame rate dropped so low that it probably harmed the user's
experience.

![](/img/tools/perf-frames-per-second.png)

### Frames section

The "Frames" section tells us exactly how long a single frame took.

Hover over a frame or click on it to view a tooltip with more information about it.

![](/img/tools/perf-frames.png)

### Network section

Expand the **Network** section to view a waterfall of network requests that occurred during the recording.
Requests are color-coded as follows:

* HTML: Blue 
* CSS: Purple 
* JS: Yellow 
* Images: Green 

A darker-blue square in the top-left of a request means it's a higher-priority request. A lighter-blue square means
lower-priority. For example, the blue, selected request is higher-priority, and the green one above it is lower-priority.

![](/img/tools/perf-network.png)

### Network timing

The request for www.google.com is represented by a line on the left, a bar in the middle with a dark portion and a light
portion, and a line on the right.

Here's how this representation (on the left) maps to Network tab representation (on the right):

* The left line is everything up to the Connection Start group of events, inclusive. In other words, it's everything
before Request Sent, exclusive.
* The light portion of the bar is Request Sent and Waiting (TTFB). 
* The dark portion of the bar is Content Download.
* The right line is essentially time spent waiting for the main thread. This is not represented in the **Timing** tab.

![](/img/tools/perf-network-timing.png)

### Memory chat

DevTools displays a new **Memory** chart, above the **Summary** tab. There's also a new chart below the **NET** chart,
called **HEAP**. The **HEAP** chart provides the same information as the **JS Heap** line in the **Memory** chart.

The colored lines on the chart map to the colored checkboxes above the chart. Disable a checkbox to hide that category
from the chart.

The chart only displays the region of the recording that is currently selected. For example, on the picture, the
**Memory** chart is only showing memory usage for the start of the recording, up to around the 1000ms mark.

![](/img/tools/perf-memory.png)

### Screenshots

Hover over the **Overview chart** to view a screenshot of how the page looked during that moment of the recording.

You can also view screenshots by clicking a frame in the **Frames** section.

After clicking the 195.5ms frame in the **Frames** section, the screenshot for that frame is displayed in the **
Summary** tab

![](/img/tools/perf-screenshots.png)

## PageSpeed Insights

Instead of running **Lighthouse** locally, the extension now uses the **PageSpeed Insights API**. It will not be a sufficient
replacement for some of our users. These are the key differences:

* **PageSpeed Insights** is unable to audit non-public websites, since it is run via a remote server and not your local
  **Chrome instance**. If you need to audit a non-public website, use the DevTools Lighthouse panel, or the **Node CLI**.
* **PageSpeed Insights** is not guaranteed to use the latest **Lighthouse** release. If you want to use the latest
  release, use the **Node CLI**. The browser extension will get the update ~ 1-2 weeks after release.
* **PageSpeed Insights** is a **Google API**, using it constitutes accepting the **Google API Terms of Service**. If you
  do not wish to or cannot accept the terms of service, use the **DevTools Lighthouse** panel, or the **Node CLI**.

![](/img/tools/page-speed-insights.png)
