"use client"

import { Plus } from "lucide-react"

interface AddTaskButtonProps {
  onClick: () => void
}

export function AddTaskButton({ onClick }: AddTaskButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 p-0 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <Plus className="h-6 w-6 text-white mx-auto" />
      <span className="sr-only">Add task</span>
    </button>
  )
}
