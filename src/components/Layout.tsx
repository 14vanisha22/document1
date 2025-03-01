import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Search, Menu, X, BrainCircuit, BarChart2 } from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md text-gray-700"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">DocuMind AI</span>
          </div>
        </div>
        <nav className="mt-6 px-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink
            to="/documents"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FileText className="h-5 w-5 mr-3" />
            Documents
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <Search className="h-5 w-5 mr-3" />
            Search
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <BarChart2 className="h-5 w-5 mr-3" />
            Analytics
          </NavLink>
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;