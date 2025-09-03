# Task Tracker Application

A full-stack task management application with user authentication, task CRUD operations, and push notifications.

## Features

- **User Authentication**: Secure signup and login using JWT
- **Task Management**: Create, read, update, and delete tasks
- **Status Toggle**: Mark tasks as pending or completed
- **Task Prioritization**: Set task priorities (low, medium, high)
- **Due Dates**: Assign due dates to tasks
- **Push Notifications**: Receive notifications for task status changes
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Bootstrap for styling
- Axios for API requests
- React Toastify for toast notifications
- Service Workers for push notifications

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt.js for password hashing
- Express Validator for input validation

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Setup Instructions

1. **Clone the repository**

```bash
git clone <repository-url>
cd task-tracker
```

2. **Install server dependencies**

```bash
cd server
npm install
```

3. **Configure environment variables**

Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/tasktracker
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. **Install client dependencies**

```bash
cd ../client
npm install
```

5. **Run the application**

In the server directory:
```bash
npm run dev
```

In the client directory (in a separate terminal):
```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Tasks
- `GET /api/tasks` - Get all tasks for the logged-in user
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PUT /api/tasks/:id/toggle` - Toggle task status (pending/completed)

## Usage Guide

### User Registration and Login
1. Navigate to the Register page
2. Fill in your name, email, and password
3. Submit the form to create an account
4. Use your email and password to login

### Managing Tasks
1. From the dashboard, use the form on the left to add new tasks
2. Fill in the task title, description, priority, and due date
3. Click "Add Task" to create the task
4. View your tasks in the list on the right
5. Use the "Mark Complete" button to toggle task status
6. Click the trash icon to delete a task

### Notifications
1. Allow notifications when prompted
2. Receive notifications when task status changes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Bootstrap for the UI components
- MongoDB for the database
- Express.js for the backend framework
- React.js for the frontend library
