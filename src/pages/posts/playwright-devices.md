---
id: 16
layout: "../../layouts/BlogPost.astro"
title: "Test websites in different devices with the Playwright device list"
description: 'How to emulate different devices in Playwright '
publishDate: "11 Jul 2022"
heroImage:
  src: "/assets/blog/introducing-astro.jpg"
  alt: "Test your website in different devices with Playwright"
---

Playwright offers functionality which lets you test your website in many different devices.
The list with possible devices is available in the Microsoft/Playwright Github repo. 

The list is here : <a href="https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json"> https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json</a>.

Its possible to test mobile devices like 
- Blackberry
- Samsung Galaxy
- iPad
- iPhone
- LG
- Kindle
- Microsoft Lumia
- Android / Nexus
- Nokia
- Pixel
- Moto

Most devices offer two orientations(Portrait or Landscape). 
Laptops with high-resolution are also available.


### Emulate iPhoneX, Iphone 12, iPhone 13, or Samsung devices
To test websites in different devices you can import the device list from your local code, or you can inline a part from the devicelist, like in the following example. The code generates screenshots of Amazon.com **for every device** in the testDevices list(change edit at your own need). The screenshots are saved in the 'devices' directory.


```js
const { chromium, devices } = require('playwright-chromium');

const testDevices = {
    /////// REMOVE/UPDATE/CHANGE/PASTE DEVICES from 'Playwright device list' BELOW :
    "iPhone 13 Pro": {
        "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        "screen": {
            "width": 390,
            "height": 844
        },
        "viewport": {
            "width": 390,
            "height": 664
        },
        "deviceScaleFactor": 3,
        "isMobile": true,
        "hasTouch": true,
        "defaultBrowserType": "webkit"
    },
    "iPhone 13 Pro landscape": {
        "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        "screen": {
            "width": 390,
            "height": 844
        },
        "viewport": {
            "width": 750,
            "height": 342
        },
        "deviceScaleFactor": 3,
        "isMobile": true,
        "hasTouch": true,
        "defaultBrowserType": "webkit"
    },
    "iPhone 13 Pro Max": {
        "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        "screen": {
            "width": 428,
            "height": 926
        },
        "viewport": {
            "width": 428,
            "height": 746
        },
        "deviceScaleFactor": 3,
        "isMobile": true,
        "hasTouch": true,
        "defaultBrowserType": "webkit"
    },
    "iPhone 13 Pro Max landscape": {
        "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        "screen": {
            "width": 428,
            "height": 926
        },
        "viewport": {
            "width": 832,
            "height": 380
        },
        "deviceScaleFactor": 3,
        "isMobile": true,
        "hasTouch": true,
        "defaultBrowserType": "webkit"
    },
    "iPhone 13 Mini": {
        "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        "screen": {
            "width": 375,
            "height": 812
        },
        "viewport": {
            "width": 375,
            "height": 629
        },
        "deviceScaleFactor": 3,
        "isMobile": true,
        "hasTouch": true,
        "defaultBrowserType": "webkit"
    },
    "iPhone 13 Mini landscape": {
        "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        "screen": {
            "width": 375,
            "height": 812
        },
        "viewport": {
            "width": 712,
            "height": 327
        },
        "deviceScaleFactor": 3,
        "isMobile": true,
        "hasTouch": true,
        "defaultBrowserType": "webkit"
    }
    //// END OF Playwright DEVICELIST. Edit list items above this line, not below.
}


const desireArray = Object.keys(testDevices).map((key) => ({ devi: key, ...testDevices[key] }));
// console.log(desireArray)

const deviceloop = (async() => {


    for (let deviceItem of desireArray) {

        devi = deviceItem.devi
        console.log(devi)

        const browser = await chromium.launch({ headless: false, slowMo: 250 });
        let deviceItems = devices[devi];

        const context = await browser.newContext({
            ...deviceItems,
        });

        const page = await context.newPage();

        const goToUrl = 'https://amazon.com/'
        await page.goto(goToUrl);
  
        const slugify = str =>
            str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');


        const fileName = slugify(devi) + '-' + slugify(goToUrl)

        await page.screenshot({ path: `./devices/` + fileName + '.jpeg', fullPage: true, quality: 30, type: 'jpeg' });

        await browser.close();
    }
});

deviceloop();
````

If images are missing in the screenshots, take a look at <a href="/posts/screenshot-page-lazy-loaded-images">fullpage screenshots with lazy loaded images</a>.