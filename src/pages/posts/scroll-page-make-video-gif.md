---
id: 18
draft: false
layout: "../../layouts/BlogPost.astro"
title: "Smooth scroll a page and make a video or animated gif"
description: 'How to scroll to bottom of a page with smooth scroll. Create video/animated gif of the page.'
publishDate: "11 Jul 2022"
heroImage:
  src: "https://images.unsplash.com/photo-1641141109253-6c1fc4f53e66?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=420&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1OTY4Mjc2OA&ixlib=rb-1.2.1&q=80&w=840"
  alt: "Smooth scrolling to end of page and exit Playwright function"
---

On Apify there is task to create an animated gif scrolling through a webpage, the 'GIF Scroll Animation'. Apify uses headless browsers to automate and create these tasks. 
Thought it would be nice to see if that can be recreated with Playwright.

Steps to create video / animated gif of a scrolling webpage:
- open a browser
- <a href="/blog/use-cookies-accept-consent">adding cookies</a> (optional, if there is a cookie consent popup)
- set config for video
- visit url
- wait for url to load 
- smooth scroll through the end of the page
- record video and close page.
- convert webm to gif

## Smooth scroll to bottom
The first steps are obvious and can be done easily. I had some difficulty finding a script which smooth scrolls to the end of the webpage. Most scripts jump by an x amount of pixels every x seconds, which is not very smooth. 'Window.scrollby' solved the first problem. 

## Execute javascript in browser
For the script to run in the browser and not in Node I had use 'page.evaluate'. My main struggle became waiting for the 'smooth scroll' script to finish before exiting the browser.

## Waiting for a script to finish in Playwright
It turns out you have to set a promiss and wait for it to complete. After the job returns the promiss the script continues with the next step in the script *(in example script 'console.logging different values' and closing tab and closing browser)*. 

In the process of creating the script many possible solutions were tested, but they all failed.
- In one attempt I injected a smooth scroll script in the head, and injected html with an anchor link at the top of the page which would link to a target, in also, injected html at the bottom of the page. Don't know why this didn't work, maybe because of shadow DOM. 
- I tried to use 'page.waitForFunction' but also no luck.
- Using a Promiss.race also did not do the job for me. 
- At one time I thought that adding an event in the page(which triggers at the bottom of the page), and than waiting for it would do the trick, but that doesn't seem to be possible right now.


## Playwright smooth scroll script to go to the end of a page
I added cookies for accepting the cookie consent on Essent.nl and on Vercel.com.

```js
// @ts-checkNOOO

const { chromium } = require('playwright');

(async() => {

    // exported cookies with Edit this Cookie plugin, for accepting cookieconsent. 
    const cookiesArr = [
        // { name: "", value: "", domain: "", path: "" },
        { name: "cookieconsent", value: "3", domain: ".essent.nl", path: "/" },
        { name: "gdprconsent", value: "3", domain: ".essent.nl", path: "/" },
        {
            "domain": "vercel.com",
            "hostOnly": true,
            "httpOnly": false,
            "name": "cconsent",
            "path": "/",
            "sameSite": "Lax",
            "value": "{\"version\":1,\"categories\":{\"Product-Analytics-/-Tracking-Cookies\":{\"wanted\":true},\"Strictly-Necessary-Cookies\":{\"wanted\":true}},\"services\":[\"Product Analytics / Tracking Cookies Cookies\",\"Strictly Necessary Cookies Cookies\"]}",
            "id": 10
        }
    ]

    // Launch browser and set new context with video recording
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1240, height: 800 },
        deviceScaleFactor: 1,
        recordVideo: { dir: 'videos/' }
    });

    // Set Cookies to accept cookieconsent
    await context.addCookies([...cookiesArr])

    const page = await context.newPage();

    // // Go to a url to scroll and record.
    // await page.goto('https://netlify.com'); // fails on animation
    // await page.goto('https://vercel.com');
    // await page.goto('https://www.adobe.com');  
    // await page.goto('https://www.contentsquare.com'); // fails 
    await page.goto('https://www.amazon.com');
    // await page.goto('https://render.com');
    // await page.goto('https://www.essent.nl/klanten/app');

    // // Function, see below
    await autoScroll(page);

    // // Not needed, just some logging of scrollHeight, Innerheight and scrolled pixels.
    const scrollHeight = await page.evaluate(async() => {
        const pageHeight = (document.body.scrollHeight)
        return pageHeight
    })
    console.log('scrollHeight', scrollHeight)

    const wInnerHeight = await page.evaluate(async() => {
        const pageHeight = (window.innerHeight) // 300
            // const pageHeight = (window.clientHeight) // undefined
            // const pageHeight = (document.body.clientHeight)
            // const pageHeight = (document.body.scrollTop)
        return pageHeight
    })
    console.log('window innerHeight', wInnerHeight)

    const scrollY = await page.evaluate(async() => {
        const pageHeight = (window.scrollY)
        return pageHeight
    })
    console.log('window scrollY', scrollY)

    if (((wInnerHeight + scrollY)) >= scrollHeight) {
        console.log('sssheight', scrollHeight)
        console.log('scrollY', scrollY)
        console.log('windowInnerHeight', wInnerHeight)
    }

    // Close page and close browser.
    await page.close();
    await browser.close();

})();

async function autoScroll(page) {
    await page.evaluate(async() => {
        return await new Promise((resolve, reject) => {

            const docLenght = document.body.scrollHeight
            console.log(docLenght)

            var x = 0;
            var intervalID = setInterval(function() {

                window.scrollBy(docLenght, 1);

                if (++x === docLenght) {
                    window.clearInterval(intervalID);
                    resolve()
                }
            }, 1);

        });
    });
}
```

