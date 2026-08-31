import React from "react";
import InventoryTab from "./InventoryTab";
import ReportTab from "./ReportTab";
import BangsalTab from "./BangsalTab";
import SupplierTab from "./SupplierTab";
import AnalyticsTab from "./AnalyticsTab";
import ColdChainTab from "./ColdChainTab";
import LowStockAlert from "../components/LowStockAlert";

export default function AdminPage({
  activeTab,
  inventory,
  filteredInventory,
  searchQuery,
  setSearchQuery,
  conditionFilter,
  setConditionFilter,
  totalJenisBarang,
  barangBagusCount,
  barangRusakCount,
  setShowAddModal,
  handleOpenOutModal,
  handleOpenEdit,
  handleDelete,
  mutations,
  onOpenBarcodeScanner,
  onOpenBufferCalculator,
  onOpenDeliverySlip,
  onOpenCommandPalette,
  darkMode,
  cardBg,
  tableTheme,
}) {
  const getTabTitleInfo = () => {
    switch (activeTab) {
      case "analitik":
        return {
          title: "Analitik SIM-RS & Logistik",
          subtitle: "Executive dashboard monitoring alur obat, kapasitas bangsal, dan efisiensi logistik",
          badge: "Live Data",
        };
      case "inventaris":
        return {
          title: "Manajemen Inventaris Logistik",
          subtitle: "Katalog obat-obatan kejiwaan, jarum suntik, BHP bangsal, dan alat kesehatan",
          badge: `${totalJenisBarang} Item Terdata`,
        };
      case "bangsal":
        return {
          title: "Monitoring Bangsal Rawat Inap Jiwa",
          subtitle: "Pemantauan hunian ranjang pasien kejiwaan & distribusi perbekalan tiap ruangan",
          badge: "6 Bangsal Rawat",
        };
      case "coldchain":
        return {
          title: "Monitoring Suhu & Cold-Chain Farmasi",
          subtitle: "Sensor IoT real-time lemari pendingin obat injeksi, vaksin, & psikotropika (2°C - 8°C)",
          badge: "3 Sensor Aktif",
        };
      case "supplier":
        return {
          title: "Direktori Rekanan Vendor PBF & Alkes",
          subtitle: "Daftar distributor resmi penyedia pasokan farmasi dan alat kesehatan RSJ Tampan",
          badge: "5 Vendor PBF",
        };
      case "laporan":
        return {
          title: "Laporan Mutasi & Sirkulasi Logistik",
          subtitle: "Riwayat pencatatan barang masuk dari rekanan dan pengeluaran ke bangsal",
          badge: "Audit Ready",
        };
      default:
        return { title: "Dashboard SIM-RS", subtitle: "Sistem Informasi Manajemen Logistik RSJ", badge: "" };
    }
  };

  const tabInfo = getTabTitleInfo();

  return (
    <div className="py-2 animate-fade-in">
      {/* INTEGRATED CLEAN PAGE HEADER */}
      <div
        className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom"
        style={{ borderColor: darkMode ? "#181d2e" : "#e2e8f0" }}
      >
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold mb-0" style={{ letterSpacing: "-0.02em" }}>
              {tabInfo.title}
            </h4>
            {tabInfo.badge && (
              <span
                className="badge rounded-pill px-2 py-1"
                style={{
                  fontSize: "0.68rem",
                  backgroundColor: darkMode ? "rgba(16, 185, 129, 0.15)" : "#ecfdf5",
                  color: "#10b981",
                  fontWeight: 600,
                }}
              >
                {tabInfo.badge}
              </span>
            )}
          </div>
          <p
            className="mb-0 small"
            style={{ color: darkMode ? "#7e8699" : "#64748b" }}
          >
            {tabInfo.subtitle}
          </p>
        </div>

        {/* QUICK ACTIONS ACCORDING TO TAB */}
        <div className="d-flex align-items-center gap-2">
          {activeTab === "inventaris" && (
            <>
              <button
                className="btn btn-sm btn-outline-success fw-medium px-3 d-flex align-items-center gap-1"
                onClick={onOpenBarcodeScanner}
              >
                <span>📷</span> Scan Barcode
              </button>
              <button
                className="btn btn-sm btn-success fw-medium px-3 shadow-sm d-flex align-items-center gap-1"
                onClick={() => setShowAddModal(true)}
              >
                <span>+</span> Tambah Logistik
              </button>
            </>
          )}

          <button
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
            onClick={onOpenCommandPalette}
            title="Cari fitur (Ctrl+K)"
          >
            <span>🔍</span>
            <span className="d-none d-sm-inline">Cari</span>
          </button>
        </div>
      </div>

      {/* NOTIFIKASI STOK KRITIS (HANYA DITAMPILKAN DI TAB INVENTARIS AGAR TAB LAIN BERSIH) */}
      {activeTab === "inventaris" && (
        <LowStockAlert
          inventory={inventory}
          handleOpenAddModal={() => setShowAddModal(true)}
          darkMode={darkMode}
        />
      )}

      {/* TAB 1: ANALITIK */}
      {activeTab === "analitik" && (
        <AnalyticsTab
          darkMode={darkMode}
          cardBg={cardBg}
          tableTheme={tableTheme}
        />
      )}

      {/* TAB 2: INVENTARIS */}
      {activeTab === "inventaris" && (
        <InventoryTab
          inventory={inventory}
          filteredInventory={filteredInventory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          conditionFilter={conditionFilter}
          setConditionFilter={setConditionFilter}
          totalJenisBarang={totalJenisBarang}
          barangBagusCount={barangBagusCount}
          barangRusakCount={barangRusakCount}
          setShowAddModal={setShowAddModal}
          handleOpenOutModal={handleOpenOutModal}
          handleOpenEdit={handleOpenEdit}
          handleDelete={handleDelete}
          onOpenBarcodeScanner={onOpenBarcodeScanner}
          onOpenBufferCalculator={onOpenBufferCalculator}
          onOpenDeliverySlip={onOpenDeliverySlip}
          darkMode={darkMode}
          cardBg={cardBg}
          tableTheme={tableTheme}
        />
      )}

      {/* TAB 3: BANGSAL */}
      {activeTab === "bangsal" && (
        <BangsalTab
          darkMode={darkMode}
          cardBg={cardBg}
          tableTheme={tableTheme}
        />
      )}

      {/* TAB 4: COLD CHAIN & SUHU FARMASI */}
      {activeTab === "coldchain" && (
        <ColdChainTab
          darkMode={darkMode}
          cardBg={cardBg}
          tableTheme={tableTheme}
        />
      )}

      {/* TAB 5: REKANAN VENDOR */}
      {activeTab === "supplier" && (
        <SupplierTab
          darkMode={darkMode}
          cardBg={cardBg}
          tableTheme={tableTheme}
        />
      )}

      {/* TAB 6: LAPORAN MUTASI */}
      {activeTab === "laporan" && (
        <ReportTab
          mutations={mutations}
          onOpenDeliverySlip={onOpenDeliverySlip}
          darkMode={darkMode}
          cardBg={cardBg}
          tableTheme={tableTheme}
        />
      )}
    </div>
  );
}
