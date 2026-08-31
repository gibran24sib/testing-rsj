import React, { useState } from "react";

export default function ColdChainTab({ darkMode, cardBg, tableTheme }) {
  const [selectedUnit, setSelectedUnit] = useState("all");

  const chillers = [
    {
      id: "CHILL-01",
      nama: "Chiller Farmasi Utama (Depo Pusat)",
      lokasi: "Gedung Farmasi Lt. 1",
      suhu: "3.8°C",
      target: "2.0°C – 8.0°C",
      status: "Optimal",
      kelembaban: "45%",
      pintu: "Tertutup Rapat",
      daya: "PLN + UPS Siaga",
      jenisObat: "Injeksi Haloperidol Decanoate, Fluphenazine, Vaksin Hepatitis",
      lastCheck: "2 menit yang lalu",
      statusClass: "badge-soft-success",
    },
    {
      id: "CHILL-02",
      nama: "Chiller Depo IGD & Bangsal Akut",
      lokasi: "IGD Psikiatri 24 Jam",
      suhu: "4.2°C",
      target: "2.0°C – 8.0°C",
      status: "Optimal",
      kelembaban: "48%",
      pintu: "Tertutup Rapat",
      daya: "PLN + UPS Siaga",
      jenisObat: "Diazepam Ampul, Midazolam Injeksi, Serum Anti-Bisa",
      lastCheck: "1 menit yang lalu",
      statusClass: "badge-soft-success",
    },
    {
      id: "CHILL-03",
      nama: "Cold Room Khusus NAPZA & Lab",
      lokasi: "Instalasi Laboratorium & NAPZA",
      suhu: "5.1°C",
      target: "2.0°C – 8.0°C",
      status: "Stabil",
      kelembaban: "50%",
      pintu: "Tertutup Rapat",
      daya: "PLN + Generator",
      jenisObat: "Reagen Skrining Narkoba Multi-Panel, Sampel Toksikologi",
      lastCheck: "4 menit yang lalu",
      statusClass: "badge-soft-success",
    },
  ];

  const tempLogs = [
    { jam: "09:00 WIB", unit: "Chiller Farmasi Utama", suhu: "3.8°C", petugas: "Apt. Hendra Pratama, S.Farm", status: "Normal" },
    { jam: "08:00 WIB", unit: "Chiller Farmasi Utama", suhu: "3.7°C", petugas: "Apt. Hendra Pratama, S.Farm", status: "Normal" },
    { jam: "07:00 WIB", unit: "Chiller Depo IGD", suhu: "4.3°C", petugas: "Ns. Siti Rahma, S.Kep", status: "Normal" },
    { jam: "06:00 WIB", unit: "Cold Room Khusus Lab", suhu: "5.0°C", petugas: "Petugas Jaga Malam", status: "Normal" },
    { jam: "05:00 WIB", unit: "Chiller Farmasi Utama", suhu: "3.9°C", petugas: "Sistem Otomatis IoT", status: "Normal" },
  ];

  return (
    <div className="mb-5 animate-fade-in">
      {/* 3 SENSOR KPI CARDS */}
      <div className="row g-3 mb-4">
        {chillers.map((c) => (
          <div key={c.id} className="col-lg-4 col-md-6">
            <div
              className={`p-4 rounded-4 shadow-sm h-100 d-flex flex-column justify-content-between ${cardBg}`}
              style={{
                border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
              }}
            >
              <div>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <code style={{ fontSize: "0.72rem" }}>{c.id}</code>
                    <h6 className="fw-bold mb-0 mt-1">{c.nama}</h6>
                    <small className="opacity-75 d-block">📍 {c.lokasi}</small>
                  </div>
                  <span className={`badge ${c.statusClass} px-2 py-1`}>
                    ● {c.status}
                  </span>
                </div>

                <div
                  className="p-3 rounded-3 my-3 d-flex align-items-center justify-content-between"
                  style={{
                    backgroundColor: darkMode ? "#141828" : "#f1f5f9",
                    border: darkMode ? "1px solid #222b42" : "1px solid #e2e8f0",
                  }}
                >
                  <div>
                    <small className="opacity-75 d-block">Suhu Sensor IoT:</small>
                    <h2 className="fw-bold text-success mb-0">{c.suhu}</h2>
                  </div>
                  <div className="text-end">
                    <small className="opacity-75 d-block">Target Aman:</small>
                    <span className="badge badge-soft-secondary font-monospace">
                      {c.target}
                    </span>
                  </div>
                </div>

                <div className="row g-2 text-start small mb-3">
                  <div className="col-6">
                    <span className="opacity-75 d-block">Kelembaban:</span>
                    <strong>💧 {c.kelembaban}</strong>
                  </div>
                  <div className="col-6">
                    <span className="opacity-75 d-block">Status Pintu:</span>
                    <strong>🔒 {c.pintu}</strong>
                  </div>
                  <div className="col-12 mt-1">
                    <span className="opacity-75 d-block">Sumber Daya Cadangan:</span>
                    <strong className="text-primary">⚡ {c.daya}</strong>
                  </div>
                </div>

                <p className="small opacity-75 mb-0 p-2 rounded" style={{ backgroundColor: darkMode ? "#101422" : "#f8fafc", fontSize: "0.76rem" }}>
                  <b>Isi Logistik:</b> {c.jenisObat}
                </p>
              </div>

              <div className="pt-3 mt-3 border-top border-opacity-10 d-flex justify-content-between align-items-center">
                <small className="opacity-50" style={{ fontSize: "0.72rem" }}>
                  Pembaruan: {c.lastCheck}
                </small>
                <button
                  className="btn btn-sm btn-outline-success py-0 px-2"
                  style={{ fontSize: "0.75rem" }}
                  onClick={() => alert(`Kalibrasi sensor ${c.id} berhasil disinkronkan dengan server SIM-RS.`)}
                >
                  🔄 Kalibrasi IoT
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LOG TABEL PEMERIKSAAN SUHU HARIAN */}
      <div
        className={`p-4 rounded-4 shadow-sm border ${
          darkMode ? "bg-dark-card border-secondary border-opacity-25" : "bg-white"
        }`}
      >
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <div>
            <h6 className="fw-bold mb-0">📋 Log Pencatatan Suhu Cold-Chain Farmasi (Permenkes 24/2021)</h6>
            <small className="opacity-75">
              Pencatatan berkala setiap pergantian shift dinas farmasi & perawat bangsal
            </small>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => alert("Mengekspor log sensor suhu ke format PDF Rekapitulasi BPOM...")}
            >
              📥 Unduh Laporan BPOM
            </button>
            <button
              className="btn btn-sm btn-success fw-medium"
              onClick={() => alert("Form pencatatan inspeksi fisik suhu harian.")}
            >
              + Input Cek Manual
            </button>
          </div>
        </div>

        <div className="table-responsive rounded-3 border">
          <table className={`table ${tableTheme} align-middle mb-0`}>
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Unit Penyimpanan</th>
                <th>Suhu Terbaca</th>
                <th>Petugas Pemeriksa</th>
                <th>Status Validasi</th>
              </tr>
            </thead>
            <tbody>
              {tempLogs.map((log, i) => (
                <tr key={i}>
                  <td className="font-monospace small">{log.jam}</td>
                  <td className="fw-medium">{log.unit}</td>
                  <td>
                    <span className="badge badge-soft-success font-monospace">
                      {log.suhu}
                    </span>
                  </td>
                  <td className="small opacity-75">{log.petugas}</td>
                  <td>
                    <span className="badge badge-soft-success">✅ {log.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
