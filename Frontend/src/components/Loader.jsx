import React from "react";
import "./Loader.css";

export default function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader-logo-wrap">
        <img
          src="/Homewhize.png"
          alt="HomeWhize Loader"
          className="loader-logo"
        />
      </div>
    </div>
  );
}