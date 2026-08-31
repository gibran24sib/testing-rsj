import React, { useState } from "react";
import { initialInventory } from "../data/initialData";
import { bangsalList } from "../data/bangsalData";
import { getStockStatus, getCategoryBadgeClass } from "../utils/formatters";

export default function PublicMedAvailability({ darkMode, cardBg }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("semua");
  const [viewMode, setViewMode] = useState("obat"); // 'obat' | 'bed'

  const filteredMeds = initialInventory.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "semua" || item.kategori === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["semua", "Obat Farmasi", "Alat Medis", "Bahan Habis Pakai (BHP)"];

  return (
    <div
      className={`p-4 rounded-4 shadow-sm border ${
        darkMode ? "bg-dark-card border-secondary border-opacity-25" : "bg-white"
      }`}
    >
      {/* HEADER PORTAL PUBLIK */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-opacity-10">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h5 className="fw-bold mb-0">Cek Ketersediaan Obat & Ruang Rawat Inap</h5>
            <span className="badge badge-soft-success">Transparansi Publik</span>
          </div>
          <small className="opacity-75">
            Informasi ketersediaan perbekalan farmasi kejiwaan & bed bangsal RSJ Tampan Riau
          </small>
        </div>

        {/* TOGGLE TAB: OBAT vs BED */}
        <div
          className="d-flex p-1 rounded-pill"
          style={{
            backgroundColor: darkMode ? "#141824" : "#f1f5f9",
            border: darkMode ? "1px solid #232a3d" : "1px solid #e2e8f0",
          }}
        >
          <button
            className={`btn btn-sm rounded-pill px-3 py-1 fw-medium border-0 ${
              viewMode === "obat"
                ? "bg-success text-white shadow-sm"
                : "text-muted bg-transparent"
            }`}
            onClick={() => setViewMode("obat")}
          >
            💊 Stok Obat & Alkes
          </button>
          <button
            className={`btn btn-sm rounded-pill px-3 py-1 fw-medium border-0 ${
              viewMode === "bed"
                ? "bg-success text-white shadow-sm"
                : "text-muted bg-transparent"
            }`}
            onClick={() => setViewMode("bed")}
          >
            🛏️ Ketersediaan Bed Bangsal
          </button>
        </div>
      </div>

      {viewMode === "obat" ? (
        /* 1. TAMPILAN KETERSEDIAAN OBAT */
        <div>
          {/* SEARCH & CATEGORY PILLS */}
          <div className="row g-2 align-items-center justify-content-between mb-4">
            <div className="col-md-5">
              <div className="input-group input-group-sm">
                <span
                  className={`input-group-text ${
                    darkMode ? "bg-dark text-muted border-secondary" : "bg-light"
                  }`}
                >
                  🔍
                </span>
                <input
                  type="text"
                  className={`form-control ${
                    darkMode ? "bg-dark text-white border-secondary" : ""
                  }`}
                  placeholder="Ketik nama obat (cth: Risperidone, Haloperidol)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSearch("")}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="col-md-7 d-flex flex-wrap gap-1 justify-content-md-end">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`btn btn-sm rounded-pill px-3 py-1 text-capitalize ${
                    categoryFilter === cat
                      ? "btn-success"
                      : "btn-outline-secondary opacity-75"
                  }`}
                  style={{ fontSize: "0.78rem" }}
                >
                  {cat === "semua" ? "Semua Kategori" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* LIST CARD OBAT MINIMALIS */}
          <div className="row g-3 mb-3">
            {filteredMeds.length > 0 ? (
              filteredMeds.map((item) => {
                const status = getStockStatus(item.stok);
                return (
                  <div key={item.id} className="col-md-6 col-lg-4">
                    <div
                      className="p-3 rounded-3 h-100 d-flex flex-column justify-content-between transition-all"
                      style={{
                        backgroundColor: darkMode ? "#131724" : "#f8fafc",
                        border: darkMode ? "1px solid #20273a" : "1px solid #e2e8f0",
                      }}
                    >
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <code style={{ fontSize: "0.75rem" }}>{item.id}</code>
                          <span className={`badge ${status.badgeClass}`} style={{ fontSize: "0.68rem" }}>
                            {status.label}
                          </span>
                        </div>
                        <h6 className="fw-bold mb-1" style={{ fontSize: "0.95rem" }}>
                          {item.nama}
                        </h6>
                        <span className={`badge ${getCategoryBadgeClass(item.kategori)} mb-2`} style={{ fontSize: "0.7rem" }}>
                          {item.kategori}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center pt-2 border-top border-opacity-10 mt-2">
                        <small className="opacity-75">Status Fisik:</small>
                        <span className="fw-semibold small text-success">
                          {item.kondisi === "Bagus" ? "✅ Layak / Standar Farmasi" : "⚠️ Karantina"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center py-5 opacity-50">
                <span className="fs-3 d-block mb-1">🔍</span>
                Obat atau alkes yang dicari tidak ditemukan.
              </div>
            )}
          </div>

          <div
            className="p-3 rounded-3 d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3"
            style={{
              backgroundColor: darkMode ? "rgba(16, 185, 129, 0.08)" : "#ecfdf5",
              border: darkMode ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid #d1fae5",
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <span className="fs-5">ℹ️</span>
              <small className="fw-medium" style={{ color: darkMode ? "#a7f3d0" : "#065f46" }}>
                Pengambilan obat resep dokter kejiwaan dilayani di Depo Farmasi Rawat Jalan 24 Jam.
              </small>
            </div>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Depo%20Farmasi%20RSJ%20Tampan,%20saya%20ingin%20menanyakan%20ketersediaan%20obat"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-success fw-medium"
            >
              💬 Tanya Farmasi via WA
            </a>
          </div>
        </div>
      ) : (
        /* 2. TAMPILAN KETERSEDIAAN BED RUANGAN */
        <div className="animate-fade-in">
          <div className="row g-3 mb-3">
            {bangsalList.map((bangsal) => {
              const bedTersedia = bangsal.kapasitas - bangsal.terisi;
              const persenTerisi = Math.round((bangsal.terisi / bangsal.kapasitas) * 100);
              return (
                <div key={bangsal.id} className="col-md-6 col-lg-4">
                  <div
                    className="p-3 rounded-3 h-100 d-flex flex-column justify-content-between"
                    style={{
                      backgroundColor: darkMode ? "#131724" : "#f8fafc",
                      border: darkMode ? "1px solid #20273a" : "1px solid #e2e8f0",
                    }}
                  >
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold mb-0">{bangsal.nama}</h6>
                        <span className="badge badge-soft-primary small">{bangsal.tipe}</span>
                      </div>
                      <small className="opacity-75 d-block mb-3">📍 {bangsal.lokasi}</small>

                      <div className="mb-2">
                        <div className="d-flex justify-content-between small mb-1">
                          <span>Ketersediaan Bed:</span>
                          <strong className={bedTersedia > 0 ? "text-success" : "text-danger"}>
                            {bedTersedia} Bed Kosong
                          </strong>
                        </div>
                        <div className="progress" style={{ height: "6px" }}>
                          <div
                            className={`progress-bar ${persenTerisi > 85 ? "bg-danger" : "bg-success"}`}
                            style={{ width: `${persenTerisi}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-top border-opacity-10 d-flex justify-content-between align-items-center mt-2">
                      <span className="badge badge-soft-success small">{bangsal.status}</span>
                      <small className="opacity-50">Total {bangsal.kapasitas} Ranjang</small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center py-2">
            <small className="opacity-75">
              ☎️ Informasi rujukan ranjang rawat inap kejiwaan hubungi Call Center RSJ: <b>(0761) 63238</b>
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
