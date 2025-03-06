# Real-time Chat Application

A modern real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring real-time messaging, user authentication, and theme customization.

## Project Overview

This project consists of two main parts:

### Backend (`/backend`)
- Node.js/Express.js server
- MongoDB database integration
- Socket.IO for real-time communication
- JWT authentication
- Cloudinary for image uploads
- RESTful API endpoints

### Frontend (`/frontend`)
- React with Vite
- Tailwind CSS for styling
- DaisyUI for UI components
- Zustand for state management
- Socket.IO client for real-time features
- Responsive design with multiple themes

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
```

#### Frontend (`.env`)
```env
VITE_API_URL=your_backend_url
```

## Documentation

For detailed documentation about each part of the application, please refer to:

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## Features

- Real-time messaging
- User authentication
- Profile management
- Theme customization
- Responsive design
- Online/Offline status
- Message history
- Image upload support

## Tech Stack

- **Frontend**: React, Tailwind CSS, DaisyUI, Zustand, Socket.IO Client
- **Backend**: Node.js, Express.js, MongoDB, Socket.IO, JWT
- **Deployment**: Vite, Node.js
- **Storage**: MongoDB, Cloudinary

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0) - see the [LICENSE](LICENSE) file for details.

This license ensures that:
- The code remains free and open source
- Any derivative works must also be open source
- Users must disclose their source code when distributing the software
- The original copyright notice must be preserved
- The license must be included with any distribution

For more information about the GPL-3.0 license, visit [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).
