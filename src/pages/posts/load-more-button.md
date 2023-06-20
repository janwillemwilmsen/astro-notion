---
id: 2
layout: "../../layouts/BlogPost.astro"
title: "Scrape a page with a 'load more' button"
description: 'Scraping a page with multiple load more buttons'
publishDate: "11 Jul 2022"
heroImage:
  src: "https://images.unsplash.com/photo-1468908627957-7783f0c42edb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=420&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1OTY4Mjc2OA&ixlib=rb-1.2.1&q=80&w=840"
  alt: "Space shuttle leaving curved trail in the sky 12"
---

Scraping a page with a 'Load more' button seems easy. If there is a button to load more content click it, if there is no load more button your are done!


It was harder than I thought. Tried to calculate the height of the page, and matching it to the height of the page after clicking the load more button, did not succeed. 


### Fail & error :-(

````js
let loadMoreBtn = await page.locator('//button[contains(@class, "searchEngineLoadMoreButton")]').isVisible();

let  currentHeight = await page.evaluate('document.body.scrollHeight');
console.log('current height:', currentHeight)

if (loadMoreBtn) {
    console.log('After first click')
    await loadMoreBtn.scrollIntoViewIfNeeded()
    await loadMoreBtn.click()

    // let newHeight;
    let newHeight = await page.evaluate('document.documentElement.scrollHeight');
    console.log('new height:', newHeight)
}

if (newHeight > currentHeight ) {......}
````

Then I tried to use 'If Else' statements to check for the availability of the button, also no luck. Endless trial and error, until I ended up with the script below:

```js
  const { chromium } = require('playwright-chromium');
  const fs = require('fs');

  (async() => {

  const url = 'https://www.gputracker.eu/en/search/category/1/graphics-cards?textualSearch=RX%206800%20xt&onlyInStock=true'

  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const context = await browser.newContext({
      viewport: { width: 1200, height: 1080 },
      deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  await page.goto(url, { timeout: 0, waitUntil: "load" });
  await page.waitForTimeout(500);
  console.log('Go to GPU Tracker');

  let loadMore = true;
  try {
      while (loadMore) {
        // Load more button selector
          const selector = '//button[contains(@class, "searchEngineLoadMoreButton")]';

          await page.$(selector) !== null
          await page.waitForTimeout(500);
          await page.click(selector);

          await page.$(selector) === null

          // Set empty arrays
          myArrayTitles = []
          myArrayPrices = []

          // The elements to scrape:
          const titles = await page.$$eval('//h3', elements => elements.map(el => el.textContent.trim().split('\n')[0]))
          const prices = await page.$$eval("//div[@class[contains(.,'font-weight-bold text-secondary w-100 d-block h1 mb-2')]]", elements => elements.map(el => el.textContent.trim().split('\n')[0]))

          // Push values into arrays
          myArrayTitles.push(String(titles));
          myArrayPrices.push(String(prices));

          const result = titles.map((title, index) => ({ title, price: prices[index] }));

          const gpuscrape = JSON.stringify(result);

          // Write to json output
          const filename = "gpuscrape-result.json";
          fs.writeFileSync(filename, gpuscrape);

      } // end While
  } // end Try
  catch (e) {
      console.log('No more load more');
      await page.waitForTimeout(500);
      await browser.close()
  }

  await page.waitForTimeout(2500);
  await browser.close()
  })()

````

### Running the script
Create new file (loadmore.js ). Copy code, paste code, adjust to your situation. Run 'node loadmore' in the terminal.
<br><br>
The result is a Json file with productnames and prices. Just pretty print the file and it should look like :

````json
[
	{
		"title": "SAPPHIRE Pulse Radeon RX 6800 XT Gaming OC 16G, 16384 MB GDDR6",
		"price": "789 €"
	},
	{
		"title": "XFX Radeon RX 6800XT Speedster SWFT319 CORE GAMING 16GB",
		"price": "826 €"
	},
  ....
````


#### Disclaimer
Don't overload GPU Tracker by running the script endlessly. Use with moderation. The classnames, url might be outdated, use it as guidline and base for your own script. 