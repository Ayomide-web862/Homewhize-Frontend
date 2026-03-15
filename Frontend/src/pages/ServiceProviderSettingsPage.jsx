import React from "react";
import ServiceProviderLayout from "../components/ServiceProviderLayout"; // use your SP layout
import SettingsBody from "../components/SettingsBody";
import "./ServiceProviderSettingsPage.css";

export default function ServiceProviderSettingsPage() {
  return (
    <ServiceProviderLayout>
      <div className="settings-container">
        <h2 className="settings-title">Settings</h2>
        {/* showAdvanced can be true if SP has advanced settings */}
        <SettingsBody showAdvanced={true} />
      </div>
    </ServiceProviderLayout>
  );
}