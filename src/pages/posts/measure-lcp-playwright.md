---
id: 4
layout: "../../layouts/BlogPost.astro"
title: 'Measure LCP on multiple urls in Playwright'
description: 'How to loop through multiple url, multiple times to calculate the LCP / Largest Contenful Paint'
publishDate: "11 Jul 2022"
heroImage:
  src: "https://source.unsplash.com/gySMaocSdqs/"
  alt: "Space shuttle leaving curved trail in the sky 12"
---

The LCP of a page is the metric which tells you how long the largest element (image, video, text) in the viewport takes to load in milliseconds.

It represent the loading performance of the page. 
- Ideally this metric should be below 2.5 seconds.
- If the value is between 2.5 and 4 seconds it needs improvement.
- Above 4 sec is just poor.

The LCP is a part of the Core Web Vitals. The Web Vitals are ranking factors in Google search. 



### Measuring multiple urls
Measuring single urls is a tedius job. You can automate that ;-)<br>
To minimize outliers, a couple of reruns on the same url can help and give extra confindence. As it turns out duplicating an array in javascript with json string values is pretty easy. 

### Loop urls and measure LCP
The steps in the script below:
- Set required imports
- Optionally set cookies 
- Add urls in array, the value is the number of reruns
- Set filename for the results(in JSON format)
- Loop launch browser and visit urls and measure LCP. **If the url in the array does not match the actual url no value will be recorded.**
- Push values in Array, console log them and save in json output file.

```js
const playwright = require('playwright-chromium');
const fs = require('fs');

// optional : set cookies to bypass Cookieconsent
const cookiesArr = [
    // { name: "", value: "", domain: "", path: "" },
]

// urls to be tested. Make sure urls are valid (with or without www, and possible params)
const siteList = [
    { site: "https://www.google.nl/", "value": 2 },
    { site: "https://www.bing.com/?cc=nl", "value": 2 },
    { site: "https://volkskrant.nl", "value": 2 },
];

// Copy siteList entries. Change 'value' in siteList array to multiply the number of runs a url should be tested.
const siteListDuplicated = siteList.flatMap((el) => new Array(el.value).fill(null).map(e => ({...el })))

// Filename for output:
const filename = "lcp-run.json";

const siteLoop = async() => {

    // Set empty array
    const lcpdata = []

    for (const url of siteListDuplicated) {

        console.log('Visit:', url.site)
        goToUrl = url.site

        const browser = await playwright.chromium.launch({ headless: true });
        const context = await browser.newContext({});

        // await context.addCookies([...cookiesArr])

        const page = await context.newPage({});;

        await page.setViewportSize({
            width: 1240,
            height: 600,
        });

        try {
            await page.goto(goToUrl);

            // Test if actual url matches the siteList urls. In case url is redirected to some other url.
            const url = await page.url();
            console.log(url)

            if (url !== goToUrl) {
                console.log('break because actual url is different from input url')
                lcpdata.push({
                    site: 'redirectedUrl',
                    lcp: 'changeTheUrlToMatch'
                });
                await browser.close();
            } else {
                // Actual url matches the url provided in siteList
                // https://www.checklyhq.com/learn/headless/basics-performance/
                const largestContentfulPaint = await page.evaluate(() => {
                    return new Promise((resolve) => {
                        new PerformanceObserver((l) => {
                            const entries = l.getEntries()
                                // the last entry is the largest contentful paint
                            const largestPaintEntry = entries.at(-1)
                            resolve(largestPaintEntry.startTime)
                        }).observe({
                            type: 'largest-contentful-paint',
                            buffered: true
                        })
                    })
                })

                // Push urls and results in array
                lcpdata.push({
                    site: goToUrl,
                    lcp: parseFloat(largestContentfulPaint)
                });

                console.log('LCP:', parseFloat(largestContentfulPaint))

                await page.close()
                await browser.close();
            }

        } catch {
            await page.goto('https://i.stack.imgur.com/6M513.png')
        }
    }

    console.log(lcpdata)
    fs.writeFileSync(filename, JSON.stringify(lcpdata));
}

siteLoop(siteList)
```


### The result
The json in the output after running the script:
(lcp in milliseconds)

```json
[
	{
		"site": "https://www.google.nl/",
		"lcp": 1150.15
	},
	{
		"site": "https://www.google.nl/",
		"lcp": 1142.099
	},
	{
		"site": "https://www.bing.com/?cc=nl",
		"lcp": 1284.594
	},
	{
		"site": "https://www.bing.com/?cc=nl",
		"lcp": 1272.564
	},
	{
		"site": "redirectedUrl",
		"lcp": "changeTheUrlToMatch"
	},
	{
		"site": "redirectedUrl",
		"lcp": "changeTheUrlToMatch"
	}
]
```