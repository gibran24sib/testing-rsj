import React, { useState } from "react";

export default function FloatingSupportWidget({
  onOpenEmergency,
  onOpenBooking,
  onOpenScreening,
  darkMode,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* FLOATING ACTION BUTTON */}
      <div
        className="position-fixed"
        style={{
          bottom: "28px",
          right: "28px",
          zIndex: 1040,
        }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-success rounded-circle shadow-lg d-flex align-items-center justify-content-center border-0"
          style={{
            width: "56px",
            height: "56px",
            fontSize: "1.5rem",
            boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isOpen ? "rotate(90deg)" : "none",
          }}
          title="Pusat Bantuan & Layanan Cepat RSJ"
        >
          {isOpen ? "✕" : "💬"}
        </button>
      </div>

      {/* POPUP SUPPORT DRAWER */}
      {isOpen && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 1035 }}
            onClick={() => setIsOpen(false)}
          ></div>
          <div
            className="position-fixed p-3 rounded-4 shadow-lg animate-fade-in"
            style={{
              bottom: "94px",
              right: "28px",
              width: "320px",
              backgroundColor: darkMode ? "#101422" : "#ffffff",
              border: darkMode ? "1px solid #1e263d" : "1px solid #e2e8f0",
              zIndex: 1040,
              color: darkMode ? "#f8fafc" : "#0f172a",
              boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between pb-2 mb-2 border-bottom border-opacity-10">
              <div className="d-flex align-items-center gap-2">
                <span className="pulse-dot"></span>
                <strong className="small">Bantuan & Layanan Pasien</strong>
              </div>
              <span className="badge badge-soft-success" style={{ fontSize: "0.65rem" }}>
                24 Jam Online
              </span>
            </div>

            <div className="d-flex flex-column gap-2">
              <button
                type="button"
                className="btn btn-sm btn-danger text-start d-flex align-items-center gap-2 p-2 rounded-3 shadow-sm"
                onClick={() => {
                  setIsOpen(false);
                  onOpenEmergency();
                }}
              >
                <span className="fs-5">🚑</span>
                <div>
                  <strong className="d-block small">Panggil Ambulans Darurat</strong>
                  <small className="opacity-75" style={{ fontSize: "0.7rem" }}>
                    Penjemputan krisis gaduh gelisah
                  </small>
                </div>
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline-success text-start d-flex align-items-center gap-2 p-2 rounded-3"
                onClick={() => {
                  setIsOpen(false);
                  onOpenBooking();
                }}
              >
                <span className="fs-5">🎟️</span>
                <div>
                  <strong className="d-block small">Nomor Antrean Dokter</strong>
                  <small className="opacity-75" style={{ fontSize: "0.7rem" }}>
                    Poli Psikiatri & Psikologi
                  </small>
                </div>
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline-primary text-start d-flex align-items-center gap-2 p-2 rounded-3"
                onClick={() => {
                  setIsOpen(false);
                  onOpenScreening();
                }}
              >
                <span className="fs-5">🧠</span>
                <div>
                  <strong className="d-block small">Skrining Mandiri Jiwa</strong>
                  <small className="opacity-75" style={{ fontSize: "0.7rem" }}>
                    Tes stres & kecemasan online
                  </small>
                </div>
              </button>

              <a
                href="https://wa.me/6281234567890?text=Halo%20RSJ%20Tampan,%20saya%20ingin%20bertanya%20informasi%20layanan"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-secondary text-start d-flex align-items-center gap-2 p-2 rounded-3 text-decoration-none"
              >
                <span className="fs-5">💬</span>
                <div>
                  <strong className="d-block small">Chat WhatsApp Humas</strong>
                  <small className="opacity-75" style={{ fontSize: "0.7rem" }}>
                    0812-3456-7890
                  </small>
                </div>
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
