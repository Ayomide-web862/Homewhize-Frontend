import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Contact.css";

export default function Contact() {
  return (
    <div className="contact-container">
      <Navbar />

      <main className="contact-page">
        <h1>Contact Us</h1>
        <p className="contact-subtitle">
          We’re available to assist with bookings and payments.
        </p>

        <div className="contact-grid">
          <div>
            <h3>Email</h3>
            <a href="mailto:homewhizeteam@gmail.com">
              homewhizeteam@gmail.com
            </a>
          </div>

          <div>
            <h3>Phone</h3>
            <a href="tel:+2348163153497">
              +234 816 315 3497
            </a>
          </div>

          <div>
            <h3>Office</h3>
            <p>Rivers State, Nigeria</p>
          </div>
        </div>
      </main>
    </div>
  );
}
