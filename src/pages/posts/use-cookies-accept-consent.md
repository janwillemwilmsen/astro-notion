---
id: 12
layout: "../../layouts/BlogPost.astro"
title: "Set cookies in Playwright to bypass cookiepopups"
description: 'How to accept and bypass cookieconsent'
publishDate: "11 Jul 2022"
heroImage:
  src: "/assets/blog/introducing-astro.jpg"
  alt: "use Cookies to set consent in Playwright"
---

Cookie consent popups can be a pain when scraping websites or running scripts.

If you set cookies in the Playwright script, the consent is automatically accepted, and the popup doesn't popup.

## How to get the cookies that accept the cookieconsent?
- Go to site you work with
- Open Inspector
- Go to Application
- Go to Data
- Clear all data 
- Accept the cookieconsent popup
- See which new cookies get set in the inspector
- Export cookies with Edit this Cookie

Edit this cookie Chrome plugin:
https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg?hl=nl
<br>*(Edit this Cookie is added in the 'Inspector' and creates a shortcut in the browser context menu, right click on a page)*

<img src="/assets/export-cookies.jpg">

You get code like this:
```json
{
  "domain": "myprivacy.dpgmedia.nl",
  "expirationDate": 1695326976.860644,
  "hostOnly": true,
  "httpOnly": false,
  "name": "authId",
  "path": "/",
  "sameSite": "None",
  "secure": true,
  "session": false,
  "storeId": "0",
  "value": "8570cd70-a2c8-4c69-a3a6-b38609bdaf57",
  "id": 1
},
```





Paste the copied block in the cookiesArray (paste at top of the script)
```js
const cookiesArr = [{
  "domain": "myprivacy.dpgmedia.nl",
  "expirationDate": 1695326976.860644,
  "hostOnly": true,
  "httpOnly": false,
  "name": "authId",
  "path": "/",
  "sameSite": "lax",
  "secure": true,
  "session": false,
  "storeId": "0",
  "value": "8570cd70-a2c8-4c69-a3a6-b38609bdaf57",
  "id": 1
} 
]
```

and add the 'await context addCookies' between context and page, like so:


```js
const context = await browser.newContext({});

await context.addCookies([...cookiesArr])

const page = await context.newPage();
```

### Errors after adding cookies
If you get errors like:<br>
*UnhandledPromiseRejectionWarning: browserContext.addCookies: cookies[0].sameSite: expected one of (Strict|Lax|None)*

Just change 'sameSite' to 'None'.