import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./ShortletDetailPage.css";
import { optimizeCloudinaryUrl } from "../utils/imageUtils";

/* ✅ FIX LEAFLET ICON */
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

export default function ShortletDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [shortlet, setShortlet] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const api = (await import("../api/axios")).default;
        const { data } = await api.get(`/properties/public/slug/${slug}`);
        setShortlet(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);
  // Hooks for gallery (must be declared unconditionally)
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  const images = Array.isArray(shortlet?.images) ? shortlet.images : [];

  useEffect(() => {
    if (!images.length) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % images.length), 3500);
    return () => clearInterval(timer);
  }, [images.length]);

  const onPrev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const onNext = () => setIndex((i) => (i + 1) % images.length);
  const onTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) onNext();
      else onPrev();
    }
    touchStartX.current = null;
  };

  // ✅ USE YOUR CUSTOM LOADER
  if (loading) return <Loader />;
  if (!shortlet) return <p>Shortlet not found</p>;

  return (
    <div className="shortlet-detail-container">
      <Navbar />

      <div className="shortlet-detail-content">
        {/* GALLERY */}
        <div className="shortlet-gallery" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {images.length > 0 ? (
            <>
              <button className="gallery-nav prev" onClick={onPrev} aria-label="Previous image">‹</button>
              <img src={optimizeCloudinaryUrl(images[index], 1200)} alt={shortlet.name} loading="lazy" />
              <button className="gallery-nav next" onClick={onNext} aria-label="Next image">›</button>
              <div className="gallery-dots">
                {images.map((_, i) => (
                  <span key={i} className={`dot ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)} />
                ))}
              </div>
            </>
          ) : (
            <p>No images available</p>
          )}
        </div>

        <h1>{shortlet.name}</h1>

        <p className="location">
          {shortlet.address}, {shortlet.location}
        </p>

        <p className="price">
          ₦{Number(shortlet.price).toLocaleString()}/night
        </p>

        <p className="meta">
          {shortlet.max_guests} guests • {shortlet.bedrooms} bedrooms
        </p>

        <p className="description">{shortlet.description}</p>

        {/* MAP */}
        {shortlet.latitude && shortlet.longitude && (
          <MapContainer
            center={[shortlet.latitude, shortlet.longitude]}
            zoom={13}
            className="shortlet-map"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[shortlet.latitude, shortlet.longitude]} />
          </MapContainer>
        )}

        <button
          className="book-btn"
          onClick={() => navigate("/booking", { state: { shortlet } })}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
