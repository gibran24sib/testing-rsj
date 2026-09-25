import React, { useState, useEffect, useRef } from "react";

export default function CommandPalette({
  isOpen,
  onClose,
  darkMode,
  onSelectAction,
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const commands = [
    // LAYANAN MANDIRI PEGAWAI
    {
      id: "pegawai_profil",
      label: "Buka Data Diri & Profil Pegawai Saya",
      category: "Layanan Mandiri Pegawai",
      icon: "👤",
      action: () => onSelectAction({ type: "navigate_pegawai", tab: "profil" }),
    },
    {
      id: "pegawai_berkas",
      label: "Upload & E-Berkas Dokumen Digital Mandiri",
      category: "Layanan Mandiri Pegawai",
      icon: "📁",
      action: () => onSelectAction({ type: "navigate_pegawai", tab: "berkas" }),
    },
    {
      id: "pegawai_cuti",
      label: "Pengajuan & Riwayat Cuti Mandiri Nakes",
      category: "Layanan Mandiri Pegawai",
      icon: "🏖️",
      action: () => onSelectAction({ type: "navigate_pegawai", tab: "cuti" }),
    },
    {
      id: "pegawai_roster",
      label: "Jadwal Shift Jaga Bangsal Saya",
      category: "Layanan Mandiri Pegawai",
      icon: "📅",
      action: () => onSelectAction({ type: "navigate_pegawai", tab: "roster" }),
    },
    {
      id: "pegawai_presensi",
      label: "E-Presensi Shift Geolocation Pegawai",
      category: "Layanan Mandiri Pegawai",
      icon: "⏱️",
      action: () => onSelectAction({ type: "navigate_pegawai", tab: "presensi" }),
    },
    {
      id: "pegawai_legalitas",
      label: "Masa Berlaku STR & SIP Izin Praktik Saya",
      category: "Layanan Mandiri Pegawai",
      icon: "📜",
      action: () => onSelectAction({ type: "navigate_pegawai", tab: "legalitas" }),
    },
    {
      id: "pegawai_diklat",
      label: "Sertifikat & Diklat Khusus Jiwa Saya",
      category: "Layanan Mandiri Pegawai",
      icon: "🎓",
      action: () => onSelectAction({ type: "navigate_pegawai", tab: "diklat" }),
    },

    // PANEL ADMIN KEPEGAWAIAN
    {
      id: "admin_direktori",
      label: "Direktori Seluruh Pegawai & Nakes Medis (Admin)",
      category: "Panel Admin SDM",
      icon: "👥",
      action: () => onSelectAction({ type: "navigate_admin", tab: "direktori" }),
    },
    {
      id: "admin_cuti",
      label: "Approval & Manajemen Cuti Pegawai (Admin HRD)",
      category: "Panel Admin SDM",
      icon: "📋",
      action: () => onSelectAction({ type: "navigate_admin", tab: "cuti" }),
    },
    {
      id: "admin_roster",
      label: "Roster Shift Jaga 24/7 Seluruh Bangsal (Admin)",
      category: "Panel Admin SDM",
      icon: "📅",
      action: () => onSelectAction({ type: "navigate_admin", tab: "roster" }),
    },
    {
      id: "admin_abk_wisn",
      label: "Kalkulator Analisis Beban Kerja WISN Kemenkes (Admin)",
      category: "Panel Admin SDM",
      icon: "🧮",
      action: () => onSelectAction({ type: "navigate_admin", tab: "abk_wisn" }),
    },
    {
      id: "admin_dossier",
      label: "Master Arsip Digital e-Dossier Semua Pegawai (Admin)",
      category: "Panel Admin SDM",
      icon: "📁",
      action: () => onSelectAction({ type: "navigate_admin", tab: "dossier" }),
    },
    {
      id: "admin_legalitas",
      label: "Audit Kepatuhan STR & SIP Tenaga Medis (Admin)",
      category: "Panel Admin SDM",
      icon: "📜",
      action: () => onSelectAction({ type: "navigate_admin", tab: "legalitas" }),
    },
    {
      id: "admin_analitik",
      label: "Dashboard Analitik Kinerja SDM & SKP (Admin)",
      category: "Panel Admin SDM",
      icon: "📊",
      action: () => onSelectAction({ type: "navigate_admin", tab: "analitik" }),
    },

    // PORTAL & UTILITY
    {
      id: "portal_publik",
      label: "Lihat Portal Informasi SDM Publik",
      category: "Navigasi Umum",
      icon: "🏥",
      action: () => onSelectAction({ type: "navigate_view", view: "guest" }),
    },
    {
      id: "toggle_theme",
      label: "Ganti Tema Tampilan (Dark / Light Mode)",
      category: "Pengaturan Tampilan",
      icon: darkMode ? "☀️" : "🌙",
      action: () => onSelectAction({ type: "toggle_theme" }),
    },
    {
      id: "logout",
      label: "Keluar Sesi Akun (Logout)",
      category: "Akun Pengguna",
      icon: "🚪",
      action: () => onSelectAction({ type: "logout" }),
    },
  ];

  const filteredCommands = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="modal-backdrop-custom d-flex align-items-start justify-content-center pt-5 animate-fade-in"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(6px)",
        zIndex: 1070,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="rounded-4 shadow-lg overflow-hidden animate-scale-up"
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: darkMode ? "#111624" : "#ffffff",
          color: darkMode ? "#ffffff" : "#0f172a",
          border: darkMode ? "1px solid #1e293b" : "1px solid #e2e8f0",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* INPUT SEARCH HEADER */}
        <div
          className="d-flex align-items-center gap-2 p-3 border-bottom"
          style={{ borderColor: darkMode ? "#1e293b" : "#e2e8f0" }}
        >
          <span className="fs-5">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="form-control border-0 bg-transparent shadow-none"
            style={{
              color: darkMode ? "#ffffff" : "#0f172a",
              fontSize: "1rem",
            }}
            placeholder="Ketik modul, aksi, atau fitur (contoh: berkas, cuti, roster)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd
            className="px-2 py-1 rounded small"
            style={{
              backgroundColor: darkMode ? "#182035" : "#f1f5f9",
              color: darkMode ? "#94a3b8" : "#64748b",
              fontSize: "0.75rem",
            }}
          >
            ESC
          </kbd>
        </div>

        {/* LIST COMMAND RESULTS */}
        <div style={{ maxHeight: "380px", overflowY: "auto" }} className="p-2">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-4 text-muted small">
              Tidak ada perintah atau modul yang cocok dengan &quot;{query}&quot;.
            </div>
          ) : (
            filteredCommands.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                className="btn w-100 text-start d-flex align-items-center justify-content-between p-2 rounded-3 border-0 transition-all mb-1 hover-lift"
                style={{
                  backgroundColor: "transparent",
                  color: darkMode ? "#cbd5e1" : "#334155",
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <span className="fs-5">{item.icon}</span>
                  <div>
                    <div className="fw-medium small">{item.label}</div>
                    <small
                      className="d-block"
                      style={{
                        fontSize: "0.68rem",
                        color: darkMode ? "#64748b" : "#94a3b8",
                      }}
                    >
                      {item.category}
                    </small>
                  </div>
                </div>
                <span
                  className="badge rounded-pill"
                  style={{
                    fontSize: "0.65rem",
                    backgroundColor: darkMode ? "#182035" : "#f1f5f9",
                    color: darkMode ? "#94a3b8" : "#64748b",
                  }}
                >
                  Buka &rarr;
                </span>
              </button>
            ))
          )}
        </div>

        {/* FOOTER SHORTCUT HINT */}
        <div
          className="p-2 px-3 border-top d-flex align-items-center justify-content-between"
          style={{
            borderColor: darkMode ? "#1e293b" : "#e2e8f0",
            backgroundColor: darkMode ? "#0c101a" : "#f8fafc",
            fontSize: "0.72rem",
            color: darkMode ? "#64748b" : "#94a3b8",
          }}
        >
          <span>Gunakan Ctrl+K di mana saja untuk membuka menu cepat</span>
          <span>RSJ Tampan SIM-SDM</span>
        </div>
      </div>
    </div>
  );
}
