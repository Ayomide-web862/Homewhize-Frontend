import React, { useEffect, useRef, useState, memo } from "react";
import { motion } from "framer-motion";
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
}) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);
  const touchStartX = useRef(null);

  // autoplay when multiple images
  useEffect(() => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [images.length]);

  const onTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) setIndex((i) => (i + 1) % images.length);
      else setIndex((i) => (i - 1 + images.length) % images.length);
    }
    touchStartX.current = null;
  };

  const rawSrc = images[index] || "/placeholder-property.jpg";
  const imgSrc = rawSrc && typeof rawSrc === 'string' ? optimizeCloudinaryUrl(rawSrc, 600) : rawSrc;

  return (
    <motion.article
      className="shortlet-card"
      onClick={onClick}
      style={{ cursor: "pointer" }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, boxShadow: "0 15px 25px rgba(0,0,0,0.15)" }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => clearInterval(intervalRef.current)}
      onMouseLeave={() => {
        if (images.length <= 1) return;
        intervalRef.current = setInterval(() => setIndex((i) => (i + 1) % images.length), 3000);
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="shortlet-img-wrapper">
        <img src={imgSrc} alt={title} className="shortlet-card-image" loading="lazy" />
        {images.length > 1 && (
          <div className="shortlet-dots">
            {images.map((_, i) => (
              <span key={i} className={`dot ${i === index ? "active" : ""}`} />
            ))}
          </div>
        )}
      </div>

      <div className="shortlet-card-body">
        <h3 className="shortlet-title">{title}</h3>

        <p className="shortlet-price">₦{Number(price).toLocaleString()}/night</p>

        <p className="shortlet-location">{location}</p>

        <p className="shortlet-meta">
          {guests} guests • {bedrooms} bedroom{bedrooms > 1 ? "s" : ""}
        </p>

        <p className="shortlet-minstay">{minStay || 1} night minimum stay</p>
      </div>
    </motion.article>
  );
}

export default memo(ShortletCard);
