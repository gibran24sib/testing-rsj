import React, { useState } from "react";

export default function NotificationDropdown({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "warning",
      icon: "⚠️",
      title: "Stok Menipis (<50 unit)",
      message: "Haloperidol Injeksi 50mg tersisa 25 ampul di Depo Pusat.",
      time: "5 menit lalu",
      unread: true,
    },
    {
      id: 2,
      type: "success",
      icon: "📦",
      title: "Pengiriman Vendor PBF",
      message: "PT Kimia Farma telah mengirimkan 200 botol Risperidone 2mg.",
      time: "20 menit lalu",
      unread: true,
    },
    {
      id: 3,
      type: "info",
      icon: "🌡️",
      title: "Sensor Suhu Cold-Chain",
      message: "Chiller Farmasi Utama optimal pada 3.8°C (Standar BPOM).",
      time: "1 jam lalu",
      unread: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="position-relative">
      {/* BELL BUTTON WITH UNREAD BADGE */}
      <button
        type="button"
        className={`btn btn-sm rounded-circle position-relative p-1 d-flex align-items-center justify-content-center ${
          darkMode ? "btn-outline-secondary text-light" : "btn-outline-secondary text-dark"
        }`}
        style={{ width: "34px", height: "34px" }}
        onClick={() => setIsOpen(!isOpen)}
        title="Pusat Notifikasi SIM-RS"
      >
        <span>🔔</span>
        {unreadCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "0.6rem" }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN POPUP */}
      {isOpen && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 1040 }}
            onClick={() => setIsOpen(false)}
          ></div>
          <div
            className="position-absolute end-0 mt-2 rounded-4 shadow-lg p-3 animate-fade-in"
            style={{
              width: "320px",
              backgroundColor: darkMode ? "#101422" : "#ffffff",
              border: darkMode ? "1px solid #1e263d" : "1px solid #e2e8f0",
              zIndex: 1050,
              color: darkMode ? "#f8fafc" : "#0f172a",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-opacity-10">
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold small">Pusat Notifikasi</span>
                {unreadCount > 0 && (
                  <span className="badge badge-soft-danger" style={{ fontSize: "0.65rem" }}>
                    {unreadCount} Baru
                  </span>
                )}
              </div>
              <button
                type="button"
                className="btn btn-sm btn-link p-0 text-decoration-none text-success small"
                style={{ fontSize: "0.72rem" }}
                onClick={markAllRead}
              >
                Tandai Dibaca
              </button>
            </div>

            <div className="d-flex flex-column gap-2" style={{ maxHeight: "280px", overflowY: "auto" }}>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-2 rounded-3 transition-all"
                  style={{
                    backgroundColor: n.unread
                      ? darkMode
                        ? "#151b2e"
                        : "#f0fdf4"
                      : "transparent",
                    border: darkMode ? "1px solid #1c2438" : "1px solid #f1f5f9",
                  }}
                >
                  <div className="d-flex align-items-start gap-2">
                    <span className="fs-5">{n.icon}</span>
                    <div className="flex-grow-1 overflow-hidden">
                      <strong className="d-block small text-truncate">{n.title}</strong>
                      <p className="mb-0 small opacity-75" style={{ fontSize: "0.74rem", lineHeight: "1.3" }}>
                        {n.message}
                      </p>
                      <small className="opacity-50" style={{ fontSize: "0.65rem" }}>
                        {n.time}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
