---
id: 4
layout: "../../layouts/BlogPost.astro"
title: 'How to loop through multiple pages with Playwright'
description: 'Test and crawl through multiple pages. Use arry of urls to loop and rerun the script. Explanation.'
publishDate: "11 Jul 2022"
heroImage:
  src: "https://source.unsplash.com/gySMaocSdqs/840x420"
  alt: "Run a script for multiple urls"
---

# How to loop through multiple pages and urls with Playwright
 

## From Playwright.dev 

```js
const { chromium } = require('playwright');  // Or 'firefox' or 'webkit'.

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (let currentURL of ['https://google.com', 'https://bbc.com']) {
    await page.goto(currentURL);
    const element = await page.waitForSelector('img');
    console.log('Loaded image: ' + await element.getAttribute('src'));
  }
  await browser.close();
})();
```

