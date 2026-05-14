import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import {useNavigate} from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()

  return (
    <>
      {/* Navbar */}
      <nav className="sticky bg-[#0d1117] top-0 z-50 shadow">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Hamburger + Brand */}
            <div className="flex justify-start items-center space-x-6">
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-md hover:bg-white/10"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
              <span className="text-2xl font-semibold text-blue-400 cursor-pointer">NoteLog</span>
            </div>

            {/* Right: Profile */}
            <img
              src="https://imgs.search.brave.com/KgU6V_7TgxxBcn0X4LKJtLu2UDB4oIxk4GGshNPPyVc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91bmln/cmVldC5jb20vd3At/Y29udGVudC9zbXVz/aC13ZWJwLzIwMjMv/MDMvQ3V0ZS1jYXQt/UGljdHVyZXMtRm9y/LURwLTc1N3gxMDI0/LmpwZy53ZWJw"
              alt=""
              className="w-10 h-10 rounded-full border-2 border-gray-300"
            />
          </div>
        </div>
      </nav>

      {/* Side Menu Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="relative w-72 bg-[#0d1117] h-full shadow-lg p-6 flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Menu Links */}
            <nav className="mt-10 flex flex-col space-y-4">
              <a 
                onClick={() => navigate('/dashboard')}
                className="text-white hover:text-gray-300 text-lg">
                Dashboard
              </a>
              <a href="#" className="text-white hover:text-gray-300 text-lg">
                Notes
              </a>
              <a href="#" className="text-white hover:text-gray-300 text-lg">
                Features
              </a>
              <a href="#" className="text-white hover:text-gray-300 text-lg">
                About
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
