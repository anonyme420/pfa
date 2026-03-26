# TravelAI - Frontend Architecture Guide

## 🏗️ Architecture Overview

This is a fully structured Next.js frontend for the TravelAI travel planning chatbot. The architecture follows modern React best practices with clear separation of concerns, scalable state management, and extensive TypeScript typing.

## 📁 Project Structure

```
├── app/
│   ├── auth/
│   │   ├── login/page.tsx       # Login page
│   │   └── signup/page.tsx      # Sign up page
│   ├── chat/
│   │   └── page.tsx             # Main chat/planning interface (protected)
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Global styles
│   └── providers.tsx            # Context providers wrapper
├── components/
│   ├── Navbar.tsx               # Navigation bar with account dropdown
│   ├── Footer.tsx               # Footer with links
│   ├── Sidebar.tsx              # Chat session sidebar
│   └── ChatInterface.tsx         # Main chat UI component
├── lib/
│   ├── context/
│   │   ├── AuthContext.tsx       # Authentication state management
│   │   └── ChatContext.tsx       # Chat sessions state management
│   ├── services/
│   │   ├── api.ts               # API client & business logic
│   │   └── auth.ts              # Local auth/token management
│   └── types/
│       └── index.ts             # TypeScript type definitions
```

## 🔐 Authentication & State Management

### AuthContext (`lib/context/AuthContext.tsx`)
Manages user authentication state:
- **Session State**: User info, authentication status, loading state
- **Methods**:
  - `login(email, password)` - User login
  - `register(email, password, name)` - User registration
  - `logout()` - User logout

Currently uses **local storage** for persistence. When your backend is ready, update the API calls in `authService`.

### ChatContext (`lib/context/ChatContext.tsx`)
Manages chat sessions and messages:
- **Session State**: Current session, all sessions list, loading state
- **Methods**:
  - `createSession(title)` - Create new trip planning chat
  - `addMessage(message)` - Add user/AI message to current session
  - `setCurrentSession(session)` - Switch between chats

## 🔌 API Services Architecture

### `lib/services/api.ts` - Backend Integration Layer
Contains all API business logic with TODO markers for backend endpoints:
- **authService**: Login, register, logout, get current user
- **chatService**: Send message, get chat history, create/list sessions
- **travelService**: Generate itinerary, update itinerary, export

**All API calls are placeholders** - they have TODO comments where actual backend integration is needed.

### `lib/services/auth.ts` - Local Token Management
Manages JWT tokens and user data in localStorage:
- `getToken()` / `setToken()` - Token management
- `getUser()` / `setUser()` - User data persistence
- `isAuthenticated()` - Auth status check

## 📝 Type System

### `lib/types/index.ts` - Comprehensive TypeScript Types
Includes all domain models:
- **User/Auth**: `User`, `AuthSession`
- **Chat**: `ChatMessage`, `ChatSession`
- **Travel**: `TravelItinerary`, `Activity`, `Accommodation`, `Flight`
- **API**: `ApiResponse<T>`, `ChatResponse`

## 🛠️ Key Features

### ✨ Landing Page (`app/page.tsx`)
- Hero section with CTA
- Features showcase (6 feature cards)
- How it works section (4-step process)
- Call-to-action section
- Fully responsive design

### 🔐 Authentication Pages
- **Login** (`app/auth/login/page.tsx`): Email/password login with social options
- **Signup** (`app/auth/signup/page.tsx`): Registration with validation
- Protected routes - redirects to login if not authenticated

### 💬 Chat Interface (`app/chat/page.tsx`)
- **Sidebar**: List of chat sessions, create new chat
- **Chat Panel**: Message display, AI responses, input field
- **Features**:
  - Session persistence
  - Real-time message updates
  - Typing indicators
  - Time stamps
  - Message history

### 🧩 UI Components
- **Navbar**: Responsive navigation with account dropdown
- **Footer**: Links and branding
- **Sidebar**: Session management
- **ChatInterface**: Message display and input

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Configuration

