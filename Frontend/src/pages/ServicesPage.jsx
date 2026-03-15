import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaSoap, FaCouch } from "react-icons/fa";
import Navbar from "../components/Navbar";
import "./ServicesPage.css";

const SERVICE_CATEGORIES = [
  "Residential & Standard Cleaning",
  "Specialized Cleaning & Restoration",
  "Hygiene & Facility Maintenance",
];

const SERVICE_DATA = SERVICE_CATEGORIES.map((c, i) => {
  const icons = [<FaHome />, <FaCouch />, <FaSoap />];

  const detailsMap = [
    ["General cleaning", "Standard cleaning", "Deep cleaning"],
    ["Post-Renovation cleaning", "Sofa & Upholstery wash", "Rug & Carpet wash"],
    ["Janitorial / House upkeep", "Fumigation & Pest control services"],
  ];

  return {
    slug: encodeURIComponent(c),
    category: c,
    icon: icons[i] || <FaHome />,
    details: detailsMap[i] || [],
  };
});

export default function ServicesPage() {
  const navigate = useNavigate();

  const handleCategoryClick = (slug) => {
    navigate(`/services/${slug}`);
  };

  return (
    <div className="services-page">
      <Navbar />

      <div className="services-hero">
        <div className="hero-overlay">
          <h1>Professional Cleaning Services</h1>
          <p>Keeping your home and office spotless with care and precision</p>
        </div>
      </div>

      <div className="services-content">
        <section className="services-grid">
          {SERVICE_DATA.map((service, index) => (
            <div
              key={service.slug}
              className="service-card"
              style={{ animationDelay: `${index * 0.2}s` }}
              onClick={() => handleCategoryClick(service.slug)}
            >
              <div className="service-icon">{service.icon}</div>

              <h2>{service.category}</h2>

              <ul>
                {service.details.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}