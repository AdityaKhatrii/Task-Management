"use client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./Layouts/DashboardLayout";
import { LoginPage } from "./Pages/LoginPage";
import { SignupPage } from "./Pages/SignupPage";
import { TasksPage } from "./Pages/Tasks";
import { TaskProvider } from "./context/TaskContext";
import { Completed } from "./Pages/Completed";

// Define Task type
// interface Task {
//   id: number
//   title: string
//   description: string
//   dueDate: string
//   completed: boolean
// }

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {

  return (
    <BrowserRouter>
    <TaskProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/completed" element={<Completed />} />
          <Route path="/" element={<Navigate to="/tasks" replace />} />
        </Route>
      </Routes>
      </TaskProvider>
    </BrowserRouter>
  )
}

export default App
