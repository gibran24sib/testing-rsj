import React from "react";
import AnalyticsDashboard from "../components/AnalyticsDashboard";

export default function AnalyticsTab({ darkMode, cardBg, tableTheme }) {
  return (
    <div className="container-fluid px-0">
      <AnalyticsDashboard darkMode={darkMode} cardBg={cardBg} />
    </div>
  );
}
