import React, { useMemo } from "react";
import { formatIndonesianDate } from "../utils/formatters";

export default function DeliverySlipModal({
  show,
  onClose,
  deliveryData,
  darkMode,
}) {
  const docNumber = useMemo(() => {
    if (!deliveryData) return "";
    const idSnippet = deliveryData.id ? String(deliveryData.id).slice(-4) : "1001";
    return `SBBK/RSJT/2026/${idSnippet}`;
  }, [deliveryData]);

  if (!show || !deliveryData) return null;

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(6px)",
        zIndex: 1060,
      }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div
          className={`modal-content border-0 shadow-lg ${
            darkMode ? "bg-dark-card text-light" : "bg-white text-dark"
          }`}
          style={{
            border: darkMode ? "1px solid #232c42" : "1px solid #e2e8f0",
          }}
        >
          {/* HEADER MODAL */}
          <div className="modal-header border-bottom border-opacity-10 pb-3">
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  fontSize: "1.1rem",
                }}
              >
                🧾
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0">Surat Bukti Barang Keluar (SBBK)</h5>
                <small className="opacity-75">Dokumen Resmi Distribusi Farmasi & Alkes Bangsal</small>
              </div>
            </div>
            <button
              type="button"
              className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body p-4">
            {/* PRINTABLE SLIP CONTAINER */}
            <div
              className="p-4 rounded-4 shadow-sm"
              style={{
                backgroundColor: darkMode ? "#101422" : "#ffffff",
                border: darkMode ? "1px solid #1e263d" : "1px solid #cbd5e1",
              }}
            >
              {/* KOP SURAT RESMI RSJ TAMPAN */}
              <div className="text-center border-bottom pb-3 mb-3">
                <h6 className="fw-bold mb-0" style={{ letterSpacing: "1px" }}>
                  PEMERINTAH PROVINSI RIAU
                </h6>
                <h5 className="fw-bold mb-1" style={{ color: "#10b981" }}>
                  RUMAH SAKIT JIWA TAMPAN
                </h5>
                <small className="opacity-75 d-block" style={{ fontSize: "0.76rem" }}>
                  Jl. HR. Soebrantas Km. 12.5 Pekanbaru, Riau • Telp. (0761) 63238 • Terakreditasi Paripurna KARS
                </small>
                <div className="badge badge-soft-secondary mt-2 font-monospace">
                  SURAT BUKTI BARANG KELUAR • NO: {docNumber}
                </div>
              </div>

              {/* INFORMASI DISTRIBUSI */}
              <div className="row g-2 mb-3 small">
                <div className="col-6">
                  <span className="opacity-75 d-block">Tanggal Pengeluaran:</span>
                  <strong>{formatIndonesianDate(deliveryData.tanggal || "2026-08-31")}</strong>
                </div>
                <div className="col-6">
                  <span className="opacity-75 d-block">Tujuan Ruangan / Bangsal:</span>
                  <strong className="text-primary">{deliveryData.tujuan || deliveryData.asalTujuan || "Bangsal Rawat Inap"}</strong>
                </div>
                <div className="col-6">
                  <span className="opacity-75 d-block">Petugas Penyerah:</span>
                  <strong>{deliveryData.petugas || "Admin Logistik Farmasi"}</strong>
                </div>
                <div className="col-6">
                  <span className="opacity-75 d-block">Status Kondisi:</span>
                  <strong className="text-success">✅ {deliveryData.kondisi || "Bagus (Layak Pakai)"}</strong>
                </div>
              </div>

              {/* TABEL ITEM LOGISTIK */}
              <div className="table-responsive rounded-3 border mb-4">
                <table className="table table-sm align-middle mb-0" style={{ fontSize: "0.82rem" }}>
                  <thead className={darkMode ? "table-dark" : "table-light"}>
                    <tr>
                      <th style={{ width: "40px" }}>No</th>
                      <th>Kode</th>
                      <th>Nama Logistik Medis / Obat</th>
                      <th>Jumlah Distribusi</th>
                      <th>Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td><code>{deliveryData.kode || deliveryData.item?.id || "B001"}</code></td>
                      <td className="fw-semibold">{deliveryData.nama || deliveryData.item?.nama || "Logistik Medis"}</td>
                      <td className="fw-bold text-danger">
                        {deliveryData.jumlahOut || deliveryData.jumlah || 1} {deliveryData.satuan || deliveryData.item?.satuan || "Pcs"}
                      </td>
                      <td className="opacity-75">Kebutuhan Rutin Pasien Bangsal</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* KOLOM TANDA TANGAN SERAH TERIMA */}
              <div className="row text-center pt-2 small">
                <div className="col-6">
                  <span className="opacity-75 d-block mb-4">Diserahkan Oleh (Petugas Logistik):</span>
                  <strong className="d-block text-decoration-underline">
                    {deliveryData.petugas || "Apt. Hendra Pratama, S.Farm"}
                  </strong>
                  <small className="opacity-50">NIP. 19850412 201001 1 008</small>
                </div>
                <div className="col-6">
                  <span className="opacity-75 d-block mb-4">Diterima Oleh (Kepala Ruangan):</span>
                  <strong className="d-block text-decoration-underline">
                    Ns. Rahmad Hidayat, S.Kep
                  </strong>
                  <small className="opacity-50">Penanggung Jawab Bangsal</small>
                </div>
              </div>
            </div>

            {/* AKSI MODAL */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Tutup
              </button>
              <button
                type="button"
                className="btn btn-success fw-semibold px-4 d-flex align-items-center gap-2 shadow-sm"
                onClick={() => window.print()}
              >
                <span>🖨️</span> Cetak SBBK / PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
