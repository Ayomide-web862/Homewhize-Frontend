import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";
import "./Contact.css";

export default function Contact() {
  return (
    <div className="contact-wrapper">
      <Navbar />

      <main className="contact-page">
        <section className="contact-hero">
          <span className="contact-badge">Get in Touch</span>
          <h1>Contact HomeWhize</h1>
          <p className="contact-subtitle">
            We’re here to help with bookings, payments, support inquiries, and
            general questions about our services.
          </p>
        </section>

        <section className="contact-content">
          <div className="contact-info-grid">
            <div className="contact-card">
              <div className="contact-icon">
                <FiMail />
              </div>
              <h3>Email Address</h3>
              <p>Send us an email anytime and we’ll respond as soon as possible.</p>
              <a href="mailto:homewhizeteam@gmail.com">
                homewhizeteam@gmail.com
              </a>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <FiPhone />
              </div>
              <h3>Phone Number</h3>
              <p>Reach out directly for urgent support or booking assistance.</p>
              <a href="tel:+2348163153497">+234 816 315 3497</a>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <FiMapPin />
              </div>
              <h3>Office Location</h3>
              <p>Our operations are based in Rivers State, Nigeria.</p>
              <span>Rivers State, Nigeria</span>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <FiClock />
              </div>
              <h3>Working Hours</h3>
              <p>24/7 Availability</p>
              <span></span>
            </div>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  );
}