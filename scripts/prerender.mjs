#!/usr/bin/env node
/**
 * Custom prerender script for GitHub Pages
 * Generates static HTML for key routes after build
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');

// Routes to prerender
const routes = [
    '/builder',
    '/category/ai-image-generation',
    '/category/video-generation',
    '/category/coding',
    '/category/writing',
    '/category/design',
    '/category/education',
];

async function prerenderRoute(browser, route) {
    console.log(`Prerendering: ${route}`);

    const page = await browser.newPage();
    const fullUrl = `file://${distDir}/index.html`;

    try {
        await page.goto(fullUrl, { waitUntil: 'networkidle0' });

        // Wait for React to render
        await page.waitForSelector('#root', { timeout: 5000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Get rendered HTML
        const html = await page.content();

        // Create directory structure
        const routePath = route === '/' ? 'index.html' : `${route}/index.html`;
        const fullPath = path.join(distDir, routePath);
        const dir = path.dirname(fullPath);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Write HTML file
        fs.writeFileSync(fullPath, html);
        console.log(`✓ Generated: ${routePath}`);

    } catch (error) {
        console.error(`✗ Failed to prerender ${route}:`, error.message);
    } finally {
        await page.close();
    }
}

async function main() {
    console.log('Starting prerender process...');

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    for (const route of routes) {
        await prerenderRoute(browser, route);
    }

    await browser.close();
    console.log('Prerender complete!');
}

main().catch(console.error);
