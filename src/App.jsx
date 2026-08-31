import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

// Layouts
import Navbar from "./layouts/Navbar";
import Sidebar from "./layouts/Sidebar";
import BannerSub from "./layouts/BannerSub";
import Footer from "./layouts/Footer";

// Pages
import GuestPage from "./pages/GuestPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";

// Modals / Components
import AddModal from "./components/AddModal";
import EditModal from "./components/EditModal";
import OutModal from "./components/OutModal";
import CommandPalette from "./components/CommandPalette";
import BarcodeScannerModal from "./components/BarcodeScannerModal";
import BufferStockCalculatorModal from "./components/BufferStockCalculatorModal";
import DeliverySlipModal from "./components/DeliverySlipModal";
import ToastNotification from "./components/ToastNotification";

// Data
import {
  initialUsers,
  initialInventory,
  initialMutations,
} from "./data/initialData";

function App() {
  const [currentView, setCurrentView] = useState("guest");
  const [currentUser, setCurrentUser] = useState(null);

  // STATE THEMA (DARK / LIGHT MODE)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("rsj_theme") === "dark";
  });

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("rsj_theme", newMode ? "dark" : "light");
      return newMode;
    });
  }, []);

  // STATE TOAST NOTIFIKASI
  const [toast, setToast] = useState(null);

  const showToast = useCallback((title, message, type = "success") => {
    setToast({ title, message, type });
  }, []);

  // STATE COMMAND PALETTE (CTRL+K)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // KEYBOARD SHORTCUT LISTENER (CTRL + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // STATE AUTENTIKASI
  const [authInput, setAuthInput] = useState({
    nama: "",
    username: "",
    password: "",
    role: "Petugas Bangsal",
  });
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("rsj_users");
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });

  useEffect(() => {
    if (!localStorage.getItem("rsj_users")) {
      localStorage.setItem("rsj_users", JSON.stringify(users));
    }
  }, [users]);

  // STATE TAMPILAN ADMIN TAB
  const [activeTab, setActiveTab] = useState("analitik");
  const [searchQuery, setSearchQuery] = useState("");
  const [conditionFilter, setConditionFilter] = useState("semua");

  // STATE INVENTARIS
  const [inventory, setInventory] = useState(initialInventory);

  // STATE LAPORAN MUTASI
  const [mutations, setMutations] = useState(initialMutations);

  // MODAL STATES
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    nama: "",
    kategori: "Alat Medis",
    stok: "",
    satuan: "Pcs",
    kondisi: "Bagus",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [showOutModal, setShowOutModal] = useState(false);
  const [outItem, setOutItem] = useState({
    item: null,
    jumlahOut: "",
    tujuan: "Bangsal Psychiatric Akut",
  });

  // NEW FEATURE MODALS
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showBufferCalculator, setShowBufferCalculator] = useState(false);
  const [showDeliverySlip, setShowDeliverySlip] = useState(false);
  const [deliverySlipData, setDeliverySlipData] = useState(null);

  const handleOpenDeliverySlip = (data) => {
    setDeliverySlipData(data);
    setShowDeliverySlip(true);
  };

  // COMMAND PALETTE ACTIONS
  const handleCommandAction = useCallback(
    (action) => {
      switch (action.type) {
        case "navigate_tab":
          if (currentView !== "admin") {
            setCurrentView("admin");
            if (!currentUser) {
              setCurrentUser({
                nama: "Petugas SIM-RS",
                role: "Admin Logistik",
                username: "admin",
              });
            }
          }
          setActiveTab(action.tab);
          break;
        case "add_item":
          if (currentView !== "admin") {
            setCurrentView("admin");
          }
          setActiveTab("inventaris");
          setShowAddModal(true);
          break;
        case "toggle_theme":
          toggleTheme();
          break;
        case "open_screening":
        case "open_med_checker":
        case "open_booking":
          setCurrentView("guest");
          break;
        default:
          break;
      }
    },
    [currentView, currentUser, toggleTheme]
  );

  // AUTH HANDLERS
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError("");
    const foundUser = users.find(
      (u) =>
        u.username.toLowerCase() === authInput.username.trim().toLowerCase() &&
        u.password === authInput.password
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      setCurrentView("admin");
      setAuthInput({
        nama: "",
        username: "",
        password: "",
        role: "Petugas Bangsal",
      });
      showToast("Login Berhasil", `Selamat bertugas, ${foundUser.nama}!`, "success");
    } else {
      setAuthError("Username atau Password salah! (Default demo: admin / 123)");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    const isExist = users.some(
      (u) =>
        u.username.toLowerCase() === authInput.username.trim().toLowerCase()
    );
    if (isExist) {
      setAuthError("Username sudah terdaftar!");
      return;
    }

    const newUser = {
      nama: authInput.nama,
      username: authInput.username.trim(),
      password: authInput.password,
      role: authInput.role,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("rsj_users", JSON.stringify(updatedUsers));

    setAuthSuccess("Pendaftaran berhasil! Silakan Login.");
    showToast("Registrasi Berhasil", "Akun petugas Anda telah terdaftar.", "success");
    setTimeout(() => {
      setCurrentView("login");
      setAuthSuccess("");
      setAuthInput({
        nama: "",
        username: "",
        password: "",
        role: "Petugas Bangsal",
      });
    }, 1500);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("guest");
    showToast("Logout Berhasil", "Anda telah keluar dari sesi SIM-RS.", "info");
  };

  // INVENTARIS HANDLERS
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newItem.nama || !newItem.stok) return;

    const newKode = `B00${inventory.length + 1}`;
    const qtyStok = parseInt(newItem.stok);

    const newBarang = {
      id: newKode,
      nama: newItem.nama,
      kategori: newItem.kategori,
      stok: qtyStok,
      satuan: newItem.satuan,
      kondisi: newItem.kondisi,
    };
    setInventory([...inventory, newBarang]);

    const today = new Date().toISOString().split("T")[0];
    const newLogMutasi = {
      id: Date.now(),
      tanggal: today,
      kode: newKode,
      nama: newItem.nama,
      jenis: "Masuk",
      jumlah: qtyStok,
      satuan: newItem.satuan,
      asalTujuan: "Pengadaan Logistik Baru",
      kondisi: newItem.kondisi,
      petugas: currentUser?.nama || "Admin Logistik",
    };
    setMutations([newLogMutasi, ...mutations]);

    setShowAddModal(false);
    setNewItem({
      nama: "",
      kategori: "Alat Medis",
      stok: "",
      satuan: "Pcs",
      kondisi: "Bagus",
    });
    showToast("Logistik Ditambahkan", `${newBarang.nama} (${qtyStok} ${newBarang.satuan}) berhasil disimpan.`, "success");
  };

  const handleOpenOutModal = (item) => {
    setOutItem({ item: item, jumlahOut: "", tujuan: "Bangsal Psychiatric Akut" });
    setShowOutModal(true);
  };

  const handleOutSubmit = (e) => {
    e.preventDefault();
    const qtyOut = parseInt(outItem.jumlahOut);

    if (qtyOut > outItem.item.stok) {
      alert("Gagal! Jumlah barang keluar melebihi stok yang tersedia.");
      return;
    }

    setInventory(
      inventory.map((item) => {
        if (item.id === outItem.item.id) {
          return { ...item, stok: item.stok - qtyOut };
        }
        return item;
      })
    );

    const today = new Date().toISOString().split("T")[0];
    const newOutLog = {
      id: Date.now(),
      tanggal: today,
      kode: outItem.item.id,
      nama: outItem.item.nama,
      jenis: "Keluar",
      jumlah: qtyOut,
      satuan: outItem.item.satuan,
      asalTujuan: outItem.tujuan,
      kondisi: outItem.item.kondisi,
      petugas: currentUser?.nama || "Admin Logistik",
    };
    setMutations([newOutLog, ...mutations]);

    setShowOutModal(false);
    showToast("Distribusi Berhasil", `${qtyOut} ${outItem.item.satuan} ${outItem.item.nama} dikirim ke ${outItem.tujuan}.`, "success");

    // Open delivery slip automatically for convenience
    handleOpenDeliverySlip(newOutLog);
  };

  const handleOpenEdit = (item) => {
    setEditingItem({ ...item });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setInventory(
      inventory.map((item) =>
        item.id === editingItem.id ? editingItem : item
      )
    );
    setShowEditModal(false);
    setEditingItem(null);
    showToast("Data Diperbarui", `Informasi ${editingItem.nama} berhasil diperbarui.`, "success");
  };

  const handleDelete = (id, nama) => {
    if (window.confirm(`Hapus ${nama} dari inventaris?`)) {
      setInventory(inventory.filter((item) => item.id !== id));
      showToast("Data Dihapus", `${nama} telah dihapus dari inventaris.`, "danger");
    }
  };

  // FILTERING & STATISTIK
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCondition =
      conditionFilter === "semua" || item.kondisi === conditionFilter;
    return matchesSearch && matchesCondition;
  });

  const totalJenisBarang = inventory.length;
  const barangBagusCount = inventory.filter(
    (item) => item.kondisi === "Bagus"
  ).length;
  const barangRusakCount = inventory.filter(
    (item) => item.kondisi === "Rusak"
  ).length;

  // THEME CLASSES
  const themeBg = darkMode ? "bg-dark text-light" : "bg-light text-dark";
  const cardBg = darkMode
    ? "bg-dark-card text-light"
    : "bg-white text-dark border";
  const navBg = darkMode
    ? "bg-dark navbar-dark border-bottom border-secondary"
    : "bg-white navbar-light shadow-sm";
  const tableTheme = darkMode ? "table-dark" : "table-light";

  return (
    <div
      className={`w-100 min-vh-100 ${themeBg}`}
      style={{
        backgroundColor: darkMode ? "#080a10" : "#f8fafc",
      }}
    >
      {/* ======================================================== */}
      {/* 1. ADMIN VIEW (CLEAN 2-COLUMN LAYOUT)                   */}
      {/* ======================================================== */}
      {currentView === "admin" ? (
        <div className="d-flex w-100 min-vh-100">
          {/* SIDEBAR NAVIGASI KIRI */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
            darkMode={darkMode}
            toggleTheme={toggleTheme}
            handleLogout={handleLogout}
            setCurrentView={setCurrentView}
            inventoryCount={totalJenisBarang}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />

          {/* MAIN CONTENT DI SISI KANAN */}
          <main className="flex-grow-1 w-100 d-flex flex-column min-vh-100 overflow-auto">
            <div className="flex-grow-1 px-3 px-md-4 py-3">
              <AdminPage
                activeTab={activeTab}
                setActiveTab={setActiveTab}
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
                mutations={mutations}
                onOpenBarcodeScanner={() => setShowBarcodeScanner(true)}
                onOpenBufferCalculator={() => setShowBufferCalculator(true)}
                onOpenDeliverySlip={handleOpenDeliverySlip}
                onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
                darkMode={darkMode}
                cardBg={cardBg}
                tableTheme={tableTheme}
              />
            </div>
            <Footer isAdmin={true} darkMode={darkMode} />
          </main>
        </div>
      ) : (
        /* ======================================================== */
        /* 2. GUEST / PUBLIC VIEW                                  */
        /* ======================================================== */
        <div className="w-100 min-vh-100 d-flex flex-column justify-content-between">
          <div>
            <Navbar
              currentView={currentView}
              setCurrentView={setCurrentView}
              darkMode={darkMode}
              toggleTheme={toggleTheme}
              navBg={navBg}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            />

            <BannerSub currentView={currentView} darkMode={darkMode} />

            {currentView === "guest" && (
              <GuestPage
                setCurrentView={setCurrentView}
                darkMode={darkMode}
                cardBg={cardBg}
              />
            )}

            {currentView === "login" && (
              <LoginPage
                authInput={authInput}
                setAuthInput={setAuthInput}
                authError={authError}
                authSuccess={authSuccess}
                handleLogin={handleLogin}
                setCurrentView={setCurrentView}
                darkMode={darkMode}
                cardBg={cardBg}
              />
            )}

            {currentView === "register" && (
              <RegisterPage
                authInput={authInput}
                setAuthInput={setAuthInput}
                authError={authError}
                authSuccess={authSuccess}
                handleRegister={handleRegister}
                setCurrentView={setCurrentView}
                darkMode={darkMode}
                cardBg={cardBg}
              />
            )}
          </div>

          <Footer darkMode={darkMode} />
        </div>
      )}

      {/* MODAL DIALOGS */}
      <AddModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        newItem={newItem}
        setNewItem={setNewItem}
        handleAddSubmit={handleAddSubmit}
        darkMode={darkMode}
        cardBg={cardBg}
      />

      <EditModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        handleEditSubmit={handleEditSubmit}
        darkMode={darkMode}
        cardBg={cardBg}
      />

      <OutModal
        showOutModal={showOutModal}
        setShowOutModal={setShowOutModal}
        outItem={outItem}
        setOutItem={setOutItem}
        handleOutSubmit={handleOutSubmit}
        darkMode={darkMode}
        cardBg={cardBg}
      />

      {/* NEW VALUE-ADDED MODALS FOR EVALUATION */}
      <BarcodeScannerModal
        show={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        inventory={inventory}
        onSelectScannedItem={(item) => handleOpenOutModal(item)}
        darkMode={darkMode}
      />

      <BufferStockCalculatorModal
        show={showBufferCalculator}
        onClose={() => setShowBufferCalculator(false)}
        darkMode={darkMode}
      />

      <DeliverySlipModal
        show={showDeliverySlip}
        onClose={() => setShowDeliverySlip(false)}
        deliveryData={deliverySlipData}
        darkMode={darkMode}
      />

      {/* COMMAND PALETTE (CTRL+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        darkMode={darkMode}
        onSelectAction={handleCommandAction}
      />

      {/* GLOBAL TOAST NOTIFICATION */}
      <ToastNotification
        toast={toast}
        onClose={() => setToast(null)}
        darkMode={darkMode}
      />
    </div>
  );
}

export default App;
