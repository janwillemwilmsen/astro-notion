---
id: 6
layout: "../../layouts/BlogPost.astro"
title: 'Add watermark on screenshots in Playwright'
description: 'How to add html to a page and include it in screenshots'
publishDate: "11 Jul 2022"
heroImage:
  src: "https://source.unsplash.com/gySMaocSdqs/"
  alt: "Adding a watermark / html element in playwright script"
---

You can add HTML to a page when working with Playwright. The added HTML can be screenshotted. This way you can add a date when the screenshot was created or you can add the source website, or other notification about the screenshot. 


The following code adds a rounded element with red background with 'BETA' as text and the current date. The element is fixed at the top on the right side of the page. 


```js
await page.evaluate(async() => {
    const selector = 'body'

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    const newDiv = document.createElement("div");
    newDiv.innerHTML = `<div style='
                                background:red;
                                color:white;
                                border-radius: 100%; 
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                flex-direction: column;
                                margin: auto; 
                                text-align: center; 
                                font-size:20px;  
                                z-index:9999999; 
                                position: fixed; 
                                width:100px; 
                                height:100px; 
                                top:40px; 
                                right:40px;'>
                                    BETA<br> 
                                    <span style="font-size:10px;">
                                        ${date}
                                    </span>
                        </div>`;

const currentDiv = document.querySelector(selector);
    currentDiv.prepend(newDiv);
});
```


### Result added watermark or html in Playwright
<img src="/assets/add-watermark-html-to-playwright.jpg">

 
Add the code to the script where screenshots are created and the new element will be injected and screenshotted. Tune the css/text to your own liking.


