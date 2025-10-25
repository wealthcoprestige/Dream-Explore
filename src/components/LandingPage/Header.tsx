"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  const navItems = [
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  if (pathname !== "/") {
    navItems.unshift({ name: "Home", path: "/" });
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center text-xl font-bold text-blue-800"
          >
            <i className="fas fa-globe-americas mr-2"></i>
            <span className="hidden sm:inline">Dream Abroad</span>
            <span className="sm:hidden">DA</span>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div
                key={item.name}
                onClick={() => router.push(item.path)}
                className="text-gray-800 font-medium hover:text-blue-800 transition-colors duration-300 cursor-pointer"
              >
                {item.name}
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={() => router.push("/dashboard")}
                className="text-gray-800 font-medium hover:text-blue-800 transition-colors duration-300"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => router.push("/accounts/login")}
                className="text-gray-800 font-medium hover:text-blue-800 transition-colors duration-300"
              >
                Login
              </button>
            )}
            <button
              onClick={() => router.push("/book-interview")}
              className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Book Consultation
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
