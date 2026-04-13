import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiUser, FiMenu, FiX, FiLogOut, FiHome, FiGrid } from "react-icons/fi";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    syncUser();

    const handleStorageChange = (e) => {
      if (e.key === "user") {
        syncUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest(".hamburger")
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const getUserInitials = (name) => {
    if (!name || typeof name !== "string") return "U";
    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const handleAvatarClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className="hw-navbar">
      <div className="hw-navbar-left">
        <NavLink to="/" className="hw-logo" onClick={closeMenu}>
          <div className="hw-logo-badge">
            <img
              src="/Homewhize.png"
              alt="HomeWhize Logo"
              className="hw-logo-img"
            />
          </div>
          <span className="hw-brand">HomeWhize</span>
        </NavLink>

        <nav
          ref={menuRef}
          className={`hw-nav-links ${menuOpen ? "open" : ""}`}
        >
          <NavLink to="/" end onClick={closeMenu} className="hw-nav-link">
            Home
          </NavLink>

          <NavLink to="/shortlets" onClick={closeMenu} className="hw-nav-link">
            Shortlets
          </NavLink>

          <NavLink to="/services" onClick={closeMenu} className="hw-nav-link">
            Services
          </NavLink>

          <NavLink to="/community" onClick={closeMenu} className="hw-nav-link">
            Community
          </NavLink>

          <NavLink to="/about-us" onClick={closeMenu} className="hw-nav-link">
            About Us
          </NavLink>
        </nav>
      </div>

      <div className="hw-navbar-right">
        {user ? (
          <div className="hw-user-menu" ref={dropdownRef}>
            <button
              type="button"
              className="hw-user-avatar"
              onClick={handleAvatarClick}
              aria-label="Open user menu"
            >
              {getUserInitials(user.name)}
            </button>

            {dropdownOpen && (
              <div className="hw-user-dropdown">
                <div className="hw-user-summary">
                  <span className="hw-user-summary-name">
                    {user.name || "User"}
                  </span>
                  {user.email && (
                    <span className="hw-user-summary-email">{user.email}</span>
                  )}
                </div>

                <button
                  type="button"
                  className="hw-dropdown-item"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/");
                  }}
                >
                  <FiHome size={16} />
                  Home
                </button>

                <button
                  type="button"
                  className="hw-dropdown-item"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/shortlets");
                  }}
                >
                  <FiGrid size={16} />
                  Browse Shortlets
                </button>

                <button
                  type="button"
                  className="hw-dropdown-item logout"
                  onClick={handleLogout}
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <NavLink to="/login" className="hw-login-btn">
            <FiUser size={18} />
            <span>Login</span>
          </NavLink>
        )}

        <button
          type="button"
          className="hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
    </header>
  );
}