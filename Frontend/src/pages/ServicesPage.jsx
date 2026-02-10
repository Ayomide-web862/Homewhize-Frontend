import React from "react";
import { FaHome, FaSoap, FaCouch } from "react-icons/fa";
import Navbar from '../components/Navbar';
import "./ServicesPage.css";

export default function ServicesPage() {
  const services = [
    {
      category: "Residential & Standard Cleaning",
      icon: <FaHome />,
      details: ["General cleaning", "Standard cleaning", "Deep cleaning"]
    },
    {
      category: "Specialized Cleaning & Restoration",
      icon: <FaCouch />,
      details: ["Post-Renovation cleaning", "Sofa & Upholstery wash", "Rug & Carpet wash"]
    },
    {
      category: "Hygiene & Facility Maintenance",
      icon: <FaSoap />,
      details: ["Janitorial / House upkeep", "Fumigation & Pest control services"]
    }
  ];

  return (
    <div className="services-page">
      <Navbar />

      {/* HERO IMAGE */}
      <div className="services-hero">
        <div className="hero-overlay">
          <h1>Professional Cleaning Services</h1>
          <p>Keeping your home and office spotless with care and precision</p>
        </div>
      </div>

      {/* MAIN CONTENT WRAPPER - matches ShortletsPage */}
      <div className="services-content">
        <section className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="service-icon">{service.icon}</div>
              <h2>{service.category}</h2>
              <ul>
                {service.details.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
