import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// Realistic SVG QR Code Component
function RealisticQrCode({ value, size = 44, color = "#0f172a" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <rect width="33" height="33" fill="#ffffff" />
      {/* Top Left Finder Pattern */}
      <rect x="2" y="2" width="7" height="7" fill={color} />
      <rect x="3" y="3" width="5" height="5" fill="#ffffff" />
      <rect x="4" y="4" width="3" height="3" fill={color} />

      {/* Top Right Finder Pattern */}
      <rect x="24" y="2" width="7" height="7" fill={color} />
      <rect x="25" y="3" width="5" height="5" fill="#ffffff" />
      <rect x="26" y="4" width="3" height="3" fill={color} />

      {/* Bottom Left Finder Pattern */}
      <rect x="2" y="24" width="7" height="7" fill={color} />
      <rect x="3" y="25" width="5" height="5" fill="#ffffff" />
      <rect x="4" y="26" width="3" height="3" fill={color} />

      {/* Timing Patterns */}
      <path
        d="M10 5h2v1h-2zm3 0h2v1h-2zm3 0h2v1h-2zm3 0h2v1h-2z M5 10v2h1v-2zm0 3v2h1v-2zm0 3v2h1v-2zm0 3v2h1v-2z"
        fill={color}
      />

      {/* Realistic Data Matrix Blocks */}
      <rect x="11" y="2" width="1" height="2" fill={color} />
      <rect x="14" y="2" width="2" height="1" fill={color} />
      <rect x="18" y="2" width="1" height="2" fill={color} />
      <rect x="21" y="2" width="2" height="1" fill={color} />

      <rect x="10" y="8" width="2" height="2" fill={color} />
      <rect x="14" y="7" width="1" height="2" fill={color} />
      <rect x="17" y="8" width="3" height="1" fill={color} />
      <rect x="21" y="7" width="1" height="3" fill={color} />

      <rect x="2" y="11" width="2" height="1" fill={color} />
      <rect x="6" y="11" width="1" height="2" fill={color} />
      <rect x="10" y="12" width="3" height="1" fill={color} />
      <rect x="15" y="11" width="2" height="2" fill={color} />
      <rect x="19" y="11" width="2" height="1" fill={color} />
      <rect x="23" y="11" width="1" height="3" fill={color} />
      <rect x="26" y="11" width="3" height="1" fill={color} />

      <rect x="2" y="15" width="1" height="2" fill={color} />
      <rect x="5" y="14" width="2" height="2" fill={color} />
      <rect x="9" y="15" width="2" height="1" fill={color} />
      <rect x="13" y="14" width="3" height="2" fill={color} />
      <rect x="18" y="14" width="2" height="2" fill={color} />
      <rect x="22" y="16" width="3" height="1" fill={color} />
      <rect x="27" y="14" width="2" height="2" fill={color} />

      <rect x="11" y="18" width="2" height="2" fill={color} />
      <rect x="15" y="18" width="3" height="1" fill={color} />
      <rect x="20" y="18" width="2" height="2" fill={color} />
      <rect x="25" y="18" width="2" height="1" fill={color} />
      <rect x="29" y="18" width="2" height="2" fill={color} />

      <rect x="2" y="20" width="3" height="1" fill={color} />
      <rect x="7" y="20" width="1" height="2" fill={color} />
      <rect x="10" y="22" width="2" height="2" fill={color} />
      <rect x="14" y="21" width="1" height="2" fill={color} />
      <rect x="17" y="22" width="3" height="1" fill={color} />
      <rect x="22" y="21" width="2" height="2" fill={color} />
      <rect x="26" y="22" width="1" height="2" fill={color} />
      <rect x="29" y="21" width="2" height="2" fill={color} />

      <rect x="11" y="25" width="3" height="2" fill={color} />
      <rect x="16" y="26" width="2" height="1" fill={color} />
      <rect x="20" y="25" width="2" height="2" fill={color} />
      <rect x="24" y="25" width="3" height="1" fill={color} />
      <rect x="29" y="25" width="2" height="2" fill={color} />

      <rect x="11" y="29" width="2" height="2" fill={color} />
      <rect x="15" y="29" width="3" height="1" fill={color} />
      <rect x="20" y="28" width="2" height="2" fill={color} />
      <rect x="24" y="29" width="2" height="2" fill={color} />
      <rect x="28" y="29" width="3" height="1" fill={color} />
    </svg>
  );
}

