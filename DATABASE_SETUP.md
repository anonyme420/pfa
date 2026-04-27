# Quick Database Setup Guide

## Option 1: PostgreSQL with Docker (Recommended for Local Development)

### Prerequisites
- Install Docker Desktop: https://www.docker.com/products/docker-desktop

### Setup
```bash
# Start PostgreSQL container
docker-compose up -d

# Verify it's running
docker-compose ps

# Push Prisma schema to database
npx prisma db push
```

### Cleanup
```bash
docker-compose down  # Stops the container (keeps data)
docker-compose down -v  # Stops and deletes all data
```

---

## Option 2: Use Supabase (Cloud - Free Tier)

1. Go to https://supabase.com and create a free account
2. Create a new project
3. In the project settings, copy the PostgreSQL connection string
4. Update `.env` with your connection string:
   ```
   DATABASE_URL="your-supabase-connection-string"
   ```
5. Run: `npx prisma db push`

---

## Option 3: Use Railway (Cloud - Pay as you go, very affordable)

1. Go to https://railway.app
2. Create a new PostgreSQL database
3. Copy the connection string
4. Update `.env` with your connection string
5. Run: `npx prisma db push`

---

## After Database Setup

Once your database is connected:

```bash
# Create the tables
npx prisma db push

# Start the development server
npm run dev

# Visit http://localhost:3000
```

Your app should now work! 🎉
