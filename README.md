# Student-Alumni Portal

A full-stack web application that facilitates interaction between students and alumni, enabling event management, networking, and knowledge sharing.

## Features

### For Alumni
- Create and manage events
- Share job opportunities
- Interact with students
- Profile management
- Virtual event hosting capabilities

### For Students
- View and register for events
- Access job opportunities
- Connect with alumni
- Profile management
- Event participation tracking

## Tech Stack

### Frontend
- React.js
- Context API for state management
- Axios for API calls
- Material-UI components
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB for database
- JWT for authentication
- RESTful API architecture

## Project Structure

```
student-alumni-portal/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page components
│       ├── context/       # Context providers
│       └── utils/         # Utility functions
│
└── server/                # Backend Node.js application
    ├── controllers/       # Request handlers
    ├── models/           # Database models
    ├── routes/           # API routes
    └── middleware/       # Custom middleware
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/student-alumni-portal.git
cd student-alumni-portal
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd ../client
npm install
```

4. Create a .env file in the server directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

5. Start the backend server
```bash
cd server
nodemon server.js
```

6. Start the frontend application
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login

### Events
- GET /api/events - Get all events
- POST /api/events - Create new event
- PUT /api/events/:id - Update event
- DELETE /api/events/:id - Delete event

### Users
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped with the development
- Special thanks to the mentors and advisors who provided guidance 
