# Performance tools home task

The main goal of this task is to get some experience with Lighthouse and Chrome Dev Tools.

## Prerequisites

First off, you need run example app locally, so you will have ability to play with codebase and optimize a bit one small app.

1. Go to `/examples/tonys-favorite-foods`.
2. Run `npm i`
3. Run `npm start`
4. Check if everything is OK with your local setup by opening [localhost:1234](http://localhost:1234), you are supposed you are supposed to see an app with food cards.

## Task Steps

1. Open [localhost:1234](http://localhost:1234).
2. Press `Command+Option+J` (Mac) or `Control+Shift+J` (Windows, Linux, Chrome OS). Chrome DevTools opens up alongside the demo.

> Firstly, we need to establish a baseline - the baseline is a record of how the site performed before you made any performance improvements.

3. Find `Lighhouse` tab and click on it.
4. Match your audit configuration settings to those described below:

    - Check `Clear storage` checkbox.
    - Check `Simulated throtlling`.
    - Check only `Performance` *Category*.
    - Check `Mobile` *Device*.

Here's an explanation of the different options:

 - **Device** Setting to Mobile changes the user agent string and simulates a mobile viewport. Setting to Desktop pretty much just disables the Mobile changes.
 - **Category** Disabling a category prevents the Lighthouse panel from running those categories audits, and excludes those audits from your report. You can leave the other categories enabled, if you want to see the types of recommendations they provide. Disabling categories slightly speeds up the auditing process.
 - **Throttling** Lighthouse applies network throttling to emulate the ~85th percentile mobile connection speed even when run on much faster fiber connections. It's called "simulated" because the Lighthouse panel doesn't actually throttle during the auditing process. Instead, it just extrapolates how long the page would take to load under mobile conditions. 
 - **Clear Storage** Enabling this checkbox clears all storage associated with the page before every audit. Leave this setting on if you want to audit how first-time visitors experience your site. Disable this setting when you want the repeat-visit experience.

5. Click `Generate report` and wait until it finishes and shows results to you.

> If you ever get an error in your Lighthouse panel report, try running the demo tab from an incognito window with no other tabs open. This ensures that you're running Chrome from a clean state. Chrome Extensions in particular often interfere with the auditing process.

The number at the top of your report is the overall performance score for the site. Later, as you make changes to the code, you should see this number rise. A higher score means better performance.

6. Inspect your report and find in *Diagnostics* section a row which is telling `Avoid enormous network payloads`. Then, expand those row and inspect the list of files which is shown. 
7. Let's take a more detailed look at those files by opening *Network* tab and reloading the page to see some requests there, apart from that open *Network*'s tab settings and check `Use large request rows`.
8. If you don't see the Size column in the table of network requests, click the table header and then select Size.

Each Size cell shows two values. The top value is the size of the downloaded resource (take a look at `bundle.js`). The bottom value is the size of the uncompressed resource. If the two values are the same, then the resource is not being compressed when it's sent over the network. So, we can conclude that we have that `enormous network payloads` due to lack of compression.

You can also check for compression by inspecting a resource's HTTP headers:
- Click `bundle.js`.
- Click the Headers tab.
- Search the Response Headers section for a content-encoding header. You shouldn't see one, meaning that bundle.js was not compressed. When a resource is compressed, this header is usually set to `gzip`, `deflate`, or `br`.

9. Let's add some compression. Open `server.js` file and add the following code to `server.js`. Make sure to put `app.use(compression())` before `app.use(express.static('build'))`.

```javascript
const fs = require('fs');
const compression = require('compression');
app.use(compression());
app.use(express.static('build'));
```

10. Re-start `npm start` command and go to the *Network* with the same settings, the Size column should now show 2 different values for text resources like `bundle.js`. The Response Headers section for `bundle.js` should now include a `content-encoding: gzip` header.
11. Run Lighthouse audit again (Click `+` icon on the top-left corner of the tab) with the same settings, you should notice that total score was increased.
12. Let's inspect Lighthouse report again, we can find out that it still includes `Avoid enormous network payloads` row, but now there is only... images. So, let's do something with them.
13. Open `src/model.js`, replace `const dir = 'big'` with `const dir = 'small'`. This directory contains copies of the same images which have been resized.
14. Re-start `npm start` command and run Lighthouse audit again with the same settings. Now you can see that your total score was increased again, and page loads faster.

> Looks like the change only has a minor affect on the overall performance score. However, one thing that the score doesn't show clearly is how much network data you're saving your users. The total size of the old photos was around 5.3 megabytes, whereas now it's only about 0.18 megabytes.

15. Let's inspect Lighthouse report again :) one of the biggest problems is `Eliminate render-blocking resources`, so it's time to fix it. Expand this row and what exactly blocks the page (`lodash.js` and `jquery.js`).
16. Press `Command+Shift+P` (Mac) or `Control+Shift+P` (Windows, Linux, Chrome OS) to open the Command Menu, start typing *Coverage*, and then select `Show Coverage`.
17. Click `Reload` button and wait for report. The Coverage tab provides an overview of how much of the code in `bundle.js`, `jquery.js`, and `lodash.js` is being executed while the page loads. Report says that about 73% and 28% of the jQuery and Lodash files aren't used, respectively.
18. Click the `jquery.js` row. DevTools opens the file in the Sources panel. A line of code was executed if it has a green bar next to it. A red bar means it was not executed, and is definitely not needed on page load.
19. Scroll through the jQuery code a bit. Some of the lines that get "executed" are actually just comments. Running this code through a minifier that strips comments is another way to reduce the size of this file.

Are the `jquery.js` and `lodash.js` files even needed to load the page? The Request Blocking tab can show you what happens when resources aren't available.

21. Click the *Network* tab.
22. Press `Command+Shift+P` (Mac) or `Control+Shift+P` (Windows, Linux, Chrome OS) to open the Command Menu again.
23. Start typing *blocking* and then select `Show Request Blocking`.
24. Click `Add Pattern` / `+`, type `/libs/*`, and then press Enter to confirm.
25. Reload the page. The jQuery and Lodash requests are red, meaning that they were blocked. The page still loads and is interactive, so it looks like these resources aren't needed whatsoever!
26. Click `Remove all` patterns to delete the /libs/* blocking pattern.
27. Open `template.html`.
28. Delete `<script src="/libs/lodash.js">` and `<script src="/libs/jquery.js"></script>`.
29. Re-start `npm start` or just wait for a re-build if you're using `npm run develop`.
30. Audit the page again from the Lighthouse panel. Your overall score should have improved again!

Now, looking at latest report it looks like the biggest bottleneck is too much thread activity (`Minimize main-thread work`).

Use *Performance* tab to fix main thread activity problem. 

32. Record performance with help of `Reload` button on the *Performance* tab (wait until it finishes automatically)
33. Find `yellow wall` - the long CPU activity on the top most chart.
34. Click the *Timings* section to expand it. Based on the fact that there seems to be a bunch of User Timing measures from React, it seems like Tony's app is using the development mode of React. Switching to the production mode of React will probably yield some easy performance wins.
35. Browse the *Main* section. According to found `yellow wall` scroll down to the bottom of the Main section. When you use a framework, most of the upper activity is caused by the framework, which is usually out of your control. The activity caused by your app is usually at the bottom. In this app, it seems like a function called App is causing a lot of calls to a mineBitcoin function. It sounds like Tony might be using the devices of his fans to mine cryptocurrency...
36. Expand the Bottom-Up section. This tab breaks down what activities took up the most time. If you don't see anything in the Bottom-Up section, click the label for Main section. The Bottom-Up section only shows information for whatever activity, or group of activity, you have currently selected. For example, if you clicked on one of the mineBitcoin activities, the Bottom-Up section is only going to show information for that one activity.

The *Self Time* column shows you how much time was spent directly in each activity. For example, report shows that about 75% of main thread time was spent on the `mineBitcoin` function.

37. Time to see whether using production mode and reducing JavaScript activity will speed up the page load. Start with production mode:

   - Open `webpack.config.js`.
   - Change `"mode":"development"` to `"mode":"production"`.
   - Re-start build or wait for re-build
   - Audit the page (the score is increased again).

38. Let's reduce JavaScript activity by removing the call to `mineBitcoin`:

   - Open `src/App.jsx`
   - Comment out the call to `this.mineBitcoin(1500)` in the `constructor`.
   - Re-start build or wait for re-build.
   - Audit the page (the score is increased again).

## Summary

- Whenever you set out to optimize a site's load performance, always start with an audit. The audit establishes a baseline, and gives you tips on how to improve.
- Make one change at a time, and audit the page after each change in order to see how that isolated change affects performance.

## Evaluation criteria
For every day of lateness there is a penalty in 0.5 point. Maximum 10 points. 

1. Create a step by step report with key steps and attach it with modified project **[5 points]**
1. Your final performance mark more than 80/100 **[2 points]**
1. Your final performance mark more than 90/100 **[3 points]**