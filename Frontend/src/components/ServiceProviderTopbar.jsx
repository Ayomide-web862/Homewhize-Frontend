import React, { useState, useRef, useEffect } from "react";
import "./ServiceProviderTopbar.css";
import { FiUser, FiLogOut, FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ServiceProviderTopbar({ setSidebarOpen }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    if (!loggingOut) setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    setLoggingOut(true);

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }, 800);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !loggingOut) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [loggingOut]);

  return (
    <div className="sp-topbar">
      <div className="sp-left">
        <button className="menu-toggle" onClick={() => setSidebarOpen(prev => !prev)}>
          <FiMenu />
        </button>
      </div>

      <div className="sp-right">
        <div className="user-dropdown-wrapper" ref={dropdownRef}>
          <FiUser className="sp-icon" onClick={toggleDropdown} />

          {showDropdown && (
            <div className="user-dropdown">
              <button onClick={handleLogout} disabled={loggingOut}>
                {loggingOut ? (
                  <>
                    <span className="spinner" /> Logging out...
                  </>
                ) : (
                  <> <FiLogOut /> Logout </> 
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}