## Results
*Webm video using you.com as page to scroll:*
 
<video width="600" height="300" controls loop autoplay>
  <source src="/assets/you-dot-com.webm" type="video/webm">
  <!-- <source src="/assets/video-playwright.mp4" type="video/webm"> -->
 
</video>
(Filesize: 1.353 MB)

*Animated gif of scrolling you.com :*
<img src="/assets/you-dot-com.gif" width="600" height="300">
using 'https://cloudconvert.com/webm-to-gif' to convert webm to gif.
(Filesize: 5.147 MB)


Animated gif of scrolling page made with Apify Actor:
<img src="/assets/blog/you.com-scroll_original-apify.gif" width="600" height="300">
(Without any compression, filesize: 614kB, with a framerate of 15)

## Notes
- Apify has animated .gif as output
- Playwright script has .webm as output, you have to convert it to gif
- The script has no options to tune the speed of scrolling, Apify has setting to set a framerate(although a high framerate scrolls really fast)
- The script does not optimize file size
- The video generated with the script starts with blank page, you might need to edit/cut it from the video with video editing software
- Apify has option to click on a link, it has a cookie accept option, it has the option to scroll a specific percentage of the page and it has some waiting options
- On urls with animations the script has difficulties, don't know why but white elements appear during scrolling or the scrolling ends after a few seconds


## Some of the code that did not work ;-(

```js
 // await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/smoothscroll/1.4.10/SmoothScroll.min.js' });
    // await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll/dist/smooth-scroll.polyfills.min.js' });

    await page.evaluate(async() => {
        const selector = 'body'
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `<div style='
        background:red;
        color:white;
        z-index:9999999; 
        width:400px; 
        height:200px; 
                            '>
                                <a data-scroll href="#bazinga">Anchor Link</a>
                            </div>`;

        const currentDiv = document.querySelector(selector);
        currentDiv.prepend(newDiv);
    });


    await page.evaluate(async() => {
        const selector = 'body'
        const newEndDiv = document.createElement("div");
        newEndDiv.innerHTML = `<div style='
                                    background:red;
                                    color:white;
                                    z-index:9999999; 
                                    width:400px; 
                                    height:200px; 
                            '>
                            <div id="bazinga">Bazinga!</div>

                            </div>`;

        const currentDiv = document.querySelector(selector);
        currentDiv.append(newEndDiv);
    });


    // const watchDog = page.waitForFunction({
    //     pageScroll() {
    //         window.scrollBy(0, 1);
    //         scrolldelay = setTimeout(pageScroll, 1);
    //         // new Promise((scrolldelay) => setTimeout(scrolldelay, 1));
    //         // scrolldelay = new Promise(resolve => setTimeout(resolve, pageScroll, 1));
    //     }
    // })
    // await watchDog;

        // await page.addInitScript(() => {
    //     window.SmoothScrollOptions({ keyboardSupport: false, animationTime: 12400, stepSize: 100 })
    // })
```
