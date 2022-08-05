import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import serviceWorker from "astrojs-service-worker";
import robotsTxt from 'astro-robots-txt';
import { astroImageTools } from "astro-imagetools";

import preact from '@astrojs/preact';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
    integrations: [astroImageTools, sitemap(), preact(), tailwind(), serviceWorker({ enableInDevelopment: false }), robotsTxt()],
    site: `https://astro-notion-xi.vercel.app`
});