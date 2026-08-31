import React, { useState } from "react";

export default function BarcodeScannerModal({
  show,
  onClose,
  inventory = [],
  onSelectScannedItem,
  darkMode,
}) {
  const [scannedItem, setScannedItem] = useState(null);
  const [isScanning, setIsScanning] = useState(true);

  // Sample quick barcodes for realistic demonstration
  const sampleBarcodes = [
    { code: "B001", nama: "Risperidone 2mg Tab", kategori: "Obat Farmasi" },
    { code: "B002", nama: "Haloperidol Injeksi 50mg/mL", kategori: "Obat Farmasi" },
    { code: "B003", nama: "Diazepam 5mg Tab", kategori: "Obat Farmasi" },
    { code: "B005", nama: "Spuit 3cc Jarum Suntik", kategori: "Alat Medis" },
    { code: "B006", nama: "Infus Set Makro Dewasa", kategori: "Alat Medis" },
  ];

  if (!show) return null;

  const handleSimulateScan = (sample) => {
    setIsScanning(false);
    const found = inventory.find((item) => item.id === sample.code) || {
      id: sample.code,
      nama: sample.nama,
      kategori: sample.kategori,
      stok: 120,
      satuan: "Pcs",
      kondisi: "Bagus",
    };
    setScannedItem(found);
  };

  const handleResetScan = () => {
    setIsScanning(true);
    setScannedItem(null);
  };

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        zIndex: 1060,
      }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className={`modal-content border-0 shadow-lg rounded-4 ${
            darkMode ? "bg-dark-card text-light" : "bg-white text-dark"
          }`}
          style={{
            border: darkMode ? "1px solid #232c42" : "1px solid #e2e8f0",
          }}
        >
          {/* HEADER */}
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
                📷
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0">Pemindai Barcode / QR Code Logistik</h5>
                <small className="opacity-75">SIM-RS Hardware Scanner Simulator</small>
              </div>
            </div>
            <button
              type="button"
              className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
              onClick={() => {
                handleResetScan();
                onClose();
              }}
            ></button>
          </div>

          <div className="modal-body p-4 text-center">
            {isScanning ? (
              /* SCANNER VIEWFINDER */
              <div>
                <div
                  className="rounded-4 position-relative mx-auto overflow-hidden d-flex flex-column align-items-center justify-content-center shadow-inner mb-3"
                  style={{
                    width: "100%",
                    height: "220px",
                    backgroundColor: "#05070c",
                    border: "2px dashed #10b981",
                  }}
                >
                  {/* ANIMATED SCANNING LASER */}
                  <div
                    style={{
                      position: "absolute",
                      width: "80%",
                      height: "2px",
                      backgroundColor: "#10b981",
                      boxShadow: "0 0 12px #10b981, 0 0 20px #10b981",
                      animation: "scanAnim 2s infinite ease-in-out",
                    }}
                  ></div>

                  <style>{`
                    @keyframes scanAnim {
                      0% { top: 15%; opacity: 0.8; }
                      50% { top: 85%; opacity: 1; }
                      100% { top: 15%; opacity: 0.8; }
                    }
                  `}</style>

                  <span className="fs-1 opacity-50 mb-1">📦</span>
                  <span className="small text-white opacity-75">
                    Arahkan kamera ke Barcode / QR Code Box Obat
                  </span>
                  <span className="badge badge-soft-success mt-2">
                    Kamera Aktif • Siap Memindai
                  </span>
                </div>

                <div className="mb-3">
                  <small className="opacity-75 d-block mb-2 fw-semibold">
                    ⚡ Simulasi Pemindaian Cepat (Klik salah satu obat):
                  </small>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    {sampleBarcodes.map((sample) => (
                      <button
                        key={sample.code}
                        type="button"
                        className="btn btn-sm btn-outline-secondary font-monospace"
                        style={{ fontSize: "0.76rem" }}
                        onClick={() => handleSimulateScan(sample)}
                      >
                        🏷️ {sample.code} - {sample.nama.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* SCAN RESULT */
              <div className="animate-fade-in text-start">
                <div
                  className="p-3 rounded-4 mb-3"
                  style={{
                    backgroundColor: darkMode ? "#141a29" : "#f0fdf4",
                    border: darkMode ? "1px solid #202b42" : "1px solid #bbf7d0",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge badge-soft-success">✅ Barcode Teridentifikasi</span>
                    <code className="fs-6">{scannedItem?.id}</code>
                  </div>
                  <h5 className="fw-bold mb-1">{scannedItem?.nama}</h5>
                  <span className="badge badge-soft-primary mb-3">{scannedItem?.kategori}</span>

                  <div className="row g-2 small border-top border-opacity-10 pt-2">
                    <div className="col-6">
                      <span className="opacity-75 d-block">Stok Gudang:</span>
                      <strong>{scannedItem?.stok} {scannedItem?.satuan}</strong>
                    </div>
                    <div className="col-6">
                      <span className="opacity-75 d-block">Kondisi Fisik:</span>
                      <strong className="text-success">{scannedItem?.kondisi}</strong>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-50 py-2"
                    onClick={handleResetScan}
                  >
                    🔄 Scan Ulang
                  </button>
                  <button
                    type="button"
                    className="btn btn-success fw-semibold w-50 py-2 shadow-sm"
                    onClick={() => {
                      onSelectScannedItem(scannedItem);
                      handleResetScan();
                      onClose();
                    }}
                  >
                    📤 Pilih Logistik
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
