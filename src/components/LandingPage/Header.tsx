"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import api from "../axios/axiosInsatance";

interface Applicant {
  id: string;
  full_name: string;
  profile_photo: string;
}

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
    if (token) {
      // Fetch applicant data if authenticated
      api.get<{ applicant: Applicant }>("dashboard/applicant/").then((res) => {
        setApplicant(res.applicant);
      });
    }
  }, []);

  // Click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the click is on the overlay (which is the direct child of the sidebar container)
      // or if the click is outside the sidebar content and not on the menu button.
      if (
        isMobileMenuOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !menuButtonRef.current?.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    // Escape key to close sidebar
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  if (pathname !== "/") {
    navItems.unshift({ name: "Home", path: "/" });
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    setApplicant(null);
    router.push("/accounts/login");
  };

  const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath)
      return "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"; // Fallback image
    if (imagePath.startsWith("http")) return imagePath;
    return `http://127.0.0.1:8000${imagePath}`;
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-4">
          {/* Mobile Menu Button - Left Side */}
          <div className="md:hidden">
            <button
              ref={menuButtonRef}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-12 h-12 rounded-full border-2 border-blue-600 flex items-center justify-center hover:bg-blue-50 transition-colors duration-300"
            >
              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="w-5 h-0.5 bg-blue-600 rounded-full"></div>
                <div className="w-5 h-0.5 bg-blue-600 rounded-full"></div>
                <div className="w-5 h-0.5 bg-blue-600 rounded-full"></div>
              </div>
            </button>
          </div>

          {/* Logo - Right Side on Mobile */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center text-xl font-bold text-blue-800 md:ml-0 ml-auto"
          >
            <Image
              src="/logo.png"
              alt="DreamExplore Logo"
              width={40}
              height={40}
              className="object-cover rounded-full"
            />
          </button>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className="text-gray-800 font-medium hover:text-blue-800 transition-colors duration-300 cursor-pointer"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons - Right Side */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            {isAuthenticated && applicant ? (
              <div className="relative">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center space-x-3 bg-white border border-gray-200 rounded-xl px-4 py-2 hover:shadow-md transition-all duration-300"
                >
                  <Image
                    src={getImageUrl(applicant.profile_photo)}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-gray-700 font-medium hidden lg:inline">
                    {applicant.full_name}
                  </span>
                  <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => router.push("/accounts/login")}
                  className="text-gray-800 font-medium hover:text-blue-800 transition-colors duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/book-interview")}
                  className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  Book Consultation
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Navigation Menu (Sidebar) */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50" role="dialog">
            {/* Sidebar */}
            <div
              ref={sidebarRef}
              className={`fixed inset-y-0 left-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <i className="fas fa-times text-gray-600"></i>
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="p-4 h-full overflow-y-auto">
                {/* User Profile Section */}
                {isAuthenticated && applicant && (
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-blue-50 mb-6">
                    <Image
                      src={getImageUrl(applicant.profile_photo)}
                      alt="Profile"
                      width={50}
                      height={50}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 truncate">
                        {applicant.full_name}
                      </div>
                      <button
                        onClick={() => handleNavigation("/dashboard")}
                        className="text-sm text-blue-600 hover:underline font-medium"
                      >
                        View Dashboard
                      </button>
                    </div>
                  </div>
                )}

                {/* Navigation Items */}
                <div className="space-y-2 mb-6">
                  {navItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.path)}
                      className="w-full text-left p-4 text-gray-700 font-medium rounded-lg hover:bg-blue-50 hover:text-blue-800 transition-colors duration-200 flex items-center"
                    >
                      <i className="fas fa-chevron-right text-blue-500 mr-3 text-sm"></i>
                      {item.name}
                    </button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 border-t pt-6">
                  <button
                    onClick={() => handleNavigation("/book-interview")}
                    className="w-full bg-gradient-to-r from-blue-800 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                  >
                    <i className="fas fa-calendar-check mr-2"></i>
                    Book Consultation
                  </button>

                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-red-50 text-red-700 py-4 rounded-xl font-semibold hover:bg-red-100 transition-colors duration-300 flex items-center justify-center"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      Logout
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavigation("/accounts/login")}
                      className="w-full bg-gray-100 text-gray-800 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center"
                    >
                      <i className="fas fa-sign-in-alt mr-2"></i>
                      Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
