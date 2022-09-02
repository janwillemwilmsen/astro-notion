---
id: 3
layout: "../../layouts/BlogPost.astro"
title: "404 check, check for broken links and see redirect chain"
description: 'How to get statuscodes for links on a page with Playwright'
publishDate: "11 Jul 2022"
heroImage:
  src: "/assets/blog/introducing-astro.jpg"
  alt: "404 and redirects in Playwright"
---

Links are a fundamental part of the web. As websites change broken links become an inherent part of it.

Redirects on old urls prevent users getting 404's and tell Google the new url. Good as a short term solution, but for the long run cleaning up redirects and removing links to old urls is better. 

### How to find 404's and redirects with Playwright? 
With Playwright its possible to scrape all the links on a page. Looping through the links and checking the statuscodes can give insights on which link is broken en which link is redirected.






```js
const { chromium } = require('playwright-chromium');

(async() => {
    const browser = await chromium.launch({ headless: false, slowMo: 1050 });
    const page = await browser.newPage();
    await page.goto('https://playwright.dev');

    const hrefs = await page.evaluate(() => {
        return Array.from(document.links).map(item => item.href);
    });
    console.log(hrefs)

    for (let i = 0; i < hrefs.length; i++) {

        try {
            const response = await page.goto(hrefs[i]);

            for (let request = response.request(); request; request = request.redirectedFrom()) {
                console.log((await request.response()).status(), request.url())
            }

        } catch {
            console.log('no errorcode, offline?, check url:', hrefs[i])
        }

    }

    await page.close();
    await browser.close();
})();
```

## Results
Scanning the Playwright.dev homepage gave the following result:<br>
*(No 404's and only external urls that redirect)*
<img src="/assets/404-broken-link-and-redirect-chain.jpg">

## Most common statuscodes


| **Code** | **Meaning**                        |
|----------|------------------------------------|
| 1xx      | Informational/temporary statuscode |
| 2xx      | Great, succes!                     |
| 200      | OK                                 |
| 3xx      | Redirecting                        |
| 301      | Permanent redirect                 |
| 302      | Temporary redirect                 |
| 4xx      | Client error                       |
| 400      | Bad request                        |
| 401      | Unauthorized                       |
| 403      | Forbidden                          |
| 404      | Not found                          |
| 410      | Gone                               |
| 5xx      | Server error                       |
| 500      | Internal server error              |
| 502      | Bad gateway                        |
| 503      | Service unavailable                |

## Notes:
- *To do : only use internal links in the linkchecker*
- *To do : make it a multipage checker, so you can input a sitemap with multiple urls*
- Code is loosly based on this issue: https://github.com/microsoft/playwright/issues/6848
- Docs : https://playwright.dev/docs/api/class-request#request-redirected-from
- I could not get this to work : https://github.com/microsoft/playwright/issues/11698
- I could not save the data to a file, if you can, let me know. 
- With Typescript turned on errors appear. But script still works. 
- Use <a href="https://httpstatus.io/" target="_blank">https://httpstatus.io/</a> to see statuscode en redirects for one or more urls. 
- Sometime the scripts get blocked by cookiepopup. <a href="/posts/use-cookies-accept-consent">Find the cookies to accept the popup and set them in the script</a>, or try to block the script that sets the cookiepop.
- No guarantees ;-)