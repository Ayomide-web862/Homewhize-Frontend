import React, { useState, useEffect } from "react";
import SuperAdminSidebar from "./Super-AdminSidebar";
import SuperAdminTopbar from "./Super-AdminTopbar";
import "./Super-AdminLayout.css";

export default function SuperAdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };

    if (sidebarOpen) {
      document.addEventListener("keydown", handleKey);
      const el = document.querySelector(".admin-sidebar");
      el?.focus();
    }

    return () => document.removeEventListener("keydown", handleKey);
  }, [sidebarOpen]);

  return (
    <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      <SuperAdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="admin-main">
        <SuperAdminTopbar setSidebarOpen={setSidebarOpen} />
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
