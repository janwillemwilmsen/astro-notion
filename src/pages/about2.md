---
id: 
layout: "../layouts/BlogPost.astro"
title: 'About programmablebrowser'
description: 'Learn more on how and why programmable browser was built.'
publishDate: "11 Aug 2022"
heroImage:
  src: "https://source.unsplash.com/gySMaocSdqs/600x300"
  alt: ""
setup: |
  import { Image, Picture } from "astro-imagetools/components";
---


Programmablebrowser is a website with resources for using the Playwright library. It contains scripts and code created by me and have gathered from the web.

## Who made it?
The website is created by Jan-Willem Wilmsen. Me -;)

I have a long standing interest in scraping websites and automating tasks in the browser. After finding Puppeteer I was thrilled. Finally a tool based on an actual browser, build by Google itself, so it had to be quality stuff. 

## Puppeteer
At the company I work for I once was responsible for the Quality of the Online Footprint. Every website needed to be on or above par, visually, code wise, analytics wise and content wise. For the visual testing of the websites I used Puppeteer to generate screenshots. 

## Playwright
I can't remember when, but one day I learned that the developers who created Puppeteer at Google had moved to Microsoft. At Microsoft they forked Puppeteer and named it Playwright. It looked like the Puppeteer development had halted, and Playwright would soon catch up and pass Puppeteer. The main changes in capabilities 'Auto waiting' and having more browsers to test with looked very interesting. 

## About this site
- The site is generated with Astro. 
- Tailwind CSS as CSS Framework.
- Flat Markdown files as 'CMS'. 
  (Possible to be edited by other poeple who have a Github account)
- (Initially I wanted to have the content in Notion...)
- The website is installable (Progressive Web App)

### Lighthouse score
Astro is a Static Site Generator, the output is normal html files, which can be very fast. The goal was to get the maximum score, both on mobile and desktop.
I know its not a game and doesn't guarantee anything, it was fun getting there. 

#### Partytown
Astro has a Partytown integration. This allowed me to test and work with Partytown. With Partytown you can offload javascript to the serviceworker, thus eliminating render blocking issues (which is good for website performance /sitespeed). Unfortunately implementing the Partytown module gave some unexpected errors. So switched back to normal script injecting. The Lighthouse results are still all green!   

<img src="/assets/lighthouse-before-partytown.jpg">

### Open source
The code of the site is publicly available. If you have feedback, or want to add or change code, please do!


 