/**
 * CSS Build Script for Quest Quiz Application
 * Creates minified CSS for production deployment
 * 
 * Usage: node build-css.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function minifyCSS(css) {
    return css
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        // Remove space around certain characters
        .replace(/\s*{\s*/g, '{')
        .replace(/;\s*/g, ';')
        .replace(/:\s*/g, ':')
        .replace(/,\s*/g, ',')
        .replace(/}\s*/g, '}')
        // Remove trailing semicolon before }
        .replace(/;}/g, '}')
        // Trim
        .trim();
}

function buildCSS() {
    const sourcePath = path.join(__dirname, 'style-sheet.css');
    const outputPath = path.join(__dirname, 'style-sheet.min.css');
    
    try {
       
        // Read source CSS
        const sourceCSS = fs.readFileSync(sourcePath, 'utf8');
        const sourceSize = Buffer.byteLength(sourceCSS, 'utf8');
        
        // Minify CSS
        const minifiedCSS = minifyCSS(sourceCSS);
        const minifiedSize = Buffer.byteLength(minifiedCSS, 'utf8');
        
        // Write minified CSS
        fs.writeFileSync(outputPath, minifiedCSS, 'utf8');
        
        // Calculate savings
        const savings = ((sourceSize - minifiedSize) / sourceSize * 100).toFixed(1);
        
    } catch (error) {
        console.error('❌ Error building CSS:', error);
    }
}

// Run build
buildCSS();