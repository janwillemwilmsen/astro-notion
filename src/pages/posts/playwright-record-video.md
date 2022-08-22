---
id: 14
layout: "../../layouts/BlogPost.astro"
title: "Save a recording / save a video"
description: 'How to set Playwright to record a video'
publishDate: "11 Jul 2022"
heroImage:
  src: "/assets/blog/introducing-astro.jpg"
  alt: "Video recording in Playwright"
---

Scripts and tests can be recorded as video in Playwright. Set video in the context and a video will be saved after the script is done running.

The path where the video will be saved and the video size can be configured. The default filetype is *.webm*. 



```js
const { chromium } = require('playwright-chromium');

(async() => {

    const browser = await chromium.launch({ headless: false, slowMo: 1050 });
    const context = await browser.newContext({
        viewport: { width: 1200, height: 1080 },
        deviceScaleFactor: 1,
        recordVideo: { dir: 'videos/' }
    });

    const page = await context.newPage();
    await page.goto('https://webscraper.io/test-sites/e-commerce/allinone');

    const hrefs = await page.evaluate(() => {
        return Array.from(document.links).map(item => item.href);
    });
    console.log(hrefs)

    for (let i = 0; i < hrefs.length; i++) {
        try {
            await page.goto(hrefs[i]);
            console.log('goto:', hrefs[i])
        } catch {
            console.log('error getting to ', hrefs[i])
        }
    }

    await page.close();
    await browser.close();
})();
```

How to change the size of recorded video, set size:

```js
 const context = await browser.newContext({
        viewport: { width: 1240, height: 600 },
        deviceScaleFactor: 1,
        recordVideo: {
            dir: 'videos/',
            size: { width: 1240, height: 600 },
        }
    });
```

<!-- www.x.com -->

<!-- <img src="/assets/video-recording-playwright.jpg"> -->

## Result
*(using example.com as start page)*
 
<video width="640" height="300" controls>
  <source src="/assets/video-playwright.webm" type="video/webm">
  <source src="/assets/video-playwright.mp4" type="video/webm">

  
</video>


