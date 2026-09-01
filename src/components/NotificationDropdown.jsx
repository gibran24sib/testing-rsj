import React, { useState } from "react";

export default function NotificationDropdown({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "warning",
      icon: "📜",
      title: "Peringatan STR Nakes",
      message: "STR dr. Mutia Rahmadani, Sp.KJ mendekati batas kedaluwarsa (<45 hari).",
      time: "10 menit lalu",
      unread: true,
    },
    {
      id: 2,
      type: "info",
      icon: "🏖️",
      title: "Pengajuan Cuti Baru",
      message: "Ns. Budi Setiawan mengajukan Cuti Alasan Penting (2 hari) di IGD Jiwa.",
      time: "30 menit lalu",
      unread: true,
    },
    {
      id: 3,
      type: "success",
      icon: "🎓",
      title: "Pendaftaran Diklat Jiwa",
      message: "Workshop De-eskalasi & Fiksasi Mekanik Aman telah dibuka untuk 30 peserta.",
      time: "2 jam lalu",
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
        title="Pusat Notifikasi SIM-SDM"
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
                <span className="fw-bold small">Notifikasi Kepegawaian</span>
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
                        ? "#171d30"
                        : "#f0fdf4"
                      : "transparent",
                    border: n.unread
                      ? darkMode
                        ? "1px solid #232c47"
                        : "1px solid #bbf7d0"
                      : "1px solid transparent",
                  }}
                >
                  <div className="d-flex align-items-start gap-2">
                    <span className="fs-6 mt-1">{n.icon}</span>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold" style={{ fontSize: "0.8rem" }}>
                          {n.title}
                        </span>
                        <span className="text-muted" style={{ fontSize: "0.65rem" }}>
                          {n.time}
                        </span>
                      </div>
                      <p className="mb-0 text-muted" style={{ fontSize: "0.74rem", lineHeight: "1.3" }}>
                        {n.message}
                      </p>
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
