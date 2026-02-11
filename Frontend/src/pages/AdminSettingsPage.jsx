import React from "react";
import AdminLayout from "../components/AdminLayout";
import SettingsBody from "../components/SettingsBody";
import "./AdminSettingsPage.css";

export default function AdminSettingsPage() {
  return (
    <div className="settings-page">
      <AdminLayout>
      <main className="settings-container">
        <h1>Account Settings</h1>
        <SettingsBody showAdvanced={true} />
      </main>
      </AdminLayout>
    </div>
  );
}