---
id: 8
layout: "../../layouts/BlogPost.astro"
title: "Screenshot long pages with lazy loaded images"
description: 'Screenshotting long pages with lazy loaded images is a hassle. See how I do manage....'
publishDate: "11 Jul 2022"
heroImage:
  src: "/assets/blog/introducing-astro.jpg"
  alt: "Lazy images screenshot them with Playwright"
---

Lazy loading images is a usefull technique for increasing page performance, but once you want to create fullpage screenshots of long pages with lazy loaded images you end up without images in the screenshot. Hmnn. 

### Bypass lazy load images
To make sure all images are loaded you tell Playwright to scroll the page. In example below NY Times is used as an example.
I am sure there is a better way to create fullpage screenshots, without so much duplication, but this works for me. 


```js
const playwright = require('playwright-chromium');

(async() => {
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewportSize({
        width: 1240,
        height: 600,
    });

    await page.goto('https://nytimes.com/');

    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight / 10);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight / 7);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight / 6);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight / 3);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight * 0.6);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight * 0.7);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight * 0.8);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight * 0.9);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight * 0.95);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight * 1);
    })

    await page.waitForTimeout(1500);

    await page.screenshot({ path: `screenshot-lazy-loaded-images.png`, fullPage: true });
    await browser.close();
})();
````

### Example NYtimes.com
Left screenshot is without scrolling. Right with scrolling:
<img src="/assets/screenshot-lazy-loaded-images.jpg">


### Fullpage screenshots mobile device / iPhone X
If you want to create fullpage mobiles screenshots, the script below can help you get started:  

```js
const { chromium, devices } = require('playwright-chromium');

(async() => {
    const browser = await chromium.launch({ headless: false, slowMo: 250 });

    const iPhoneX = devices['iPhone X'];
    const context = await browser.newContext({
        ...iPhoneX,
    });
    const page = await context.newPage();

    await page.goto('https://nytimes.com/');

    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight / 10);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight / 7);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight / 6);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight / 3);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight * 0.6);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight * 0.7);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight * 0.8);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight * 0.9);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight * 0.95);
    })
    await page.waitForTimeout(1500);

    await page.evaluate(async() => {
        window.scrollTo(0, document.body.scrollHeight * 1);
    })

    await page.waitForTimeout(1500);

    await page.screenshot({ path: `screenshot-lazy-loaded-images-mobile.jpeg`, fullPage: true, quality: 30, type: 'jpeg' });

    await browser.close();
})();
```

### Alternatives
There are node packages like 'scroll-to-bottomjs' that might help you. Scrolling on a setInterval with a distance based on height of the page did not give me the result I wanted. 