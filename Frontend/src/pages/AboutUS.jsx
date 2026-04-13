import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaHome,
  FaRegHandshake,
  FaRegSmile,
  FaUsers,
  FaBuilding,
  FaClock,
} from "react-icons/fa";
import CountUp from "react-countup";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./AboutUs.css";

export default function AboutUs() {
  /* ===============================
     STATS
  =============================== */
  const stats = [
    { icon: <FaBuilding />, label: "Properties Managed", value: 20 },
    { icon: <FaUsers />, label: "Happy Clients", value: 50 },
    { icon: <FaClock />, label: "Years of Experience", value: 10 },
  ];

  /* ===============================
     TYPING TEXT
  =============================== */
  const text = `At Homewhize, we are rewriting the future of living and services in Nigeria. 
No more scattered listings, no more uncertainty — we are building the ultimate 
marketplace where shortlets and trusted services converge under one powerful platform. 
We are not just another app; we are a movement. A movement to bring order, trust, and 
convenience into the everyday lives of Nigerians. With Homewhize, every booking, every 
service, every connection is a step toward a smarter, more connected nation.`;

  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;

    const typingInterval = setInterval(() => {
      index += 1;
      setTypedText(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(typingInterval);
        setTimeout(() => setShowCursor(false), 700);
      }
    }, 18);

    return () => clearInterval(typingInterval);
  }, [text]);

  /* ===============================
     FRAMER VARIANTS
  =============================== */
  const fadeUp = {
    hidden: { opacity: 0, y: 45 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <div className="about-page-wrapper">
      <Navbar />

      <main className="about-container">
        {/* ===============================
           HERO SECTION
        =============================== */}
        <motion.section
          className="about-hero"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="hero-overlay">
            {/* <div className="hero-badge">About Us</div> */}

            <h1>About HomeWhize</h1>

            <p className="hero-typed-text">
              {typedText}
              {showCursor && <span className="typing-cursor">|</span>}
            </p>
          </div>
        </motion.section>

        {/* ===============================
           OUR STORY
        =============================== */}
        <motion.section
          className="about-overview"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="section-heading">
            <span className="section-tag">Who We Are</span>
            <h2>Our Story</h2>
          </div>

          <p>
            HomeWhize was founded to provide exceptional property management and
            shortlet experiences. Our mission is to combine comfort, luxury, and
            professional service to create unforgettable stays.
          </p>
        </motion.section>

        {/* ===============================
           STATS SECTION
        =============================== */}
        <motion.section
          className="about-stats"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              variants={fadeUp}
              whileHover={{ y: -8 }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <h3>
                <CountUp
                  start={0}
                  end={stat.value}
                  duration={2}
                  separator=","
                  suffix="+"
                  enableScrollSpy
                  scrollSpyOnce
                />
              </h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* ===============================
           MISSION / VISION / VALUES
        =============================== */}
        <motion.section
          className="about-mission-vision"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            className="about-card"
            variants={fadeUp}
            whileHover={{ y: -8 }}
          >
            <div className="about-card-icon">
              <FaHome />
            </div>
            <h3>Our Mission</h3>
            <p>
              At Homewhize, we don’t just connect guests and owners — we redefine
              short-term stays with trusted homes, clear services, and effortless
              solutions that just work.
            </p>
          </motion.div>

          <motion.div
            className="about-card"
            variants={fadeUp}
            whileHover={{ y: -8 }}
          >
            <div className="about-card-icon">
              <FaRegHandshake />
            </div>
            <h3>Our Vision</h3>
            <p>
              Our vision is to be Nigeria’s most trusted marketplace where
              customers find ease and owners gain control.
            </p>
          </motion.div>

          <motion.div
            className="about-card"
            variants={fadeUp}
            whileHover={{ y: -8 }}
          >
            <div className="about-card-icon">
              <FaRegSmile />
            </div>
            <h3>Our Values</h3>
            <p>
              Comfort, reliability, style, and exceptional customer experience.
            </p>
          </motion.div>
        </motion.section>
      </main>

      {/* <Footer /> */}
    </div>
  );
}