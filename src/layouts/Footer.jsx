import React from "react";

export default function Footer({ darkMode, isAdmin = false }) {
  if (isAdmin) {
    return (
      <footer
        className="w-100 text-center py-3 mt-auto"
        style={{
          backgroundColor: "transparent",
          color: darkMode ? "#5f6677" : "#94a3b8",
          fontSize: "0.75rem",
        }}
      >
        <p className="mb-0">
          &copy; 2026 RSJ Tampan Pekanbaru Riau • Sistem Informasi Manajemen SDM & Kepegawaian (SIM-SDM)
        </p>
      </footer>
    );
  }

  return (
    <footer
      className="w-100 text-center py-4 border-top mt-auto"
      style={{
        backgroundColor: darkMode ? "#0c0d12" : "#ffffff",
        borderColor: darkMode ? "#1c202e" : "#e2e8f0",
        color: darkMode ? "#94a3b8" : "#64748b",
        fontSize: "0.82rem",
      }}
    >
      <div className="container-fluid px-4">
        <p className="mb-1 fw-semibold" style={{ color: darkMode ? "#f1f5f9" : "#0f172a" }}>
          Rumah Sakit Jiwa Tampan Provinsi Riau
        </p>
        <small style={{ color: darkMode ? "#cbd5e1" : "#475569" }}>
          &copy; 2026 RSJ Tampan Pekanbaru Riau • Portal SDM & Ketenagaan Terpadu
        </small>
      </div>
    </footer>
  );
}
