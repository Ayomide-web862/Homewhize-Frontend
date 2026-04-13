import React, { useEffect, useRef, useState, memo } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaUserFriends, FaBed } from "react-icons/fa";
import "./ShortletCard.css";
import { optimizeCloudinaryUrl } from "../utils/imageUtils";

function ShortletCard({
  images = [],
  title,
  price,
  location,
  guests,
  bedrooms,
  minStay,
  onClick,
  is_booked = false,
}) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (images.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, [images.length]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current == null || images.length <= 1) return;

    const dx = e.changedTouches[0].clientX - touchStartX.current;

    if (Math.abs(dx) > 40) {
      if (dx < 0) {
        setIndex((i) => (i + 1) % images.length);
      } else {
        setIndex((i) => (i - 1 + images.length) % images.length);
      }
    }

    touchStartX.current = null;
  };

  const rawSrc = images[index] || "/placeholder-property.jpg";
  const imgSrc =
    rawSrc && typeof rawSrc === "string"
      ? optimizeCloudinaryUrl(rawSrc, 700)
      : rawSrc;

  const formatPrice = Number(price || 0).toLocaleString();

  return (
    <motion.article
      className="shortlet-card"
      onClick={onClick}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
      onMouseEnter={() => clearInterval(intervalRef.current)}
      onMouseLeave={() => {
        if (images.length <= 1) return;
        intervalRef.current = setInterval(() => {
          setIndex((i) => (i + 1) % images.length);
        }, 3000);
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ cursor: "pointer" }}
    >
      <div className="shortlet-img-wrapper">
        <img
          src={imgSrc}
          alt={title}
          className="shortlet-card-image"
          loading="lazy"
        />

        <div
          className={`shortlet-availability ${
            is_booked ? "booked" : "available"
          }`}
        >
          {is_booked ? "Booked" : "Available"}
        </div>

        <div className="shortlet-image-gradient" />

        {images.length > 1 && (
          <div className="shortlet-dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === index ? "active" : ""}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="shortlet-card-body">
        <div className="shortlet-top-row">
          <h3 className="shortlet-title">{title}</h3>
          <p className="shortlet-price">₦{formatPrice}<span>/night</span></p>
        </div>

        <p className="shortlet-location">
          <FaMapMarkerAlt />
          <span>{location}</span>
        </p>

        <div className="shortlet-meta-row">
          <p className="shortlet-meta-item">
            <FaUserFriends />
            <span>{guests} guests</span>
          </p>

          <p className="shortlet-meta-item">
            <FaBed />
            <span>
              {bedrooms} bedroom{bedrooms > 1 ? "s" : ""}
            </span>
          </p>
        </div>

        <p className="shortlet-minstay">
          {minStay || 1} night minimum stay
        </p>
      </div>
    </motion.article>
  );
}

export default memo(ShortletCard);