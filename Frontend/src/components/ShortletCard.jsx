import React from "react";
import { motion } from "framer-motion";
import "./ShortletCard.css";

export default function ShortletCard({
  image,
  title,
  price,
  location,
  guests,
  bedrooms,
  minStay,
  onClick,
}) {
  return (
    <motion.article
      className="shortlet-card"
      onClick={onClick}
      style={{ cursor: "pointer" }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, boxShadow: "0 15px 25px rgba(0,0,0,0.15)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="shortlet-img-wrapper">
        <img
          src={image || "/placeholder-property.jpg"}
          alt={title}
          className="shortlet-card-image"
        />
      </div>

      <div className="shortlet-card-body">
        <h3 className="shortlet-title">{title}</h3>

        <p className="shortlet-price">
          ₦{Number(price).toLocaleString()}/night
        </p>

        <p className="shortlet-location">{location}</p>

        <p className="shortlet-meta">
          {guests} guests • {bedrooms} bedroom{bedrooms > 1 ? "s" : ""}
        </p>

        <p className="shortlet-minstay">
          {minStay || 1} night minimum stay
        </p>
      </div>
    </motion.article>
  );
}
