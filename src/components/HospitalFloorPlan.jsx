import React, { useState } from "react";

export default function HospitalFloorPlan({ darkMode }) {
  const buildings = [
    {
      id: "gedung-a",
      code: "GEDUNG A",
      nama: "Instalasi Gawat Darurat (IGD) & Poliklinik Rawat Jalan",
      tipe: "Layanan 24 Jam & Konsultasi Spesialis",
      kapasitas: "8 Bed Triase Darurat, 6 Poli Rawat Jalan",
      kepala: "dr. Faisal Anwar, Sp.KJ (K)",
      ekstensi: "Ext. 101 / 102",
      logistikUtama: "Emergency Drug Kit, Injeksi Haloperidol, Diazepam, Tabung Oksigen",
      color: "#ef4444",
      icon: "🚑",
    },
    {
      id: "gedung-b",
      code: "GEDUNG B",
      nama: "Instalasi Farmasi, Gudang Sentral & Laboratorium",
      tipe: "Pusat Distribusi Logistik & Uji Toksikologi",
      kapasitas: "3 Cold-Chain Chillers, Depo Farmasi 24 Jam",
      kepala: "Apt. Hendra Pratama, S.Farm",
      ekstensi: "Ext. 201 / 202",
      logistikUtama: "Stok Utama Obat Psikotropika, Reagen Toksikologi NAPZA, APD & BHP",
      color: "#10b981",
      icon: "💊",
    },
    {
      id: "gedung-c",
      code: "GEDUNG C",
      nama: "Bangsal Rawat Inap Psikiatri Akut (Pria & Wanita)",
      tipe: "Ruang Rawat Intensif & Restraint Medis",
      kapasitas: "85 Tempat Tidur (Bed Terisolasi & Terpantau)",
      kepala: "Ns. Rahmad Hidayat, S.Kep",
      ekstensi: "Ext. 301 / 302",
      logistikUtama: "Antipsikotik Oral/Injeksi, Spuit 3cc, Set Infus, Linen Bangsal",
      color: "#3b82f6",
      icon: "🏥",
    },
    {
      id: "gedung-d",
      code: "GEDUNG D",
      nama: "Wisma Rehabilitasi Medis & Sosial NAPZA",
      tipe: "Program Detoksifikasi & Therapeutic Community",
      kapasitas: "35 Tempat Tidur & Ruang Konseling Kelompok",
      kepala: "dr. Andi Pratama, Sp.KJ",
      ekstensi: "Ext. 401",
      logistikUtama: "Multi-Drug Rapid Test, Vitamin Neurotropik, Modul Terapi Psikososial",
      color: "#f59e0b",
      icon: "🌿",
    },
    {
      id: "gedung-e",
      code: "GEDUNG E",
      nama: "Klinik Tumbuh Kembang Anak & Psikogeriatri (Lansia)",
      tipe: "Sensori Integrasi & Perawatan Demensia",
      kapasitas: "30 Tempat Tidur Lansia, 4 Ruang Terapi Anak",
      kepala: "dr. Mutia Rahmadani, Sp.KJ",
      ekstensi: "Ext. 501",
      logistikUtama: "Alat Terapi Motorik, Stimulan Kognitif, Suplemen Geriatri",
      color: "#8b5cf6",
      icon: "🧸",
    },
  ];

  const [selectedBuilding, setSelectedBuilding] = useState(buildings[0]);

  return (
    <div
      className={`p-4 rounded-4 shadow-sm border ${
        darkMode ? "bg-dark-card border-secondary border-opacity-25" : "bg-white"
      }`}
    >
      {/* HEADER */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-opacity-10">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h5 className="fw-bold mb-0">Peta Denah Zonasi Bangsal & Fasilitas RSJ Tampan</h5>
            <span className="badge badge-soft-success">Peta Kompleks Rumah Sakit</span>
          </div>
          <small className="opacity-75">
            Panduan navigasi zonasi gedung pelayanan medis, farmasi, dan rawat inap kejiwaan
          </small>
        </div>
        <span className="badge badge-soft-secondary font-monospace">Luas Kompleks: 8.5 Hektar • Panam</span>
      </div>

      <div className="row g-4">
        {/* INTERACTIVE BUILDING CARDS MAP */}
        <div className="col-lg-7">
          <div className="d-flex flex-column gap-2">
            {buildings.map((b) => {
              const isSelected = selectedBuilding.id === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBuilding(b)}
                  className="p-3 rounded-4 transition-all d-flex align-items-center justify-content-between"
                  style={{
                    cursor: "pointer",
                    backgroundColor: isSelected
                      ? darkMode
                        ? "rgba(16, 185, 129, 0.15)"
                        : "#ecfdf5"
                      : darkMode
                      ? "#131726"
                      : "#f8fafc",
                    border: isSelected
                      ? "2px solid #10b981"
                      : darkMode
                      ? "1px solid #1e263d"
                      : "1px solid #e2e8f0",
                    transform: isSelected ? "scale(1.01)" : "none",
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center fs-4"
                      style={{
                        width: "44px",
                        height: "44px",
                        backgroundColor: `${b.color}22`,
                        color: b.color,
                      }}
                    >
                      {b.icon}
                    </div>
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge font-monospace" style={{ backgroundColor: `${b.color}22`, color: b.color, fontSize: "0.68rem" }}>
                          {b.code}
                        </span>
                        <h6 className="fw-bold mb-0" style={{ fontSize: "0.92rem" }}>
                          {b.nama}
                        </h6>
                      </div>
                      <small className="opacity-75 d-block" style={{ fontSize: "0.76rem" }}>
                        {b.tipe}
                      </small>
                    </div>
                  </div>

                  <span className="opacity-50 fs-5">&rarr;</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* DETAIL PANEL OF SELECTED BUILDING */}
        <div className="col-lg-5">
          <div
            className="p-4 rounded-4 h-100 shadow-sm animate-fade-in"
            style={{
              backgroundColor: darkMode ? "#101422" : "#f8fafc",
              border: `1px solid ${selectedBuilding.color}55`,
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="fs-3">{selectedBuilding.icon}</span>
              <div>
                <span className="badge font-monospace" style={{ backgroundColor: `${selectedBuilding.color}22`, color: selectedBuilding.color }}>
                  {selectedBuilding.code}
                </span>
                <h5 className="fw-bold mb-0 mt-1">{selectedBuilding.nama}</h5>
              </div>
            </div>

            <p className="small opacity-75 mb-3">{selectedBuilding.tipe}</p>

            <hr className="my-2 opacity-25" />

            <div className="row g-2 small mb-3">
              <div className="col-12">
                <span className="opacity-75 d-block">Kapasitas & Fasilitas:</span>
                <strong>🛏️ {selectedBuilding.kapasitas}</strong>
              </div>
              <div className="col-6 mt-2">
                <span className="opacity-75 d-block">Kepala Instalasi / Ruangan:</span>
                <strong>👨‍⚕️ {selectedBuilding.kepala}</strong>
              </div>
              <div className="col-6 mt-2">
                <span className="opacity-75 d-block">Telepon Internal:</span>
                <strong className="text-primary font-monospace">☎️ {selectedBuilding.ekstensi}</strong>
              </div>
            </div>

            <div
              className="p-3 rounded-3 small mb-3"
              style={{
                backgroundColor: darkMode ? "#151b2e" : "#ffffff",
                border: darkMode ? "1px solid #1f283d" : "1px solid #e2e8f0",
              }}
            >
              <strong className="d-block mb-1 text-success">📦 Alokasi Pasokan Logistik Utama:</strong>
              <p className="mb-0 opacity-75" style={{ fontSize: "0.76rem" }}>
                {selectedBuilding.logistikUtama}
              </p>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-outline-success w-100 fw-semibold"
              onClick={() => alert(`Menghubungkan ke ${selectedBuilding.nama} (${selectedBuilding.ekstensi})...`)}
            >
              📞 Hubungi Interkom Ruangan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
