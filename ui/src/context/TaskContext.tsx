import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
import { Task } from '../Types';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => Promise<void>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  toggleTaskCompletion: (taskId: number, completed: boolean) => Promise<void>;
  deleteTask: (taskId:number) => Promise<void>;
  updateTask: (id: number, updatedFields: { title: string; description: string; dueDate: string }) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/task`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) setTasks(res.data);
      console.log(res.data)
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (newTask: Omit<Task, 'id' | 'completed'>) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${BASE_URL}/api/task/add`,
        { ...newTask, completed: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if(res.data)
      setTasks(prev => [...prev, res.data.task]);
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };
  const toggleTaskCompletion = async (taskId: number, completed: boolean) => {
  try {
    
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${BASE_URL}/api/task/update/${taskId}`,
      { completed },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if(res.data){
        setTasks(prev =>
            prev.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );

        console.log("Task completion updated");
    }

  } catch (error) {
    console.error("Error updating task completion:", error);
  }
};
const deleteTask = async(taskId:number) =>{
    try {
        const token = localStorage.getItem('token');
        const newTasks = await axios.post( `${BASE_URL}/api/task/delete/${taskId}`,{},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if(newTasks.status == 200){
        console.log('task deleted successfully');
        setTasks(prev => prev.filter(task => task.id !== taskId));
       }
    } catch (error) {
        console.error("Error updating task completion:", error);
    }
}
const updateTask = async (
  id: number,
  updatedFields: { title: string; description: string; dueDate: string }
) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${BASE_URL}/api/task/update/${id}`,
      updatedFields,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.data) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? { ...task, ...updatedFields }
            : task
        )
      );
    }
  } catch (err) {
    throw new Error("Failed to update task.");
  }
};

  useEffect(() => {
    const token = localStorage.getItem('token');
  if (token) {
    fetchTasks();
  }
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, loading, fetchTasks, addTask, setTasks,toggleTaskCompletion,deleteTask, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTaskContext must be used within a TaskProvider');
  return context;
};
