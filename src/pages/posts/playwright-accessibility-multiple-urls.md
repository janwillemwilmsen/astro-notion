---
id: 24
draft: true
layout: "../../layouts/BlogPost.astro"
title: "Run AXE Accessibility check in Playwright - multiple urls"
description: 'How to : Test the accessibility of a website with Axe and Playwright'
publishDate: "11 Jul 2022"
heroImage:
  src: "https://images.unsplash.com/photo-1588362951121-3ee319b018b2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=420&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1OTY4Mjc2OA&ixlib=rb-1.2.1&q=80&w=840"
  alt: "Playwright Axe Core Axe HTML Reporter"
---

Axe-core is a module which checks and tests webpages for accessibility. 
The module is open-source. It is used in many applications, like Lighthouse, but also can be run separate.


Besides Playwright the only extra module is 'Axe Html Reporter'.


install axe-html-reporter:
```js
npm i -D axe-html-reporter
```

## Steps
- create script 'axe-run.js' 
- import required modules
- define urls to check
- create axe-min.js file. Copy content from CDN. So you can use local file to inject in the head of every url that gets scanned
- For every url loop through the axe script
- the 'Axe-Core' script checks html elements and writes a json file with results
- the 'Axe-HTML-reporter' uses the json files and presents the data in table view
- the script creates a folder 'axe-reports'
- in the folder are two subfolders and an index.html
- the 'json' folder contains the raw json output with accessibility scan
- the 'html' folder contains html files with results per url scanned  
- open the index.html with Live Server (if you have VS code)
- on the left click on any of the urls to view corresponding axe scan


