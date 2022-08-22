---
id: 11
draft: true
layout: "../../layouts/BlogPost.astro"
title: "Web Vitals overlay"
description: 'Get the Core Web Vitals data in Playwright'
publishDate: "11 Jul 2022"
heroImage:
  src: "/assets/blog/introducing-astro.jpg"
  alt: "Add Core Web Vitals data on your screenschots in Playwright"
---

Chrome Developer Tool lets you add an overlay with Core Web Vitals data directly on the webpage you are.
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
