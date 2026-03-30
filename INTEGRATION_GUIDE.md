# Frontend Backend Integration Guide

## ✅ Changes Completed

### 1. **Type Definitions** (`lib/types/index.ts`)
- Updated `User` interface to include `role` ('user' | 'admin') and proper optional fields
- Added `AuthResponse` interface with `access_token`, `refresh_token`, and user data
- Updated `ChatMessage` and `ChatSession` to match backend entities
- Updated `TravelItinerary` to include all backend fields

### 2. **API Service** (`lib/services/api.ts`)
**Auth Endpoints:**
- `POST /auth/login` - Login with email/password
- `POST /auth/register` - Register new user
- `POST /auth/refresh` - Refresh expired token
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user

**Chat Endpoints:**
- `POST /chat/sessions` - Create new chat session
- `GET /chat/sessions` - List user's chat sessions  
- `GET /chat/:sessionId` - Get specific session
- `POST /chat/:sessionId/messages` - Send message to session

**Travel Endpoints:**
- `POST /travel/generate-itinerary` - Generate new itinerary
- `PUT /travel/itineraries/:id` - Update itinerary
- `GET /travel/itineraries/:id/export?format=pdf|json` - Export itinerary

### 3. **Auth Context** (`lib/context/AuthContext.tsx`)
- ✅ Real API calls instead of mocks
- ✅ Token refresh logic on initialization
- ✅ Automatic token management with localStorage
- ✅ Error handling and clearError function
- ✅ User role support (user/admin)

### 4. **Chat Context** (`lib/context/ChatContext.tsx`)
- ✅ Creates sessions via API
- ✅ Loads session list from backend
- ✅ Sends messages and updates UI
- ✅ Full async/await implementation
- ✅ Error handling for all operations

### 5. **Travel Context** (`lib/context/TravelContext.tsx`)  [NEW]
- ✅ Generate new itineraries
- ✅ Update existing itineraries
- ✅ Export to PDF/JSON
- ✅ Track current and multiple itineraries
- ✅ Error handling

### 6. **Providers** (`app/providers.tsx`)
- ✅ Added TravelProvider to context setup

---

## 🔧 Environment Configuration

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Adjust the URL based on your backend server address.

---

## 📝 Usage Examples

### Authentication
```typescript
import { useAuth } from '@/lib/context/AuthContext';

function LoginPage() {
  const { login, error } = useAuth();
  
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Redirects to dashboard
    } catch (err) {
      console.error(err);
    }
  };
}
```

### Chat
```typescript
import { useChat } from '@/lib/context/ChatContext';

function ChatPage() {
  const { createSession, sendMessage, currentSession } = useChat();
  
  const handleNewChat = async () => {
    await createSession('My Travel Plan');
  };
  
  const handleSendMessage = async (text: string) => {
    const message = await sendMessage(text);
  };
}
```

### Travel
```typescript
import { useTravel } from '@/lib/context/TravelContext';

function ItineraryPage() {
  const { generateItinerary, itinerary } = useTravel();
  
  const handleGenerate = async () => {
    await generateItinerary(
      'Paris',
      '2024-04-01',
      '2024-04-15',
      { budget: 2000, activities: ['museums', 'food'] }
    );
  };
}
```

---

## 🔐 Token Management

Tokens are stored in localStorage with the key `travelai_token`. The AuthContext will:
1. ✅ Verify token on app load
2. ✅ Attempt refresh if token is expired
3. ✅ Clear auth if refresh fails
4. ✅ Include token in all API requests

---

## 🚀 Quick Start

1. Ensure backend is running on `http://localhost:3001`
2. Create `.env.local` with API_URL
3. Test login/register endpoints
4. Chat and Travel endpoints are ready with full integration

---

## 📦 API Response Format

All endpoints return responses in this format:

```typescript
interface ApiResponse<T> {
  data: T;
  // OR
  access_token: string;
  refresh_token: string;
  user: User;
}
```

---

## ⚠️ Important Notes

- Remove any mock data hooks - all data now comes from backend
- Update login/signup pages to use `useAuth()` context
- Chat UI components can use `useChat()` for real sessions
- All API calls are properly typed with TypeScript
- Error handling is consistent across all contexts

