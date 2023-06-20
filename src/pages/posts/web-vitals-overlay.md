---
id: 7
draft: false
layout: "../../layouts/BlogPost.astro"
title: "Web Vitals overlay"
description: 'Get the Core Web Vitals data in Playwright'
publishDate: "11 Jul 2022"
heroImage:
  src: "https://images.unsplash.com/photo-1524058293211-04a6443a5bc5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=420&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1OTY4Mjc2OA&ixlib=rb-1.2.1&q=80&w=840"
  alt: "Add Core Web Vitals data on your screenschots in Playwright"
---

Chrome Developer Tools lets you add an overlay with Core Web Vitals data directly on the webpage you are.
You can turn this setting on with:
- Inspect a page in Developer Tools
- Type 'CTRL SHIFT P' (in Windows) 
- Search for 'Core Web Vitals'
- Select the 'Core Web Vitals' option in the Rendering tab

<img src="/assets/core-web-vitals-overlay-chrome.jpg">

The Core Web Vitals overlay can be triggered with Playwright as well. Connect to the 'Chrome Developer Protocol', and set show Overlay.setShowWebVitals to true, just like in the example below:


```js
const { chromium } = require('playwright');
const path = require('path');

(async() => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    const client = await context.newCDPSession(page);

    await client.send('Overlay.setShowWebVitals', { show: true });

    await page.goto('https://playwright.dev/');
       // await page.reload();
    await page.screenshot({ path: 'cwv/core-web-vital-overlay.jpeg', type: 'jpeg', });

    await page.close();
    await browser.close();
})();
```

## Result of adding Core Web Vitals overlay

Now your screenshots will have the Web Vitals overlay added to them:

<img src="/assets/core-web-vital-overlay.jpeg">
