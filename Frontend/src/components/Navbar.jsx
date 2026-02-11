import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiClipboard, FiUser, FiMenu, FiX } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="padup-header">
      <div className="padup-left">
        <div className="padup-logo">
          <div className="padup-icon-bg">
            <img
              src="/Homewhize.png"
              alt="HomeWhize Logo"
              className="padup-logo-img"
            />
          </div>

          <span className="padup-brand">HomeWhize</span>
        </div>

        <nav className={`padup-nav ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" onClick={closeMenu} className="nav-link">
            Shortlet
          </NavLink>
          <NavLink to="/services" onClick={closeMenu} className="nav-link">
            Services
          </NavLink>
          <NavLink to="/community" onClick={closeMenu} className="nav-link">
            Community
          </NavLink>
          <NavLink to="/about-us" onClick={closeMenu} className="nav-link">
            About Us
          </NavLink>
        </nav>
      </div>

      <div className="padup-right">
        {/* <NavLink to="" className="padup-icon">
          <FiClipboard size={18} />
        </NavLink> */}

        <NavLink to="/login" className="padup-icon">
          <FiUser size={18} />
        </NavLink>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>
    </header>
  );
}
