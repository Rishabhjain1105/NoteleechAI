import React, { useState } from "react";
import { Menu, X, LayoutDashboard, NotebookText, Home, LogOut } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function NotelogNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  const navLinks = [
    { name: 'Home',      icon: Home,            action: () => navigate('/') },
    { name: 'Dashboard', icon: LayoutDashboard,  action: () => navigate('/dashboard') },
    { name: 'NoteLog',   icon: NotebookText,     action: () => navigate('/notelog') },
  ];

  return (
    <>
      <nav className="sticky bg-[#0d1117] top-0 z-50 shadow">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Left: Hamburger + Brand */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-md hover:bg-white/10 transition-colors"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
              <span
                onClick={() => navigate('/')}
                className="text-2xl font-semibold text-blue-400 cursor-pointer"
              >
                NoteLog
              </span>
            </div>

            {/* Right: Desktop nav links + Sign Out */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <button
                  key={link.name}
                  onClick={link.action}
                  className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm font-medium transition-colors"
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </button>
              ))}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm font-medium transition-colors ml-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

            {/* Mobile: profile avatar */}
            <img
              src="https://imgs.search.brave.com/KgU6V_7TgxxBcn0X4LKJtLu2UDB4oIxk4GGshNPPyVc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91bmln/cmVldC5jb20vd3At/Y29udGVudC9zbXVz/aC13ZWJwLzIwMjMv/MDMvQ3V0ZS1jYXQt/UGljdHVyZXMtRm9y/LURwLTc1N3gxMDI0/LmpwZy53ZWJw"
              alt="profile"
              className="w-10 h-10 rounded-full border-2 border-gray-300 md:hidden"
            />
          </div>
        </div>
      </nav>

      {/* Side Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative w-72 bg-[#0d1117] h-full shadow-lg p-6 flex flex-col border-r border-[#30363d]">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-semibold text-blue-400 mt-2 mb-8">NoteLeech AI</h2>

            <nav className="flex flex-col space-y-2 flex-1">
              {navLinks.map(link => (
                <button
                  key={link.name}
                  onClick={() => { link.action(); setIsOpen(false); }}
                  className="flex items-center gap-3 text-white hover:text-blue-400 hover:bg-white/5 rounded-lg px-3 py-2.5 text-base transition-colors text-left"
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </button>
              ))}
            </nav>

            {/* Sign Out at bottom */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg px-3 py-2.5 text-base transition-colors mt-4"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </>
  );
}