---
id: 6
layout: "../../layouts/BlogPost.astro"
title: 'Measure Cumulative Layout Shift for multiple urls'
description: 'How to calculate Cumulative Layout Shift for multiple urls, with Playwright.'
publishDate: "11 Jul 2022"
heroImage:
  src: "https://source.unsplash.com/gySMaocSdqs/"
  alt: "Cumulative Layout Shift loop through multiple urls, multiple times"
---

The CLS, or **Cumulative Layout Shift**, is a metric which defines how visual stable a webpage is. 

Fonts, ads or images might change size after they are done loading causing a change in the page layout. Shifting content is annoying for users and therefor it should be minimized.

The CLS is part of the Web Vitals, Web Vitals are a set of metrics which describe the quality of a webpage. Besides shifting elements(CLS) the following metrics are an important part: 
- LCP : Time needed for <a href="/posts/measure-lcp-playwright">loading of the largest element</a> on the page and
- FID : First Input delay, how fast a page is responding to user input.
*The FID is based an actual usage by visitors with real devices of pages. Total Blocking Time (TBT) is used as an alternative way to test the responsiveness.*
 
### Measure 'CLS' with Layout Instability API
The following script calculates the CLS of multiple urls, it reruns urls a couple of times. Metrics might be inacurate because it cannot measure shifts in iframes, pages that are in cache, or preloaded. 

## Good CLS
- Below 0.1 = good
- Between 0.1 and 0.25 = needs improvement
- Above 0.25 = Poor

### The steps to get CLS
- import required modules
- optionally set cookies
- set urls to test + set number of reruns(value)
- set filename for output in Json format
- Check if actual url is in the configured url-list (if url is redirected, no value will be calculated)
- Save data in array, log data and save data to output file 

