# Real-time Chat Backend

This is the backend server for a real-time chat application built with Node.js, Express, and Socket.IO.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account (for image uploads)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5001
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key_here
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. For production:
```bash
npm start
```

## API Routes

### Authentication Routes (`/api/auth`)

- `POST /signup` - Register a new user
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /logout` - Logout user
- `PUT /update-profile` - Update user profile (Protected)
- `GET /check` - Check authentication status (Protected)

### Message Routes (`/api/messages`)

- `GET /users` - Get all users for sidebar (Protected)
- `GET /:id` - Get messages with a specific user (Protected)
- `POST /send/:id` - Send message to a specific user (Protected)
  ```json
  {
    "message": "Hello!"
  }
  ```

### AI Chat Routes (`/api/ai`)

- `POST /chat` - Send message to Blink Chat AI and get a response (Protected)
  ```json
  {
    "text": "Hello, AI!"
  }
  ```

## Dependencies

- express: Web framework
- mongoose: MongoDB ODM
- socket.io: Real-time communication
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- cloudinary: Image upload service
- cors: Cross-origin resource sharing
- cookie-parser: Cookie parsing
- morgan: HTTP request logger
- multer: File upload handling
- groq-sdk: Groq API client for AI bot

## Development Dependencies

- nodemon: Auto-restart server during development

## Security

- All routes except signup and login are protected with JWT authentication
- Passwords are hashed using bcrypt
- CORS is enabled for frontend communication
- Environment variables are used for sensitive data

## Error Handling

The API returns appropriate HTTP status codes and error messages in the following format:

```json
{
  "error": "Error message here"
}
```

## Socket.IO Events

The server implements real-time messaging using Socket.IO. Events include:

- `connection`: When a client connects
- `disconnect`: When a client disconnects
- `sendMessage`: When a message is sent
- `newMessage`: When a new message is received 