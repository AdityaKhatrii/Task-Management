"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"

// Helper function to conditionally join class names
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ")
}

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: (task: { title: string; description: string; dueDate: string }) => void
}

export function AddTaskDialog({ open, onOpenChange, onAddTask }: AddTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close dialog
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, onOpenChange])

  // Handle ESC key to close dialog
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [open, onOpenChange])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !date) return

    onAddTask({
      title,
      description,
      dueDate: date.toISOString().split("T")[0],
    })

    // Reset form
    setTitle("")
    setDescription("")
    setDate(null)

    onOpenChange(false)
  }

  if (!open) return null

  // Generate dates for the simple date picker
  const generateDates = () => {
    const today = new Date()
    const month = today.getMonth()
    const year = today.getFullYear()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1
      const date = new Date(year, month, day)
      return { day, date }
    })
  }

  const dates = generateDates()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div ref={dialogRef} className="relative w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-medium text-gray-900">Add New Task</h2>
            <p className="mt-1 text-sm text-gray-500">Create a new task with a title, description, and due date.</p>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <div className="relative mt-1">
                <button
                  type="button"
                  id="dueDate"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className={cn(
                    "flex w-full items-center rounded-md border border-gray-300 bg-white py-2 px-3 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm",
                    !date && "text-gray-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                  {date ? format(date, "PPP") : "Select a date"}
                </button>
                {showDatePicker && (
                  <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
                    <div className="p-2">
                      <div className="mb-2 px-2 py-1 font-medium text-sm text-gray-700 border-b">
                        {format(new Date(), "MMMM yyyy")}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {dates.map(({ day, date: dateObj }) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              setDate(dateObj)
                              setShowDatePicker(false)
                            }}
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full hover:bg-blue-100",
                              date &&
                                format(date, "yyyy-MM-dd") === format(dateObj, "yyyy-MM-dd") ?
                                "bg-blue-500 text-white" : undefined,
                            )}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !date}
              className="rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
