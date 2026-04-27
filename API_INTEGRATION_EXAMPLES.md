// API Integration Examples

// ============================================================================
// AUTHENTICATION EXAMPLES
// ============================================================================

import { signIn, signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { authService } from '@/lib/services/auth';

// 1. Register a new user
async function handleRegister(email: string, password: string, name: string) {
  try {
    const result = await authService.register(email, password, name);
    console.log('User registered:', result);
    // After registration, redirect to login
  } catch (error) {
    console.error('Registration failed:', error);
  }
}

// 2. Login with credentials
async function handleLogin(email: string, password: string) {
  try {
    const result = await authService.login(email, password);
    console.log('Logged in successfully');
    // Session updates automatically
  } catch (error) {
    console.error('Login failed:', error);
  }
}

// 3. Logout
async function handleLogout() {
  try {
    await authService.logout();
    console.log('Logged out');
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

// 4. Get current session in React component
function UserProfile() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;

  return (
    <div>
      <p>Welcome, {session.user?.name}!</p>
      <p>Email: {session.user?.email}</p>
    </div>
  );
}

// ============================================================================
// CHAT EXAMPLES  
// ============================================================================

import { chatService } from '@/lib/services/api';

// 1. Get all chat sessions
async function getAllSessions() {
  try {
    const response = await chatService.getSessions();
    console.log('Sessions:', response.sessions);
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
  }
}

// 2. Create a new chat session
async function createChatSession(title: string) {
  try {
    const response = await chatService.createSession(title);
    console.log('Created session:', response.session);
    return response.session;
  } catch (error) {
    console.error('Failed to create session:', error);
  }
}

// 3. Get session with all messages
async function getSessionDetails(sessionId: string) {
  try {
    const response = await chatService.getSession(sessionId);
    console.log('Session:', response.session);
    return response.session;
  } catch (error) {
    console.error('Failed to fetch session:', error);
  }
}

// 4. Get messages in a session
async function getSessionMessages(sessionId: string) {
  try {
    const response = await chatService.getMessages(sessionId);
    console.log('Messages:', response.messages);
    return response.messages;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
  }
}

// 5. Send a message to a session
async function sendChatMessage(
  sessionId: string,
  content: string,
  role: 'user' | 'assistant'
) {
  try {
    const response = await chatService.sendMessage(
      sessionId,
      role,
      content,
      { timestamp: new Date().toISOString() }
    );
    console.log('Message sent:', response.message);
    return response.message;
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}

// 6. Update session title
async function updateSessionTitle(sessionId: string, newTitle: string) {
  try {
    const response = await chatService.updateSession(sessionId, newTitle);
    console.log('Session updated:', response.session);
  } catch (error) {
    console.error('Failed to update session:', error);
  }
}

// 7. Delete a session
async function deleteSession(sessionId: string) {
  try {
    const response = await chatService.deleteSession(sessionId);
    console.log('Session deleted');
  } catch (error) {
    console.error('Failed to delete session:', error);
  }
}

// ============================================================================
// COMPLETE CHAT WORKFLOW EXAMPLE
// ============================================================================

// Full example of creating a session and sending messages
export async function chatWorkflow() {
  // 1. Create new session
  const session = await createChatSession('Travel Planning for Paris');
  if (!session) return;

  console.log('Session ID:', session.id);

  // 2. Send user message
  const userMsg = await sendChatMessage(
    session.id,
    'Plan a 5-day trip to Paris',
    'user'
  );

  // 3. Send assistant response (simulated)
  const assistantMsg = await sendChatMessage(
    session.id,
    'Here is a 5-day Paris itinerary...',
    'assistant'
  );

  // 4. Fetch all messages
  const messages = await getSessionMessages(session.id);
  console.log('Total messages:', messages.length);

  // 5. List all sessions
  await getAllSessions();
}

// ============================================================================
// ERROR HANDLING PATTERN
// ============================================================================

async function robustChatOperation(sessionId: string) {
  try {
    // Attempt to fetch session
    const session = await getSessionDetails(sessionId);
    return session;
  } catch (error) {
    // Handle different error types
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        console.error('Session not found');
      } else if (error.message.includes('401')) {
        console.error('Unauthorized - please login');
      } else {
        console.error('Unknown error:', error.message);
      }
    }
    return null;
  }
}