// Realistic SVG Barcode Component
function RealisticBarcode({ code, height = 24, width = "100%" }) {
  return (
    <div style={{ width, textAlign: "center" }}>
      <svg
        width="100%"
        height={height}
        viewBox="0 0 200 36"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="200" height="36" fill="#ffffff" />
        <g fill="#0f172a">
          {/* Barcode bars */}
          <rect x="4" y="2" width="3" height="32" />
          <rect x="9" y="2" width="1.5" height="32" />
          <rect x="13" y="2" width="4" height="32" />
          <rect x="19" y="2" width="2" height="32" />
          <rect x="24" y="2" width="1.5" height="32" />
          <rect x="27" y="2" width="5" height="32" />
          <rect x="34" y="2" width="2" height="32" />
          <rect x="38" y="2" width="3.5" height="32" />
          <rect x="44" y="2" width="1.5" height="32" />
          <rect x="48" y="2" width="4.5" height="32" />
          <rect x="55" y="2" width="2" height="32" />
          <rect x="59" y="2" width="1.5" height="32" />
          <rect x="63" y="2" width="5" height="32" />
          <rect x="70" y="2" width="2" height="32" />
          <rect x="74" y="2" width="3.5" height="32" />
          <rect x="80" y="2" width="1.5" height="32" />
          <rect x="84" y="2" width="4" height="32" />
          <rect x="90" y="2" width="2" height="32" />
          <rect x="94" y="2" width="3" height="32" />
          <rect x="99" y="2" width="1.5" height="32" />
          <rect x="103" y="2" width="4.5" height="32" />
          <rect x="110" y="2" width="2" height="32" />
          <rect x="114" y="2" width="1.5" height="32" />
          <rect x="118" y="2" width="5" height="32" />
          <rect x="125" y="2" width="2" height="32" />
          <rect x="129" y="2" width="3.5" height="32" />
          <rect x="135" y="2" width="1.5" height="32" />
          <rect x="139" y="2" width="4" height="32" />
          <rect x="145" y="2" width="2.5" height="32" />
          <rect x="150" y="2" width="1.5" height="32" />
          <rect x="154" y="2" width="4" height="32" />
          <rect x="160" y="2" width="2" height="32" />
          <rect x="164" y="2" width="3.5" height="32" />
          <rect x="170" y="2" width="1.5" height="32" />
          <rect x="174" y="2" width="4" height="32" />
          <rect x="180" y="2" width="2.5" height="32" />
          <rect x="185" y="2" width="1.5" height="32" />
          <rect x="188" y="2" width="4" height="32" />
          <rect x="194" y="2" width="2" height="32" />
        </g>
      </svg>
      <div
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "7.5px",
          fontWeight: 700,
          letterSpacing: "1.5px",
          color: "#475569",
          marginTop: "1px",
          textAlign: "center",
        }}
      >
        {code}
      </div>
    </div>
  );
}

