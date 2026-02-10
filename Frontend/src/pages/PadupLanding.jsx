import React from "react";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import ShortletCard from "../components/ShortletCard";
import Navbar from "../components/Navbar";
import "./PadupLanding.css";

export default function PadupLanding() {
  const shortlets = [
    { image: "/hero.jpg", title: "Prestige Collection", price: "Luxury" },
    { image: "/hero1.jpg", title: "Prime Collection", price: "Standard" },
    { image: "/hero2.jpg", title: "Comfort Living", price: "Economy" },
  ];

  return (
    <div className="padup-container">
      <div className="padup-content">

        {/* NAVBAR */}
        <Navbar />
        
        {/* HERO SECTION */}
        <section className="padup-hero">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Discover Comfort, Style & Premium Living
          </motion.h1>

          <motion.p
            className="padup-hero-subtext"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Find beautifully curated shortlets tailored to your lifestyle.  
            Whether you seek luxury, simplicity, or affordability.
          </motion.p>

          {/* <motion.div
            className="padup-searchbox"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <FiSearch size={20} className="padup-searchicon" />
            <input type="text" placeholder="Search your next destination..." />
          </motion.div> */}

          <div className="padup-values">
            <div className="padup-value-card">Premium Apartments</div>
            <div className="padup-value-card">Instant Booking</div>
            <div className="padup-value-card">Secure Payments</div>
          </div>
        </section>

        {/* CATEGORY SECTION */}
        <section className="padup-section">
          <h2 className="padup-subheading">Explore Our Collections</h2>
          {/* <p className="padup-section-subtext">
            Choose from our range of curated apartments designed for  
            luxury, convenience and unforgettable stays.
          </p> */}

          <div className="padup-card-grid">
            {shortlets.map((item, index) => (
              <ShortletCard key={index} {...item} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
