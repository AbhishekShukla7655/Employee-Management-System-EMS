# Nexus EMS — Frontend

A production-ready Employee Management System frontend built with React 19, Vite, TailwindCSS, TanStack Query, and React Hook Form.

## Tech Stack

- **React 19** + **Vite 6**
- **React Router DOM v6** — client-side routing
- **TanStack Query v5** — server state & caching
- **React Hook Form v7** — form management
- **Axios** — HTTP client with JWT interceptors & refresh token logic
- **Tailwind CSS v3** — utility-first styling
- **Recharts** — dashboard charts
- **Lucide React** — icons
- **jsPDF + AutoTable** — PDF salary slip generation

## Features

### Authentication
- JWT login / register / logout
- Refresh token with silent retry
- Role-based routing: ADMIN / MANAGER / EMPLOYEE

### Theme
- Dark / Light mode toggle
- Persisted in `localStorage`

### Admin
- Dashboard with charts (headcount, task distribution, department data)
- Full CRUD: Employees, Managers
- Task assignment to managers
- Attendance overview
- Salary generation + PDF slip download
- Role management

### Manager
- Dashboard with team stats & charts
- Team member cards
- Task assignment to employees
- Team attendance view

### Employee
- Personal dashboard (tasks, attendance, salary)
- Task list with inline status update
- Attendance history with monthly filter
- Salary history + PDF slip download
- Profile edit with image upload

## Project Structure

```
src/
├── App.jsx                     # Root with all providers
├── main.jsx                    # Entry point
├── index.css                   # Tailwind + custom CSS
├── context/
│   ├── AuthContext.jsx          # Auth state (user, token, login/logout)
│   └── ThemeContext.jsx         # Dark/Light theme
├── interceptors/
│   └── axiosInstance.js        # Axios + JWT + refresh token interceptors
├── services/
│   └── api.js                  # All API service functions
├── routes/
│   ├── AppRouter.jsx            # All routes defined here
│   └── ProtectedRoute.jsx       # Role-based route guard
├── layouts/
│   ├── AppLayout.jsx            # Sidebar + Topbar shell
│   └── AuthLayout.jsx           # Auth page layout
├── hooks/
│   └── useCommon.js             # usePagination, useSearch, useModal, useConfirm
├── utils/
│   ├── helpers.js               # formatDate, formatCurrency, getInitials, etc.
│   └── pdfGenerator.js          # jsPDF salary slip generator
├── components/
│   ├── common/                  # Avatar, Badge, Button, Input, Modal, etc.
│   └── layout/                  # Sidebar, Topbar
└── pages/
    ├── auth/                    # LoginPage, RegisterPage
    ├── admin/                   # Dashboard, Employees, Managers, Tasks, Attendance, Salary, Roles, Profile
    ├── manager/                 # Dashboard, Team, Tasks, Attendance, Profile
    └── employee/                # Dashboard, Tasks, Attendance, Salary, Profile
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env

# 3. Start dev server (proxies /api → http://localhost:8080)
npm run dev

# 4. Build for production
npm run build
```

## Backend Connection

The Vite dev server proxies `/api` to `http://localhost:8080` (configured in `vite.config.js`).

Make sure the Spring Boot backend is running on port 8080 before starting the frontend.

## Demo Credentials (after seeding backend)

| Role     | Email                  | Password    |
|----------|------------------------|-------------|
| Admin    | admin@nexus.com        | admin123    |
| Manager  | manager@nexus.com      | manager123  |
| Employee | employee@nexus.com     | emp123      |