```js
const playwright = require('playwright-chromium');
const fs = require('fs');

// optional : set cookies to bypass Cookieconsent
const cookiesArr = [
    // { name: "", value: "", domain: "", path: "" },
]

// urls to be tested. Make sure urls are valid (with or without www, and possible params)
const siteList = [
    // { site: "https://www.amazon.com/", "value": 3 },
    { site: "https://www.essent.nl/", "value": 3 },
    // { site: "https://www.vattenfall.nl/", "value": 3 },
    // { site: "https://www.bing.com/?cc=nl", "value": 3 },
    // { site: "https://volkskrant.nl", "value": 2 },
];

// Copy siteList entries. Change 'value' in siteList array to multiply the number of runs a url should be tested.
const siteListDuplicated = siteList.flatMap((el) => new Array(el.value).fill(null).map(e => ({...el })))

// Filename for output:
const filename = "cls-run.json";

const siteLoop = async() => {

    // Set empty array
    const clsdata = []

    for (const url of siteListDuplicated) {

        console.log('Visit:', url.site)
        goToUrl = url.site

        const browser = await playwright.chromium.launch({ headless: true });
        const context = await browser.newContext({});

        // await context.addCookies([...cookiesArr])

        const page = await context.newPage({});;

        // Desktop
        await page.setViewportSize({
            width: 1920,
            height: 1080,
        });

        try {
            await page.goto(goToUrl);

            // Wait a second // May use this for scrolling to bottom of the page
            await page.waitForTimeout(1500);

            // await page.evaluate(async() => {
            //     window.scrollTo(0, document.body.scrollHeight / 8);
            // })
            // await page.waitForTimeout(1500);

            // await page.evaluate(async() => {
            //     window.scrollTo(0, document.body.scrollHeight / 6);
            // })
            // await page.waitForTimeout(1500);

            // await page.evaluate(async() => {
            //     window.scrollTo(0, document.body.scrollHeight / 4);
            // })
            // await page.waitForTimeout(1500);

            // await page.evaluate(async() => {
            //     window.scrollTo(0, document.body.scrollHeight / 2);
            // })
            // await page.waitForTimeout(1500);

            // Test if actual url matches the siteList urls. In case url is redirected to some other url.
            const url = await page.url();
            console.log(url)

            if (url !== goToUrl) {
                console.log('break because actual url is different from input url')
                clsdata.push({
                    site: 'redirectedUrl',
                    cls: 'changeTheUrlToMatch'
                });
                await browser.close();
            } else {
                // Actual url matches the url provided in siteList
                // https://www.checklyhq.com/learn/headless/basics-performance/
                const cummulativeLayoutShift = await page.evaluate(() => {
                    return new Promise((resolve) => {
                        let CLS = 0


                        // Old CLS function
                        // new PerformanceObserver((l) => {
                        //     const entries = l.getEntries()

                        //     entries.forEach(entry => {
                        //         if (!entry.hadRecentInput) {
                        //             CLS += entry.value
                        //         }
                        //     })

                        //     resolve(CLS)
                        // }).observe({
                        //     type: 'layout-shift',
                        //     buffered: true
                        // })

                        // END Old CLS calculation

                        // NEW CLS start
                        let clsValue = 0;
                        let clsEntries = [];

                        let sessionValue = 0;
                        let sessionEntries = [];

                        new PerformanceObserver((entryList) => {
                            for (const entry of entryList.getEntries()) {
                                // Only count layout shifts without recent user input.
                                if (!entry.hadRecentInput) {
                                    const firstSessionEntry = sessionEntries[0];
                                    const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

                                    // If the entry occurred less than 1 second after the previous entry and
                                    // less than 5 seconds after the first entry in the session, include the
                                    // entry in the current session. Otherwise, start a new session.
                                    if (sessionValue &&
                                        entry.startTime - lastSessionEntry.startTime < 1000 &&
                                        entry.startTime - firstSessionEntry.startTime < 5000) {
                                        sessionValue += entry.value;
                                        sessionEntries.push(entry);
                                    } else {
                                        sessionValue = entry.value;
                                        sessionEntries = [entry];
                                    }

                                    // If the current session value is larger than the current CLS value,
                                    // update CLS and the entries contributing to it.
                                    if (sessionValue > clsValue) {
                                        clsValue = sessionValue;
                                        clsEntries = sessionEntries;

                                        // Log the updated value (and its entries) to the console.
                                        console.log('CLS:', clsValue, clsEntries)
                                    }
                                    resolve(clsValue, clsEntries)
                                }
                            }
                        }).observe({ type: 'layout-shift', buffered: true });
                        // NEW end




                    })
                })

                console.log('CLS:', parseFloat(cummulativeLayoutShift))
                    // Push urls and results in array
                clsdata.push({
                    site: goToUrl,
                    cls: parseFloat(cummulativeLayoutShift)
                });


                await page.close()
                await browser.close();
            }

        } catch {
            await page.goto('https://i.stack.imgur.com/6M513.png')
        }
    }

    console.log(clsdata)
    fs.writeFileSync(filename, JSON.stringify(clsdata));
}

siteLoop(siteList)
```


### The result
The json in the output after running the script:

```json
[
	{
		"site": "https://www.amazon.com/",
		"cls": 0.046417420340501794
	},
	{
		"site": "https://www.amazon.com/",
		"cls": 0.04189639883512544
	},
	{
		"site": "https://www.bing.com/?cc=nl",
		"cls": 0.00009983445335922594
	},
	{
		"site": "https://www.bing.com/?cc=nl",
		"cls": 0.00009983445335922594
	},
	{
		"site": "redirectedUrl",
		"cls": "changeTheUrlToMatch"
	},
	{
		"site": "redirectedUrl",
		"cls": "changeTheUrlToMatch"
	}
]
```

## Notes
- Measuring CLS with Playwright in a 'Lab' environment like setting is not representative for your users. 
- Measuring CLS on page-load without scrolling the page does not take shifting elements below the viewport in account. So LCP is probably not representative for the average CLS for your users. Maybe scrolling to the bottom of the page might help.
- If you want to compare the CLS calculated with this script, with the CLS calculated in the <a href="https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma">Web Vitals</a> Chrome browser plugin make sure you have the same Viewport size configured(otherwise calculations will differ).
- Both the 'old' and the 'new' way of calculating the CLS are in the script.
- Running in headless mode will give more consistant results.