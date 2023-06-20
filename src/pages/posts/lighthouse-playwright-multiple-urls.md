---
id: 20
draft: true
layout: "../../layouts/BlogPost.astro"
title: "Run Lighthouse in Playwright - test multiple urls"
description: 'How to scan multiple urls with Lighthouse and Playwright: ✓ SEO ✓ Accessibility ✓ Performance ✓ PWA'
publishDate: "11 Jul 2022"
heroImage:
  src: "https://images.unsplash.com/photo-1617412400335-3823da66e819?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=420&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1OTY4Mjc2OA&ixlib=rb-1.2.1&q=80&w=840"
  alt: "Lighthouse in Playwright"
---

Lighthouse is an open source tool from Google. It enables you to scan a website/url to identify and find opportunities on how to improve the page in question. In the scan modern performance metrics and insights on developer best practices are collected.

## Run Lighthouse on website urls
The purpose of this script is to generate multiple scans in one run. Especially after a site migration this might come in handy because you don't have to scan pages one-by-one. 

### Scoring
Lighthouse scans and scores metrics and elements on a page in **five categories**:
- Performance (How the speed of the website is perceived, how fast the page is responsive to user input, and how visual stable the page is)
- Accessibility (if people with disabilities can use the page/website)
- SEO (if there are technical SEO issues)
- Best practices (common and expected guidelines are followed)
- PWA (if conditions for installing the website as an 'Web App' are met)

#### Category 1: Performance score
The performance score is currently based on six audits:
- TBT: Total Blocking Time - 30% 
- LCP: Largest Contentful Paint - 25%
- FCP: First Contentful Paint 10%
- SI: Speed Index - 10%
- TTI: Time to Interactive - 10%
- CLS: Cumulative Layout Shift - 10%

Every audit has a weight for which it is used in the total performance score.

#### Category 2: Accessibility score
The accessibility scan uses the Axe Accessibility Testing engine. Axe helps you identify issues with the accessibility of a page. It checks all html elements on a page and checks if the element is correct according to the WCAG guidelines. 

If an element is not accessible it doesn't score any points. Axe tests elements used for navigation, if there are ARIA elements, if elements on the page can be seen and translated by screenreaders, if color has enough contrast. If tables and lists can be understood by screenreaders. It also checks if best practices are followed, if videos and audio is embedded correct, and if language is set in the right way.

For more info see : https://web.dev/accessibility-scoring


#### Category 3: SEO score
Except for the 'structured data' check, all checks in the SEO scan get the same amount of points. A check passes or fails, there is no partial pass.
Currently there are 14 checks in three categories:

*Content related:*
- 'hreflang'
- 'meta-description'
- 'document-title'
- 'image-alt'
- 'canonical'
- 'plugins'
- 'link-text'

*Mobile related:*
- 'viewport'
- 'font-size'
- 'tap-targets'

*Crawlability:*
- 'http-status-code'
- 'crawlable-anchors'
- 'is-crawlable'
- 'robots-txt'

#### Category 4: Best Practices
The checks in the Best Practices category are also equally valued, and if checks fails no points are scored.

*Trust & Safety:*
- 'is-on-https'
- 'geolocation-on-start'
- 'notification-on-start'
- 'csp-xss'

*User Experience:*
- 'password-inputs-can-be-pasted-into'
- 'image-aspect-ratio'
- 'image-size-responsive'
- 'preload-fonts'

*Browser Compatibility:*
- 'doctype'
- 'charset'

*General Group:*
- 'js-libraries'
- 'deprecations'
- 'errors-in-console'
- 'valid-source-maps'
- 'inspector-issues'

## Lighthouse tools
Lighthouse is available in the Chrome Developer Tools(and in MS Edge), there is a Lighthouse Chrome plugin and you can use web.dev/measure to scan a webpage with Lighthouse. 

Usually you test on a url by url base. But with a Playwright script you can scan and run multiple scans in one go.  

