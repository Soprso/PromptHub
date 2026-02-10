#!/usr/bin/env node
/**
 * Generate routes for prerendering
 * This script reads the prompt data and generates all important routes
 */

import { promptCategories } from './src/data/prompts/index.ts';

// High priority routes (always prerender)
const routes = [
    '/',
    '/builder',
];

// Add all category routes
promptCategories.forEach(category => {
    routes.push(`/category/${category.id}`);

    // Add top 2 folders from each category for deeper indexing
    category.folders.slice(0, 2).forEach(folder => {
        routes.push(`/category/${category.id}/${folder.id}`);
    });
});

console.log(JSON.stringify(routes, null, 2));