export default function SdmIdCardModal({
  isOpen,
  onClose,
  employee,
  darkMode,
}) {
  const [cardOrientation, setCardOrientation] = useState("portrait"); // "portrait" (tegak 54x86) | "landscape" (mendatar 86x54)
  const [cardSide, setCardSide] = useState("both"); // "front" | "back" | "both"
  const [printOption, setPrintOption] = useState("both"); // "both" (Depan & Belakang siap potong) | "active" (Sisi yang dipilih)

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !employee) return null;

  const handlePrint = () => {
    window.print();
  };

  const isMedical = employee.kategori === "Medis";
  const isNursing = employee.kategori === "Keperawatan";
  const badgeColor = isMedical ? "#0284c7" : isNursing ? "#059669" : "#7c3aed";
  const statusColor =
    employee.statusKepegawaian === "PNS"
      ? "#059669"
      : employee.statusKepegawaian === "PPPK"
        ? "#2563eb"
        : "#d97706";

  const nipClean = employee.nip ? employee.nip.replace(/\s+/g, "") : "199001012020011001";
  const barcodeValue = `RSJT-${nipClean.slice(-8)}`;

  // ==========================================
  // CARD COMPONENT - PORTRAIT FRONT (54mm x 86mm)
  // ==========================================
  const renderPortraitFront = (isForPrint = false) => (
    <div
      className={`id-card-unit id-card-portrait ${isForPrint ? "is-print-mode" : ""}`}
      style={{
        position: "relative",
        width: isForPrint ? "54mm" : "300px",
        height: isForPrint ? "86mm" : "478px",
        minWidth: isForPrint ? "54mm" : "300px",
        maxWidth: isForPrint ? "54mm" : "300px",
        minHeight: isForPrint ? "86mm" : "478px",
        maxHeight: isForPrint ? "86mm" : "478px",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        borderRadius: isForPrint ? "3.18mm" : "16px",
        boxShadow: isForPrint ? "none" : "0 10px 25px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.1)",
        border: isForPrint ? "0.5pt solid #94a3b8" : "1.5pt solid #cbd5e1",
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      }}
    >
      {/* 1. LATAR BELAKANG / WATERMARK LOGO RESMI RSJ TAMPAN */}
      <div
        className="card-watermark"
        style={{
          position: "absolute",
          top: "54%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isForPrint ? "46mm" : "210px",
          height: isForPrint ? "46mm" : "210px",
          backgroundImage: "url('/logo-rsj-daun.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 0.12,
          pointerEvents: "none",
          zIndex: 1,
          filter: "contrast(1.15)",
        }}
      />

      {/* Decorative Top Hospital Curved Header Accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: isForPrint ? "17mm" : "94px",
          background: "linear-gradient(135deg, #059669 0%, #047857 60%, #065f46 100%)",
          zIndex: 0,
          borderBottomLeftRadius: "50% 12px",
          borderBottomRightRadius: "50% 12px",
        }}
      />

      {/* Card Content Layer */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: isForPrint ? "2.5mm 3.2mm 2.2mm 3.2mm" : "14px 18px 12px 18px",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER KOP: LOGO + INSTANSI */}
        <div>
          {/* Lanyard Slot Cutout simulation (screen preview only) */}
          {!isForPrint && (
            <div
              className="mx-auto mb-1.5"
              style={{
                width: "36px",
                height: "4px",
                backgroundColor: "rgba(255,255,255,0.4)",
                borderRadius: "999px",
              }}
            />
          )}

          <div className="d-flex align-items-center gap-1.5 mb-1 text-white">
            <div
              style={{
                width: isForPrint ? "8.5mm" : "42px",
                height: isForPrint ? "8.5mm" : "42px",
                backgroundColor: "#ffffff",
                borderRadius: "50%",
                padding: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                flexShrink: 0,
              }}
            >
              <img
                src="/logo-rsj-daun.png"
                alt="Logo RSJ Tampan"
                style={{
                  width: "92%",
                  height: "92%",
                  objectFit: "contain",
                }}
              />
            </div>
            <div style={{ lineHeight: "1.15", flex: 1 }}>
              <div
                style={{
                  fontSize: isForPrint ? "5.2pt" : "8.5px",
                  fontWeight: 700,
                  letterSpacing: "0.4px",
                  color: "#d1fae5",
                  textTransform: "uppercase",
                }}
              >
                Pemerintah Provinsi Riau
              </div>
              <div
                style={{
                  fontSize: isForPrint ? "7.2pt" : "11.5px",
                  fontWeight: 900,
                  letterSpacing: "-0.2px",
                  color: "#ffffff",
                  textTransform: "uppercase",
                }}
              >
                RSJ Tampan Pekanbaru
              </div>
              <div
                style={{
                  fontSize: isForPrint ? "4.2pt" : "7px",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                Jl. H.R. Soebrantas Km. 12.5 Pekanbaru
              </div>
            </div>
          </div>
        </div>

        {/* FOTO PEGAWAI DENGAN BINGKAI EMAS / STATUS */}
        <div className="text-center my-0.5">
          <div
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <div
              style={{
                width: isForPrint ? "21mm" : "105px",
                height: isForPrint ? "25.5mm" : "126px",
                borderRadius: isForPrint ? "2mm" : "10px",
                overflow: "hidden",
                border: "2.5px solid #059669",
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                backgroundColor: "#f1f5f9",
                margin: "0 auto",
              }}
            >
              <img
                src={
                  employee.foto ||
                  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"
                }
                alt={employee.nama}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            <span
              style={{
                position: "absolute",
                bottom: "-5px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: statusColor,
                color: "#ffffff",
                fontSize: isForPrint ? "5pt" : "8px",
                fontWeight: 800,
                padding: isForPrint ? "0.3mm 2.2mm" : "2px 8px",
                borderRadius: "999px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                whiteSpace: "nowrap",
                letterSpacing: "0.5px",
              }}
            >
              {employee.statusKepegawaian || "PNS"}
            </span>
          </div>
        </div>

        {/* DATA PEGAWAI */}
        <div className="text-center mt-1">
          <div
            style={{
              fontSize: isForPrint ? "8.5pt" : "13px",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: "1.2",
              marginBottom: "2px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {employee.nama}
          </div>

          <div
            style={{
              display: "inline-block",
              backgroundColor: "rgba(5, 150, 105, 0.12)",
              color: "#047857",
              fontWeight: 700,
              fontSize: isForPrint ? "5.5pt" : "9px",
              padding: isForPrint ? "0.4mm 2.2mm" : "2px 8px",
              borderRadius: "4px",
              marginBottom: "3px",
            }}
          >
            {employee.profesi || "Tenaga Kesehatan"}
          </div>

          <div
            style={{
              fontSize: isForPrint ? "5.8pt" : "9px",
              fontWeight: 600,
              color: "#475569",
              lineHeight: "1.25",
            }}
          >
            NIP. {employee.nip || "-"}
          </div>
        </div>

        {/* DETAIL BOX (UNIT, GOLONGAN, MASA BERLAKU) */}
        <div
          style={{
            backgroundColor: "rgba(248, 250, 252, 0.88)",
            borderRadius: "6px",
            padding: isForPrint ? "1.2mm 2.2mm" : "6px 10px",
            border: "1px solid #e2e8f0",
            fontSize: isForPrint ? "5.2pt" : "8.5px",
            lineHeight: "1.35",
            marginTop: "2px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #cbd5e1", paddingBottom: "2px" }}>
            <span style={{ color: "#64748b" }}>Unit Kerja:</span>
            <span style={{ fontWeight: 700, color: "#1e293b", maxWidth: isForPrint ? "30mm" : "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {employee.unitPenempatan || "RSJ Tampan"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "2px" }}>
            <span style={{ color: "#64748b" }}>Pangkat / Gol:</span>
            <span style={{ fontWeight: 700, color: "#1e293b" }}>
              {employee.golongan || "-"}
            </span>
          </div>
        </div>

        {/* FOOTER BAR: QR CODE + SERIAL CODE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #059669",
            paddingTop: isForPrint ? "1.2mm" : "6px",
            marginTop: "2px",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: isForPrint ? "4.2pt" : "7px", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
              KARTU IDENTITAS RESMI
            </div>
            <div style={{ fontSize: isForPrint ? "5.5pt" : "9px", fontWeight: 800, color: "#059669" }}>
              SIM-SDM #{employee.id}
            </div>
            <div style={{ fontSize: isForPrint ? "3.8pt" : "6.5px", color: "#94a3b8" }}>
              Berlaku Selama Menjabat
            </div>
          </div>

          <div
            style={{
              padding: "1.5px",
              backgroundColor: "#ffffff",
              borderRadius: "4px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <RealisticQrCode value={employee.nip || employee.id} size={isForPrint ? 26 : 38} color="#059669" />
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // CARD COMPONENT - PORTRAIT BACK (54mm x 86mm)
  // ==========================================
  const renderPortraitBack = (isForPrint = false) => (
    <div
      className={`id-card-unit id-card-portrait ${isForPrint ? "is-print-mode" : ""}`}
      style={{
        position: "relative",
        width: isForPrint ? "54mm" : "300px",
        height: isForPrint ? "86mm" : "478px",
        minWidth: isForPrint ? "54mm" : "300px",
        maxWidth: isForPrint ? "54mm" : "300px",
        minHeight: isForPrint ? "86mm" : "478px",
        maxHeight: isForPrint ? "86mm" : "478px",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        borderRadius: isForPrint ? "3.18mm" : "16px",
        boxShadow: isForPrint ? "none" : "0 10px 25px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.1)",
        border: isForPrint ? "0.5pt solid #94a3b8" : "1.5pt solid #cbd5e1",
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      }}
    >
      {/* 1. LATAR BELAKANG / WATERMARK LOGO RESMI RSJ TAMPAN */}
      <div
        className="card-watermark"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isForPrint ? "46mm" : "210px",
          height: isForPrint ? "46mm" : "210px",
          backgroundImage: "url('/logo-rsj-daun.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 0.12,
          pointerEvents: "none",
          zIndex: 1,
          filter: "contrast(1.15)",
        }}
      />

      {/* Decorative Top Accent Stripe */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: isForPrint ? "3mm" : "12px",
          backgroundColor: "#059669",
          zIndex: 0,
        }}
      />

      {/* Content Container */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: isForPrint ? "4.5mm 3.2mm 2.5mm 3.2mm" : "22px 18px 14px 18px",
          boxSizing: "border-box",
        }}
      >
        {/* KETENTUAN HEADER */}
        <div>
          <div className="text-center mb-1 pb-1" style={{ borderBottom: "1.5px solid #059669" }}>
            <div
              style={{
                fontSize: isForPrint ? "6.8pt" : "11px",
                fontWeight: 900,
                color: "#059669",
                letterSpacing: "0.4px",
                textTransform: "uppercase",
              }}
            >
              Ketentuan Penggunaan
            </div>
            <div
              style={{
                fontSize: isForPrint ? "4.5pt" : "7.5px",
                color: "#64748b",
                fontWeight: 600,
              }}
            >
              KARTU PEGAWAI ELEKTRONIK (KPE) RSJ TAMPAN
            </div>
          </div>

          {/* RULES LIST */}
          <div
            style={{
              fontSize: isForPrint ? "4.8pt" : "8px",
              color: "#334155",
              lineHeight: "1.4",
              marginTop: "4px",
            }}
          >
            <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
              <span style={{ color: "#059669", fontWeight: 700 }}>1.</span>
              <span>Kartu ini adalah identitas resmi pegawai Pemerintah Provinsi Riau di RSJ Tampan.</span>
            </div>
            <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
              <span style={{ color: "#059669", fontWeight: 700 }}>2.</span>
              <span>Wajib dikenakan selama jam dinas, pelayanan pasien, dan kegiatan kedinasan.</span>
            </div>
            <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
              <span style={{ color: "#059669", fontWeight: 700 }}>3.</span>
              <span>Tidak boleh dipindahtangankan, dipinjamkan, atau disalahgunakan oleh pihak lain.</span>
            </div>
            <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
              <span style={{ color: "#059669", fontWeight: 700 }}>4.</span>
              <span>Apabila hilang atau menemukan kartu ini, harap segera menghubungi Subbag SDM RSJ Tampan.</span>
            </div>
          </div>
        </div>

        {/* CALL CENTER & PENGESAHAN */}
        <div>
          <div
            style={{
              backgroundColor: "rgba(240, 253, 244, 0.85)",
              border: "1px solid #86efac",
              borderRadius: "5px",
              padding: isForPrint ? "1.5mm" : "6px",
              textAlign: "center",
              marginBottom: "6px",
            }}
          >
            <div style={{ fontSize: isForPrint ? "4.2pt" : "7px", color: "#065f46", fontWeight: 600 }}>
              Layanan Informasi Kepegawaian & Verifikasi:
            </div>
            <div style={{ fontSize: isForPrint ? "5.5pt" : "8.5px", fontWeight: 800, color: "#047857" }}>
              (0761) 63222 • sdm@rsjtampan.riau.go.id
            </div>
            <div style={{ fontSize: isForPrint ? "4.2pt" : "7px", color: "#065f46" }}>
              https://rsjtampan.riau.go.id
            </div>
          </div>

          {/* SIGNATURE / PENGESAHAN STAMP */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              padding: isForPrint ? "0 1mm 1.5mm 1mm" : "0 4px 6px 4px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: isForPrint ? "3.8pt" : "6.5px", color: "#64748b" }}>
                Verifikasi Sistem
              </div>
              <div
                style={{
                  border: "1px dashed #059669",
                  borderRadius: "3px",
                  padding: "1px 4px",
                  fontSize: isForPrint ? "4pt" : "6.5px",
                  color: "#059669",
                  fontWeight: 700,
                  marginTop: "1px",
                }}
              >
                VALIDATED ✓
              </div>
            </div>

            <div style={{ textAlign: "center", minWidth: isForPrint ? "22mm" : "110px" }}>
              <div style={{ fontSize: isForPrint ? "4pt" : "7px", color: "#475569" }}>
                Pekanbaru, Riau
              </div>
              <div style={{ fontSize: isForPrint ? "4.2pt" : "7px", fontWeight: 700, color: "#1e293b" }}>
                Direktur RSJ Tampan
              </div>
              <div
                style={{
                  height: isForPrint ? "5mm" : "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Brush Script MT', cursive, sans-serif",
                    fontSize: isForPrint ? "8pt" : "14px",
                    color: "#1e3a8a",
                  }}
                >
                  dr. Zulkifli, Sp.KJ
                </span>
              </div>
              <div
                style={{
                  borderTop: "0.5pt solid #475569",
                  fontSize: isForPrint ? "4pt" : "6.5px",
                  color: "#334155",
                  fontWeight: 600,
                }}
              >
                NIP. 19680512 199803 1 004
              </div>
            </div>
          </div>

          {/* REALISTIC BARCODE & SERIAL NUMBER */}
          <div
            style={{
              borderTop: "1px solid #e2e8f0",
              paddingTop: isForPrint ? "1.2mm" : "4px",
              textAlign: "center",
            }}
          >
            <RealisticBarcode code={barcodeValue} height={isForPrint ? 14 : 20} />
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // CARD COMPONENT - LANDSCAPE FRONT (86mm x 54mm)
  // ==========================================
  const renderLandscapeFront = (isForPrint = false) => (
    <div
      className={`id-card-unit id-card-landscape ${isForPrint ? "is-print-mode" : ""}`}
      style={{
        position: "relative",
        width: isForPrint ? "86mm" : "480px",
        height: isForPrint ? "54mm" : "300px",
        minWidth: isForPrint ? "86mm" : "480px",
        maxWidth: isForPrint ? "86mm" : "480px",
        minHeight: isForPrint ? "54mm" : "300px",
        maxHeight: isForPrint ? "54mm" : "300px",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        borderRadius: isForPrint ? "3.18mm" : "16px",
        boxShadow: isForPrint ? "none" : "0 10px 25px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.1)",
        border: isForPrint ? "0.5pt solid #94a3b8" : "1.5pt solid #cbd5e1",
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      }}
    >
      {/* 1. LATAR BELAKANG / WATERMARK LOGO RESMI RSJ TAMPAN */}
      <div
        className="card-watermark"
        style={{
          position: "absolute",
          top: "50%",
          left: "58%",
          transform: "translate(-50%, -50%)",
          width: isForPrint ? "44mm" : "210px",
          height: isForPrint ? "44mm" : "210px",
          backgroundImage: "url('/logo-rsj-daun.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 0.12,
          pointerEvents: "none",
          zIndex: 1,
          filter: "contrast(1.15)",
        }}
      />

      {/* Decorative Top Hospital Curved Header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: isForPrint ? "11.5mm" : "64px",
          background: "linear-gradient(135deg, #059669 0%, #047857 60%, #065f46 100%)",
          zIndex: 0,
        }}
      />

      {/* Content Container */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: isForPrint ? "2.2mm 3.5mm 1.8mm 3.5mm" : "12px 18px 10px 18px",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER: LOGO + INSTANSI + CHIP/BADGE */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: isForPrint ? "7.5mm" : "36px",
                height: isForPrint ? "7.5mm" : "36px",
                backgroundColor: "#ffffff",
                borderRadius: "50%",
                padding: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                flexShrink: 0,
              }}
            >
              <img
                src="/logo-rsj-daun.png"
                alt="Logo RSJ"
                style={{ width: "90%", height: "90%", objectFit: "contain" }}
              />
            </div>
            <div style={{ lineHeight: "1.15" }}>
              <div
                style={{
                  fontSize: isForPrint ? "4.8pt" : "8px",
                  fontWeight: 700,
                  letterSpacing: "0.3px",
                  color: "#d1fae5",
                  textTransform: "uppercase",
                }}
              >
                PEMERINTAH PROVINSI RIAU
              </div>
              <div
                style={{
                  fontSize: isForPrint ? "6.8pt" : "11px",
                  fontWeight: 900,
                  color: "#ffffff",
                  letterSpacing: "-0.2px",
                  textTransform: "uppercase",
                }}
              >
                RSJ TAMPAN PEKANBARU
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: statusColor,
              color: "#ffffff",
              fontSize: isForPrint ? "4.8pt" : "7.5px",
              fontWeight: 800,
              padding: isForPrint ? "0.4mm 2.2mm" : "2px 8px",
              borderRadius: "999px",
              letterSpacing: "0.4px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          >
            KPE • {employee.statusKepegawaian || "PNS"}
          </div>
        </div>

        {/* BODY 2-KOLOM (FOTO + IDENTITAS) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isForPrint ? "3mm" : "14px",
            marginTop: "1.5mm",
          }}
        >
          {/* FOTO & CHIP / QR */}
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div
              style={{
                width: isForPrint ? "17mm" : "84px",
                height: isForPrint ? "21mm" : "104px",
                borderRadius: isForPrint ? "1.8mm" : "8px",
                overflow: "hidden",
                border: "2px solid #059669",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                backgroundColor: "#f1f5f9",
              }}
            >
              <img
                src={
                  employee.foto ||
                  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
                }
                alt={employee.nama}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* TEKS DATA PEGAWAI */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: isForPrint ? "8.2pt" : "13px",
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: "1.2",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {employee.nama}
            </div>

            <div
              style={{
                display: "inline-block",
                backgroundColor: "rgba(5, 150, 105, 0.12)",
                color: "#047857",
                fontWeight: 700,
                fontSize: isForPrint ? "5.2pt" : "8.5px",
                padding: isForPrint ? "0.3mm 2mm" : "1.5px 6px",
                borderRadius: "3px",
                marginTop: "1px",
                marginBottom: "3px",
              }}
            >
              {employee.profesi || "Tenaga Medis"}
            </div>

            <div
              style={{
                backgroundColor: "rgba(248, 250, 252, 0.9)",
                borderRadius: "5px",
                padding: isForPrint ? "1mm 1.8mm" : "5px 8px",
                border: "1px solid #e2e8f0",
                fontSize: isForPrint ? "4.8pt" : "8px",
                lineHeight: "1.3",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>NIP:</span>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>{employee.nip || "-"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Unit Kerja:</span>
                <span style={{ fontWeight: 700, color: "#0f172a", maxWidth: isForPrint ? "36mm" : "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {employee.unitPenempatan || "RSJ Tampan"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Pangkat / Gol:</span>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>{employee.golongan || "-"}</span>
              </div>
            </div>
          </div>

          {/* QR CODE SAMPING */}
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <div
              style={{
                padding: "1.5px",
                backgroundColor: "#ffffff",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <RealisticQrCode value={employee.nip || employee.id} size={isForPrint ? 25 : 36} color="#059669" />
            </div>
            <div style={{ fontSize: isForPrint ? "3.6pt" : "6px", color: "#64748b", marginTop: "1px", fontWeight: 700 }}>
              ID: {employee.id}
            </div>
          </div>
        </div>

        {/* FOOTER BARCODE */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #059669",
            paddingTop: isForPrint ? "1mm" : "4px",
            fontSize: isForPrint ? "4.2pt" : "7px",
          }}
        >
          <span style={{ color: "#64748b", fontWeight: 600 }}>SIM-SDM RSJ TAMPAN PROVINSI RIAU</span>
          <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#059669" }}>{barcodeValue}</span>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // CARD COMPONENT - LANDSCAPE BACK (86mm x 54mm)
  // ==========================================
  const renderLandscapeBack = (isForPrint = false) => (
    <div
      className={`id-card-unit id-card-landscape ${isForPrint ? "is-print-mode" : ""}`}
      style={{
        position: "relative",
        width: isForPrint ? "86mm" : "480px",
        height: isForPrint ? "54mm" : "300px",
        minWidth: isForPrint ? "86mm" : "480px",
        maxWidth: isForPrint ? "86mm" : "480px",
        minHeight: isForPrint ? "54mm" : "300px",
        maxHeight: isForPrint ? "54mm" : "300px",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        borderRadius: isForPrint ? "3.18mm" : "16px",
        boxShadow: isForPrint ? "none" : "0 10px 25px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.1)",
        border: isForPrint ? "0.5pt solid #94a3b8" : "1.5pt solid #cbd5e1",
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      }}
    >
      {/* 1. LATAR BELAKANG / WATERMARK LOGO RESMI RSJ TAMPAN */}
      <div
        className="card-watermark"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isForPrint ? "44mm" : "210px",
          height: isForPrint ? "44mm" : "210px",
          backgroundImage: "url('/logo-rsj-daun.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 0.12,
          pointerEvents: "none",
          zIndex: 1,
          filter: "contrast(1.15)",
        }}
      />

      {/* Top Stripe */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: isForPrint ? "2.5mm" : "8px",
          backgroundColor: "#059669",
          zIndex: 0,
        }}
      />

      {/* Content Container */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: isForPrint ? "3.5mm 3.5mm 2mm 3.5mm" : "14px 18px 10px 18px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1.5px solid #059669", paddingBottom: "2px" }}>
          <div>
            <div style={{ fontSize: isForPrint ? "6.2pt" : "10px", fontWeight: 900, color: "#059669", textTransform: "uppercase" }}>
              Ketentuan Kartu Pegawai Elektronik (KPE)
            </div>
            <div style={{ fontSize: isForPrint ? "4.2pt" : "7px", color: "#64748b" }}>
              Pemerintah Provinsi Riau - RSJ Tampan Pekanbaru
            </div>
          </div>
          <div style={{ fontSize: isForPrint ? "4.5pt" : "7.5px", fontWeight: 700, color: "#047857" }}>
            ISO/IEC 7810 ID-1
          </div>
        </div>

        {/* 2 Kolom: Rules + Pengesahan */}
        <div style={{ display: "flex", gap: isForPrint ? "3mm" : "12px", marginTop: "2px" }}>
          <div style={{ flex: 1.2, fontSize: isForPrint ? "4.5pt" : "7.5px", color: "#334155", lineHeight: "1.35" }}>
            <div style={{ marginBottom: "2px" }}>• Kartu identitas dinas resmi di lingkungan RSJ Tampan.</div>
            <div style={{ marginBottom: "2px" }}>• Wajib selalu dikenakan selama dinas dan jam pelayanan.</div>
            <div style={{ marginBottom: "2px" }}>• Jika menemukan kartu ini harap serahkan ke Subbag SDM.</div>
            <div style={{ color: "#047857", fontWeight: 700 }}>• Call Center SDM: (0761) 63222 / 63223</div>
          </div>

          <div style={{ flex: 0.8, textAlign: "center", borderLeft: "1px dashed #cbd5e1", paddingLeft: isForPrint ? "2mm" : "8px" }}>
            <div style={{ fontSize: isForPrint ? "3.8pt" : "6.5px", color: "#64748b" }}>Pekanbaru, Riau</div>
            <div style={{ fontSize: isForPrint ? "4.2pt" : "7px", fontWeight: 700, color: "#1e293b" }}>Direktur RSJ Tampan</div>
            <div style={{ height: isForPrint ? "4.5mm" : "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Brush Script MT', cursive", fontSize: isForPrint ? "7.5pt" : "12px", color: "#1e3a8a" }}>
                dr. Zulkifli, Sp.KJ
              </span>
            </div>
            <div style={{ borderTop: "0.5pt solid #475569", fontSize: isForPrint ? "3.6pt" : "6px", color: "#334155", fontWeight: 600 }}>
              NIP. 19680512 199803 1 004
            </div>
          </div>
        </div>

        {/* BARCODE */}
        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: isForPrint ? "1mm" : "3px" }}>
          <RealisticBarcode code={barcodeValue} height={isForPrint ? 11 : 16} />
        </div>
      </div>
    </div>
  );

  return createPortal(
    <>
      {/* ======================================================== */}
      {/* PRINT-SPECIFIC CSS RULES                                 */}
      {/* Guarantees 1:1 Physical CR80 Size (54mm x 86mm) on Print */}
      {/* ======================================================== */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 12mm 10mm;
        }

        @media print {
          /* Hide everything in page */
          body * {
            visibility: hidden !important;
          }

          /* Show ONLY print container */
          #print-root-container, #print-root-container * {
            visibility: visible !important;
          }

          #print-root-container {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 8mm 0 !important;
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            align-items: flex-start !important;
            gap: 10mm !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Ensure exact millimeter card sizing for physical cutter/holder */
          .id-card-unit {
            box-shadow: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .id-card-unit.id-card-portrait {
            width: 54mm !important;
            height: 86mm !important;
            min-width: 54mm !important;
            max-width: 54mm !important;
            min-height: 86mm !important;
            max-height: 86mm !important;
            border-radius: 3.18mm !important;
            border: 0.5pt solid #94a3b8 !important;
          }

          .id-card-unit.id-card-landscape {
            width: 86mm !important;
            height: 54mm !important;
            min-width: 86mm !important;
            max-width: 86mm !important;
            min-height: 54mm !important;
            max-height: 54mm !important;
            border-radius: 3.18mm !important;
            border: 0.5pt solid #94a3b8 !important;
          }

          .crop-guide {
            display: block !important;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* ======================================================== */}
      {/* HIDDEN PRINT-ONLY CONTAINER (Populates standard print)   */}
      {/* ======================================================== */}
      <div id="print-root-container" style={{ display: "none" }}>
        {/* Helper title header on printed page */}
        <div style={{ width: "100%", textAlign: "center", marginBottom: "6mm" }}>
          <div style={{ fontSize: "11pt", fontWeight: 800, color: "#065f46", textTransform: "uppercase" }}>
            Kartu Pegawai Elektronik (KPE) - RSJ Tampan Provinsi Riau
          </div>
          <div style={{ fontSize: "8pt", color: "#64748b" }}>
            Ukuran Cetak Standar Fisik CR80 (54 mm × 86 mm) • Potong mengikuti garis luar untuk dimasukkan ke card holder / lanyard
          </div>
        </div>

        {/* If user wants both sides (front & back side-by-side for easy folding/cutting) */}
        {printOption === "both" ? (
          cardOrientation === "portrait" ? (
            <>
              {/* SISI DEPAN TEGAK */}
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: "7pt", fontWeight: 700, color: "#64748b", marginBottom: "2mm", textAlign: "center" }}>
                  [ SISI DEPAN ]
                </div>
                {renderPortraitFront(true)}
              </div>

              {/* SISI BELAKANG TEGAK */}
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: "7pt", fontWeight: 700, color: "#64748b", marginBottom: "2mm", textAlign: "center" }}>
                  [ SISI BELAKANG ]
                </div>
                {renderPortraitBack(true)}
              </div>
            </>
          ) : (
            <>
              {/* SISI DEPAN LANDSCAPE */}
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: "7pt", fontWeight: 700, color: "#64748b", marginBottom: "2mm", textAlign: "center" }}>
                  [ SISI DEPAN ]
                </div>
                {renderLandscapeFront(true)}
              </div>

              {/* SISI BELAKANG LANDSCAPE */}
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: "7pt", fontWeight: 700, color: "#64748b", marginBottom: "2mm", textAlign: "center" }}>
                  [ SISI BELAKANG ]
                </div>
                {renderLandscapeBack(true)}
              </div>
            </>
          )
        ) : (
          /* User selected single side print */
          cardOrientation === "portrait" ? (
            cardSide === "back" ? renderPortraitBack(true) : renderPortraitFront(true)
          ) : (
            cardSide === "back" ? renderLandscapeBack(true) : renderLandscapeFront(true)
          )
        )}
      </div>

      {/* ======================================================== */}
      {/* INTERACTIVE MODAL BACKDROP & DIALOG                      */}
      {/* ======================================================== */}
      <div
        className="animate-fade-in no-print"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          boxSizing: "border-box",
        }}
        onClick={onClose}
      >
        <div
          className="rounded-4 shadow-lg overflow-hidden animate-scale-up"
          style={{
            width: "100%",
            maxWidth: cardSide === "both" || cardOrientation === "landscape" ? "740px" : "440px",
            backgroundColor: darkMode ? "#0f1424" : "#ffffff",
            color: darkMode ? "#f8fafc" : "#0f172a",
            border: darkMode ? "1px solid #1f293d" : "1px solid #e2e8f0",
            boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.5)",
            maxHeight: "94vh",
            display: "flex",
            flexDirection: "column",
            transition: "max-width 0.25s ease",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* MODAL HEADER */}
          <div
            className="py-2.5 px-3 border-bottom d-flex justify-content-between align-items-center"
            style={{
              borderColor: darkMode ? "#1f293d" : "#e2e8f0",
              backgroundColor: darkMode ? "#131b2e" : "#f8fafc",
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src="/logo-rsj-daun.png"
                  alt="Logo"
                  style={{ width: "20px", height: "20px", objectFit: "contain" }}
                />
              </div>
              <div>
                <h6 className="fw-bold mb-0" style={{ fontSize: "0.9rem", lineHeight: "1.2" }}>
                  Kartu Pegawai Elektronik (KPE)
                </h6>
                <small className="opacity-75" style={{ fontSize: "0.68rem" }}>
                  Standar Fisik CR80 (54 mm × 86 mm) • Latar Belakang Logo Resmi RSJ Tampan
                </small>
              </div>
            </div>
            <button
              type="button"
              className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
              onClick={onClose}
              aria-label="Close"
              style={{ fontSize: "0.75rem" }}
            />
          </div>

          {/* CONTROLS TOOLBAR */}
          <div
            className="px-3 py-2 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2"
            style={{
              backgroundColor: darkMode ? "#0c111e" : "#f8fafc",
              borderColor: darkMode ? "#1f293d" : "#e2e8f0",
            }}
          >
            {/* 1. ORIENTATION TOGGLE */}
            <div className="d-flex align-items-center gap-1.5">
              <span className="small text-muted fw-semibold" style={{ fontSize: "0.72rem" }}>
                Orientasi:
              </span>
              <div className="btn-group btn-group-sm" role="group">
                <button
                  type="button"
                  className={`btn btn-sm py-1 px-2.5 ${
                    cardOrientation === "portrait"
                      ? "btn-success fw-bold shadow-xs"
                      : darkMode
                        ? "btn-outline-secondary text-light border-0"
                        : "btn-outline-secondary border-0"
                  }`}
                  onClick={() => setCardOrientation("portrait")}
                  style={{ fontSize: "0.72rem" }}
                >
                  📇 Tegak (54×86mm)
                </button>
                <button
                  type="button"
                  className={`btn btn-sm py-1 px-2.5 ${
                    cardOrientation === "landscape"
                      ? "btn-success fw-bold shadow-xs"
                      : darkMode
                        ? "btn-outline-secondary text-light border-0"
                        : "btn-outline-secondary border-0"
                  }`}
                  onClick={() => setCardOrientation("landscape")}
                  style={{ fontSize: "0.72rem" }}
                >
                  💳 Mendatar (86×54mm)
                </button>
              </div>
            </div>

            {/* 2. SIDE SELECTOR */}
            <div className="d-flex align-items-center gap-1.5">
              <span className="small text-muted fw-semibold" style={{ fontSize: "0.72rem" }}>
                Tampilan:
              </span>
              <div className="btn-group btn-group-sm" role="group">
                <button
                  type="button"
                  className={`btn btn-sm py-1 px-2 ${
                    cardSide === "both"
                      ? "btn-primary fw-bold"
                      : darkMode
                        ? "btn-outline-secondary text-light border-0"
                        : "btn-outline-secondary border-0"
                  }`}
                  onClick={() => setCardSide("both")}
                  style={{ fontSize: "0.72rem" }}
                >
                  Depan + Belakang
                </button>
                <button
                  type="button"
                  className={`btn btn-sm py-1 px-2 ${
                    cardSide === "front"
                      ? darkMode
                        ? "btn-light text-dark fw-bold"
                        : "btn-dark text-white fw-bold"
                      : "btn-link text-muted text-decoration-none"
                  }`}
                  onClick={() => setCardSide("front")}
                  style={{ fontSize: "0.72rem" }}
                >
                  Depan Saja
                </button>
                <button
                  type="button"
                  className={`btn btn-sm py-1 px-2 ${
                    cardSide === "back"
                      ? darkMode
                        ? "btn-light text-dark fw-bold"
                        : "btn-dark text-white fw-bold"
                      : "btn-link text-muted text-decoration-none"
                  }`}
                  onClick={() => setCardSide("back")}
                  style={{ fontSize: "0.72rem" }}
                >
                  Belakang Saja
                </button>
              </div>
            </div>
          </div>

          {/* CARD PREVIEW AREA */}
          <div
            className="p-3 d-flex align-items-center justify-content-center overflow-auto flex-wrap gap-4"
            style={{
              backgroundColor: darkMode ? "#070b14" : "#e2e8f0",
              minHeight: "360px",
              maxHeight: "68vh",
            }}
          >
            {cardOrientation === "portrait" ? (
              <>
                {(cardSide === "front" || cardSide === "both") && (
                  <div className="d-flex flex-column align-items-center">
                    <span
                      className="badge bg-secondary mb-2"
                      style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}
                    >
                      SISI DEPAN (PORTRAIT)
                    </span>
                    {renderPortraitFront(false)}
                  </div>
                )}
                {(cardSide === "back" || cardSide === "both") && (
                  <div className="d-flex flex-column align-items-center">
                    <span
                      className="badge bg-secondary mb-2"
                      style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}
                    >
                      SISI BELAKANG (PORTRAIT)
                    </span>
                    {renderPortraitBack(false)}
                  </div>
                )}
              </>
            ) : (
              <>
                {(cardSide === "front" || cardSide === "both") && (
                  <div className="d-flex flex-column align-items-center">
                    <span
                      className="badge bg-secondary mb-2"
                      style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}
                    >
                      SISI DEPAN (LANDSCAPE)
                    </span>
                    {renderLandscapeFront(false)}
                  </div>
                )}
                {(cardSide === "back" || cardSide === "both") && (
                  <div className="d-flex flex-column align-items-center">
                    <span
                      className="badge bg-secondary mb-2"
                      style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}
                    >
                      SISI BELAKANG (LANDSCAPE)
                    </span>
                    {renderLandscapeBack(false)}
                  </div>
                )}
              </>
            )}
          </div>

          {/* PRINT HINT NOTICE */}
          <div
            className="px-3 py-1.5 border-top d-flex align-items-center justify-content-between flex-wrap gap-2"
            style={{
              backgroundColor: darkMode ? "#101626" : "#f1f5f9",
              borderColor: darkMode ? "#1f293d" : "#e2e8f0",
              fontSize: "0.72rem",
            }}
          >
            <div className="d-flex align-items-center gap-1.5 text-muted">
              <span>💡</span>
              <span>
                <strong>Ukuran Cetak Fisik:</strong> CR80 (54 mm × 86 mm) persis kartu ATM/e-KTP, siap dimasukkan ke plastik lanyard holder.
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="text-muted fw-semibold">Mode Cetak:</span>
              <div className="btn-group btn-group-sm">
                <button
                  type="button"
                  className={`btn btn-xs py-0.5 px-2 ${printOption === "both" ? "btn-success" : "btn-outline-secondary"}`}
                  onClick={() => setPrintOption("both")}
                  style={{ fontSize: "0.7rem" }}
                >
                  Depan & Belakang
                </button>
                <button
                  type="button"
                  className={`btn btn-xs py-0.5 px-2 ${printOption === "active" ? "btn-success" : "btn-outline-secondary"}`}
                  onClick={() => setPrintOption("active")}
                  style={{ fontSize: "0.7rem" }}
                >
                  Sisi Tampil Saja
                </button>
              </div>
            </div>
          </div>

          {/* MODAL FOOTER */}
          <div
            className="py-2 px-3 border-top d-flex justify-content-between align-items-center"
            style={{
              borderColor: darkMode ? "#1f293d" : "#e2e8f0",
              backgroundColor: darkMode ? "#131b2e" : "#f8fafc",
            }}
          >
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary px-3"
              onClick={onClose}
              style={{ fontSize: "0.78rem" }}
            >
              Tutup
            </button>

            <button
              type="button"
              className="btn btn-sm btn-success px-3.5 py-1.5 fw-bold d-flex align-items-center gap-2 shadow-sm"
              onClick={handlePrint}
              style={{ fontSize: "0.82rem" }}
            >
              <span>🖨️</span>
              <span>Cetak ID Card (Standar Fisik 54×86mm)</span>
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
