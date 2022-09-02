---
id: 11
draft: false
layout: "../../layouts/BlogPost.astro"
title: "Load external or inline scripts in Playwright"
description: 'How to add scripts in Playwright'
publishDate: "11 Jul 2022"
heroImage:
  src: "/assets/blog/introducing-astro.jpg"
  alt: ""
---

Playwright offers a couple of ways to add scripts to the page(s) you are working with.
- Load external script in the head
- Add an inline script
- Load a script from node_modules or other path

Examples of the different ways to add and use a script in Playwright:

## External script

```js
    await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll/dist/smooth-scroll.polyfills.min.js' });
```

## Inline script

```js
    function functionToInject (){
        return 1+1;
    }
    
    function otherFunctionToInject(input){
        return 6
    }

    await page.addScriptTag({ content: `${functionToInject} ${otherFunctionToInject}`});
    var data = await page.evaluate(function(){
        console.log('Running inside a browser')
        return functionToInject() + otherFunctionToInject();
    });
    
    console.log(data);
```

## Path 
with fake data

```js

console.log(`Current directory: ${process.cwd()}`);
// Get current working directory

await page.addScriptTag({path: 'public\\js\\build\\report_bundle.js'});


```