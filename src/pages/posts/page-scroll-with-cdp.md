---
id: 600
draft: false
layout: "../../layouts/BlogPost.astro"
title: "Scroll a page with Devtools Protocol"
description: 'Use developer protocol to scroll a page'
publishDate: "11 Jul 2022"
heroImage:
  src: "/assets/blog/introducing-astro.jpg"
  alt: "Chrome Devtools Protocol to scroll a page"
---

Smooth scrolling in Playwright or Puppeteer is no easy task. It takes quite some code to script. 

In an example script in the <a href="https://web.dev/lighthouse-user-flows/">'Lighthouse User flows'</a> documentation I came across code which uses Chrome Devtools Protocol to scroll a page.

Not yet tested but might be interesting to investigate.


```js
  const session = await page.target().createCDPSession();

// We need the ability to scroll like a user. There's not a direct puppeteer function for this, but we can use the DevTools Protocol and issue a Input.synthesizeScrollGesture event, which has convenient parameters like repetitions and delay to somewhat simulate a more natural scrolling gesture.
  // https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-synthesizeScrollGesture
  await session.send('Input.synthesizeScrollGesture', {
    x: 100,
    y: 0,
    yDistance: -2500,
    speed: 1000,
    repeatCount: 2,
    repeatDelayMs: 250,
  });
```