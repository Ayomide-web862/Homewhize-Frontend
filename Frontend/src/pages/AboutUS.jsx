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
import "./AboutUs.css";

export default function AboutUs() {
  /* ===============================
     STATS
  =============================== */
  const stats = [
    { icon: <FaBuilding />, label: "Properties Managed", value: 120 },
    { icon: <FaUsers />, label: "Happy Clients", value: 350 },
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

  const [typingKey, setTypingKey] = useState(0);

  /* Restart typing after completion */
  const restartTyping = () => {
    setTimeout(() => {
      setTypingKey((prev) => prev + 1);
    }, 2000); // pause before restarting
  };

  /* ===============================
     FRAMER VARIANTS
  =============================== */
  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.025,
      },
    },
  };

  const letter = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const cursor = {
    blink: {
      opacity: [0, 1, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  /* ===============================
     REUSABLE SCROLL FADE VARIANT
  =============================== */
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="about-container">
      <Navbar />

      {/* ===============================
         HERO SECTION
      =============================== */}
      <motion.section
        className="about-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-overlay">
          <h1>About HomeWhize</h1>

          {/* TYPING TEXT */}
          <motion.p
            key={typingKey}
            variants={container}
            initial="hidden"
            animate="visible"
            onAnimationComplete={restartTyping}
          >
            {text.split("").map((char, index) => (
              <motion.span key={index} variants={letter}>
                {char}
              </motion.span>
            ))}

            <motion.span
              variants={cursor}
              animate="blink"
              style={{ marginLeft: "4px" }}
            >
              |
            </motion.span>
          </motion.p>
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
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2>Our Story</h2>
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
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          visible: {
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card"
            variants={fadeUp}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 15px 25px rgba(0,0,0,0.15)",
            }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <h3>
              <CountUp
                start={0}
                end={stat.value}
                duration={2}
                separator=","
                suffix="+"
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
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          visible: {
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        <motion.div
          className="about-card"
          variants={fadeUp}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 15px 25px rgba(0,0,0,0.15)",
          }}
        >
          <FaHome size={40} color="#0F4D3C" />
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
          whileHover={{
            scale: 1.05,
            boxShadow: "0 15px 25px rgba(0,0,0,0.15)",
          }}
        >
          <FaRegHandshake size={40} color="#0F4D3C" />
          <h3>Our Vision</h3>
          <p>
            Our vision is to be Nigeria’s most trusted marketplace where
            customers find ease and owners gain control.
          </p>
        </motion.div>

        <motion.div
          className="about-card"
          variants={fadeUp}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 15px 25px rgba(0,0,0,0.15)",
          }}
        >
          <FaRegSmile size={40} color="#0F4D3C" />
          <h3>Our Values</h3>
          <p>
            Comfort, reliability, style, and exceptional customer experience.
          </p>
        </motion.div>
      </motion.section>
    </div>
  );
}
