---
id: 12
layout: "../../layouts/BlogPost.astro"
title: "Block image, scripts with ads or other resources"
description: 'How to block scripts and resources to increase speed of scraping and testing'
publishDate: "11 Jul 2022"
heroImage:
  src: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=420&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1OTY4Mjc2OA&ixlib=rb-1.2.1&q=80&w=840"
  alt: "Block resource Playwright"
---

All the network traffic that is send from the browser to the server (and vice versa) is logged. Just like in the browser console, Playwright logs all network traffic. You can see all the requests and responses with it.  

You can log traffic on Content or as Page event. 

### Block and abort resources and network traffic
Blocking specific resources or multiple reourcetypes can speed up crawling and also mitigate unwanted traffic/hits in your analytics.
Requests can be blocked and aborted based on resourcetype or url. These types can be blocked:
- **document** 
- **stylesheet** (.css)
- **image** (.png, .svg, .jpg, .jpeg etc)
- **media** (.mp4, .webm etc)
- **font** (.woff, .woff2, .ttf etc )
- **script** (.js)
- **texttrack** (describes media, used for example to add captions and language)
- **xhr** (XMLHttpRequest, send network requests between browser/server)
- **fetch** (for fetching resources)
- **eventsource** (server-sent events)
- **websocket** (2-way communication protocol between browser and server)
- **manifest** (json file, used to create Progressive Web App, contains metadata about the site)
- **other** (?)

In the script below two Playwright browsers are lauched. For both browsers the network traffic is logged. See **'output-allow.txt'** or **'output-disallow.txt'** after the script has been executed.

- In the first browser no traffic is blocked, and all traffic is logged. 
- Examples of logging network traffic based on Statuscode or on 'failed' is in the first browserinstance. Uncomment and run script to see results in console or output file.
- In the second browser instance traffic is blocked and aborted on different rules:
    - based on resource type
    - based on multiple specific urls  
    - based on resource types(in array) 
    - based on resource url that 'Starts with' a specific string




```js
const playwright = require('playwright-chromium');
const fs = require('fs');
let writeStreamAllow = fs.createWriteStream('output-allow.txt');
let writeStreamDisAllow = fs.createWriteStream('output-disallow.txt');

(async() => {
    const goToUrl = 'https://vercel.com'
    const browser = await playwright.chromium.launch({ headless: false, slowMo: 1050 });
    const context = await browser.newContext();
    const page = await context.newPage();

    // // Log requests and resonses on page event:
    // writeStreamAllow.write(">>: REQUESTS + RESPONSES \r\n");
    // page.on('request', req => console.log(`>>: ${req.method()} - ${req.resourceType()} - ${req.url()}`))
    // page.on('request', req => writeStreamAllow.write(`>>: ${req.method()} - ${req.resourceType()} - ${req.url()}` + "\r\n"));

    page.on('response', res => console.log(`<< : ${res.status()} - ${res.url()} `))
    page.on('response', res => writeStreamAllow.write(`<< : ${res.status()} - ${res.url()} ` + "\r\n"))

    // // Log responses if the have a Statuscode of 200 or higher:
    // page.on('response', response => {
    //     if (response.status() > 200) {
    //         console.log("Status if 200 or higher << : " + response.status() + " " + response.statusText() + " " + response.url());
    //     }
    // });

    // // Write responses if the have a Statuscode of 200 or higher ('output-allow.txt'):
    // page.on('response', response => {
    //     if (response.status() > 200) {
    //         writeStreamAllow.write(`Status if 200 or higher << :  ${response.status()} -  ${response.statusText()} -  ${response.url()}` + "\r\n");
    //     }
    // });

    // // Log failed requests
    // page.on('requestfailed', request => {
    //     console.log("RequestFailed >> : " + request.url() + ' ' + request.failure().errorText);
    // });

    // // Write failed network requests in 'output-allow.txt'
    // page.on('requestfailed', request => {
    //     writeStreamAllow.write(`RequestFailed >> : ${request.url()} - ${request.failure().errorText}` + "\r\n");
    // });

    // // Log + write requests made in the context:
    // // Log and continue all network requests
    // context.route('**', (route, request) => {
    //     console.log(' >> ', request.url());
    //     route.continue();
    //     writeStreamAllow.write(`REQUEST >> TYPE:  ${request.resourceType()} - URL: ${request.url()} ` + "\r\n");
    // });

    await page.waitForTimeout(1500);
    await page.goto(goToUrl);
    await page.waitForTimeout(1500);

    await browser.close();

    ///////////////////////////////////////////////////////////////////////////////
    // // 2ND page --> 'page2' 'context2' 
    ///////////////////////////////////////////////////////////////////////////////

    const browser2 = await playwright.chromium.launch({ headless: false, slowMo: 1050 });
    const context2 = await browser2.newContext();
    const page2 = await context2.newPage();

    // Abort routes based on the request type of image
    // await page2.route('**/*', route => {
    //     return route.request().resourceType() === 'image' ?
    //         route.abort() : route.continue();
    // });

    // // Abort/Block specific resources
    const BLOCKED_RESOURCES = [
        "https://cdn.ethyca.com/org/oueOVtbEu9DiFVB06nsApzwM2Dcx1DOHdf0gyahrE%3D/cookie.js",
        "https://vercel.com/api/show-banner"
    ]

    // await page2.route("**/*", (request) => {
    //     BLOCKED_RESOURCES.includes(request.request().url()) ?
    //         request.abort() :
    //         request.continue();
    //     return;
    // });

    // // BLOCK Resource Types
    const BLOCKED_TYPES = ['font', 'other'];
    // const BLOCKED_TYPES = ['image', 'stylesheet', 'script', 'font', 'other'];

    // await page2.route('**/*', (route) => {
    //     BLOCKED_TYPES.includes(route.request().resourceType()) ?
    //         route.abort() :
    //         route.continue();
    //     return;
    // });

    // // Block resources starting with 
    await context2.route("**/*", (request) => {
        request.request().url().startsWith("https://www.datadoghq-browser") ?
            request.abort() :
            request.continue();
        return;
    });

    // // LOG Responses from server (in console and in file : 'output-disallow.txt'):
    page2.on('response', res => console.log(`<< : ${res.status()} - ${res.url()} `))
    page2.on('response', res => writeStreamDisAllow.write(`<< : ${res.status()} - ${res.url()} ` + "\r\n"))

    await page2.waitForTimeout(1500);
    await page2.goto(goToUrl);
    await page2.waitForTimeout(1500);

    await browser2.close();
})();
```

### Notes
- Maybe blocking resources via 'Chrome Developer Protocol' / CDP is also possible, like in this script: https://github.com/itsjafer/airline-scraper/blob/main/alaska.js


*at top of the script*

```js
const BLOCKED_RESOURCES = [
  "*/favicon.ico", ".css", ".jpg", ".jpeg", ".png", ".svg", ".woff",
  "*.optimizely.com", "everesttech.net", "userzoom.com", "doubleclick.net", "googleadservices.com", "adservice.google.com/*",
  "connect.facebook.com", "connect.facebook.net", "sp.analytics.yahoo.com"]
```

*after 'page'*

```js
  const client = await page.context().newCDPSession(page);
  await client.send("Network.setBlockedURLs", { urls: BLOCKED_RESOURCES })
  ```