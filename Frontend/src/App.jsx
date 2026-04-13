import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import PadupLanding from "./pages/PadupLanding";
import HomeWhizeLanding from "./pages/HomeWhizeLanding";
import ShortletsPage from "./pages/ShortletsPage";
import ShortletDetailPage from "./pages/ShortletDetailPage";
import ServicesPage from "./pages/ServicesPage";
import ServiceProvidersPage from "./pages/ServiceProvidersPage";
import ProviderDetail from "./pages/ProviderDetail";
import CommunityPage from "./pages/CommunityPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AboutUs from "./pages/AboutUS";
import BookingPage from "./pages/BookingPage";
import PaymentVerify from "./pages/PaymentVerify";
import AdminDashboard from "./pages/AdminDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import ServiceProviderDashboard from "./pages/ServiceProviderDashboard";
import ServiceProviderBookingRequests from "./pages/ServiceProviderBookingRequests";
import ServiceProviderMessages from "./pages/ServiceProviderMessages";
import ServiceProviderSettingsPage from "./pages/ServiceProviderSettingsPage";
import ServiceProviderServiceManagement from "./pages/ServiceProviderServiceManagement";
import ServicePrServiceProviderKYC from "./pages/ServiceProviderKYC";
import ServiceBookingForm from "./pages/ServiceBookingForm";
import ServiceBookingHistory from "./pages/ServiceBookingHistory";
import ServiceBookingDetails from "./pages/ServiceBookingDetails";



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
import SuperAdminCreateProvider from "./pages/SuperAdminCreateProvider";
import SuperAdminPropertyManagement from "./pages/SuperAdminPropertyManagement";



import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import api from "./api/axios";
import ServiceProviderKYC from "./pages/ServiceProviderKYC";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Prefetch public shortlets into localStorage so ShortletsPage can render instantly
  useEffect(() => {
    let cancelled = false;
    const prefetch = async () => {
      try {
        const { data } = await api.get("/properties/public");
        if (!cancelled) {
          try {
            localStorage.setItem("cachedShortlets", JSON.stringify(data || []));
          } catch (e) {
            console.warn("Failed to write cachedShortlets during prefetch", e);
          }
        }
      } catch (e) {
        // ignore prefetch errors
      }
    };

    prefetch();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      {loading ? <Loader /> : (
        <Router>
          <Routes>
            {/* OPTION 2: Add as new page */}
            {/* <Route path="/" element={<PadupLanding />} /> */}
            <Route path="/" element={<HomeWhizeLanding />} />
            <Route path="/shortlets" element={<ShortletsPage />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:category" element={<ServiceProvidersPage />} />
            <Route path="/provider/:slug" element={<ProviderDetail />} />
            <Route path="/provider/:slug/book/:serviceId" element={
              <ProtectedRoute>
                <ServiceBookingForm />
              </ProtectedRoute>
            } />
            <Route path="/service-bookings" element={
              <ProtectedRoute>
                <ServiceBookingHistory />
              </ProtectedRoute>
            } />
            <Route path="/service-bookings/:id" element={
              <ProtectedRoute>
                <ServiceBookingDetails />
              </ProtectedRoute>
            } />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/payments/verify" element={<PaymentVerify />} />
            <Route path="/shortlets/:slug" element={<ShortletDetailPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/provider/messages/:conversationId" element={<ServiceProviderMessages roles={["cleaner"]} />} />
            <Route path="/service-provider/messages/:conversationId" element={<ProtectedRoute roles={["cleaner"]}><ServiceProviderMessages /></ProtectedRoute>} />


            
            {/* <Route path="/admin/kyc" element={<AdminKYC />} />}
            <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/super-admin/bookings" element={<SuperAdminBookings />} />
            <Route path="/super-admin/kyc" element={<SuperAdminKYC />} />
            <Route path="/super-admin/settingspage" element={<SuperAdminSettingsPage />} />
            <Route path="/super-admin/userspage" element={<SuperAdminUsersPage />} />
            <Route path="/super-admin/create-provider" element={<SuperAdminCreateProvider />} />
            <Route path="/provider-dashboard/*" element={

            <Route path="/super-admin/revenueanalytics" element={<SuperAdminRevenueAnalytics />} /> */}


            <Route path="/service-provider/dashboard" 
              element={
                <ProtectedRoute roles={["cleaner"]}>
                  <ServiceProviderDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/service-provider/messages" 
              element={
                <ProtectedRoute roles={["cleaner"]}>
                  <ServiceProviderMessages />
                </ProtectedRoute>
              }
            />

            <Route path="/service-provider/booking-requests" 
              element={
                <ProtectedRoute roles={["cleaner"]}>
                  <ServiceProviderBookingRequests />
                </ProtectedRoute>
              }
            />

            <Route path="/service-provider/service-management" 
              element={
                <ProtectedRoute roles={["cleaner"]}>
                  <ServiceProviderServiceManagement />
                </ProtectedRoute>
              }
            />

            <Route path="/service-provider/kyc" 
              element={
                <ProtectedRoute roles={["cleaner"]}>
                  <ServiceProviderKYC />
                </ProtectedRoute>
              }
            />

            <Route path="/service-provider/settings" 
              element={
                <ProtectedRoute roles={["cleaner"]}>
                  <ServiceProviderSettingsPage />
                </ProtectedRoute>
              }
            />


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


            <Route path="/super-admin/create-provider" 
              element={
                <ProtectedRoute roles={["superadmin"]}>
                  <SuperAdminCreateProvider />
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

            <Route path="/super-admin/properties" 
              element={
                <ProtectedRoute roles={["superadmin"]}>
                  <SuperAdminPropertyManagement />
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