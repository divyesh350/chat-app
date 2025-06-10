# Real-time Chat Application

A modern real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring real-time messaging, user authentication, theme customization, and an integrated AI chatbot.

## Project Overview

This project consists of two main parts:

### Backend (`/backend`)
- Node.js/Express.js server
- MongoDB database integration
- Socket.IO for real-time communication
- JWT authentication
- Cloudinary for image uploads
- RESTful API endpoints
- Optimized image upload handling with compression
- Enhanced error handling and timeout management
- **Groq AI Integration**: Provides human-like responses for the AI chatbot.

### Frontend (`/frontend`)
- React with Vite
- Tailwind CSS for styling
- DaisyUI for UI components
- Zustand for state management
- Socket.IO client for real-time features
- Responsive design with multiple themes
- Framer Motion for smooth animations
- Optimized component performance with React.memo
- Lazy loading for images
- Enhanced user interface with modern animations

## Recent Updates

### AI Chatbot Integration
- **Blink Chat AI**: An AI assistant available as a contact in the sidebar for personal, human-like conversations.
- **Always Available**: The AI bot is always accessible, even if no real users are online.
- **Natural Responses**: Utilizes Groq API for fast and natural responses.
- **Typing Indicator**: Displays a "typing..." indicator for improved user experience during AI response generation.

### Performance Improvements
- Optimized sidebar component with React.memo and useCallback
- Implemented lazy loading for user profile images
- Enhanced animation performance with Framer Motion
- Improved state management and component re-rendering

### UI/UX Enhancements
- Added smooth transitions and animations
- Improved online/offline status display
- Enhanced user interface with modern design elements
- Better error handling and user feedback
- Optimized image upload process with compression

### Code Quality
- Better component organization and separation
- Improved code maintainability
- Enhanced error handling
- Better type checking and prop validation
- Optimized socket connection management

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd real-time-chat
```

2. Install dependencies and build the application:
```bash
npm install
npm run build
```

3. Start the server:
```bash
npm start
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5001`

## Deployment

The project is configured for easy deployment with the following scripts in `package.json`:

```json
{
  "scripts": {
    "build": "npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend",
    "start": "npm run start --prefix backend"
  }
}
```

### Deployment Steps:

1. **Build the Application**
```bash
npm run build
```
This command will:
- Install backend dependencies
- Install frontend dependencies
- Build the frontend for production

2. **Start the Server**
```bash
npm start
```
This command will start the backend server in production mode.

### Environment Setup

Before deploying, ensure you have set up the following environment variables:

#### Backend (`.env`)
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5001
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=production
GROQ_API_KEY=your_groq_api_key_here
```

#### Frontend (`.env`)
```env
VITE_API_URL=your_backend_url
```

## Features

- Real-time messaging with optimized performance
- User authentication with enhanced security
- Profile management with image upload support
- Theme customization with modern UI
- Responsive design for all devices
- Real-time online/offline status
- Message history with optimized loading
- Image upload with compression
- Smooth animations and transitions
- Optimized component performance
- Enhanced error handling and user feedback
- **Blink Chat AI**: Integrated AI chatbot for engaging conversations.

## Tech Stack

- **Frontend**: 
  - React with Vite
  - Tailwind CSS with DaisyUI
  - Zustand for state management
  - Socket.IO Client for real-time features
  - Framer Motion for animations
  - React.memo for performance optimization

- **Backend**: 
  - Node.js with Express.js
  - MongoDB for database
  - Socket.IO for real-time communication
  - JWT for authentication
  - Cloudinary for image storage
  - Enhanced error handling
  - **Groq**: AI inference for the chatbot.

- **Development Tools**:
  - Vite for fast development
  - ESLint for code quality
  - Git for version control

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0) - see the [LICENSE](LICENSE) file for details.

This license ensures that:
- The code remains free and open source
- Any derivative works must also be open source
- Users must disclose their source code when distributing the software
- The original copyright notice must be preserved
- The license must be included with any distribution

For more information about the GPL-3.0 license, visit [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).
