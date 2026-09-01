import React from "react";

export default function BannerSub({ currentView, darkMode }) {
  const todayFormatted = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div
      className="d-flex flex-wrap align-items-center justify-content-between px-4 py-2 border-bottom"
      style={{
        backgroundColor: darkMode ? "#0c0d12" : "#f8fafc",
        borderColor: darkMode ? "#1c1f2b" : "#e2e8f0",
        fontSize: "0.8rem",
        color: darkMode ? "#8e94a4" : "#64748b",
      }}
    >
      <div className="d-flex align-items-center gap-2">
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#10b981",
            display: "inline-block",
            boxShadow: "0 0 6px rgba(16, 185, 129, 0.6)",
          }}
        ></span>
        <span className="fw-semibold">
          {currentView === "admin"
            ? "SIM-SDM Kepegawaian & Ketenagaan Nakes • RSJ Tampan Pekanbaru"
            : "Portal Informasi Ketenagaan & Pelayanan SDM Terakreditasi • RSJ Tampan"}
        </span>
      </div>

      <div className="d-none d-md-flex align-items-center gap-3">
        <span>📅 {todayFormatted}</span>
        <span className="badge badge-soft-success fw-normal px-2 py-1">
          Server SDM Online
        </span>
      </div>
    </div>
  );
}
