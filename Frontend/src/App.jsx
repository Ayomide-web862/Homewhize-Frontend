import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import PadupLanding from "./pages/PadupLanding";
import ShortletsPage from "./pages/ShortletsPage";
import ShortletDetailPage from "./pages/ShortletDetailPage";
import ServicesPage from "./pages/ServicesPage";
import CommunityPage from "./pages/CommunityPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AboutUs from "./pages/AboutUS";
import BookingPage from "./pages/BookingPage";
import AdminDashboard from "./pages/AdminDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import AdminKYC from "./pages/AdminKYC";
import AdminBookings from "./pages/AdminBookings";
import AdminProperties from "./pages/AdminProperties";
import AdminAvailabilityManager from "./pages/AdminAvailabilityManager";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminKYC from "./pages/SuperAdminKYC";
import SuperAdminBookings from "./pages/SuperAdminBookings";
import SuperAdminUsersPage from "./pages/SuperAdminUsersPage";
import SuperAdminRevenueAnalytics from "./pages/SuperAdminRevenueAnalytics";
import SuperAdminCommunityPage from "./pages/SuperAdminCommunityPage";
import SuperAdminSettingsPage from "./pages/SuperAdminSettingsPage";


import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? <Loader /> : (
        <Router>
          <Routes>
            {/* OPTION 2: Add as new page */}
            {/* <Route path="/" element={<PadupLanding />} /> */}
            <Route path="/" element={<ShortletsPage />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/shortlets/:slug" element={<ShortletDetailPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            {/* <Route path="/admin/kyc" element={<AdminKYC />} />
            <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/super-admin/bookings" element={<SuperAdminBookings />} />
            <Route path="/super-admin/kyc" element={<SuperAdminKYC />} />
            <Route path="/super-admin/settingspage" element={<SuperAdminSettingsPage />} />
            <Route path="/super-admin/userspage" element={<SuperAdminUsersPage />} />
            <Route path="/super-admin/revenueanalytics" element={<SuperAdminRevenueAnalytics />} /> */}



            <Route path="/admin/dashboard" 
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />


            <Route path="/admin/bookings" 
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminBookings />
                </ProtectedRoute>
              }
            />



            <Route path="/admin/kyc" 
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminKYC />
                </ProtectedRoute>
              }
            />

            <Route path="/admin/properties" 
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminProperties />
                </ProtectedRoute>
              }
            />

            <Route path="/admin/availability-manager" 
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminAvailabilityManager />
                </ProtectedRoute>
              }
            />

            <Route path="/admin/settingspage" 
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminSettingsPage />
                </ProtectedRoute>
              }
            />

            <Route path="/super-admin/dashboard" 
              element={
                <ProtectedRoute roles={["superadmin"]}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/super-admin/bookings" 
              element={
                <ProtectedRoute roles={["superadmin"]}>
                  <SuperAdminBookings />
                </ProtectedRoute>
              }
            />

            <Route path="/super-admin/kyc" 
              element={
                <ProtectedRoute roles={["superadmin"]}>
                  <SuperAdminKYC />
                </ProtectedRoute>
              }
            />

            

            <Route path="/super-admin/userspage" 
              element={
                <ProtectedRoute roles={["superadmin", "user"]}>
                  <SuperAdminUsersPage />
                </ProtectedRoute>
              }
            />

            <Route path="/super-admin/revenueanalytics" 
              element={
                <ProtectedRoute roles={["superadmin"]}>
                  <SuperAdminRevenueAnalytics />
                </ProtectedRoute>
              }
            />

            <Route path="/super-admin/community" 
              element={
                <ProtectedRoute roles={["superadmin"]}>
                  <SuperAdminCommunityPage />
                </ProtectedRoute>
              }
            />


            <Route path="/super-admin/settings-page" 
              element={
                <ProtectedRoute roles={["superadmin"]}>
                  <SuperAdminSettingsPage />
                </ProtectedRoute>
              }
            />


          </Routes>

          <Footer />
        </Router>
      )}
    </>
  );
}