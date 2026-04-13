import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiMapPin,
  FiHome,
  FiShield,
  FiGrid,
  FiArrowRight,
} from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import ShortletCard from "../components/ShortletCard";
import Navbar from "../components/Navbar";
import { useShortlets } from "../hooks/useShortlets";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import "./ShortletsPage.css";
import Loader from "../components/Loader";

export default function ShortletsPage() {
  const navigate = useNavigate();
  const { shortlets, loading, loadingMore, error, hasMore, fetchMore } = useShortlets();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const intersectionObserverRef = useRef(null);

  useEffect(() => {
    const dismissed = localStorage.getItem("authPromptDismissed");
    const token = localStorage.getItem("token");

    if (!dismissed && !token) {
      setShowAuthModal(true);
    }
  }, []);

  const closeAuthModal = useCallback(() => {
    localStorage.setItem("authPromptDismissed", "true");
    setShowAuthModal(false);
  }, []);

  const handleGoogleSuccess = useCallback(
    async (credentialResponse) => {
      try {
        setAuthLoading(true);
        setAuthMessage("");

        const res = await api.post("/auth/google", {
          token: credentialResponse.credential,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        closeAuthModal();
        navigate("/shortlets", { replace: true });
      } catch (error) {
        console.error(error);
        setAuthMessage(
          error.response?.data?.message || "Google signup/login failed"
        );
      } finally {
        setAuthLoading(false);
      }
    },
    [navigate, closeAuthModal]
  );

  const handleGoogleError = useCallback(() => {
    setAuthMessage("Google Sign-In was unsuccessful. Try again.");
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const lastEntry = entries[0];
        if (lastEntry.isIntersecting && hasMore && !loadingMore && !loading) {
          fetchMore();
        }
      },
      { threshold: 0.1 }
    );

    if (intersectionObserverRef.current) {
      observer.observe(intersectionObserverRef.current);
    }

    return () => {
      if (intersectionObserverRef.current) {
        observer.unobserve(intersectionObserverRef.current);
      }
    };
  }, [hasMore, loadingMore, loading, fetchMore]);

  const slugify = useCallback((text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }, []);

  const handleCardClick = useCallback(
    (item) => {
      navigate(`/shortlets/${item.slug || slugify(item.name)}`, {
        state: { shortlet: item },
      });
    },
    [navigate, slugify]
  );

  const filteredShortlets = useMemo(() => {
    return shortlets.filter((item) =>
      `${item.name} ${item.address} ${item.location}`
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase())
    );
  }, [shortlets, debouncedSearchQuery]);

  const stats = useMemo(() => {
    const total = shortlets.length;
    const available = shortlets.filter((item) => !item.is_currently_occupied).length;
    const occupied = shortlets.filter((item) => item.is_currently_occupied).length;

    return { total, available, occupied };
  }, [shortlets]);

  return (
    <div className="shortlets-page">
      <div className="shortlets-page-shell">
        <Navbar />

        <main className="shortlets-main">
          <section className="shortlets-hero">
            <div className="shortlets-hero-copy">
              {/* <span className="shortlets-hero-badge">
                Curated premium stays for modern living
              </span> */}

              <motion.h1
                className="shortlets-heading"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                Discover stylish shortlets designed for comfort, convenience, and class
              </motion.h1>

              <motion.p
                className="shortlets-hero-text"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.08, ease: "easeOut" }}
              >
                Explore thoughtfully selected homes in great locations, book with
                confidence, and enjoy a more refined shortlet experience.
              </motion.p>

              <motion.div
                className="shortlets-search-panel"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.12, ease: "easeOut" }}
              >
                <div className="shortlets-searchbox">
                  <FiSearch size={20} className="shortlets-searchicon" />
                  <input
                    type="text"
                    placeholder="Search by property name, address, or location"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="shortlets-search-cta"
                  onClick={() => {
                    const listingSection = document.getElementById("shortlets-listings");
                    if (listingSection) {
                      listingSection.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                >
                  Browse stays <FiArrowRight />
                </button>
              </motion.div>

              <div className="shortlets-feature-points">
                <div>
                  <FiShield />
                  <span>Trusted stays</span>
                </div>
                <div>
                  <FiMapPin />
                  <span>Prime locations</span>
                </div>
                <div>
                  <FiHome />
                  <span>Comfort-first spaces</span>
                </div>
              </div>
            </div>

            {/* <motion.div
              className="shortlets-hero-card"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="shortlets-hero-card-top">
                <span className="shortlets-mini-label">Stay overview</span>
                <div className="shortlets-mini-grid">
                  <div className="shortlets-mini-stat">
                    <strong>{stats.total}</strong>
                    <span>Total stays</span>
                  </div>
                  <div className="shortlets-mini-stat">
                    <strong>{stats.available}</strong>
                    <span>Available</span>
                  </div>
                  <div className="shortlets-mini-stat">
                    <strong>{stats.occupied}</strong>
                    <span>Occupied</span>
                  </div>
                </div>
              </div>

              <div className="shortlets-hero-card-bottom">
                <div className="shortlets-mini-highlight">
                  <FiGrid />
                  <div>
                    <h4>Professionally curated listings</h4>
                    <p>Clean presentation, accessible browsing, and a premium visual feel.</p>
                  </div>
                </div>
              </div>
            </motion.div> */}
          </section>

          {/* <section className="shortlets-stats-strip">
            <div className="shortlets-stat-box">
              <span className="shortlets-stat-value">{stats.total}</span>
              <span className="shortlets-stat-label">Properties listed</span>
            </div>
            <div className="shortlets-stat-box">
              <span className="shortlets-stat-value">{stats.available}</span>
              <span className="shortlets-stat-label">Currently available</span>
            </div>
            <div className="shortlets-stat-box">
              <span className="shortlets-stat-value">
                {searchQuery ? filteredShortlets.length : stats.total}
              </span>
              <span className="shortlets-stat-label">Search results</span>
            </div>
          </section> */}

          <section className="shortlets-listings-section" id="shortlets-listings">
            <div className="shortlets-section-header">
              <div>
                <span className="shortlets-section-tag">Available stays</span>
                <h2 className="shortlets-subheading">Browse premium shortlet options</h2>
              </div>

              <div className="shortlets-results-pill">
                {searchQuery
                  ? `${filteredShortlets.length} result${filteredShortlets.length !== 1 ? "s" : ""} found`
                  : `${stats.total} listing${stats.total !== 1 ? "s" : ""} available`}
              </div>
            </div>

            {loadingMore && (
              <div className="shortlets-loading-more">
                Loading more shortlets…
              </div>
            )}

            <div className="shortlets-card-grid">
              {loading && shortlets.length === 0 ? (
                <div className="shortlets-grid-spinner">
                  <Loader />
                </div>
              ) : filteredShortlets.length > 0 ? (
                <>
                  {filteredShortlets.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="shortlets-card-item"
                    >
                      <ShortletCard
                        images={
                          Array.isArray(item.images) && item.images.length
                            ? item.images
                            : [item.image_url || "/placeholder-property.jpg"]
                        }
                        title={item.name}
                        price={item.price}
                        location={`${item.address}, ${item.location}`}
                        guests={item.max_guests}
                        bedrooms={item.bedrooms}
                        minStay={1}
                        onClick={() => handleCardClick(item)}
                        is_booked={item.is_currently_occupied}
                      />
                    </motion.div>
                  ))}

                  {hasMore && (
                    <div
                      ref={intersectionObserverRef}
                      className="shortlets-scroll-trigger"
                    />
                  )}
                </>
              ) : (
                <div className="shortlets-empty-state">
                  <div className="shortlets-empty-icon">
                    <FiSearch />
                  </div>
                  <h3>No shortlets match your search</h3>
                  <p>
                    Try a broader location or clear your search to see more available stays.
                  </p>
                  <button
                    type="button"
                    className="shortlets-clear-btn"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="shortlets-error-message">
                <p>{error}</p>
              </div>
            )}
          </section>
        </main>
      </div>

      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            className="auth-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="auth-modal"
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button className="auth-close" onClick={closeAuthModal}>
                <FaTimes />
              </button>

              <span className="auth-pill">Welcome to HomeWhize</span>
              <h2>Sign in for a smoother booking experience</h2>
              <p>
                Save your preferences, access bookings faster, and enjoy a more
                personalized shortlet experience.
              </p>

              <div className="auth-google-wrap">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>

              {authLoading && (
                <p className="auth-loading-text">Signing you in…</p>
              )}

              {authMessage && <p className="auth-error">{authMessage}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}