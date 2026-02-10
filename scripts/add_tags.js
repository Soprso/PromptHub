import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROMPTS_DIR = path.join(__dirname, '../src/data/prompts');

async function processFile(filePath) {
    const fileName = path.basename(filePath);
    if (fileName === 'index.ts' || fileName === 'prompts.ts') return;

    console.log(`Processing ${fileName}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let newLines = [];
    let currentCategory = '';
    let currentFolder = '';
    let inPrompts = false;
    let promptBlockLevel = 0; // 0 = not in prompt, 1 = in prompt object

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // 1. Detect Category Name
        // Assuming format: name: "Category Name", at lower indentation or context
        // This is tricky line-by-line. 
        // Let's assume standard indentation:
        // Category Name: 4-8 spaces
        // Folder Name: 12-16 spaces

        // Helper to get string value for property
        const getNameMatch = line.match(/name:\s*"([^"]+)"/);

        if (getNameMatch) {
            const name = getNameMatch[1];
            // Check indentation to guess context
            const indent = line.search(/\S/);

            if (indent <= 8) {
                currentCategory = name.replace(' Prompts', '').replace(' Promts', ''); // Basic cleanup
                console.log(`  Category: ${currentCategory}`);
            } else if (indent > 8 && !inPrompts) {
                currentFolder = name.replace(' Prompts', '').replace(' Promts', '');
                // Also clean up common suffixes
                currentFolder = currentFolder.replace(/ (Prompts|Prompt|Collection|Guide)$/i, '');
                console.log(`    Folder: ${currentFolder}`);
            }
        }

        if (line.includes('prompts: [')) {
            inPrompts = true;
        }

        if (inPrompts) {
            // Check for end of prompts array
            if (line.trim().startsWith(']')) {
                inPrompts = false;
            } else {
                // We are inside prompts array. Look for objects.
                // Lines often look like: { id: "...", title: "...", content: "..." },
                // or spread across lines.
                // PROMPT_START: '{'
                // PROMPT_END: '}'

                // Simple case: One-line prompt objects (most common in these files)
                // { id: "...", title: "...", content: "..." },
                if (line.trim().startsWith('{') && line.includes('content:')) {
                    // Check if tags already exist
                    if (!line.includes('tags: [')) {
                        // Generate tags
                        const tags = [currentCategory, currentFolder].filter(Boolean);
                        // Add tags before the closing brace '}'
                        // Careful if '}' is inside content string? 
                        // Content strings usually use " or ' or `
                        // The closing brace for the object is usually at the end, followed by comma?

                        const lastBraceIndex = line.lastIndexOf('}');
                        if (lastBraceIndex !== -1) {
                            const tagsString = `, tags: ${JSON.stringify(tags)} `;
                            // Insert before last brace
                            const newLine = line.slice(0, lastBraceIndex) + tagsString + line.slice(lastBraceIndex);
                            newLines.push(newLine);
                            continue;
                        }
                    }
                }
            }
        }

        newLines.push(line);
    }

    // Write back
    fs.writeFileSync(filePath, newLines.join('\n'));
}

async function main() {
    try {
        const files = fs.readdirSync(PROMPTS_DIR);
        for (const file of files) {
            if (file.endsWith('.ts')) {
                await processFile(path.join(PROMPTS_DIR, file));
            }
        }
        console.log('Done adding tags!');
    } catch (err) {
        console.error('Error:', err);
    }
}

main();
