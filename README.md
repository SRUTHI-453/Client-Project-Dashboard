# Real-Time Client Project Dashboard

A full-stack project management dashboard with role-based access control, task management, notifications, activity tracking, and real-time updates.

## Tech Stack

### Backend
- Node.js
- Fastify
- TypeScript
- Prisma 7
- PostgreSQL
- JWT Authentication
- Socket.IO
- node-cron

### Frontend
- React
- TypeScript
- Vite
- React Router
- Axios
- Socket.IO Client

## User Roles

### ADMIN
- View all projects and tasks
- Create and manage projects
- Create and manage tasks
- Assign tasks to developers
- View activities and notifications

### PROJECT_MANAGER
- Create projects
- Manage only projects created by them
- Create and manage tasks within their projects
- Assign tasks to developers
- View project activity

### DEVELOPER
- View assigned tasks
- Update status of assigned tasks
- Receive task assignment notifications
- Receive real-time activity updates

## Main Features

- JWT authentication
- Role-based access control
- Project management
- Task management
- Developer assignment
- Task status management
- Task priorities
- Due dates
- Overdue task tracking
- Activity logs
- Real-time activity feed using Socket.IO
- Database notifications
- Unread notification count
- Refresh token authentication
- PostgreSQL database
- Prisma ORM
- Scheduled overdue-task processing
- REST APIs
- Responsive dashboard UI

## Project Structure

```text
client-project-dashboard/
├── apps/
│   ├── backend/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   └── src/
│   │       ├── auth/
│   │       ├── clients/
│   │       ├── projects/
│   │       ├── tasks/
│   │       ├── activities/
│   │       ├── notifications/
│   │       ├── middleware/
│   │       ├── plugins/
│   │       ├── sockets/
│   │       ├── jobs/
│   │       ├── types/
│   │       ├── utils/
│   │       ├── app.ts
│   │       └── server.ts
│   │
│   └── frontend/
│       ├── src/
│       │   ├── api/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── types/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   └── index.css
│       └── package.json
│
└── README.md

# Backend

## Authentication
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me

## Clients

GET    /api/clients
GET    /api/clients/:id
POST   /api/clients
PATCH  /api/clients/:id
DELETE /api/clients/:id

## Projects

GET    /api/projects
GET    /api/projects/:id
POST   /api/projects
PATCH  /api/projects/:id
DELETE /api/projects/:id

## Tasks

GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id

## Activities

GET /api/projects/:projectId/activities
Notifications
GET   /api/notifications
GET   /api/notifications/unread-count
PATCH /api/notifications/:id/read
PATCH /api/notifications/read-all

## Task Status

TODO
IN_PROGRESS
IN_REVIEW
DONE
Task Priority
LOW
MEDIUM
HIGH
CRITICAL
Authentication

Access tokens are used for authenticated API requests.

Refresh tokens are handled using an HttpOnly cookie.

The frontend sends the access token using:

Authorization: Bearer <access-token>
Real-Time Activity

Socket.IO is used for live activity updates.

Examples of activity events:

Task status changed
Task assigned
Project activity

Activities are stored in PostgreSQL so they remain available after reconnecting.

Notifications

Notifications are persisted in the database.

Supported notification types include:

TASK_ASSIGNED
TASK_IN_REVIEW

The dashboard also displays the unread notification count.

Overdue Tasks

Tasks are checked by a scheduled background job.

A task is considered overdue when:

dueDate < current time

and it has not been completed.

Local Development
Backend
cd apps/backend
npm install

Create .env:

DATABASE_URL=your_postgresql_connection_string
DIRECT_URL=your_direct_postgresql_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
PORT=4000

Run Prisma:

npx prisma generate
npx prisma migrate dev

Seed database:

npx prisma db seed

Start backend:

npm run dev

Backend:

http://localhost:4000
Frontend
cd apps/frontend
npm install
npm run dev

Frontend:

http://localhost:5173
Demo Users

Password for seeded users:

Password@123

Users:

admin@example.com
pm1@example.com
pm2@example.com
dev1@example.com
dev2@example.com
dev3@example.com
dev4@example.com
Example Workflow
Admin Login
    ↓
Create Project
    ↓
Create Task
    ↓
Assign Developer
    ↓
Developer Login
    ↓
View Assigned Task
    ↓
Update Task Status
    ↓
Activity Stored in Database
    ↓
Socket.IO Live Activity
    ↓
Notification / Dashboard Update
Security
Passwords are stored as hashes
JWT authentication
Refresh token support
HttpOnly refresh-token cookie
Role-based API authorization
Project ownership validation
Developer task ownership validation
Environment variables for secrets
Deployment

## Frontend Installation

Open a new terminal:

cd apps/frontend
npm install

Create:

.env

Example:

VITE_API_URL=http://localhost:4000/api
22. Frontend Development Server

Run:

npm run dev

Frontend:

http://localhost:5173
23. Frontend Production Build

Build:

npm run build

Preview production build:

npm run preview

Environment variables must be configured on the deployment platforms.

License

This project was created as a technical assessment project.
