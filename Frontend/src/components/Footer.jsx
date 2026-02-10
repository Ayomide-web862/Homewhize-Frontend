import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-wrapper">

        {/* BRAND */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/Homewhize.png" alt="HomeWhize Logo" />
          </div>
          <h2>HomeWhize</h2>
          <p>
            Trusted shortlet apartment and reliable cleaning services designed for comfort,
            security and convenience.
          </p>
        </div>

        {/* LINKS */}
        <div className="footer-links">
          <h4>Company</h4>
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms">Terms & Conditions</a>
          <a href="/contact">Contact Us</a>
        </div>

        {/* CONTACT */}
        <div className="footer-contact">
          <h4>Contact</h4>

          <a href="mailto:homewhizeteam@gmail.com">
            Email: homewhizeteam@gmail.com
          </a>

          <a href="tel:+2348163153497">
            Phone: +234 816 315 3497
          </a>

          <p>Rivers State, Nigeria</p>

          <div className="footer-socials">
            {/* <a href="#"><FaFacebookF /></a> */}
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} HomeWhize. All rights reserved.
      </div>
    </footer>
  );
}
