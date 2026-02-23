import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://promptshub.shop';
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SRC_DIR = path.join(process.cwd(), 'src');

async function generateSitemap() {
    const urls = [
        { loc: '/', changefreq: 'daily', priority: '1.0' },
        { loc: '/prompts', changefreq: 'weekly', priority: '0.9' },
        { loc: '/builder', changefreq: 'weekly', priority: '0.8' },
        { loc: '/community', changefreq: 'daily', priority: '0.9' },
        { loc: '/share', changefreq: 'weekly', priority: '0.7' },
        { loc: '/image-of-the-day', changefreq: 'daily', priority: '0.9' },
        { loc: '/image-of-the-day/archive', changefreq: 'daily', priority: '0.8' },
        { loc: '/sitemap', changefreq: 'monthly', priority: '0.5' },
        { loc: '/about', changefreq: 'monthly', priority: '0.5' },
        { loc: '/contact', changefreq: 'monthly', priority: '0.5' },
        { loc: '/privacy-policy', changefreq: 'monthly', priority: '0.3' },
    ];

    // 1. Get slugs from seo-pages.ts
    try {
        const seoPagesContent = fs.readFileSync(path.join(SRC_DIR, 'data', 'seo-pages.ts'), 'utf8');
        const slugMatch = seoPagesContent.matchAll(/slug:\s*["']([^"']+)["']/g);
        for (const match of slugMatch) {
            urls.push({ loc: `/${match[1]}`, changefreq: 'weekly', priority: '0.8' });
        }
    } catch (err) {
        console.error('Error reading seo-pages.ts:', err);
    }

    // 2. Get categories and folders from prompts data
    // This is a bit more complex due to multiple files, so we'll look for IDs in any .ts file in src/data/prompts
    try {
        const promptsDir = path.join(SRC_DIR, 'data', 'prompts');
        const files = fs.readdirSync(promptsDir);

        for (const file of files) {
            if (file.endsWith('.ts')) {
                const content = fs.readFileSync(path.join(promptsDir, file), 'utf8');

                // Extract category IDs
                const catMatch = content.matchAll(/id:\s*["']([^"']+)["']/g);
                for (const match of catMatch) {
                    const id = match[1];
                    // Categories usually linked under /category/ID
                    if (!urls.some(u => u.loc === `/category/${id}`)) {
                        urls.push({ loc: `/category/${id}`, changefreq: 'weekly', priority: '0.7' });
                    }
                }
            }
        }
    } catch (err) {
        console.error('Error reading prompts directory:', err);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${BASE_URL}${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
    console.log('Sitemap generated successfully in public/sitemap.xml');
}

generateSitemap();
