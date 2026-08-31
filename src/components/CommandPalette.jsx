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
      id: "analitik",
      label: "Buka Analitik & Dashboard SIM-RS",
      category: "Navigasi Admin",
      icon: "📈",
      action: () => onSelectAction({ type: "navigate_tab", tab: "analitik" }),
    },
    {
      id: "inventaris",
      label: "Buka Manajemen Inventaris & Stok Logistik",
      category: "Navigasi Admin",
      icon: "📦",
      action: () => onSelectAction({ type: "navigate_tab", tab: "inventaris" }),
    },
    {
      id: "bangsal",
      label: "Monitoring Ketersediaan Bed & Bangsal Rawat Jiwa",
      category: "Navigasi Admin",
      icon: "🏥",
      action: () => onSelectAction({ type: "navigate_tab", tab: "bangsal" }),
    },
    {
      id: "coldchain",
      label: "Monitoring Sensor Suhu Cold-Chain Farmasi",
      category: "Navigasi Admin",
      icon: "❄️",
      action: () => onSelectAction({ type: "navigate_tab", tab: "coldchain" }),
    },
    {
      id: "supplier",
      label: "Direktori Rekanan Vendor PBF & Alkes",
      category: "Navigasi Admin",
      icon: "🏢",
      action: () => onSelectAction({ type: "navigate_tab", tab: "supplier" }),
    },
    {
      id: "laporan",
      label: "Laporan Riwayat Mutasi Logistik",
      category: "Navigasi Admin",
      icon: "📊",
      action: () => onSelectAction({ type: "navigate_tab", tab: "laporan" }),
    },
    {
      id: "skrining",
      label: "Mulai Skrining Mandiri Kesehatan Jiwa Online",
      category: "Layanan Publik",
      icon: "🧠",
      action: () => onSelectAction({ type: "open_screening" }),
    },
    {
      id: "cek_obat",
      label: "Cek Ketersediaan Obat Farmasi & Bed Publik",
      category: "Layanan Publik",
      icon: "💊",
      action: () => onSelectAction({ type: "open_med_checker" }),
    },
    {
      id: "booking_dokter",
      label: "Reservasi Antrean Poliklinik Dokter Spesialis",
      category: "Layanan Publik",
      icon: "👨‍⚕️",
      action: () => onSelectAction({ type: "open_booking" }),
    },
    {
      id: "tambah_barang",
      label: "Tambah Data Logistik / Obat Baru",
      category: "Aksi Cepat",
      icon: "➕",
      action: () => onSelectAction({ type: "add_item" }),
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
          boxShadow: darkMode
            ? "0 20px 40px rgba(0,0,0,0.8)"
            : "0 20px 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* INPUT BOX */}
        <div
          className="p-3 d-flex align-items-center gap-2 border-bottom"
          style={{ borderColor: darkMode ? "#242c42" : "#e2e8f0" }}
        >
          <span className="fs-5 opacity-50">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="form-control border-0 shadow-none px-1 py-1"
            style={{
              backgroundColor: "transparent",
              color: darkMode ? "#ffffff" : "#0f172a",
              fontSize: "1rem",
            }}
            placeholder="Ketik perintah atau cari fitur (cth: obat, dokter, bangsal, suhu)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "Enter" && filteredCommands.length > 0) {
                filteredCommands[0].action();
                onClose();
              }
            }}
          />
          <kbd
            className="badge badge-soft-secondary"
            style={{ fontSize: "0.7rem", cursor: "pointer" }}
            onClick={onClose}
          >
            ESC
          </kbd>
        </div>

        {/* LIST PERINTAH */}
        <div style={{ maxHeight: "380px", overflowY: "auto" }} className="p-2">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
                className="btn w-100 text-start d-flex align-items-center justify-content-between p-2 rounded-3 border-0 transition-all mb-1"
                style={{
                  backgroundColor: "transparent",
                  color: darkMode ? "#f8fafc" : "#1e293b",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode
                    ? "#1a2133"
                    : "#f1f5f9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <span className="fs-5">{cmd.icon}</span>
                  <div>
                    <span className="fw-medium d-block small">{cmd.label}</span>
                    <small className="opacity-50" style={{ fontSize: "0.72rem" }}>
                      {cmd.category}
                    </small>
                  </div>
                </div>
                <span className="opacity-25">&rarr;</span>
              </button>
            ))
          ) : (
            <div className="text-center py-4 opacity-50 small">
              Tidak ada perintah atau fitur yang sesuai "{query}".
            </div>
          )}
        </div>

        <div
          className="p-2 px-3 border-top d-flex justify-content-between align-items-center opacity-50 small"
          style={{
            borderColor: darkMode ? "#242c42" : "#e2e8f0",
            fontSize: "0.72rem",
          }}
        >
          <span>Pencarian Cepat SIM-RS Tampan</span>
          <span>Tekan <b>ESC</b> untuk menutup</span>
        </div>
      </div>
    </div>
  );
}