### Environment Variables
Create `.env.local` (copy from `.env.example`):
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Update the API URL once your backend is ready.

## 🔗 Backend Integration Guide

### Step 1: Update API Base URL
In `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

### Step 2: Implement API Endpoints
In `lib/services/api.ts`, replace TODO sections:

#### Auth Service
```typescript
async login(email: string, password: string) {
  return apiCall('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}
```

Expected response:
```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "1",
      "email": "user@example.com",
      "name": "User Name"
    }
  }
}
```

#### Chat Service
```typescript
async sendMessage(sessionId: string, message: string, token: string) {
  return apiCall(`/chat/${sessionId}/messages`, {
    method: 'POST',
    body: { content: message },
    token,
  });
}
```

Expected response:
```json
{
  "success": true,
  "data": {
    "message": {
      "id": "msg_1",
      "role": "assistant",
      "content": "AI response...",
      "timestamp": "2024-03-24T..."
    }
  }
}
```

#### Travel Service
```typescript
async generateItinerary(
  destination: string,
  startDate: string,
  endDate: string,
  preferences: Record<string, any>,
  token: string
) {
  return apiCall('/travel/generate-itinerary', {
    method: 'POST',
    body: { destination, startDate, endDate, preferences },
    token,
  });
}
```

### Step 3: Handle Responses
Update response handling in contexts:
```typescript
const response = await authService.login(email, password);
if (response.success) {
  localAuthService.setToken(response.data.token);
  localAuthService.setUser(response.data.user);
  // ...
}
```

## 🎨 Styling

Uses **Tailwind CSS** v4 with:
- Dark mode support (`dark:` prefix)
- Custom gradients
- Responsive utilities
- Component classes

## 📱 Responsive Design

All components are mobile-first and responsive:
- `sm:` - Small screens (640px+)
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)

## 🔒 Protected Routes

The chat page is protected and redirects unauthenticated users to login:
```typescript
useEffect(() => {
  if (!session.isAuthenticated) {
    router.push('/auth/login');
  }
}, [session.isAuthenticated]);
```

## 🧪 Testing the App

1. **Landing Page**: Visit `/` - see features and CTA
2. **Sign Up**: Click "Sign Up" or visit `/auth/signup`
3. **Login**: Click "Login" or visit `/auth/login`
4. **Chat**: After login, visit `/chat` to start planning
5. **Account**: Click your avatar in navbar for account menu

## 📋 TODOs for Backend Integration

- [ ] Implement `/auth/login` endpoint
- [ ] Implement `/auth/register` endpoint
- [ ] Implement `/auth/logout` endpoint
- [ ] Implement `/auth/me` endpoint (verify JWT)
- [ ] Implement `/chat/sessions` endpoints
- [ ] Implement `/chat/{sessionId}/messages` endpoints
- [ ] Implement AI message generation
- [ ] Implement `/travel/generate-itinerary` endpoint
- [ ] Implement itinerary management endpoints
- [ ] Add error handling and validation
- [ ] Set up database models
- [ ] Configure JWT authentication

## 🔄 State Flow

```
User Input (Navbar/Chat) 
  ↓
Context Hook (useAuth/useChat)
  ↓
API Service (api.ts)
  ↓
Backend API
  ↓
Response Handler
  ↓
Context Update
  ↓
Component Re-render
```

## 🎯 Next Steps

1. **Set up backend** with the endpoints mentioned in Backend Integration Guide
2. **Update API URLs** in `.env.local`
3. **Implement error handling** in API service
4. **Add loading states** to UI components
5. **Test authentication flow**
6. **Implement chat message routing** to AI backend
7. **Add travel data persistence**
8. **Deploy to production**

## 💡 Tips

- All API calls have `// TODO:` comments - use them as guides
- Mock responses are currently enabled for testing (signup = auto-success)
- Local auth works immediately for development
- Use browser DevTools to inspect localStorage (`travelai_token`, `travelai_user`)
- Network tab shows API calls once backend is connected

## 📚 Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Questions?** Check the code comments and TODOs in the codebase for implementation hints!
