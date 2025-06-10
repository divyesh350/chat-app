# Real-time Chat Frontend

A modern real-time chat application frontend built with React, Tailwind CSS, and DaisyUI.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Features

### UI Components & Styling
- **DaisyUI Integration**: Modern component library with 30+ themes
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Theme Switching**: Support for multiple themes including:
  - Light/Dark mode
  - Custom themes (cupcake, bumblebee, emerald, etc.)

### Authentication
- User registration
- Login/Logout functionality
- Protected routes
- JWT token management
- Profile management

### Chat Features
- Real-time messaging using Socket.IO
- User list sidebar
- Message history
- Online/Offline status
- Message timestamps
- Read receipts
- **Blink Chat AI Integration**: 
  - Appears as a contact in the sidebar (always available).
  - Accessible by every logged-in user for personal, human-like conversations.
  - Responses powered by Groq API (using models like `mistral-saba-24b`).
  - Displays a "typing..." indicator when the AI is generating a response.

### User Interface Components
- **AuthImagePattern**: Custom animated background for auth pages
- **MessageInput**: Real-time message input with emoji support
- **UserAvatar**: Profile picture display with fallback
- **MessageBubble**: Chat message display with different styles for sent/received
- **Sidebar**: User list with search functionality

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── store/         # State management
│   ├── context/       # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   └── assets/        # Static assets
├── public/            # Public assets
└── index.html         # Entry HTML file
```

## Dependencies

### Core
- react: UI library
- react-dom: React rendering
- react-router-dom: Routing
- socket.io-client: Real-time communication
- zustand: State management
- axios: HTTP client
- groq-sdk: Groq API client for AI bot

### UI & Styling
- tailwindcss: Utility-first CSS
- daisyui: Component library
- lucide-react: Icon library
- react-hot-toast: Toast notifications

### Development
- vite: Build tool
- eslint: Code linting
- postcss: CSS processing

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5001
GROQ_API_KEY=your_groq_api_key_here
```

## Theme Configuration

The application uses DaisyUI for theming. Available themes can be configured in `tailwind.config.js`:

```js
daisyui: {
  themes: [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    // ... more themes
  ]
}
```

## State Management

The application uses Zustand for state management with the following stores:

### 1. Authentication Store (`useAuthStore`)
Manages user authentication state and socket connection:
```js
{
  authUser: null,              // Current authenticated user
  isSigningUp: false,         // Signup loading state
  isLoggingIn: false,         // Login loading state
  isUpdatingProfile: false,   // Profile update loading state
  isCheckingAuth: true,       // Initial auth check state
  onlineUsers: [],            // List of online users
  socket: null,               // Socket.IO instance
}
```

Key methods:
- `checkAuth()`: Verify authentication status
- `signup(data)`: Register new user
- `login(data)`: User login
- `logout()`: User logout
- `updateProfile(data)`: Update user profile
- `connectSocket()`: Initialize socket connection
- `disconnectSocket()`: Clean up socket connection

### 2. Chat Store (`useChatStore`)
Manages chat functionality and messages:
```js
{
  messages: [],               // Current chat messages
  users: [],                  // List of chat users
  selectedUser: null,         // Currently selected chat user
  isUsersLoading: false,      // Users loading state
  isMessagesLoading: false,   // Messages loading state
  isAILoading: false,         // AI response loading state
}
```

Key methods:
- `getUsers()`: Fetch all chat users
- `getMessages(userId)`: Load chat history
- `sendMessage(messageData)`: Send new message
- `subscribeToMessages()`: Listen for new messages
- `unsubscribeFromMessages()`: Clean up message listeners
- `setSelectedUser(user)`: Set active chat user

### 3. Theme Store (`useThemeStore`)
Manages application theming:
```js
{
  theme: "coffee",           // Current theme
  setTheme(theme)           // Update theme
}
```

Features:
- Persistent theme storage in localStorage
- Theme switching with DaisyUI integration
- Default theme fallback

### Store Integration
- Stores are interconnected (e.g., Chat store uses Auth store's socket)
- Real-time updates through Socket.IO
- Automatic state persistence where needed
- Loading states for better UX
- Error handling with toast notifications

## API Integration

The frontend communicates with the backend through:
- RESTful API calls for authentication and user management
- Socket.IO for real-time messaging
- Axios for HTTP requests

## Error Handling

- Form validation with error messages
- API error handling with toast notifications
- Network error handling
- Authentication error handling

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of components
- Optimized image loading
- Efficient state updates with Zustand

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
