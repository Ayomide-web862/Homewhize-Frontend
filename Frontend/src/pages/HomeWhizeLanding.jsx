import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiHome,
  FiMapPin,
  FiShield,
  FiStar,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";
import {
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { getPublicProperties, getPublicPropertiesCount } from "../api/properties.api";
import "./HomeWhizeLanding.css";

export default function HomeWhizeLanding() {
  const navigate = useNavigate();
  const [featuredHomes, setFeaturedHomes] = useState([]);
  const [propertyCount, setPropertyCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load properties and count in parallel for optimal performance
        const [propertiesRes, countRes] = await Promise.allSettled([
          getPublicProperties(),
          getPublicPropertiesCount()
        ]);

        // Set property count (loads faster from lightweight endpoint)
        if (countRes.status === 'fulfilled' && countRes.value?.data?.count) {
          setPropertyCount(countRes.value.data.count);
        }

        // Set featured properties
        if (propertiesRes.status === 'fulfilled' && propertiesRes.value?.data) {
          const transformed = propertiesRes.value.data.slice(0, 3).map(property => ({
            id: property.id,
            title: property.name,
            location: property.location,
            price: `₦${property.price.toLocaleString()}`,
            image: property.images && property.images.length > 0 ? property.images[0] : "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
          }));
          setFeaturedHomes(transformed);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to hardcoded data if API fails
        setFeaturedHomes([
          {
            id: 1,
            title: "Modern Apartment",
            location: "Lekki, Lagos",
            price: "₦85,000",
            image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
          },
          {
            id: 2,
            title: "Luxury Shortlet Suite",
            location: "Victoria Island, Lagos",
            price: "₦120,000",
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
          },
          {
            id: 3,
            title: "Cozy Urban Stay",
            location: "Ikoyi, Lagos",
            price: "₦95,000",
            image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: <FiHome />,
      title: "Premium Shortlets",
      text: "Browse well-curated apartments and homes designed for comfort, convenience, and flexible stays.",
    },
    {
      icon: <FiShield />,
      title: "Trusted Experience",
      text: "Enjoy a safer booking process, verified listings, and a platform experience built around reliability.",
    },
    {
      icon: <FiCalendar />,
      title: "Easy Booking",
      text: "Move from discovery to reservation quickly with a clean, simple experience for guests and hosts.",
    },
    {
      icon: <FiUsers />,
      title: "Lifestyle Services",
      text: "Beyond shortlets, connect with helpful home and lifestyle services that make every stay smoother.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Find",
      text: "Search through stylish shortlets and find a space that matches your taste, budget, and location.",
    },
    {
      number: "02",
      title: "Book",
      text: "Choose your preferred dates, review the details, and secure your stay with a smooth booking flow.",
    },
    {
      number: "03",
      title: "Enjoy",
      text: "Arrive, settle in, and enjoy a premium living experience with comfort and convenience in mind.",
    },
  ];

  const testimonials = [
    {
      name: "Damilola A.",
      role: "Guest",
      text: "HomeWhize made finding a clean and stylish shortlet so easy. The process felt smooth from start to finish.",
    },
    {
      name: "Tolu M.",
      role: "Guest",
      text: "I loved how modern and simple the platform felt. It gave me confidence while searching for a place to stay.",
    },
    {
      name: "Chioma E.",
      role: "Guest",
      text: "The listings looked premium and the overall experience felt intentional. It definitely stands out.",
    },
  ];

  return (
    <div className="hw-landing-page">
      <div className="hw-landing-shell">
        <Navbar />

        <main>
          {/* HERO */}
          <section className="hw-hero">
            <div className="hw-hero-left">
              <span className="hw-badge">Premium living, simplified</span>

              <h1>
                Find stylish shortlets and lifestyle services in one place
              </h1>

              <p>
                HomeWhize helps you discover premium shortlets, book with ease,
                and enjoy a seamless stay experience designed for comfort,
                convenience, and peace of mind.
              </p>

              <div className="hw-hero-actions">
                <button
                  className="hw-btn hw-btn-primary"
                  onClick={() => navigate("/shortlets")}
                >
                  Explore Shortlets <FiArrowRight />
                </button>

                <Link to="/services" className="hw-btn hw-btn-secondary">
                  Explore Services
                </Link>
              </div>

              <div className="hw-hero-proof">
                <div className="hw-proof-item">
                  <strong>{loading ? 'Loading...' : propertyCount > 0 ? propertyCount + '+' : '0'}</strong>
                  <span>Curated stays</span>
                </div>
                <div className="hw-proof-item">
                  <strong>98%</strong>
                  <span>Guest satisfaction</span>
                </div>
                <div className="hw-proof-item">
                  <strong>24/7</strong>
                  <span>Support experience</span>
                </div>
              </div>
            </div>

            <div className="hw-hero-right">
              <div className="hw-hero-card hw-main-visual">
                <img
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80"
                  alt="Luxury shortlet interior"
                />
              </div>

              <div className="hw-floating-card hw-floating-card-top">
                <div className="hw-floating-icon">
                  <FiMapPin />
                </div>
                <div>
                  {/* <h4>Lekki, Lagos</h4> */}
                  <p>Modern stays in prime locations</p>
                </div>
              </div>

              <div className="hw-floating-card hw-floating-card-bottom">
                <div className="hw-rating">
                  <FiStar />
                  <span>4.9</span>
                </div>
                <p>Trusted by guests looking for premium comfort</p>
              </div>
            </div>
          </section>

          {/* LOGO STRIP / TRUST */}
          <section className="hw-trust-strip">
            <p>Designed for modern guests, flexible stays, and premium living</p>
          </section>

          {/* FEATURES */}
          <section className="hw-section">
            <div className="hw-section-head">
              <span>Why HomeWhize</span>
              <h2>Everything you need for a better stay experience</h2>
              <p>
                From discovering premium spaces to booking confidently, the
                platform is designed to make every step easier.
              </p>
            </div>

            <div className="hw-features-grid">
              {features.map((feature, index) => (
                <div className="hw-feature-card" key={index}>
                  <div className="hw-feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FEATURED HOMES */}
          <section className="hw-section">
            <div className="hw-section-head hw-section-head-row">
              <div>
                <span>Featured stays</span>
                <h2>Spaces curated for comfort and style</h2>
              </div>

              <button
                className="hw-inline-link"
                onClick={() => navigate("/shortlets")}
              >
                View all shortlets <FiArrowRight />
              </button>
            </div>

            <div className="hw-homes-grid">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <article className="hw-home-card" key={index}>
                    <div className="hw-home-image-wrap" style={{ backgroundColor: '#f5f5f5' }}>
                      <div style={{ height: '200px', backgroundColor: '#e0e0e0' }}></div>
                    </div>
                    <div className="hw-home-content">
                      <div className="hw-home-top">
                        <div style={{ height: '20px', backgroundColor: '#e0e0e0', marginBottom: '8px' }}></div>
                        <div style={{ height: '16px', backgroundColor: '#e0e0e0', width: '60%' }}></div>
                      </div>
                      <div style={{ height: '16px', backgroundColor: '#e0e0e0', marginTop: '8px' }}></div>
                      <div style={{ height: '36px', backgroundColor: '#e0e0e0', marginTop: '16px', borderRadius: '4px' }}></div>
                    </div>
                  </article>
                ))
              ) : (
                featuredHomes.map((home) => (
                  <article className="hw-home-card" key={home.id}>
                    <div className="hw-home-image-wrap">
                      <img src={home.image} alt={home.title} />
                    </div>

                    <div className="hw-home-content">
                      <div className="hw-home-top">
                        <h3>{home.title}</h3>
                        <span>{home.price}/night</span>
                      </div>

                      <p className="hw-home-location">
                        <FiMapPin /> {home.location}
                      </p>

                      <button
                        className="hw-card-btn"
                        onClick={() => navigate("/shortlets")}
                      >
                        Book now
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="hw-section hw-how-it-works">
            <div className="hw-section-head">
              <span>How it works</span>
              <h2>Three simple steps to your next stay</h2>
            </div>

            <div className="hw-steps-grid">
              {steps.map((step, index) => (
                <div className="hw-step-card" key={index}>
                  <div className="hw-step-number">{step.number}</div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ABOUT SPLIT */}
          <section className="hw-about-split">
            <div className="hw-about-image">
              <img
                src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80"
                alt="Beautiful apartment space"
              />
            </div>

            <div className="hw-about-content">
              <span>About the platform</span>
              <h2>
                A modern platform built for people who value comfort and
                convenience
              </h2>
              <p>
                HomeWhize is more than a property platform. It is a lifestyle
                experience designed to connect guests with quality stays and
                essential services in a way that feels effortless.
              </p>

              <div className="hw-check-list">
                <div>
                  <FiCheckCircle />
                  <span>Clean and modern browsing experience</span>
                </div>
                <div>
                  <FiCheckCircle />
                  <span>Premium shortlets in desirable locations</span>
                </div>
                <div>
                  <FiCheckCircle />
                  <span>Seamless path from discovery to booking</span>
                </div>
              </div>

              <Link to="/about-us" className="hw-btn hw-btn-primary hw-fit">
                Learn more <FiArrowRight />
              </Link>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section className="hw-section">
            <div className="hw-section-head">
              <span>Testimonials</span>
              <h2>What people love about HomeWhize</h2>
            </div>

            <div className="hw-testimonial-grid">
              {testimonials.map((item, index) => (
                <div className="hw-testimonial-card" key={index}>
                  <div className="hw-stars">
                    <FiStar />
                    <FiStar />
                    <FiStar />
                    <FiStar />
                    <FiStar />
                  </div>

                  <p>"{item.text}"</p>

                  <div className="hw-testimonial-user">
                    <strong>{item.name}</strong>
                    <span>{item.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="hw-cta">
            <div className="hw-cta-content">
              <span>Ready to get started?</span>
              <h2>Discover your next premium stay with HomeWhize</h2>
              <p>
                Explore beautiful shortlets, enjoy a modern experience, and
                make your next booking with confidence.
              </p>

              <div className="hw-hero-actions hw-cta-actions">
                <button
                  className="hw-btn hw-btn-primary"
                  onClick={() => navigate("/shortlets")}
                >
                  Browse Shortlets <FiArrowRight />
                </button>

                <Link to="/contact" className="hw-btn hw-btn-secondary">
                  Contact us
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* OPTIONAL SOCIALS */}
        {/* <section className="hw-social-strip">
          <a href="/" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="/" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href="/" aria-label="WhatsApp">
            <FaWhatsapp />
          </a>
        </section> */}
      </div>
    </div>
  );
}