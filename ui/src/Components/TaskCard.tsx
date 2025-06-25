"use client"

import { format } from "date-fns"
import { Calendar, Clock, Trash2 } from "lucide-react"
import { Task } from "../Types" 
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ")
}


interface TaskCardProps {
  task: Task
  onToggleComplete: () => void,
  deleteTask: ()=>void
}

export function TaskCard({ task, onToggleComplete,deleteTask }: TaskCardProps) {
  const formattedDate = format(new Date(task.dueDate), "MMM d, yyyy")
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed

  return (
    <div
      className={cn(
        "group relative border rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md",
        task.completed && "bg-gray-50",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 flex justify-between items-center gap-4 h-full flex-col">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={onToggleComplete}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div>
           <Trash2 className="bg-transparent hover:bg-slate-300 h-8 p-1 rounded" 
           style={{color:"red"}} onClick={deleteTask} />
          </div>
        </div>
        <div className="flex-1">
          <h3 className={cn("text-lg font-medium text-gray-800", task.completed && "text-gray-500 line-through")}>
            {task.title}
          </h3>
          <p className={cn("mt-1 text-sm text-gray-600", task.completed && "text-gray-400")}>{task.description}</p>
          <div
            className={cn(
              "mt-3 flex items-center text-xs",
              isOverdue ? "text-red-500" : "text-gray-500",
              task.completed && "text-gray-400",
            )}
          >
            <Calendar className="mr-1 h-3.5 w-3.5" />
            <span>{formattedDate}</span>
            {isOverdue && (
              <span className="ml-2 flex items-center text-red-500">
                <Clock className="mr-1 h-3.5 w-3.5" />
                Overdue
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