## Run Lighthouse on multiple urls
- Install Node and install VS Code (or other editor)
- Create a folder folder for your project
- Install Playwright
- Install 'lighthouse' (npm i lighthouse)
- Install 'playwright-lighthouse' (https://www.npmjs.com/package/playwright-lighthouse - npm i playwright-lighthouse)
- Create file (lighthouse.js for example)
- Copy code from below
- Edit urls + edit number of reruns (to run multiple scans per url)
- In Terminal type 'node lighthouse' and press enter
- Wait for terminal to say 'visit : url' etcetera etcetera
- In the '/lighthouse' folder several files with Lighthouse scans will be created
- After the scanning is finished, an 'index.html' will be generated
- Open 'index.html' file by right-clicking and selecting 'Open with Live Server'
- On the left side a list with all the scans is visible. Clicking on one of the links will show the scan on the right side


```js
import { chromium } from 'playwright';
import { playAudit } from 'playwright-lighthouse';
import fs from 'fs';

// optional : set cookies to bypass Cookieconsent
const cookiesArr = [
    // { name: "", value: "", domain: "", path: "" },
]

// urls to be tested. Make sure urls are valid (with or without www, and possible params)
const siteList = [
    // { site: "https://www.nytimes.com/", "value": 1, name: "" },
    // { site: "https://edition.cnn.com/", "value": 1, name: "" },
    // { site: "https://www.playwright.dev/", "value": 2, name: "Playwright.dev" },
    // { site: "https://www.amazon.com/", "value": 2, name: "" },
    // { site: "https://www.essent.nl/", "value": 2, name: "Essent.nl" },
    { site: "https://www.vattenfall.nl/", "value": 1, name: "Vattenfall.nl" },
];

// Copy siteList entries. Change 'value' in siteList array to multiply the number of runs a url should be tested.
const siteListDuplicated = siteList.flatMap((el) => new Array(el.value).fill(null).map(e => ({...el })))

const siteLoop = async() => {

        var startTime = new Date();
        console.log('Start time', startTime)

        let runs = 0
        const lighthouseScans = []

        for (const url of siteListDuplicated) {

            runs = runs += 1
            console.log('RUN :', runs)

            console.log('Visit:', url.site)
            const goToUrl = url.site
            const siteName = url.name

            const browser = await chromium.launch({
                headless: true,
                args: ['--remote-debugging-port=9222'],
            });
            const context = await browser.newContext({});

            // await context.addCookies([...cookiesArr])

            const page = await context.newPage({});;

            // await page.setViewportSize({
            //     width: 1240,
            //     height: 600,
            // });

            try {
                await page.goto(goToUrl);

                // // Test if actual url matches the siteList urls. In case url is redirected to some other url.
                const url = await page.url();
                console.log(url)

                // convert url(slugify) to use as filename
                const slugify = str =>
                    str
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');

                const slugDomain = slugify(goToUrl)

                // use date in the filename:
                let dateObj = new Date();
                let myDate = (dateObj.getUTCFullYear()) + "-" + (dateObj.getMonth() + 1) + "-" + (dateObj.getUTCDate());
                let myDateTime = (dateObj.getUTCFullYear()) + "-" + (dateObj.getMonth() + 1) + "-" + (dateObj.getUTCDate()) + "-" + (dateObj.getTime());

                // create list-item for each scan. save in array (lighthouseScans)
                const lighthouseFilename = `
                        <li class="relative">
                            <a target="targetIframe"
                               class="flex items-center px-6 py-2 text-sm text-gray-700 whitespace-normal transition duration-300 ease-in-out rounded text-ellipsis hover:text-gray-900 hover:bg-gray-100" 
                               href="lh-reports/${slugDomain}-lighthouse-${myDateTime}.html">
                                    ${siteName}
                            </a>
                        </li>`
                    // console.log(lighthouseFilename)
                lighthouseScans.push(lighthouseFilename)

                // Do the Lighthouse scans, save in Lighthouse folder
                console.log('Start scanning:', goToUrl)
                await playAudit({
                    page: page,
                    port: 9222,
                    thresholds: {
                        performance: 90,
                        accessibility: 90,
                        'best-practices': 50,
                        seo: 90,
                        pwa: 90,
                    },
                    reports: {
                        formats: {
                            html: true,
                        },
                        name: `${slugDomain}-lighthouse-${myDateTime}`,
                        directory: `${process.cwd()}/lighthouse/lh-reports/`,
                    },
                });
                console.log('finished scanning:', goToUrl)

            } catch {
                await page.goto('https://i.stack.imgur.com/6M513.png')
            }

            await page.close()
            await browser.close();

        } // End of the For url Loop...

        var end = new Date() - startTime
        console.info('Execution time: %dms', end)

        const runsduration = end / 1000
        console.log(`Done: ${runs} scans, in ${runsduration} seconds.`)

        // console.log('Lighthouse scan filenames, the html:', lighthouseScans)

        const listLinkElements = lighthouseScans.join('');

        let date = new Date();
        let myDate = (date.getUTCFullYear()) + "-" + (date.getMonth() + 1) + "-" + (date.getUTCDate());

        // Set HTML and add List items. To create an overview page with links to all the scans. Added Tailwind for some quick styling of the left-menu.
        const html = `<!doctype html>
        <html>
        <head>
            <title>Lighthouse links</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
            <div class="flex flex-row">
            <div class="h-screen px-1 overflow-y-auto bg-white shadow-md w-96">
                    <h1 class="h-12 px-6 py-4 font-semibold">Lighthouse scans</h1>
                    <p class="px-6 text-[10px] mb-4 text-gray-500">Scanned on ${myDate} with Lighthouse 9.6.7</p>

                    <ol class="relative list-decimal">
                    ${listLinkElements}
                    </ol>
                </div>
                <div class="w-full px-1">
                    <iframe class="w-full h-screen" id="LHFrame" name="targetIframe" src="" frameborder="0">
                    
                    </iframe>
                </div>
            </div>    <!-- End Flex-Col -->
            <script>
            const innerTextForIframe = document.getElementById('LHFrame');
            innerTextForIframe.contentDocument.write("Click on a link in the left sidebar to view a Lighthouse score.");
            </script>
        </body>
        </html>`

        // Write a file with HTML and List Items:
        fs.writeFile(`${process.cwd()}/lighthouse/index.html`, html, function(err) {
            if (err) throw err;
            console.log('Index file is created successfully. Open it with Live Server.');
            console.log('File:', `${process.cwd()}/lighthouse/index.html`)
        });

    } // end Siteloop

siteLoop(siteList)
```


## Result
Screenshot of multiple Lighthouse website scans:
<img src="/assets/blog/lighthouse-playwright-multiple-urls.png">

Open with 'Live server':
<img src="/assets/open-live-server-lighthouse.jpg">


#### Notes / to do's
- When running multiple single Lighthouse scans on the same url the results might differ from each other.
- Differences in calculated scores are caused by external factors.
- Network traffic, website traffic, memory issues on computer where the test is running to name a few.
- If you have multiple scores calculate the median. Don't take one scan as the truth.
- The median of five runs is twice as reliable as one run. Calculating averages for multiple runs might also remove outliers.


- Investigate if the default device (Moto G4) can be changed.
- Save urls in html file and add new one if doing runs on different days.
- Run concurrent browsers and doing scans simultaneous(puppeteer-cluster).    