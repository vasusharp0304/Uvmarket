#!/bin/bash

# UV Market School - Turso Database Setup Script
# This script helps you set up your Turso database for deployment

echo "======================================"
echo "UV Market School - Turso Setup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Turso credentials are set
if [ -z "$TURSO_DATABASE_URL" ]; then
    echo -e "${RED}Error: TURSO_DATABASE_URL is not set${NC}"
    echo ""
    echo "Please set your Turso database credentials:"
    echo ""
    echo -e "${YELLOW}export TURSO_DATABASE_URL=\"libsql://your-database-name.turso.io\"${NC}"
    echo -e "${YELLOW}export TURSO_AUTH_TOKEN=\"your-auth-token\"${NC}"
    echo ""
    echo "Get these from: https://turso.tech → Your Database → Show Credentials"
    exit 1
fi

if [ -z "$TURSO_AUTH_TOKEN" ]; then
    echo -e "${RED}Error: TURSO_AUTH_TOKEN is not set${NC}"
    echo ""
    echo "Please set your Turso auth token:"
    echo -e "${YELLOW}export TURSO_AUTH_TOKEN=\"your-auth-token\"${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Turso credentials found${NC}"
echo ""
echo "Database URL: $TURSO_DATABASE_URL"
echo ""

# Step 1: Generate Prisma Client
echo "Step 1/3: Generating Prisma Client..."
npx prisma generate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Prisma Client generated${NC}"
else
    echo -e "${RED}✗ Failed to generate Prisma Client${NC}"
    exit 1
fi
echo ""

# Step 2: Push schema to Turso
echo "Step 2/3: Pushing database schema to Turso..."
npx prisma db push --skip-generate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database schema created${NC}"
else
    echo -e "${RED}✗ Failed to push schema${NC}"
    exit 1
fi
echo ""

# Step 3: Seed database (optional)
echo "Step 3/3: Seeding database with initial data..."
read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run seed
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database seeded successfully${NC}"
        echo ""
        echo -e "${YELLOW}Default admin credentials:${NC}"
        echo "  Email: admin@uvmarketschool.com"
        echo "  Password: admin123"
        echo ""
        echo -e "${RED}⚠️  IMPORTANT: Change this password after first login!${NC}"
    else
        echo -e "${RED}✗ Failed to seed database${NC}"
    fi
else
    echo "Skipping database seed."
fi

echo ""
echo "======================================"
echo -e "${GREEN}✓ Turso setup complete!${NC}"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Deploy to Vercel: https://vercel.com"
echo "2. Add environment variables in Vercel dashboard"
echo "3. Test your deployment"
echo ""
echo "See DEPLOYMENT_GUIDE.md for detailed instructions."
echo ""
