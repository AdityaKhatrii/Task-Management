import { useState } from "react"
import { NavLink } from "react-router-dom"
import {  CheckSquare, Check, Settings, Menu, X } from 'lucide-react'

// Helper function to conditionally join class names
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ")
}

interface NavItem {
  name: string
  icon: React.ElementType
  to: string
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const navItems: NavItem[] = [
    // { name: "Dashboard", icon: LayoutDashboard, to: "/" },
    { name: "Tasks", icon: CheckSquare, to: "/tasks" },
    { name: "Completed", icon: Check, to: "/completed" },
    { name: "Settings", icon: Settings, to: "/settings" },
  ]

  return (
    <>
      {/* Mobile sidebar toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Toggle sidebar</span>
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-center border-b">
          <h2 className="text-xl font-semibold text-blue-600">TaskBoard</h2>
        </div>
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors",
                      isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                    )
                  }
                  end={item.to === "/"}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden" onClick={toggleSidebar} />}
    </>
  )
}
