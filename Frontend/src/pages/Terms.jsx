import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Legal.css";

export default function Terms() {
  return (
    <div className="legal-container">
      <Navbar />

      <main className="legal-page">
        <h1>Terms & Conditions</h1>
        <p className="legal-updated">Last updated: January 2026</p>

        <section>
          <h2>Use of Platform</h2>
          <p>
            By accessing HomeWhize, you agree to comply with all terms stated
            herein.
          </p>
        </section>

        <section>
          <h2>Bookings & Payments</h2>
          <p>
            Bookings are confirmed only after successful payment via Paystack.
          </p>
        </section>

        <section>
          <h2>Liability</h2>
          <p>
            HomeWhize shall not be liable for indirect losses arising from use
            of the platform.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <a href="mailto:homewhizeteam@gmail.com">
            homewhizeteam@gmail.com
          </a>
        </section>
      </main>
    </div>
  );
}
