import type React from "react"
export interface Task {
  id: number
  title: string
  description?: string
  dueDate: string
  completed: boolean
}

export interface NavItem {
  name: string
  icon: React.ElementType
  href: string
  active: boolean
}
