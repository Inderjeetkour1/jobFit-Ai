import React from "react";
import DarkModeToggle from "./DarkModeToggle";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-800 p-6 shadow-md flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">JobFit AI</h2>
        <nav className="space-y-4">
          <Link to="/" className="block text-blue-600 font-medium hover:underline">
            Dashboard
          </Link>
          <Link to="/upload" className="block text-gray-700 dark:text-gray-300 hover:underline">
            Upload Resume (PDF)
          </Link>
          {/* Removed broken AI Analysis Link */}
        </nav>
      </div>

      <div className="mt-6">
        <DarkModeToggle />
      </div>
    </aside>
  );
}

export default Sidebar;
