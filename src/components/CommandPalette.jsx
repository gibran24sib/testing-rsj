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
    {
      id: "direktori",
      label: "Buka Direktori & Master Pegawai Medis",
      category: "Modul SDM",
      icon: "👥",
      action: () => onSelectAction({ type: "navigate_tab", tab: "direktori" }),
    },
    {
      id: "roster",
      label: "Buka Roster Shift Jaga Bangsal 24/7",
      category: "Modul SDM",
      icon: "📅",
      action: () => onSelectAction({ type: "navigate_tab", tab: "roster" }),
    },
    {
      id: "abk_wisn",
      label: "Kalkulator Analisis Beban Kerja (WISN Kemenkes)",
      category: "Akreditasi KARS",
      icon: "🧮",
      action: () => onSelectAction({ type: "navigate_tab", tab: "abk_wisn" }),
    },
    {
      id: "kredensialing",
      label: "Jenjang Karir Perawat Jiwa & SPK/RKK Komite",
      category: "Akreditasi KARS",
      icon: "🎖️",
      action: () => onSelectAction({ type: "navigate_tab", tab: "kredensialing" }),
    },
    {
      id: "presensi",
      label: "Simulasi E-Presensi Shift Geolocation & Swafoto",
      category: "Operasional Modern",
      icon: "⏱️",
      action: () => onSelectAction({ type: "navigate_tab", tab: "presensi" }),
    },
    {
      id: "dossier",
      label: "E-Berkas & Arsip Digital Dossier Pegawai",
      category: "Operasional Modern",
      icon: "📁",
      action: () => onSelectAction({ type: "navigate_tab", tab: "dossier" }),
    },
    {
      id: "legalitas",
      label: "Audit Masa Berlaku STR & SIP Nakes",
      category: "Modul SDM",
      icon: "📜",
      action: () => onSelectAction({ type: "navigate_tab", tab: "legalitas" }),
    },
    {
      id: "cuti",
      label: "Manajemen Pengajuan & Approval Cuti",
      category: "Modul SDM",
      icon: "🏖️",
      action: () => onSelectAction({ type: "navigate_tab", tab: "cuti" }),
    },
    {
      id: "diklat",
      label: "Program Diklat & Kredensialing Khusus Jiwa",
      category: "Modul SDM",
      icon: "🎓",
      action: () => onSelectAction({ type: "navigate_tab", tab: "diklat" }),
    },
    {
      id: "analitik",
      label: "Dashboard Analitik Kinerja SDM (SKP)",
      category: "Modul SDM",
      icon: "📊",
      action: () => onSelectAction({ type: "navigate_tab", tab: "analitik" }),
    },
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
      category: "Preferensi",
      icon: darkMode ? "☀️" : "🌙",
      action: () => onSelectAction({ type: "toggle_theme" }),
    },
  ];

  const filteredCommands = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="cmd-palette-backdrop" onClick={onClose}>
      <div
        className={`cmd-palette-box ${
          darkMode ? "bg-dark text-white border border-secondary" : "bg-white text-dark border"
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: darkMode ? "#0c101d" : "#ffffff",
          borderColor: darkMode ? "#222c45" : "#cbd5e1",
          borderRadius: "16px",
          overflow: "hidden",
          maxWidth: "580px",
          width: "90%",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* INPUT BOX */}
        <div
          className="d-flex align-items-center px-3 py-3 border-bottom"
          style={{ borderColor: darkMode ? "#1a2238" : "#e2e8f0" }}
        >
          <span className="fs-5 me-2 text-muted">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="form-control border-0 shadow-none bg-transparent"
            style={{
              color: darkMode ? "#ffffff" : "#0f172a",
              fontSize: "1rem",
            }}
            placeholder="Cari modul SDM, WISN, SPK/RKK, presensi, cuti (Ctrl+K)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd
            className="px-2 py-1 rounded"
            style={{
              fontSize: "0.7rem",
              backgroundColor: darkMode ? "#1a2238" : "#f1f5f9",
              color: darkMode ? "#8e94a4" : "#64748b",
            }}
          >
            ESC
          </kbd>
        </div>

        {/* COMMAND LIST */}
        <div className="p-2" style={{ maxHeight: "350px", overflowY: "auto" }}>
          {filteredCommands.length === 0 ? (
            <div className="text-center py-4 text-muted small">
              Tidak ada modul SDM yang sesuai dengan "<strong>{query}</strong>"
            </div>
          ) : (
            filteredCommands.map((cmd) => (
              <button
                key={cmd.id}
                className="w-100 btn text-start d-flex align-items-center justify-content-between p-2 rounded-3 border-0 mb-1"
                style={{
                  backgroundColor: "transparent",
                  color: darkMode ? "#cbd5e1" : "#334155",
                  fontSize: "0.88rem",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode ? "#182035" : "#f1f5f9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <span style={{ fontSize: "1.1rem" }}>{cmd.icon}</span>
                  <span className="fw-medium">{cmd.label}</span>
                </div>
                <span
                  className="badge rounded-pill"
                  style={{
                    fontSize: "0.68rem",
                    backgroundColor: darkMode ? "#1a2238" : "#e2e8f0",
                    color: darkMode ? "#8e94a4" : "#64748b",
                  }}
                >
                  {cmd.category}
                </span>
              </button>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div
          className="d-flex align-items-center justify-content-between px-3 py-2 border-top text-muted"
          style={{
            borderColor: darkMode ? "#1a2238" : "#e2e8f0",
            backgroundColor: darkMode ? "#080c18" : "#f8fafc",
            fontSize: "0.72rem",
          }}
        >
          <span>SIM-SDM RS Jiwa Tampan</span>
          <span>Tekan ↵ untuk memilih &bull; ESC untuk batal</span>
        </div>
      </div>
    </div>
  );
}
