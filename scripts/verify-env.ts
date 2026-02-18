#!/usr/bin/env tsx
/**
 * Environment Verification Script
 * 
 * Run this script to verify that all required environment variables
 * are properly configured for production deployment.
 * 
 * Usage:
 *   npx tsx scripts/verify-env.ts
 *   npx tsx scripts/verify-env.ts --production
 */

import dotenv from 'dotenv';

// Load environment variables
const envPath = process.argv.includes('--production') ? '.env' : '.env.local';
dotenv.config({ path: envPath });

const isProduction = process.argv.includes('--production') || process.env.NODE_ENV === 'production';

interface EnvVar {
    name: string;
    required: boolean;
    description: string;
    validate?: (value: string) => boolean;
}

const requiredEnvVars: EnvVar[] = [
    {
        name: 'NEXTAUTH_SECRET',
        required: true,
        description: 'Secret key for JWT encryption (generate with: openssl rand -base64 32)',
        validate: (value) => value.length >= 32,
    },
    {
        name: 'NEXTAUTH_URL',
        required: true,
        description: 'Canonical URL of the application (e.g., https://your-app.vercel.app)',
        validate: (value) => value.startsWith('http://') || value.startsWith('https://'),
    },
    {
        name: 'TURSO_DATABASE_URL',
        required: isProduction,
        description: 'Turso database URL (format: libsql://your-db.turso.io)',
        validate: (value) => value.startsWith('libsql://'),
    },
    {
        name: 'TURSO_AUTH_TOKEN',
        required: isProduction,
        description: 'Turso authentication token (from Turso dashboard)',
    },
];

const optionalEnvVars: EnvVar[] = [
    {
        name: 'RAZORPAY_KEY_ID',
        required: false,
        description: 'Razorpay API Key ID (for payment processing)',
    },
    {
        name: 'RAZORPAY_KEY_SECRET',
        required: false,
        description: 'Razorpay API Key Secret (for payment processing)',
    },
    {
        name: 'NODE_ENV',
        required: false,
        description: 'Node environment (development/production)',
    },
];

function checkEnvVar(envVar: EnvVar): { valid: boolean; message: string } {
    const value = process.env[envVar.name];

    if (!value || value.trim() === '') {
        if (envVar.required) {
            return {
                valid: false,
                message: `❌ MISSING (Required): ${envVar.description}`,
            };
        } else {
            return {
                valid: true,
                message: `⚪ NOT SET (Optional): ${envVar.description}`,
            };
        }
    }

    if (envVar.validate && !envVar.validate(value)) {
        return {
            valid: false,
            message: `❌ INVALID: ${envVar.description}\n   Current value: ${value}`,
        };
    }

    // Mask sensitive values
    const displayValue = envVar.name.includes('SECRET') || envVar.name.includes('TOKEN')
        ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}`
        : value;

    return {
        valid: true,
        message: `✅ SET: ${envVar.description}\n   Value: ${displayValue}`,
    };
}

async function main() {
    console.log('========================================');
    console.log('Environment Verification');
    console.log('========================================\n');
    console.log(`Mode: ${isProduction ? 'Production' : 'Development'}`);
    console.log(`Checking env file: ${envPath}\n`);

    let hasErrors = false;

    console.log('Required Environment Variables:');
    console.log('----------------------------------------');
    for (const envVar of requiredEnvVars) {
        const result = checkEnvVar(envVar);
        console.log(`${envVar.name}:`);
        console.log(`   ${result.message}\n`);
        if (!result.valid) hasErrors = true;
    }

    console.log('\nOptional Environment Variables:');
    console.log('----------------------------------------');
    for (const envVar of optionalEnvVars) {
        const result = checkEnvVar(envVar);
        console.log(`${envVar.name}:`);
        console.log(`   ${result.message}\n`);
    }

    console.log('========================================');
    if (hasErrors) {
        console.log('❌ VERIFICATION FAILED');
        console.log('\nPlease set the missing required environment variables.');
        console.log('Copy .env.example to .env.local and fill in the values.\n');
        process.exit(1);
    } else {
        console.log('✅ VERIFICATION PASSED');
        console.log('\nAll required environment variables are set.\n');
        process.exit(0);
    }
}

main().catch((error) => {
    console.error('Error running verification:', error);
    process.exit(1);
});
