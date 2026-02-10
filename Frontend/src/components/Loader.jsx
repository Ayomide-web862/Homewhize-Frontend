import React from "react";
import { FaHome } from "react-icons/fa";
import "./Loader.css";

export default function Loader() {
  return (
    <div className="loader-overlay">
      <img
        src="/Homewhize.png"
        alt="HomeWhize Loader"
        className="loader-logo"
      />
    </div>
  );
}
