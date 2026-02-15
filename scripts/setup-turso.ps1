# UV Market School - Turso Database Setup Script (PowerShell)
# This script helps you set up your Turso database for deployment

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "UV Market School - Turso Setup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if Turso credentials are set
if (-not $env:TURSO_DATABASE_URL) {
    Write-Host "Error: TURSO_DATABASE_URL is not set" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please set your Turso database credentials:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host '$env:TURSO_DATABASE_URL="libsql://your-database-name.turso.io"' -ForegroundColor Yellow
    Write-Host '$env:TURSO_AUTH_TOKEN="your-auth-token"' -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Get these from: https://turso.tech → Your Database → Show Credentials"
    exit 1
}

if (-not $env:TURSO_AUTH_TOKEN) {
    Write-Host "Error: TURSO_AUTH_TOKEN is not set" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please set your Turso auth token:" -ForegroundColor Yellow
    Write-Host '$env:TURSO_AUTH_TOKEN="your-auth-token"' -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Turso credentials found" -ForegroundColor Green
Write-Host ""
Write-Host "Database URL: $env:TURSO_DATABASE_URL"
Write-Host ""

# Step 1: Generate Prisma Client
Write-Host "Step 1/3: Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Prisma Client generated" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 2: Push schema to Turso
Write-Host "Step 2/3: Pushing database schema to Turso..." -ForegroundColor Cyan
npx prisma db push --skip-generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database schema created" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to push schema" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Seed database (optional)
Write-Host "Step 3/3: Seeding database with initial data..." -ForegroundColor Cyan
$seed = Read-Host "Do you want to seed the database with sample data? (y/n)"
if ($seed -eq "y" -or $seed -eq "Y") {
    npm run seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database seeded successfully" -ForegroundColor Green
        Write-Host ""
        Write-Host "Default admin credentials:" -ForegroundColor Yellow
        Write-Host "  Email: admin@uvmarketschool.com"
        Write-Host "  Password: admin123"
        Write-Host ""
        Write-Host "⚠️  IMPORTANT: Change this password after first login!" -ForegroundColor Red
    } else {
        Write-Host "✗ Failed to seed database" -ForegroundColor Red
    }
} else {
    Write-Host "Skipping database seed."
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✓ Turso setup complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Deploy to Vercel: https://vercel.com"
Write-Host "2. Add environment variables in Vercel dashboard"
Write-Host "3. Test your deployment"
Write-Host ""
Write-Host "See DEPLOYMENT_GUIDE.md for detailed instructions."
Write-Host ""
