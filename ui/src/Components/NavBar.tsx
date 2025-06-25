import { useState, useRef, useEffect } from "react"
import { BellIcon, User, ChevronDown } from 'lucide-react'
import { useNavigate } from "react-router-dom"

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  const logout = ()=>{
    localStorage.clear();
    navigate('/login', {replace:true});
  }

  return (
    <header className="border-b bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <h1 className="pl-8 md:pl-0 text-xl font-semibold text-blue-600 md:hidden">TaskBoard</h1>
        <div className="flex-1 md:flex md:items-center md:gap-4">
          <div className="ml-auto flex items-center gap-3 justify-end">
            <button
              className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Notifications"
            >
              <BellIcon className="h-5 w-5" />
            </button>
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 rounded-full p-1 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="User menu"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                  <User className="h-5 w-5" />
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-4 py-2 text-sm text-gray-700 font-medium border-b">My Account</div>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </a>
                  <a href="#"onClick={logout} className="block px-4 py-2 text-sm text-red-500 hover:bg-blue-200">
                    Log out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
