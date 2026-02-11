import React from "react";
import SuperAdminLayout from "../components/Super-AdminLayout";
import SettingsBody from "../components/SettingsBody";
import "./SuperAdminSettingsPage.css";

export default function SuperAdminSettingsPage() {
  return (
    <SuperAdminLayout>
      <div className="settings-container">
        <h2 className="settings-title">Settings</h2>
        <SettingsBody showAdvanced={true} />
      </div>
    </SuperAdminLayout>
  );
}
