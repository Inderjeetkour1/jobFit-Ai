import React, { useEffect, useState } from "react";

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded-lg"
    >
      {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}

export default DarkModeToggle;
