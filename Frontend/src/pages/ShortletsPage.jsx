import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { FaGoogle, FaUserPlus, FaTimes } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import ShortletCard from "../components/ShortletCard";
import Navbar from "../components/Navbar";
import "./ShortletsPage.css";
import Loader from "../components/Loader";

export default function ShortletsPage() {
  const navigate = useNavigate();

  const [shortlets, setShortlets] = useState(() => {
    try {
      const cached = localStorage.getItem("cachedShortlets");
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      console.warn("Failed to parse cachedShortlets", e);
      return [];
    }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // ✅ MISSING STATE (FIX)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const dismissed = localStorage.getItem("authPromptDismissed");
    const token = localStorage.getItem("token");

    if (!dismissed && !token) {
      setShowAuthModal(true);
    }
  }, []);

  const closeAuthModal = () => {
    localStorage.setItem("authPromptDismissed", "true");
    setShowAuthModal(false);
  };

  /* GOOGLE LOGIN */
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);

      const res = await api.post("/auth/google", { token: credentialResponse.credential });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Close modal + route back to shortlets page
      setShowAuthModal(false);
      navigate("/", { replace: true });

    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Google signup/login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setMessage("Google Sign-In was unsuccessful. Try again.");
  };

  /* FETCH SHORTLETS */
  useEffect(() => {
    const fetchShortlets = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/properties/public");
        console.log("✅ Shortlets loaded:", data);
        const list = Array.isArray(data) ? data : [];
        setShortlets(list);
        try {
          localStorage.setItem("cachedShortlets", JSON.stringify(list));
        } catch (e) {
          console.warn("Failed to cache shortlets", e);
        }
      } catch (error) {
        console.error("❌ Failed to fetch shortlets:", error);
        setMessage("Failed to load shortlets. Please refresh the page.");
        setShortlets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShortlets();
  }, []);

  const filteredShortlets = shortlets.filter(item =>
    `${item.address} ${item.location}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const slugify = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  return (
    <div className="shortlets-container">
      <div className="shortlets-content">
        <Navbar />

        <main>
          <motion.h1
            className="shortlets-heading"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Find your perfect shortlet
          </motion.h1>

          <div className="shortlets-searchbox">
            <FiSearch size={20} className="shortlets-searchicon" />
            <input
              type="text"
              placeholder="Search for location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <section>
            <h2 className="shortlets-subheading">Available Shortlets</h2>

            {/* small inline refresh indicator when we have cached items but are fetching */}
            {loading && shortlets.length > 0 && (
              <div className="shortlets-refresh-indicator">Refreshing shortlets…</div>
            )}

            <div className="shortlets-card-grid">
              {loading && shortlets.length === 0 ? (
                <div className="shortlets-grid-spinner">
                  <Loader />
                </div>
              ) : filteredShortlets.length > 0 ? (
                filteredShortlets.map(item => (
                  <ShortletCard
                    key={item.id}
                    image={item.image_url}
                    title={item.name}
                    price={item.price}
                    location={`${item.address}, ${item.location}`}
                    guests={item.max_guests}
                    bedrooms={item.bedrooms}
                    minStay={1}
                    onClick={() =>
                      navigate(`/shortlets/${slugify(item.name)}`)
                    }
                  />
                ))
              ) : (
                <p>No shortlets found.</p>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* AUTH MODAL */}
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
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button className="auth-close" onClick={closeAuthModal}>
                <FaTimes />
              </button>

              <h2>Welcome</h2>
              <p>
                Sign up to book shortlets, save favorites, and get exclusive
                deals.
              </p>

              {/* <button className="auth-btn primary">
                <FaUserPlus /> Sign up
              </button> */}

              <button className="auth-btn google">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </button>

              {message && <p className="auth-error">{message}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
