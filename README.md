# TaskNest — Full-Stack Task Management App

A clean, simple, fully functional task management application built with React, Node.js, Express, and PostgreSQL.

---

## Features

- User registration and login with JWT authentication
- Create, view, edit, and delete tasks
- Filter tasks by status and priority
- Task status: TODO, IN_PROGRESS, COMPLETED
- Task priority: LOW, MEDIUM, HIGH
- Dashboard with summary stats
- Mark tasks as completed
- Overdue task indicators
- Password strength validation
- Fully protected routes

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Axios |
| Backend   | Node.js, Express.js                 |
| Auth      | JWT, bcrypt                         |
| Database  | MySQL                               |

---

## Project Structure

```
task-nest/
├── backend/
│   ├── src/
│   │   ├── config/         # App configuration
│   │   ├── controllers/    # Route handlers
│   │   ├── db/             # DB pool, schema, migration
│   │   ├── middleware/     # Auth, error, validation
│   │   ├── models/         # DB query functions
│   │   ├── routes/         # Express routers
│   │   ├── services/       # Business logic
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── context/        # React context (auth)
    │   ├── hooks/          # Custom hooks
    │   ├── pages/          # Page components
    │   ├── services/       # Axios API service
    │   ├── App.jsx         # Router setup
    │   └── main.jsx        # Entry point
    ├── .env.example
    └── package.json
```

---

## Prerequisites

- Node.js 18+
- npm 9+
- MySQL 8+

---

## MySQL Setup

1. Open your MySQL client (MySQL Workbench, mysql CLI, etc.)
2. Create a database:
   ```sql
   CREATE DATABASE tasknest;
   ```
3. Note your connection details (host, port, user, password)

---

## Environment Variables

### Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
DATABASE_URL=mysql://root:yourpassword@localhost:3306/tasknest
JWT_SECRET=your_super_secret_key_at_least_32_chars
NODE_ENV=development
```

### Frontend

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Installation

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## Database Migration

Run the schema migration to create tables:

```bash
cd backend
node src/db/migrate.js
```

This creates the `users` and `tasks` tables with proper indexes and constraints.

---

## Running the Application

### Start the Backend

```bash
cd backend
npm run dev
```

The backend runs at: http://localhost:5000

### Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend runs at: http://localhost:3000

---

## API Endpoints

### Auth

| Method | Endpoint              | Auth | Description        |
|--------|-----------------------|------|--------------------|
| POST   | /api/auth/register    | No   | Register new user  |
| POST   | /api/auth/login       | No   | Login user         |
| GET    | /api/auth/me          | Yes  | Get current user   |

### Tasks

| Method | Endpoint              | Auth | Description        |
|--------|-----------------------|------|--------------------|
| GET    | /api/tasks            | Yes  | Get all user tasks |
| GET    | /api/tasks/:id        | Yes  | Get single task    |
| POST   | /api/tasks            | Yes  | Create task        |
| PUT    | /api/tasks/:id        | Yes  | Update task        |
| DELETE | /api/tasks/:id        | Yes  | Delete task        |

**Query params for GET /api/tasks:** `?status=TODO&priority=HIGH`

### Health

| Method | Endpoint | Auth | Description  |
|--------|----------|------|--------------|
| GET    | /health  | No   | Health check |

---

## Authentication Flow

```
Register / Login
      ↓
JWT Token issued
      ↓
Token stored in localStorage
      ↓
Token sent in Authorization: Bearer <token> header
      ↓
Backend verifies token on protected routes
      ↓
User info attached to request
```

---

## Database Structure

### users

| Column     | Type        | Constraints          |
|------------|-------------|----------------------|
| id         | SERIAL      | PRIMARY KEY          |
| name       | VARCHAR(100)| NOT NULL             |
| email      | VARCHAR(255)| NOT NULL, UNIQUE     |
| password   | VARCHAR(255)| NOT NULL (hashed)    |
| created_at | TIMESTAMPTZ | DEFAULT NOW()        |
| updated_at | TIMESTAMPTZ | DEFAULT NOW()        |

### tasks

| Column      | Type        | Constraints                        |
|-------------|-------------|------------------------------------|
| id          | SERIAL      | PRIMARY KEY                        |
| title       | VARCHAR(255)| NOT NULL                           |
| description | TEXT        |                                    |
| status      | VARCHAR(20) | CHECK (TODO/IN_PROGRESS/COMPLETED) |
| priority    | VARCHAR(10) | CHECK (LOW/MEDIUM/HIGH)            |
| due_date    | DATE        |                                    |
| user_id     | INTEGER     | FK → users.id ON DELETE CASCADE    |
| created_at  | TIMESTAMPTZ | DEFAULT NOW()                      |
| updated_at  | TIMESTAMPTZ | DEFAULT NOW()                      |

---

## Pages

| Route             | Description       | Protected |
|-------------------|-------------------|-----------|
| /login            | Login page        | No        |
| /register         | Register page     | No        |
| /dashboard        | Task dashboard    | Yes       |
| /tasks/new        | Create task form  | Yes       |
| /tasks/:id/edit   | Edit task form    | Yes       |
