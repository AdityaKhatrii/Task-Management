import { useState } from 'react';
import { TaskCard } from '../Components/TaskCard';
import { AddTaskButton } from '../Components/AddTaskButton';
import { AddTaskDialog } from '../Components/AddTaskDialog';
import { Task } from '../Types';
import { Loader2 } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';

export function TasksPage() { 
  const { tasks, loading, addTask,toggleTaskCompletion,deleteTask} = useTaskContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleAddTask = async (newTaskData: Omit<Task, 'id' | 'completed'>) => {
    await addTask(newTaskData);
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Tasks</h1>
      {loading ? (
        <div className="flex items-center justify-center h-4/5">
          <Loader2 className="h-14 w-14 animate-spin text-gray-600" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onToggleComplete={() => toggleTaskCompletion(task.id, !task.completed)} 
              deleteTask={()=>{deleteTask(task.id)}}
            />
          ))}
        </div>
      )}
      <AddTaskButton onClick={() => setIsDialogOpen(true)} />
      <AddTaskDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onAddTask={handleAddTask} 
      />
    </>
  );
}