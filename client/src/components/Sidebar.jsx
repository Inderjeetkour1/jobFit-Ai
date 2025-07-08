import React from "react";
import DarkModeToggle from "./DarkModeToggle";

function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-800 p-6 shadow-md flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">JobFit AI</h2>
        <nav className="space-y-4">
          <a href="#" className="block text-blue-600 font-medium hover:underline">
            Dashboard
          </a>
          <a href="#" className="block text-gray-700 dark:text-gray-300 hover:underline">
            Upload Resume
          </a>
          <a href="#" className="block text-gray-700 dark:text-gray-300 hover:underline">
            AI Analysis
          </a>
        </nav>
      </div>

      {/* 👇 Add the toggle at the bottom */}
      <div className="mt-6">
        <DarkModeToggle />
      </div>
    </aside>
  );
}

export default Sidebar;
