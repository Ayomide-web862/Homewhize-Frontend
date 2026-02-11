import React, { useState, useRef, useEffect } from "react";
import "./AdminTopbar.css";
import { FiBell, FiSearch, FiUser, FiLogOut, FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AdminTopbar({ setSidebarOpen }) {
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !loggingOut
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [loggingOut]);

  
  return (
    <div className="admin-topbar">
      <button
        className="hamburger"
        aria-label="Toggle sidebar"
        onClick={() => setSidebarOpen(prev => !prev)}
      >
        <FiMenu />
      </button>
      
      <div className="admin-search">
        <FiSearch />
        <input type="text" placeholder="Search..." />
      </div>

      <div className="admin-topbar-right">
        {/* <FiBell className="admin-icon" /> */}

        <div className="user-dropdown-wrapper" ref={dropdownRef}>
          <FiUser className="admin-icon" onClick={toggleDropdown} />

          {showDropdown && (
            <div className="user-dropdown">
              <button onClick={handleLogout} disabled={loggingOut}>
                {loggingOut ? (
                  <>
                    <span className="spinner" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <FiLogOut /> Logout
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
