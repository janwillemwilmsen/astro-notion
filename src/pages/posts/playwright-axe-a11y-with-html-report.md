---
id: 23
draft: true
layout: "../../layouts/BlogPost.astro"
title: "Do an AXE Accessibility check in Playwright - and show output in HTML report"
description: 'How to : A11Y url scan with Axe and Playwright'
publishDate: "11 Jul 2022"
heroImage:
  src: "https://images.unsplash.com/photo-1588362951121-3ee319b018b2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=420&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1OTY4Mjc2OA&ixlib=rb-1.2.1&q=80&w=840"
  alt: "Use Playwright to test websites for A11Y issues with Axe Core and the Axe HTML Reporter"
---

Axe-core is a module which checks and tests webpages for accessibility. 
The module is open-source. It is used in many applications, like Lighthouse, but also can be run separate.


Besides Playwright the only extra module is 'Axe Html Reporter'. The Axe-Core script can be called from a CDN link. 


install axe-html-reporter:
```js
npm i -D axe-html-reporter
```

## Steps
- create script 'axe-run.js' 
- import required modules
- define url to check
- set 'PROJECT NAME' and output filename and directory if you want
- the 'Axe-Core' script checks html elements and writes a json file with results
- the 'Axe-HTML-reporter' uses the json files and presents the data in easy and more usable format
- errors will also be logged to the terminal


## Single Axe Report 
```js
import { chromium } from 'playwright';
import { createHtmlReport } from 'axe-html-reporter';
import { writeFileSync, readFileSync } from 'fs';

const url = 'https://www.essent.nl/klanten/app'
const filename = "axe-run.json";

(async() => {

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({});

    const page = await context.newPage();
    await page.goto(url);

    await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/3.3.2/axe.min.js' });
    const results = await page.evaluate(() => axe.run(document));

    if (results.violations.length > 0) {
        console.log(`Found ${results.violations.length} accessibility violations`);
        console.log(results.violations);
    }

    console.log('res', results);
    writeFileSync('axe-reports/' + filename, JSON.stringify(results));

    (() => {
        const rawAxeResults = JSON.parse(readFileSync('axe-reports/axe-run.json', 'utf8'))
        createHtmlReport({
            results: rawAxeResults,
            //options available to further customize reports
            options: {
              // Set a Projectname, output directory name and filename if you want:
                // projectKey: 'PROJECT_NAME',
                outputDir: 'axe-reports',
                reportFileName: 'exampleReport.html',
            }
        });
    })();


    await page.close();
    await browser.close();
})();
```

## Results of the AXE Accessibility Scan with HTML Report

After running 'node axe-run' in the terminal Playwright will visit the defined url, test the website for accessibility issues.
In the '/axe-reports/' folder two files will be created. 
- A json file with issues in json format. Not easy to understand and make sense of.
- An HTML file, in example 'exampleReport.html'

If you open the exampleReport.html in a browser you should se a visual representation of all the issues on the page.
The number of issues will show the number of violations, and show a list of all the types of violations.

<img src="/assets/axe-html-report.png"></img>


### Possible issues
Sometimes website block injected scripts. The 'Content Security Policy' doesn't allow files from hostnames/domains which aren't whitelisted. 
<a href="/blog/add-script-playwright">Inlining a script</a> will solve this issue. See <a href="/blog/playwright-accessibility-multiple-urls">Axe scan multiple urls</a> how inline script example. 