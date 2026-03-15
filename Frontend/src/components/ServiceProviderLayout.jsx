import React, { useState, useEffect } from "react";
import ServiceProviderSidebar from "./ServiceProviderSidebar";
import ServiceProviderTopbar from "./ServiceProviderTopbar";
import "./ServiceProviderLayout.css";

export default function ServiceProviderLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };

    if (sidebarOpen) {
      document.addEventListener("keydown", handleKey);
      const el = document.querySelector(".sp-sidebar");
      el?.focus();
    }

    return () => document.removeEventListener("keydown", handleKey);
  }, [sidebarOpen]);

  return (
    <div className={`sp-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      <ServiceProviderSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="sp-main">
        <ServiceProviderTopbar setSidebarOpen={setSidebarOpen} />
        <div className="sp-content">{children}</div>
      </div>
    </div>
  );
}