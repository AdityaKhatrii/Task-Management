# Task Management App

A full-stack task management application built with:

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, Prisma ORM
- **Database:** Neon DB postgres (development)
- **Authentication:** JWT
- **State Management:** React Context API

## Features

- User authentication (signup, login, JWT-protected routes)
- Add, view, complete, and delete tasks
- View completed tasks separately
- Responsive dashboard layout with sidebar and navbar
- API integration with protected endpoints

## Project Structure

```
task-man/
│
├── backend/
│   ├── src/
│   │   ├── controller/
│   │   ├── middlewares/
│   │   ├── model/
│   │   ├── routes/
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── package.json
│   └── tsconfig.json
│
└── ui/
    ├── src/
    │   ├── Components/
    │   ├── Pages/
    │   ├── context/
    │   ├── Layouts/
    │   ├── App.tsx
    │   └── main.tsx
    ├── public/
    ├── package.json
    └── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Backend Setup

1. Install dependencies:
    ```bash
    cd backend
    npm install
    ```

2. Set up environment variables:
    - Create a `.env` file in `backend/` with:
      ```
      JWT_SECRET=your_jwt_secret
      ```

3. Set up the database:
    ```bash
    npx prisma migrate dev --name init
    npx prisma generate
    ```

4. Start the backend server:
    ```bash
    npm run dev
    ```

### Frontend Setup

1. Install dependencies:
    ```bash
    cd ui
    npm install
    ```

2. Start the frontend dev server:
    ```bash
    npm run dev
    ```

3. The app will be available at `http://localhost:5173` (or as shown in your terminal).

## API Endpoints

- `POST /api/user/signup` — Register a new user
- `POST /api/user/login` — Login and receive JWT
- `GET /api/task` — Get all tasks (auth required)
- `POST /api/task/add` — Add a new task (auth required)
- `POST /api/task/update/:id` — Update a task (auth required)
- `POST /api/task/delete/:id` — Delete a task (auth required)

## Customization

- Update the database provider in `backend/prisma/schema.prisma` for production.
- Adjust Tailwind config and UI components as needed.

## License

MIT
