---
id: 9
layout: "../../layouts/BlogPost.astro"
title: "Get the entire HTML of a page with Playwright"
description: 'How to scrape, copy and save the whole entire html code of a webpage - multiple urls'
publishDate: "11 Jul 2022"
heroImage:
  src: "/assets/blog/introducing-astro.jpg"
  alt: "Scrape html with Playwright for"
---

Scraping and saving the whole entire HTML of a webpage with Playwright is a straightforward task. 
In the script below:
- start by setting requirements
- set the list of urls 
- start the loop
- start browser
- go to url in the list
- get the HTML
- console log the HTML
- slugify the url to create a useable and readable filename
- add date and fileextension to filename
- save HTML file in '/html/' directory
- and done...



```js
const playwright = require('playwright-chromium');
const fs = require('fs');

// urls 
const siteList = [
    { site: "https://www.example.com/" },
    { site: "https://www.yahoo.com/" },
    { site: "https://www.coinbase.com/" },
    { site: "https://kraken.com/" },
];


const siteLoop = async() => {

    for (const url of siteList) {

        console.log('Visit:::::', url.site)
        goToUrl = url.site

        const browser = await playwright.chromium.launch({ headless: false });
        const context = await browser.newContext({});

        const page = await context.newPage({});;
        await page.goto(goToUrl)
        const html = await page.content()
        console.log(html)

        const slugify = str =>
            str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        const fileName = slugify(goToUrl) + '-' + date + '.html';
        const dir = './html/';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const path = dir + fileName

        fs.writeFileSync(path, html);

        await browser.close();

    }
}

siteLoop(siteList)
```



### Scraping a XML Sitemap with urls
An alternative for inline urls is using a XML Sitemap as a list of urls.
- Start by creating a *sitemap.json* file in your project root directory
- Copy the nodes from the XML Sitemap, and convert it to JSON format
    - ***Only copy all the '\<url\> ... \</url\>' nodes you need***
    - Use an *'online XML to Json converter'* to convert the XML nodes to JSON format
- Save copied JSON in sitemap.json
- Copy the script below and run it

```js
const playwright = require('playwright-chromium');
const fs = require('fs');

let siteListJson = require('./sitemap.json')
const siteList = siteListJson

// urls 
// const siteList = [
//     { site: "https://www.example.com/" },
//     { site: "https://www.yahoo.com/" },
//     { site: "https://www.coinbase.com/" },
//     { site: "https://kraken.com/" },
// ];

const siteLoop = async() => {

    for (const url of siteList) {

        console.log('Visit:::::', url.loc)
        goToUrl = url.loc

        const browser = await playwright.chromium.launch({ headless: false });
        const context = await browser.newContext({});

        const page = await context.newPage({});;
        await page.goto(goToUrl)
        const html = await page.content()
        console.log(html)

        const slugify = str =>
            str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        const fileName = slugify(goToUrl) + '-' + date + '.html';
        const dir = './html/';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const path = dir + fileName

        fs.writeFileSync(path, html);

        await browser.close();

    }
}

siteLoop(siteList)

```

## Result scraping entire HTML pages / XML Sitemap

After running either script you should end up with a directory full of HTML files like this: 
<img src="/assets/save-entire-html-playwright-page-or-xml-sitemap.jpg">