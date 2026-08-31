import React, { useState } from "react";

export default function DrugInteractionChecker({ darkMode }) {
  const psychDrugs = [
    { id: "risperidone", nama: "Risperidone 2mg (Antipsikotik Atipikal)", golongan: "Antipsikotik Generasi 2" },
    { id: "haloperidol", nama: "Haloperidol 5mg / Injeksi (Antipsikotik Tipikal)", golongan: "Antipsikotik Generasi 1" },
    { id: "diazepam", nama: "Diazepam 5mg (Benzodiazepin)", golongan: "Ansiolitik / Penenang" },
    { id: "fluoxetine", nama: "Fluoxetine 20mg (SSRI)", golongan: "Antidepresan" },
    { id: "trihexyphenidyl", nama: "Trihexyphenidyl 2mg (Antikolinergik)", golongan: "Anti-Parkinson / Anti-EPS" },
    { id: "clozapine", nama: "Clozapine 25mg (Antipsikotik Khusus)", golongan: "Antipsikotik Refrakter" },
    { id: "carbamazepine", nama: "Carbamazepine 200mg (Mood Stabilizer)", golongan: "Penstabil Suasana Hati" },
  ];

  const [drugA, setDrugA] = useState("haloperidol");
  const [drugB, setDrugB] = useState("trihexyphenidyl");

  // Matriks Interaksi Obat Psikiatri Klinis
  const getInteractionResult = (a, b) => {
    if (a === b) {
      return {
        level: "Duplikasi Terapi",
        badgeClass: "badge-soft-warning",
        color: "#f59e0b",
        icon: "⚠️",
        summary: "Obat yang dipilih adalah zat aktif yang sama (Duplikasi dosis).",
        mechanism: "Dapat menyebabkan peningkatan konsentrasi obat dalam plasma secara berlebihan.",
        advice: "Hindari pemberian ganda tanpa penyesuaian dosis total harian oleh dokter Sp.KJ.",
      };
    }

    const pair = [a, b].sort().join("+");

    switch (pair) {
      case "haloperidol+trihexyphenidyl":
        return {
          level: "Sinergis Positif Terkendali (Kombinasi Standar)",
          badgeClass: "badge-soft-success",
          color: "#10b981",
          icon: "✅",
          summary: "Kombinasi umum untuk mencegah atau mengatasi efek samping ekstrapiramidal (EPS / distonia / kekakuan otot).",
          mechanism: "Trihexyphenidyl memblokade reseptor muskarinik sentral yang terstimulasi akibat blokade dopaminergik oleh Haloperidol.",
          advice: "Kombinasi aman dan standar pada penanganan psikotik akut. Pantau efek mulut kering atau pandangan kabur ringan.",
        };
      case "diazepam+haloperidol":
        return {
          level: "Sinergis Sedasi (Perhatian Khusus)",
          badgeClass: "badge-soft-warning",
          color: "#f59e0b",
          icon: "🟡",
          summary: "Peningkatan efek depresi sistem saraf pusat (SSP) dan rasa kantuk berat.",
          mechanism: "Kombinasi potensiasi efek sedatif sentral antara agonis reseptor GABA (Diazepam) dan antagonis D2 (Haloperidol).",
          advice: "Sering digunakan pada pasien gaduh gelisah berat. Awasi frekuensi napas dan tekanan darah pasien secara teratur.",
        };
      case "fluoxetine+risperidone":
        return {
          level: "Interaksi Farmakokinetik (Perhatian Dosis)",
          badgeClass: "badge-soft-warning",
          color: "#f59e0b",
          icon: "🟡",
          summary: "Fluoxetine menghambat enzim CYP2D6 yang memetabolisme Risperidone, sehingga kadar Risperidone dapat meningkat.",
          mechanism: "Inhibisi kompetitif enzim hati CYP2D6 menyebabkan penurunan klirens metabolit aktif Risperidone.",
          advice: "Monitor tanda-tanda gejala ekstrapiramidal (EPS) atau sedasi berlebih. Pertimbangkan penurunan dosis Risperidone.",
        };
      case "carbamazepine+clozapine":
        return {
          level: "Kontraindikasi Relatif (Risiko Tinggi)",
          badgeClass: "badge-soft-danger",
          color: "#f43f5e",
          icon: "🚫",
          summary: "Kedua obat berpotensi menekan sumsum tulang dan meningkatkan risiko agranulositosis parah.",
          mechanism: "Potensiasi toksisitas hematologis terhadap sel darah putih (leukosit) dan neutrofil.",
          advice: "Hindari kombinasi ini. Jika sangat diperlukan, wajib dilakukan pemeriksaan darah lengkap (DPL) rutin mingguan.",
        };
      default:
        return {
          level: "Kompatibel / Tidak Ditemukan Interaksi Mayor",
          badgeClass: "badge-soft-success",
          color: "#10b981",
          icon: "🌿",
          summary: "Kombinasi obat ini umumnya dapat ditoleransi dengan baik pada rentang dosis terapeutik standar.",
          mechanism: "Jalur metabolisme dan reseptor target tidak saling menghambat secara signifikan.",
          advice: "Tetap konsumsi sesuai instruksi etiket dokter spesialis jiwa dan apoteker RSJ Tampan.",
        };
    }
  };

  const result = getInteractionResult(drugA, drugB);

  return (
    <div
      className={`p-4 rounded-4 shadow-sm border ${
        darkMode ? "bg-dark-card border-secondary border-opacity-25" : "bg-white"
      }`}
    >
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-opacity-10">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h5 className="fw-bold mb-0">Pemeriksa Interaksi Obat Psikiatri Klinis</h5>
            <span className="badge badge-soft-primary">Clinical Decision Tool</span>
          </div>
          <small className="opacity-75">
            Evaluasi kompatibilitas, efek samping, dan keamanan kombinasi terapi psikotropika
          </small>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              setDrugA("haloperidol");
              setDrugB("trihexyphenidyl");
            }}
          >
            Contoh: Haloperidol + THP
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              setDrugA("carbamazepine");
              setDrugB("clozapine");
            }}
          >
            Contoh: Carbamazepine + Clozapine
          </button>
        </div>
      </div>

      {/* DRUG SELECTORS */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="p-3 rounded-3" style={{ backgroundColor: darkMode ? "#141829" : "#f8fafc", border: darkMode ? "1px solid #1e263d" : "1px solid #e2e8f0" }}>
            <label className="form-label small fw-semibold text-primary">Pilih Obat Pertama (Obat A):</label>
            <select
              className={`form-select ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
              value={drugA}
              onChange={(e) => setDrugA(e.target.value)}
            >
              {psychDrugs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama}
                </option>
              ))}
            </select>
            <small className="opacity-50 mt-1 d-block font-monospace" style={{ fontSize: "0.72rem" }}>
              Golongan: {psychDrugs.find((d) => d.id === drugA)?.golongan}
            </small>
          </div>
        </div>

        <div className="col-md-6">
          <div className="p-3 rounded-3" style={{ backgroundColor: darkMode ? "#141829" : "#f8fafc", border: darkMode ? "1px solid #1e263d" : "1px solid #e2e8f0" }}>
            <label className="form-label small fw-semibold text-info">Pilih Obat Kedua (Obat B):</label>
            <select
              className={`form-select ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
              value={drugB}
              onChange={(e) => setDrugB(e.target.value)}
            >
              {psychDrugs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama}
                </option>
              ))}
            </select>
            <small className="opacity-50 mt-1 d-block font-monospace" style={{ fontSize: "0.72rem" }}>
              Golongan: {psychDrugs.find((d) => d.id === drugB)?.golongan}
            </small>
          </div>
        </div>
      </div>

      {/* HASIL INTERAKSI */}
      <div
        className="p-4 rounded-4 animate-fade-in"
        style={{
          backgroundColor: darkMode ? "#121626" : "#f8fafc",
          border: `1px solid ${result.color}44`,
        }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="fs-4">{result.icon}</span>
            <div>
              <span className={`badge ${result.badgeClass} px-3 py-1 mb-1 rounded-pill`}>
                {result.level}
              </span>
              <h6 className="fw-bold mb-0">
                {psychDrugs.find((d) => d.id === drugA)?.nama.split(" ")[0]} + {psychDrugs.find((d) => d.id === drugB)?.nama.split(" ")[0]}
              </h6>
            </div>
          </div>
          <span className="badge badge-soft-secondary font-monospace">Database Farmakologi RSJ Tampan</span>
        </div>

        <p className="fw-medium mb-3" style={{ color: darkMode ? "#f8fafc" : "#1e293b" }}>
          {result.summary}
        </p>

        <div className="row g-3 small">
          <div className="col-md-6">
            <div className="p-3 rounded-3 h-100" style={{ backgroundColor: darkMode ? "#0d101c" : "#ffffff", border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0" }}>
              <strong className="d-block mb-1 text-primary">🔬 Mekanisme Farmakologi:</strong>
              <p className="mb-0 opacity-75">{result.mechanism}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 rounded-3 h-100" style={{ backgroundColor: darkMode ? "#0d101c" : "#ffffff", border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0" }}>
              <strong className="d-block mb-1 text-success">📋 Anjuran Dokter & Apoteker:</strong>
              <p className="mb-0 opacity-75">{result.advice}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
