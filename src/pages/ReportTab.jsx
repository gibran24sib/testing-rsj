import React from "react";
import { exportMutationsToCSV } from "../utils/exportHelpers";
import { formatIndonesianDate } from "../utils/formatters";

export default function ReportTab({
  mutations,
  onOpenDeliverySlip,
  darkMode,
  tableTheme,
}) {
  return (
    <div className="mb-5 animate-fade-in">
      {/* FILTER PERIODE & AKSI EXPORT */}
      <div
        className="p-3 mb-3 rounded-4 d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-sm"
        style={{
          backgroundColor: darkMode ? "#0c101a" : "#ffffff",
          border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <span className="small fw-semibold">📅 Periode:</span>
          <input
            type="date"
            className={`form-control form-control-sm ${
              darkMode ? "bg-dark text-white border-secondary" : ""
            }`}
            style={{ width: "140px" }}
            defaultValue="2026-08-01"
          />
          <span className="small opacity-50">&ndash;</span>
          <input
            type="date"
            className={`form-control form-control-sm ${
              darkMode ? "bg-dark text-white border-secondary" : ""
            }`}
            style={{ width: "140px" }}
            defaultValue="2026-08-20"
          />
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => window.print()}
          >
            🖨️ Cetak PDF
          </button>
          <button
            className="btn btn-sm btn-success fw-medium"
            onClick={() => exportMutationsToCSV(mutations)}
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* TABEL MUTASI */}
      <div
        className="table-responsive rounded-4 shadow-sm"
        style={{
          border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
          backgroundColor: darkMode ? "#0c101a" : "#ffffff",
        }}
      >
        <table className={`table ${tableTheme} align-middle mb-0`}>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Kode</th>
              <th>Nama Logistik</th>
              <th>Jenis</th>
              <th>Jumlah</th>
              <th>Tujuan / Asal</th>
              <th>Petugas</th>
              <th className="text-end pe-3">Slip SBBK</th>
            </tr>
          </thead>
          <tbody>
            {mutations.map((item) => (
              <tr key={item.id}>
                <td className="small opacity-75">
                  {formatIndonesianDate(item.tanggal)}
                </td>
                <td>
                  <code>{item.kode}</code>
                </td>
                <td className="fw-semibold">{item.nama}</td>
                <td>
                  {item.jenis === "Masuk" ? (
                    <span className="badge badge-soft-success">
                      Masuk
                    </span>
                  ) : (
                    <span className="badge badge-soft-danger">
                      Keluar
                    </span>
                  )}
                </td>
                <td
                  className={`fw-bold font-monospace ${
                    item.jenis === "Masuk" ? "text-success" : "text-danger"
                  }`}
                >
                  {item.jenis === "Masuk" ? "+" : "-"} {item.jumlah}{" "}
                  {item.satuan}
                </td>
                <td className="small opacity-75">{item.asalTujuan}</td>
                <td className="small opacity-75">{item.petugas}</td>
                <td className="text-end pe-3">
                  {item.jenis === "Keluar" ? (
                    <button
                      className="btn btn-sm btn-outline-info py-0 px-2 fw-medium"
                      style={{ fontSize: "0.75rem" }}
                      onClick={() => onOpenDeliverySlip(item)}
                      title="Cetak Surat Bukti Barang Keluar"
                    >
                      🧾 SBBK
                    </button>
                  ) : (
                    <span className="opacity-25 small">&ndash;</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
