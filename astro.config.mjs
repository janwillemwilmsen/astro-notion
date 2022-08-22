import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
// import serviceWorker from "astrojs-service-worker";
import robotsTxt from 'astro-robots-txt';
import { astroImageTools } from "astro-imagetools";
import preact from '@astrojs/preact';
import tailwind from "@astrojs/tailwind";

// import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
    integrations: [
        astroImageTools,
        sitemap(),
        preact(),
        tailwind(),
        robotsTxt(),
        // partytown({
        //     config: {
        //         forward: ["dataLayer.push"],
        //         // debug: true,
        //     }
        // })
    ],
    site: `https://programmablebrowser.com` // site: `http://localhost:3000`

});

// serviceWorker({
//     enableInDevelopment: true
//   }),