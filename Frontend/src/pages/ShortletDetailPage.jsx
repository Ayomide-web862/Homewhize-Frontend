import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./ShortletDetailPage.css";
import { optimizeCloudinaryUrl } from "../utils/imageUtils";

/* FIX LEAFLET ICON */
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
  const [searchParams] = useSearchParams();
  const [shortlet, setShortlet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [bookingReference, setBookingReference] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const api = (await import("../api/axios")).default;
        const { data } = await api.get(`/properties/public/slug/${slug}`);
        console.log('[ShortletDetailPage] API response for slug:', slug);
        console.log('[ShortletDetailPage] Response keys:', Object.keys(data));
        console.log('[ShortletDetailPage] Images field type:', typeof data.images);
        console.log('[ShortletDetailPage] Images field content:', data.images);
        setShortlet(data);
      } catch (err) {
        console.error('[ShortletDetailPage] API Error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  // Check for booking success parameters
  useEffect(() => {
    const bookingSuccess = searchParams.get('booking_success');
    const bookingRef = searchParams.get('booking_reference');

    if (bookingSuccess === '1' && bookingRef) {
      setBookingReference(bookingRef);
      setShowSuccessPopup(true);
      // Clean up URL parameters after showing popup
      navigate(`/shortlets/${slug}`, { replace: true });
    }
  }, [searchParams, navigate, slug]);
  // Hooks for gallery (must be declared unconditionally)
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  const images = Array.isArray(shortlet?.images) ? shortlet.images : [];
  const bookedDates = Array.isArray(shortlet?.booked_dates)
    ? shortlet.booked_dates
    : shortlet?.booked_dates
      ? String(shortlet.booked_dates).split(',').map((d) => d.trim()).filter(Boolean)
      : [];

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

  // USE YOUR CUSTOM LOADER
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

        <p className="caution-fee">
          Caution Fee: ₦{Number(shortlet.caution_fee || shortlet.cautionFee || 0).toLocaleString()}
        </p>

        <p className="meta">
          {shortlet.max_guests} guests • {shortlet.bedrooms} bedrooms
        </p>

        <p className="description">{shortlet.description}</p>

        {/* AVAILABILITY STATUS */}
        <div className="availability-card">
          <div className="availability-header">
            <h3>Availability</h3>
            <span className={`status-pill ${shortlet.is_currently_occupied ? 'occupied' : 'available'}`}>
              <span className="dot"></span>
              {shortlet.is_currently_occupied ? 'Occupied' : 'Available'}
            </span>
          </div>

          <div className="availability-body">
            {shortlet.is_currently_occupied ? (
              <p className="availability-text">
                This property is currently occupied. You can check back later or choose another date.
              </p>
            ) : (
              <p className="availability-text">
                This property is open for booking.
              </p>
            )}

            {bookedDates.length > 0 && (
              <div className="availability-subtext">
                <p>Booked dates (nights already reserved):</p>
                <ul>
                  {bookedDates.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

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

      {/* Booking Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup-overlay" onClick={() => setShowSuccessPopup(false)}>
          <div className="success-popup" onClick={(e) => e.stopPropagation()}>
            <div className="success-popup-header">
              <h2>🎉 Booking Confirmed!</h2>
              <button
                className="success-popup-close"
                onClick={() => setShowSuccessPopup(false)}
                aria-label="Close popup"
              >
                ×
              </button>
            </div>
            <div className="success-popup-body">
              <p>Your booking has been successfully confirmed!</p>
              <p className="booking-reference">
                <strong>Booking Reference:</strong> {bookingReference}
              </p>
              <p>You should receive a confirmation email shortly with all the booking details.</p>
              <div className="success-popup-actions">
                <button
                  className="success-popup-btn primary"
                  onClick={() => setShowSuccessPopup(false)}
                >
                  Continue Browsing
                </button>
                <button
                  className="success-popup-btn secondary"
                  onClick={() => navigate("/profile")}
                >
                  View My Bookings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
