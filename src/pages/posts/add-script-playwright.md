---
id: 11
draft: false
layout: "../../layouts/BlogPost.astro"
title: "Load external or inline scripts in Playwright"
description: 'How to add scripts in Playwright'
publishDate: "11 Jul 2022"
heroImage:
  src: "https://images.unsplash.com/photo-1655557984979-ea96866210c3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=420&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1OTY4Mjc2OA&ixlib=rb-1.2.1&q=80&w=840"
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



## Passing values with page.evaluate
Not tested. Found it in Youtube video.

```js
await page.goto('https://google.com')

const pizza = 'Hey Pizza'

await page.evaluate((pizza) => {
    console.log('Pizza here:', pizza)
}, pizza);
```


#### Source:
https://stackoverflow.com/questions/48207414/how-can-i-dynamically-inject-functions-to-evaluate-using-puppeteer