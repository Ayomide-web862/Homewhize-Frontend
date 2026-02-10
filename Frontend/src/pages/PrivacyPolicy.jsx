import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Legal.css";

export default function PrivacyPolicy() {
  return (
    <div className="legal-container">
      <Navbar />

      <main className="legal-page">
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: January 2026</p>

        <section>
          <h2>Introduction</h2>
          <p>
            HomeWhize is committed to protecting your privacy. This policy
            explains how we collect, use and safeguard your information.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <ul>
            <li>Personal identification details</li>
            <li>Booking and transaction data</li>
            <li>Usage and device information</li>
          </ul>
        </section>

        <section>
          <h2>Payments</h2>
          <p>
            All payments are securely processed via Paystack. We do not store
            card or bank details.
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
