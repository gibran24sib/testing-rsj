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
import CommandPalette from "./components/CommandPalette";
import ToastNotification from "./components/ToastNotification";

// Data
import { initialUsers } from "./data/initialData";
import {
  initialEmployees,
  initialShiftRoster,
  initialLeaveRequests,
  initialTrainings,
} from "./data/sdmData";

// Supabase Integration
import {
  supabase,
  isSupabaseConfigured,
  ambilDataSupabase,
  tambahDataSupabase,
} from "./services/supabaseClient";

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
    role: "Perawat Pelaksana",
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
  const [activeTab, setActiveTab] = useState("direktori");

  // STATE SDM & KEPEGAWAIAN NAKES
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("rsj_employees");
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [shiftRoster, setShiftRoster] = useState(() => {
    const saved = localStorage.getItem("rsj_roster");
    return saved ? JSON.parse(saved) : initialShiftRoster;
  });

  const [leaveRequests, setLeaveRequests] = useState(() => {
    const saved = localStorage.getItem("rsj_leaves");
    return saved ? JSON.parse(saved) : initialLeaveRequests;
  });

  const [trainings, setTrainings] = useState(() => {
    const saved = localStorage.getItem("rsj_trainings");
    return saved ? JSON.parse(saved) : initialTrainings;
  });

  // ==========================================================================
  // PENGAMBILAN DATA DARI SUPABASE (REAL-TIME FETCH PADA SAAT HALAMAN DIMUAT)
  // ==========================================================================
  useEffect(() => {
    async function loadDataFromSupabase() {
      if (isSupabaseConfigured()) {
        console.log("🔄 Menghubungkan ke database Supabase...");
        
        // 1. Ambil data tabel 'pegawai' atau 'produk'
        const dataPegawai = await ambilDataSupabase("pegawai");
        if (dataPegawai && dataPegawai.length > 0) {
          setEmployees(dataPegawai);
          showToast("Supabase Terhubung", `Memuat ${dataPegawai.length} data dari Supabase.`, "success");
        }

        // 2. Mengambil data tabel 'produk' (jika tabel produk dibuat di Supabase)
        const dataProduk = await ambilDataSupabase("produk");
        if (dataProduk && dataProduk.length > 0) {
          console.log("📦 Data Produk Supabase:", dataProduk);
        }
      }
    }

    loadDataFromSupabase();
  }, [showToast]);

  useEffect(() => {
    localStorage.setItem("rsj_employees", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem("rsj_roster", JSON.stringify(shiftRoster));
  }, [shiftRoster]);

  useEffect(() => {
    localStorage.setItem("rsj_leaves", JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem("rsj_trainings", JSON.stringify(trainings));
  }, [trainings]);

  // SDM HANDLERS
  const handleAddEmployee = useCallback((newEmp) => {
    setEmployees((prev) => [newEmp, ...prev]);
    // Sinkronisasi otomatis ke Supabase jika aktif
    if (isSupabaseConfigured()) {
      tambahDataSupabase("pegawai", newEmp);
    }
  }, []);

  const handleUpdateEmployee = useCallback((updatedEmp) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === updatedEmp.id ? updatedEmp : emp))
    );
  }, []);

  const handleDeleteEmployee = useCallback((empId) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== empId));
  }, []);

  const handleSubmitLeave = useCallback((newLeave) => {
    setLeaveRequests((prev) => [newLeave, ...prev]);
  }, []);

  const handleApproveLeave = useCallback((leaveId) => {
    setLeaveRequests((prev) =>
      prev.map((leave) =>
        leave.id === leaveId
          ? {
              ...leave,
              status: "Disetujui",
              disetujuiOleh: "Agus Pratondo, S.Sos (Kasubbag Kepegawaian)",
              catatan: "Disetujui oleh Kepala Subbagian Kepegawaian RSJ Tampan.",
            }
          : leave
      )
    );
  }, []);

  const handleRejectLeave = useCallback((leaveId) => {
    setLeaveRequests((prev) =>
      prev.map((leave) =>
        leave.id === leaveId
          ? {
              ...leave,
              status: "Ditolak",
              disetujuiOleh: "Kasubbag Kepegawaian",
              catatan: "Penyesuaian kuota shift bangsal.",
            }
          : leave
      )
    );
  }, []);

  const handleRenewStrSip = useCallback((empId) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === empId) {
          const currentYear = new Date().getFullYear();
          return {
            ...emp,
            statusAktif: "Aktif",
            str: {
              ...emp.str,
              masaBerlaku: `${currentYear + 5}-12-31`,
              status: "Aktif",
            },
            sip: {
              ...emp.sip,
              masaBerlaku: `${currentYear + 5}-12-31`,
              status: "Aktif",
            },
          };
        }
        return emp;
      })
    );
  }, []);

  // COMMAND PALETTE ACTIONS
  const handleCommandAction = useCallback(
    (action) => {
      switch (action.type) {
        case "navigate_tab":
          if (currentView !== "admin") {
            setCurrentView("admin");
            if (!currentUser) {
              setCurrentUser({
                nama: "Agus Pratondo, S.Sos",
                role: "Kasubbag Kepegawaian & SDM",
                username: "admin",
              });
            }
          }
          setActiveTab(action.tab);
          break;
        case "navigate_view":
          setCurrentView(action.view);
          break;
        case "toggle_theme":
          toggleTheme();
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
        role: "Perawat Pelaksana",
      });
      showToast("Login Berhasil", `Selamat bertugas di SIM-SDM, ${foundUser.nama}!`, "success");
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

    setAuthSuccess("Pendaftaran akun berhasil! Silakan Login.");
    showToast("Registrasi Berhasil", "Akun petugas Anda telah terdaftar.", "success");
    setTimeout(() => {
      setCurrentView("login");
      setAuthSuccess("");
      setAuthInput({
        nama: "",
        username: "",
        password: "",
        role: "Perawat Pelaksana",
      });
    }, 1500);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("guest");
    showToast("Logout Berhasil", "Anda telah keluar dari sesi SIM-SDM.", "info");
  };

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
            employeeCount={employees.length}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />

          {/* MAIN CONTENT DI SISI KANAN */}
          <main className="flex-grow-1 w-100 d-flex flex-column min-vh-100 overflow-auto">
            <div className="flex-grow-1 px-3 px-md-4 py-3">
              <AdminPage
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                employees={employees}
                shiftRoster={shiftRoster}
                leaveRequests={leaveRequests}
                trainings={trainings}
                onAddEmployee={handleAddEmployee}
                onUpdateEmployee={handleUpdateEmployee}
                onDeleteEmployee={handleDeleteEmployee}
                onSubmitLeave={handleSubmitLeave}
                onApproveLeave={handleApproveLeave}
                onRejectLeave={handleRejectLeave}
                onRenewStrSip={handleRenewStrSip}
                showToast={showToast}
                darkMode={darkMode}
                cardBg={cardBg}
                tableTheme={tableTheme}
                onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
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
