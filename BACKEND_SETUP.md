# Backend Setup Guide

Your Next.js application now has an integrated backend with authentication and chat management!

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (local or cloud)

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update the following variables in `.env.local`:

- **DATABASE_URL**: Your PostgreSQL connection string
  ```
  postgresql://username:password@localhost:5432/pfa_db
  ```

- **NEXTAUTH_URL**: Your app URL (http://localhost:3000 for development)

- **NEXTAUTH_SECRET**: Generate a secure secret:
  ```bash
  openssl rand -base64 32
  ```

### 3. Set Up the Database

Initialize Prisma and create the database schema:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev --name init

# (Optional) View database in GUI
npx prisma studio
```

### 4. Start Development Server

```bash
npm run dev
```

Your app will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Create new account
- `POST /api/auth/signin` - Login (handled by NextAuth)
- `POST /api/auth/signout` - Logout (handled by NextAuth)  
- `GET /api/auth/me` - Get current user

### Chat Management

- `GET /api/chat/sessions` - List all chat sessions for user
- `POST /api/chat/sessions` - Create new chat session
- `GET /api/chat/sessions/[sessionId]` - Get single session with messages
- `PUT /api/chat/sessions/[sessionId]` - Update session title
- `DELETE /api/chat/sessions/[sessionId]` - Delete session
- `GET /api/chat/sessions/[sessionId]/messages` - Get all messages in session
- `POST /api/chat/sessions/[sessionId]/messages` - Add new message

## Database Schema

The application uses three main tables:

### Users
- `id`: Unique identifier
- `email`: User email (unique)
- `password`: Hashed password
- `name`: User's name
- `avatar`: User avatar URL
- `role`: User role (user/admin)
- `createdAt`, `updatedAt`: Timestamps

### ChatSessions
- `id`: Session identifier
- `userId`: Reference to User
- `title`: Chat session title
- `createdAt`, `updatedAt`: Timestamps

### ChatMessages  
- `id`: Message identifier
- `sessionId`: Reference to ChatSession
- `role`: Message role (user/assistant)
- `content`: Message text
- `metadata`: Additional data (JSON)
- `createdAt`: Timestamp

## Features

✅ **User Authentication**
- Registration with email & password
- Login with Credentials provider
- JWT-based sessions
- Automatic logout

✅ **User Chats**
- Create unlimited chat sessions
- Store message history per session
- Edit session titles
- Delete sessions and messages

✅ **Security**
- Password hashing with bcryptjs
- Protected API routes (require authentication)
- Session-based security
- CSRF protection via NextAuth

## Useful Commands

```bash
# View/edit database
npx prisma studio

# Create a migration
npx prisma migrate dev --name add_field

# Reset database (DEV ONLY)
npx prisma migrate reset

# Check Prisma schema
npx prisma validate
```

## Next Steps

1. Update your chat pages to use the new API endpoints
2. Add more features (travel itinerary management, AI integration, etc.)
3. Deploy to Vercel, Railway, or your hosting platform
4. Set up production database (managed PostgreSQL service)

## Troubleshooting

**Connection Error**
- Verify PostgreSQL is running
- Check DATABASE_URL is correct
- Ensure database exists

**Auth Not Working**
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

**Prisma Issues**
- Run `npx prisma generate` after install
- Clear node_modules and reinstall if needed
