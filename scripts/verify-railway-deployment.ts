#!/usr/bin/env tsx
/**
 * Railway Deployment Verification Script
 *
 * This script verifies that all necessary configuration files
 * and environment variables are in place for Railway deployment.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

interface CheckResult {
    name: string;
    status: 'PASS' | 'FAIL' | 'WARN';
    message: string;
}

const results: CheckResult[] = [];

function checkFile(filePath: string, required: boolean = true): CheckResult {
    const fullPath = path.join(projectRoot, filePath);
    const exists = fs.existsSync(fullPath);

    if (!exists && required) {
        return {
            name: `File: ${filePath}`,
            status: 'FAIL',
            message: `Required file not found: ${filePath}`,
        };
    } else if (!exists) {
        return {
            name: `File: ${filePath}`,
            status: 'WARN',
            message: `Optional file not found: ${filePath}`,
        };
    }

    return {
        name: `File: ${filePath}`,
        status: 'PASS',
        message: `File exists`,
    };
}

function checkPackageJson() {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const exists = fs.existsSync(packageJsonPath);

    if (!exists) {
        results.push({
            name: 'Package.json',
            status: 'FAIL',
            message: 'package.json not found',
        });
        return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    // Check for required scripts
    const requiredScripts = ['build', 'start', 'dev'];
    const missingScripts = requiredScripts.filter(s => !packageJson.scripts[s]);

    if (missingScripts.length > 0) {
        results.push({
            name: 'Package.json Scripts',
            status: 'FAIL',
            message: `Missing required scripts: ${missingScripts.join(', ')}`,
        });
    } else {
        results.push({
            name: 'Package.json Scripts',
            status: 'PASS',
            message: 'All required scripts present',
        });
    }

    // Check for required dependencies
    const requiredDeps = ['next', 'react', '@prisma/client', 'next-auth', 'bcryptjs'];
    const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies?.[dep]);

    if (missingDeps.length > 0) {
        results.push({
            name: 'Package.json Dependencies',
            status: 'FAIL',
            message: `Missing required dependencies: ${missingDeps.join(', ')}`,
        });
    } else {
        results.push({
            name: 'Package.json Dependencies',
            status: 'PASS',
            message: 'All required dependencies present',
        });
    }

    // Check for Railway-specific scripts
    if (packageJson.scripts['railway:build'] && packageJson.scripts['railway:start']) {
        results.push({
            name: 'Railway Scripts',
            status: 'PASS',
            message: 'Railway-specific scripts present',
        });
    } else {
        results.push({
            name: 'Railway Scripts',
            status: 'WARN',
            message: 'Railway-specific scripts not found (optional)',
        });
    }
}

function checkPrismaSchema() {
    const schemaPath = path.join(projectRoot, 'prisma/schema.prisma');
    const exists = fs.existsSync(schemaPath);

    if (!exists) {
        results.push({
            name: 'Prisma Schema',
            status: 'FAIL',
            message: 'prisma/schema.prisma not found',
        });
        return;
    }

    const schema = fs.readFileSync(schemaPath, 'utf-8');

    if (schema.includes('provider = "postgresql"')) {
        results.push({
            name: 'Prisma Database Provider',
            status: 'PASS',
            message: 'PostgreSQL provider configured',
        });
    } else {
        results.push({
            name: 'Prisma Database Provider',
            status: 'FAIL',
            message: 'PostgreSQL provider not configured',
        });
    }
}

function checkEnvironmentVariables() {
    const envExamplePath = path.join(projectRoot, '.env.example');
    const envRailwayExamplePath = path.join(projectRoot, '.env.railway.example');

    if (!fs.existsSync(envExamplePath)) {
        results.push({
            name: 'Environment Variables',
            status: 'WARN',
            message: '.env.example not found',
        });
    } else {
        const envExample = fs.readFileSync(envExamplePath, 'utf-8');
        const requiredVars = ['NEXTAUTH_URL', 'NEXTAUTH_SECRET', 'DATABASE_URL'];
        const missingVars = requiredVars.filter(v => !envExample.includes(v));

        if (missingVars.length > 0) {
            results.push({
                name: 'Environment Variables (.env.example)',
                status: 'WARN',
                message: `Missing variables: ${missingVars.join(', ')}`,
            });
        } else {
            results.push({
                name: 'Environment Variables (.env.example)',
                status: 'PASS',
                message: 'All required variables documented',
            });
        }
    }

    if (fs.existsSync(envRailwayExamplePath)) {
        results.push({
            name: 'Railway Environment Variables',
            status: 'PASS',
            message: '.env.railway.example exists',
        });
    } else {
        results.push({
            name: 'Railway Environment Variables',
            status: 'WARN',
            message: '.env.railway.example not found',
        });
    }
}

function checkPWAFiles() {
    const manifestPath = path.join(projectRoot, 'public/manifest.json');
    const swPath = path.join(projectRoot, 'public/sw.js');

    const manifestExists = fs.existsSync(manifestPath);
    const swExists = fs.existsSync(swPath);

    if (manifestExists && swExists) {
        results.push({
            name: 'PWA Files',
            status: 'PASS',
            message: 'manifest.json and sw.js exist',
        });
    } else {
        const missing = [];
        if (!manifestExists) missing.push('manifest.json');
        if (!swExists) missing.push('sw.js');

        results.push({
            name: 'PWA Files',
            status: 'WARN',
            message: `Missing PWA files: ${missing.join(', ')}`,
        });
    }
}

function checkRailwayConfig() {
    const railwayJsonPath = path.join(projectRoot, 'railway.json');
    const procfilePath = path.join(projectRoot, 'Procfile');

    if (fs.existsSync(railwayJsonPath)) {
        try {
            const railwayJson = JSON.parse(fs.readFileSync(railwayJsonPath, 'utf-8'));
            const hasBuildCmd = railwayJson.build?.buildCommand;
            const hasStartCmd = railwayJson.deploy?.startCommand;
            const hasHealthCheck = railwayJson.deploy?.healthcheckPath;

            if (hasBuildCmd && hasStartCmd && hasHealthCheck) {
                results.push({
                    name: 'Railway Configuration',
                    status: 'PASS',
                    message: 'railway.json properly configured',
                });
            } else {
                const missing = [];
                if (!hasBuildCmd) missing.push('buildCommand');
                if (!hasStartCmd) missing.push('startCommand');
                if (!hasHealthCheck) missing.push('healthcheckPath');

                results.push({
                    name: 'Railway Configuration',
                    status: 'FAIL',
                    message: `Missing in railway.json: ${missing.join(', ')}`,
                });
            }
        } catch (error) {
            results.push({
                name: 'Railway Configuration',
                status: 'FAIL',
                message: 'railway.json is not valid JSON',
            });
        }
    } else {
        results.push({
            name: 'Railway Configuration',
            status: 'FAIL',
            message: 'railway.json not found',
        });
    }

    if (fs.existsSync(procfilePath)) {
        const procfile = fs.readFileSync(procfilePath, 'utf-8').trim();
        if (procfile.includes('npm start') || procfile.includes('node')) {
            results.push({
                name: 'Procfile',
                status: 'PASS',
                message: 'Procfile contains valid start command',
            });
        } else {
            results.push({
                name: 'Procfile',
                status: 'WARN',
                message: 'Procfile may not contain valid start command',
            });
        }
    } else {
        results.push({
            name: 'Procfile',
            status: 'FAIL',
            message: 'Procfile not found',
        });
    }
}

function checkNextConfig() {
    const configPath = path.join(projectRoot, 'next.config.ts');
    const configJsPath = path.join(projectRoot, 'next.config.js');

    const configPathExists = fs.existsSync(configPath);
    const configJsExists = fs.existsSync(configJsPath);

    if (!configPathExists && !configJsExists) {
        results.push({
            name: 'Next.js Configuration',
            status: 'FAIL',
            message: 'next.config.ts or next.config.js not found',
        });
        return;
    }

    const configPathToUse = configPathExists ? configPath : configJsPath;
    const config = fs.readFileSync(configPathToUse, 'utf-8');

    if (config.includes('output') && config.includes('standalone')) {
        results.push({
            name: 'Next.js Configuration',
            status: 'PASS',
            message: 'standalone output configured for Railway',
        });
    } else {
        results.push({
            name: 'Next.js Configuration',
            status: 'WARN',
            message: 'standalone output not configured (recommended for Railway)',
        });
    }
}

console.log('🚀 Railway Deployment Verification\n');
console.log('=====================================\n');

// Run all checks
results.push(checkFile('railway.json', true));
results.push(checkFile('Procfile', true));
results.push(checkFile('.env.railway.example', false));
results.push(checkFile('prisma/schema.prisma', true));
results.push(checkFile('src/lib/prisma.ts', true));
results.push(checkFile('src/app/api/health/route.ts', true));
checkPackageJson();
checkPrismaSchema();
checkEnvironmentVariables();
checkPWAFiles();
checkRailwayConfig();
checkNextConfig();

// Print results
console.log('Verification Results:\n');

let passCount = 0;
let failCount = 0;
let warnCount = 0;

results.forEach(result => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${result.name}`);
    console.log(`   ${result.message}`);
    console.log();

    if (result.status === 'PASS') passCount++;
    else if (result.status === 'FAIL') failCount++;
    else warnCount++;
});

console.log('=====================================\n');
console.log(`Total: ${results.length} checks`);
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`⚠️  Warnings: ${warnCount}\n`);

if (failCount === 0) {
    console.log('🎉 All critical checks passed! Your app is ready for Railway deployment.\n');
    console.log('Next steps:');
    console.log('1. Push your code to GitHub');
    console.log('2. Create a new Railway project');
    console.log('3. Add PostgreSQL database');
    console.log('4. Set environment variables (NEXTAUTH_URL, NEXTAUTH_SECRET)');
    console.log('5. Deploy!\n');
    console.log('For more details, see RAILWAY_SETUP.md');
    process.exit(0);
} else {
    console.log('❌ Some critical checks failed. Please fix the issues above before deploying.\n');
    process.exit(1);
}
