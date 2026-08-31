import React from "react";
import { kpiMetrics, bangsalLogisticsFeed } from "../data/analyticsData";

export default function AnalyticsDashboard({ darkMode }) {
  return (
    <div className="pb-3 animate-fade-in">
      {/* 4 CLEAN MINIMALIST KPI CARDS */}
      <div className="row g-3 mb-4">
        {kpiMetrics.map((kpi) => (
          <div key={kpi.id} className="col-md-6 col-xl-3">
            <div
              className="p-4 rounded-4 h-100 d-flex flex-column justify-content-between shadow-sm clean-card"
              style={{
                backgroundColor: darkMode ? "#0c101a" : "#ffffff",
                border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
                color: darkMode ? "#ffffff" : "#0f172a",
              }}
            >
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span
                    className="fw-semibold text-uppercase"
                    style={{
                      fontSize: "0.7rem",
                      color: darkMode ? "#7e8699" : "#64748b",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {kpi.label}
                  </span>
                  <span
                    className="badge rounded-pill px-2 py-1"
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 600,
                      backgroundColor:
                        kpi.badgeType === "positive"
                          ? "rgba(16, 185, 129, 0.12)"
                          : "rgba(148, 163, 184, 0.12)",
                      color:
                        kpi.badgeType === "positive"
                          ? "#10b981"
                          : "#94a3b8",
                    }}
                  >
                    {kpi.badge}
                  </span>
                </div>

                <h2
                  className="fw-bold mb-1"
                  style={{
                    letterSpacing: "-0.03em",
                    color: darkMode ? "#ffffff" : "#0f172a",
                  }}
                >
                  {kpi.value}
                </h2>
              </div>

              <div className="pt-2 mt-2 border-top border-opacity-10">
                <p
                  className="mb-0"
                  style={{
                    fontSize: "0.75rem",
                    color: darkMode ? "#717888" : "#64748b",
                  }}
                >
                  {kpi.caption}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2-COLUMN BALANCED DISTRIBUTION & FEED PANELS */}
      <div className="row g-3">
        {/* LIVE FEED PERMINTAAN BANGSAL */}
        <div className="col-lg-7">
          <div
            className="p-4 rounded-4 h-100 shadow-sm"
            style={{
              backgroundColor: darkMode ? "#0c101a" : "#ffffff",
              border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="pulse-dot"></span>
                <h6 className="fw-bold mb-0">Alur Distribusi Logistik Bangsal Terkini</h6>
              </div>
              <span className="badge badge-soft-secondary small">Live Feed SIM-RS</span>
            </div>

            <div className="d-flex flex-column gap-2">
              {bangsalLogisticsFeed.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-3 d-flex align-items-center justify-content-between gap-3 transition-all"
                  style={{
                    backgroundColor: darkMode ? "#121624" : "#f8fafc",
                    border: darkMode ? "1px solid #1b2133" : "1px solid #f1f5f9",
                  }}
                >
                  <div>
                    <strong className="d-block small" style={{ color: "#10b981" }}>
                      {item.bangsal}
                    </strong>
                    <span className="small opacity-75">{item.permintaan}</span>
                  </div>
                  <div className="text-end">
                    <span className="badge badge-soft-success small d-block mb-1 font-monospace">
                      {item.qty}
                    </span>
                    <small className="opacity-50" style={{ fontSize: "0.68rem" }}>
                      {item.waktu}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PROPORSI KATEGORI LOGISTIK */}
        <div className="col-lg-5">
          <div
            className="p-4 rounded-4 h-100 shadow-sm d-flex flex-column justify-content-between"
            style={{
              backgroundColor: darkMode ? "#0c101a" : "#ffffff",
              border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
            }}
          >
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">📦 Proporsi Kategori Logistik RSJ</h6>
                <span className="badge badge-soft-info small">Rekapitulasi</span>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between small fw-medium mb-1">
                  <span>Obat Farmasi & Psikotropika</span>
                  <span className="fw-bold text-success font-monospace">48%</span>
                </div>
                <div className="progress" style={{ height: "6px" }}>
                  <div
                    className="progress-bar bg-success"
                    style={{ width: "48%" }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between small fw-medium mb-1">
                  <span>Alat Medis & Jarum Suntik (Spuit)</span>
                  <span className="fw-bold text-primary font-monospace">28%</span>
                </div>
                <div className="progress" style={{ height: "6px" }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: "28%" }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between small fw-medium mb-1">
                  <span>Bahan Habis Pakai (BHP & APD)</span>
                  <span className="fw-bold text-info font-monospace">16%</span>
                </div>
                <div className="progress" style={{ height: "6px" }}>
                  <div
                    className="progress-bar bg-info"
                    style={{ width: "16%" }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between small fw-medium mb-1">
                  <span>ATK & Formulir Rekam Medis</span>
                  <span className="fw-bold text-secondary font-monospace">8%</span>
                </div>
                <div className="progress" style={{ height: "6px" }}>
                  <div
                    className="progress-bar bg-secondary"
                    style={{ width: "8%" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-3 badge-soft-success small mt-3 fw-medium text-center">
              ✅ Distribusi farmasi & alkes sesuai standar pelayanan Kemenkes RI.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
