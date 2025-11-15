"use client";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface NavItem {
  name: string;
  path: string;
  icon?: string;
}

interface HeaderNavItemsProps {
  isAuthenticated: boolean;
  handleNavigation: (path: string) => void;
  navItems: { name: string; path: string }[];
}

export function HeaderNavItems({
  isAuthenticated,
  handleNavigation,
  navItems,
}: HeaderNavItemsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (path: string) => {
    const currentQuery = searchParams.toString();
    const currentPathWithQuery = currentQuery
      ? `${pathname}?${currentQuery}`
      : pathname;

    if (path.includes("?")) {
      return currentPathWithQuery === path;
    }
    return pathname === path && !currentQuery;
  };

  const dashboardNavItems: NavItem[] = [
    { name: "Overview", path: "/dashboard?tab=overview", icon: "fa-home" },
    {
      name: "Applications",
      path: "/dashboard?tab=applications",
      icon: "fa-file-alt",
    },
    {
      name: "Appointments",
      path: "/dashboard?tab=appointment",
      icon: "fa-calendar",
    },
    {
      name: "Billing",
      path: "/dashboard?tab=billing",
      icon: "fa-credit-card",
    },
  ];

  return (
    <>
      {/* Dashboard Navigation (for authenticated users) */}
      {isAuthenticated && (
        <div className="space-y-2 mb-6">
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
            Dashboard
          </div>
          {dashboardNavItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`w-full text-left p-4 font-medium rounded-lg transition-colors duration-200 flex items-center
                ${
                  isActive(item.path)
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                }`}
            >
              <i
                className={`fas ${item.icon} mr-3 text-sm w-4 text-center ${
                  isActive(item.path) ? "text-blue-800" : "text-blue-500"
                }`}
              ></i>
              {item.name}
            </button>
          ))}
          <div className="pt-4">
            <div className="border-t border-gray-200"></div>
          </div>
        </div>
      )}

      {/* General Navigation Items */}
      <div className="space-y-2 mb-6">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            className={`w-full text-left p-4 font-medium rounded-lg transition-colors duration-200 flex items-center
              ${
                isActive(item.path)
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-800"
              }`}
          >
            <i
              className={`fas fa-chevron-right mr-3 text-sm w-4 text-center ${
                isActive(item.path) ? "text-blue-800" : "text-blue-500"
              }`}
            ></i>
            {item.name}
          </button>
        ))}
      </div>
    </>
  );
}