## Axe Report multiple urls 
```js
import { chromium } from 'playwright';
import { createHtmlReport } from 'axe-html-reporter';
import { writeFile, writeFileSync, readFileSync } from 'fs';

// NEEDED for ESM and creating directories + files:
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Create folder /axe-reports/
const outputDirName = "axe-reports"
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.resolve(path.join(__dirname, outputDirName));

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Create Folder '/axe-results/json' (for raw json output of the Axe scan)
const jsonFolderName = "json"
const jsonOutputDir = path.resolve(path.join(__dirname, outputDirName + '/' + jsonFolderName));

if (!fs.existsSync(jsonOutputDir)) {
    fs.mkdirSync(jsonOutputDir);
}

// Create Folder '/axe-results/html' (for html output of the Axe scan)
const htmlFolderName = "html"
const htmlOutputDir = path.resolve(path.join(__dirname, outputDirName + '/' + htmlFolderName));

if (!fs.existsSync(htmlOutputDir)) {
    fs.mkdirSync(htmlOutputDir);
}

const jsonFileExtension = ".json"
const htmlFileExtension = ".html"
const projectKey = "energy"

const siteList = [
    { site: "https://www.essent.nl/", name: "Essent.nl" },
    { site: "https://www.essent.nl/klantenservice/", name: "Essent.nl/klantenservice" },
    { site: "https://www.essent.nl/energie", name: "Essent.nl/energie" },
    { site: "https://www.energiedirect.nl/", name: "energiedirect.nl" },
    { site: "https://www.vandebron.nl/", name: "Vandebron.nl", "value": 1 },
    { site: "https://www.oxxio.nl/", name: "Oxxio.nl" },
    { site: "https://www.eneco.nl/", name: "Eneco.nl" },
    { site: "https://www.nederlandisoleert.nl/", name: "NederlandIsoleert.nl" },
    { site: "https://www.klimaatroute.nl/", name: "Klimaatroute.nl" },
    { site: "https://www.zon7.nl/", name: "Zon7" },
    { site: "https://www.energiewacht.nl/", name: "Energiewacht.nl" },
    { site: "https://www.energiewachtwest.nl/", name: "EnergiewachtWest.nl" },
    { site: "https://www.kemkens.nl/", name: "Kemkens.nl" },
    { site: "https://www.voltalimburg.nl/", name: "VoltaLimburg.nl" },
    { site: "https://www.voltasolar.nl/", name: "VoltaSolar.nl" },
    { site: "http://www.energiewonen.nl/", name: "Energiewonen.nl" },
    { site: "https://www.isoprofs.nl/", name: "Isoprofs.nl" },
    { site: "https://www.cvtotaal.nl/", name: "CV-totaal.nl" },
    { site: "https://www.gaslicht.com/", name: "GasLicht.com" },
    { site: "https://www.nle.nl/", name: "nle.nl" },
    { site: "https://www.deltaenergie.nl/", name: "Deltaenergie.nl" },
    { site: "https://www.greenchoice.nl/", name: "GreenChoice.nl" },
    { site: "https://www.budgetthuis.nl/energie/", name: "Budgetthuis.nl/energie" },
    { site: "https://www.frankenergie.nl/", name: "Frankenergie.nl" },
    { site: "https://www.engie.nl/", name: "Engie.nl" },
    { site: "https://www.shellenergy.nl/", name: "ShellEnergy.nl" },
    { site: "https://pure-energie.nl/", name: "Pure-energy.nl" },
    { site: "https://www.coolblue.nl/energie", name: "Coolblue.nl/energie" },
];


const siteLoop = async() => {
    // (async() => {
    const axeScans = []

    for (const url of siteList) {

        const browser = await chromium.launch({ headless: false });
        const context = await browser.newContext({});

        const page = await context.newPage();
        const goToUrl = url.site
        const siteName = url.name
        await page.goto(goToUrl);


        try {
            // await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/3.3.2/axe.min.js' });
            // loading script from CDN might give CSP errors.
            // copy file locally. add to head when loading a page:
            await page.addScriptTag({ path: 'axe.min.js' });

        } catch {
            console.log('Error adding script')
        }
        const results = await page.evaluate(() => axe.run(document));

        if (results.violations.length > 0) {
            console.log(`Found ${results.violations.length} accessibility violations`);
            console.log(results.violations);
        }

        console.log('res', results);

        // convert url 'slugify' to use as filename 
        const slugify = str =>
            str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .replace(/www/g, '')
            .replace(/https/g, '')
            .replace(/http/g, '')

        const slugDomain = slugify(goToUrl)

        // use date in the filename:
        let date = new Date();
        let myDateTime = (date.getUTCFullYear()) + "-" + (date.getMonth() + 1) + "-" + (date.getUTCDate()) + "-" + (date.getTime());

        // Write results to /json/slugified-url-date.json
        writeFileSync(jsonOutputDir + '/' + slugDomain + '-' + myDateTime + jsonFileExtension, JSON.stringify(results));

        (() => {
            const rawAxeResults = JSON.parse(readFileSync(jsonOutputDir + '/' + slugDomain + '-' + myDateTime + jsonFileExtension, 'utf8'))
            createHtmlReport({
                results: rawAxeResults,
                //options available to further customize reports
                options: {
                    projectKey: projectKey,
                    outputDir: outputDirName + '/' + htmlFolderName,
                    reportFileName: slugDomain + '-axe-' + myDateTime + htmlFileExtension,
                }
            });
        })();

        // // Push List Items with html in Array :
        const axeFilename = `
        <li class="relative list-decimal">
            <a target="targetIframe"
               class="flex items-center px-6 py-2 text-sm text-gray-700 whitespace-normal transition duration-300 ease-in-out rounded text-ellipsis hover:text-gray-900 hover:bg-gray-100" 
               href="${htmlFolderName}/${slugDomain}-axe-${myDateTime}.html">
                    ${siteName}
            </a>
        </li>`
            // console.log(axeFilename)
        axeScans.push(axeFilename)

        await page.close();
        await browser.close();
        // })
    }
    console.log(axeScans)

    const listLinkElements = axeScans.join('');

    let date = new Date();
    let myDate = (date.getUTCFullYear()) + "-" + (date.getMonth() + 1) + "-" + (date.getUTCDate());
    // Set HTML and add List items. To create an overview page with links to all the scans. Added Tailwind for some quick styling of the left-menu.
    const html = `<!doctype html>
         <html>
         <head>
             <title>Axe scans</title>
             <script src="https://cdn.tailwindcss.com"></script>
         </head>
         <body>
             <div class="flex flex-row">
                 <div class="h-screen px-1 overflow-y-auto bg-white shadow-md w-96">
                     <h1 class="h-12 px-6 py-4 font-semibold">Axe/A11Y scans</h1>
                     <p class="px-6 text-[10px] mb-4 text-gray-500">Scanned on ${myDate} with Axe-Core 4.4.3</p>
                     <ol class="relative list-decimal">
                     ${listLinkElements}
                     </ol>
                 </div>
                 <div class="w-full px-1">
                     <iframe class="w-full h-screen" id="axeFrame" name="targetIframe" src="" frameborder="0">
                     
                     </iframe>
                 </div>
             </div>    <!-- End Flex-Col -->
             <script>
             const innerTextForIframe = document.getElementById('axeFrame');
             innerTextForIframe.contentDocument.write("Click on a link in the left sidebar to view the Axe html-report. <br><br>Refresh the browser if reports don't load. Some external files used to style the report take some time to load....");
             </script>
         </body>
         </html>`

    // Write a file with HTML and List Items:
    writeFile(`${outputDir}/index.html`, html, function(err) {
        // writeFile(`${process.cwd()}/${outputDir}/index.html`, html, function(err) {
        if (err) throw err;
        console.log('Index file is created successfully. Open it with Live Server.');
        console.log('File:', `${process.cwd()}/${outputDir}/index.html`)
    });

}

// ();

siteLoop(siteList)
```

## Results

<img src="/assets/axe-html-report-multiple-urls.png">