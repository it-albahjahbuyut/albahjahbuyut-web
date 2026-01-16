#!/usr/bin/env node
/**
 * Security Check Script
 * Run this to verify your environment is secure
 * 
 * Usage: node scripts/security-check.js
 */

const fs = require('fs');
const path = require('path');

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

console.log('\n' + CYAN + '🔐 Al-Bahjah Buyut Security Check' + RESET);
console.log('=' .repeat(50) + '\n');

let hasErrors = false;
let hasWarnings = false;

// =============================================
// 1. Check .env file exists and not in git
// =============================================
console.log(CYAN + '1. Checking .env file...' + RESET);

const envPath = path.join(__dirname, '..', '.env');
const gitignorePath = path.join(__dirname, '..', '.gitignore');

if (!fs.existsSync(envPath)) {
    console.log(YELLOW + '   ⚠ .env file not found - copy from .env.example' + RESET);
    hasWarnings = true;
} else {
    console.log(GREEN + '   ✓ .env file exists' + RESET);
    
    // Check if .env is in gitignore
    if (fs.existsSync(gitignorePath)) {
        const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
        if (gitignore.includes('.env')) {
            console.log(GREEN + '   ✓ .env is in .gitignore' + RESET);
        } else {
            console.log(RED + '   ✗ .env is NOT in .gitignore - CRITICAL!' + RESET);
            hasErrors = true;
        }
    }
}

// =============================================
// 2. Check for sensitive files in project root
// =============================================
console.log(CYAN + '\n2. Checking for sensitive files in root...' + RESET);

const sensitivePatterns = [
    /\.pem$/,
    /\.key$/,
    /\.p12$/,
    /serviceaccount.*\.json$/i,
    /credentials.*\.json$/i,
];

const rootDir = path.join(__dirname, '..');
const files = fs.readdirSync(rootDir);

let foundSensitive = false;
files.forEach(file => {
    // Skip node_modules and .git
    if (file === 'node_modules' || file === '.git') return;
    
    // Check for Google service account pattern
    if (file.endsWith('.json') && file !== 'package.json' && 
        file !== 'package-lock.json' && file !== 'tsconfig.json' && 
        file !== 'components.json' && file !== 'vercel.json') {
        console.log(YELLOW + `   ⚠ JSON file in root: ${file}` + RESET);
        
        // Check if it's a service account
        try {
            const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
            if (content.includes('private_key') || content.includes('service_account')) {
                console.log(RED + `   ✗ SERVICE ACCOUNT FOUND: ${file} - MOVE THIS FILE!` + RESET);
                hasErrors = true;
                foundSensitive = true;
            }
        } catch (e) {
            // Ignore read errors
        }
    }
    
    sensitivePatterns.forEach(pattern => {
        if (pattern.test(file)) {
            console.log(RED + `   ✗ Sensitive file found: ${file}` + RESET);
            hasErrors = true;
            foundSensitive = true;
        }
    });
});

if (!foundSensitive) {
    console.log(GREEN + '   ✓ No obvious sensitive files in root' + RESET);
}

// =============================================
// 3. Check NEXT_PUBLIC_ variables
// =============================================
console.log(CYAN + '\n3. Checking NEXT_PUBLIC_ variables for secrets...' + RESET);

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');
    
    const sensitiveKeywords = ['SECRET', 'PASSWORD', 'PRIVATE', 'TOKEN', 'DATABASE', 'POSTGRES'];
    let foundBadPublic = false;
    
    lines.forEach((line, index) => {
        if (line.startsWith('NEXT_PUBLIC_')) {
            sensitiveKeywords.forEach(keyword => {
                if (line.toUpperCase().includes(keyword)) {
                    console.log(RED + `   ✗ Line ${index + 1}: ${line.split('=')[0]} contains "${keyword}"` + RESET);
                    hasErrors = true;
                    foundBadPublic = true;
                }
            });
        }
    });
    
    if (!foundBadPublic) {
        console.log(GREEN + '   ✓ No secrets in NEXT_PUBLIC_ variables' + RESET);
    }
}

// =============================================
// 4. Check for hardcoded secrets in code
// =============================================
console.log(CYAN + '\n4. Checking for hardcoded secrets in src/...' + RESET);

const srcDir = path.join(__dirname, '..', 'src');

function scanDirectory(dir, patterns) {
    const found = [];
    
    function scan(currentDir) {
        try {
            const items = fs.readdirSync(currentDir);
            items.forEach(item => {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory() && item !== 'node_modules' && item !== '.next') {
                    scan(fullPath);
                } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js'))) {
                    const content = fs.readFileSync(fullPath, 'utf-8');
                    patterns.forEach(({ pattern, name }) => {
                        if (pattern.test(content)) {
                            // Check if it's not an env reference
                            if (!content.includes(`process.env.${name}`) && 
                                !content.includes('process.env[')) {
                                found.push({ file: fullPath.replace(rootDir, ''), name });
                            }
                        }
                    });
                }
            });
        } catch (e) {
            // Ignore errors
        }
    }
    
    scan(dir);
    return found;
}

// Looking for patterns that might indicate hardcoded secrets
const hardcodedPatterns = [
    { pattern: /postgresql:\/\/[^"'\s]+:[^"'\s]+@/i, name: 'database_url' },
    { pattern: /-----BEGIN PRIVATE KEY-----/i, name: 'private_key' },
    { pattern: /-----BEGIN RSA PRIVATE KEY-----/i, name: 'rsa_key' },
];

const hardcodedFound = scanDirectory(srcDir, hardcodedPatterns);

if (hardcodedFound.length > 0) {
    hardcodedFound.forEach(({ file, name }) => {
        console.log(RED + `   ✗ Potential hardcoded ${name} in: ${file}` + RESET);
    });
    hasErrors = true;
} else {
    console.log(GREEN + '   ✓ No hardcoded secrets detected' + RESET);
}

// =============================================
// 5. Summary
// =============================================
console.log('\n' + '=' .repeat(50));

if (hasErrors) {
    console.log(RED + '\n❌ SECURITY ISSUES FOUND!' + RESET);
    console.log('Please fix the issues above before deploying.\n');
    process.exit(1);
} else if (hasWarnings) {
    console.log(YELLOW + '\n⚠ Warnings found - please review above.' + RESET);
    console.log(GREEN + 'No critical issues detected.\n' + RESET);
    process.exit(0);
} else {
    console.log(GREEN + '\n✅ All security checks passed!' + RESET);
    console.log('Your environment appears to be secure.\n');
    process.exit(0);
}
