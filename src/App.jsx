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
import PegawaiCutiPage from "./pages/PegawaiCutiPage";

// Modals / Components
import CommandPalette from "./components/CommandPalette";
import ToastNotification from "./components/ToastNotification";
import ConfirmPortalModal from "./components/ConfirmPortalModal";
import ConfirmLogoutModal from "./components/ConfirmLogoutModal";

// Navigation & URL Routing
import {
  getStateFromPath,
  getPathForState,
  getTitleForState,
} from "./utils/navigation";

// Auth & Permissions
import { isAdminOrHrd, isLeaveApplicant } from "./utils/authHelpers";

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
  tambahCutiSupabase,
  updateStatusCutiSupabase,
  registerUserSupabase,
  loginUserSupabase,
  ambilProfilUserSupabase,
  logoutUserSupabase,
} from "./services/supabaseClient";

function App() {
  // INISIALISASI STATE BERDASARKAN URL BROWSER (HTML5 History API)
  const initialRoute = getStateFromPath(window.location.pathname);
  const [currentView, setCurrentView] = useState(initialRoute.view);
  const [activeTab, setActiveTab] = useState(initialRoute.adminTab || "direktori");
  const [activePortalTab, setActivePortalTab] = useState(initialRoute.portalTab || "tenaga_medis");

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("rsj_current_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("Gagal membaca session user:", e);
      }
    }
    // Jika user mengakses rute /admin langsung dan belum login, pasang sesi demo admin
    if (window.location.pathname.startsWith("/admin")) {
      return {
        nama: "Agus Pratondo, S.Sos",
        role: "Kasubbag Kepegawaian & SDM",
        username: "admin",
        nip: "19830214 200803 1 001",
        employeeId: "EMP-004",
      };
    }
    // Jika user mengakses rute /cuti langsung dan belum login, pasang sesi demo nakes perawat
    if (window.location.pathname.startsWith("/cuti") || window.location.pathname.startsWith("/pegawai")) {
      return {
        nama: "Ns. Budi Setiawan, S.Kep",
        role: "Perawat Pelaksana IGD Jiwa",
        username: "budi",
        nip: "19920817 201902 1 004",
        employeeId: "EMP-006",
      };
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("rsj_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("rsj_current_user");
    }
  }, [currentUser]);

  // SINKRONISASI OTOMATIS: STATE -> URL BROWSER & DOCUMENT TITLE
  useEffect(() => {
    const targetPath = getPathForState(currentView, activeTab, activePortalTab);
    const targetTitle = getTitleForState(currentView, activeTab, activePortalTab);

    if (window.location.pathname !== targetPath) {
      window.history.pushState(
        { view: currentView, adminTab: activeTab, portalTab: activePortalTab },
        "",
        targetPath
      );
    }
    document.title = targetTitle;
  }, [currentView, activeTab, activePortalTab]);

  // SINKRONISASI BROWSER BACK / FORWARD (POPSTATE) -> STATE
  useEffect(() => {
    const handlePopState = () => {
      const state = getStateFromPath(window.location.pathname);
      setCurrentView(state.view);
      if (state.adminTab) setActiveTab(state.adminTab);
      if (state.portalTab) setActivePortalTab(state.portalTab);
      document.title = getTitleForState(state.view, state.adminTab, state.portalTab);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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

  // STATE MODAL KONFIRMASI KEMBALI KE PORTAL GUEST
  const [isConfirmPortalOpen, setIsConfirmPortalOpen] = useState(false);

  // STATE MODAL KONFIRMASI LOGOUT DARI ADMIN
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);

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
    nip: "",
    role: "Perawat Pelaksana",
    unit: "Bangsal Kampar (Akut Pria)",
    username: "",
    email: "",
    password: "",
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

  // ==========================================================================
  // SINKRONISASI SESI AUTH SUPABASE (TOKEN & PROFIL TETAP AKTIF SAAT BUKA TAB BARU)
  // ==========================================================================
  useEffect(() => {
    async function syncSession() {
      if (isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const profile = await ambilProfilUserSupabase(session.user.id);
            const meta = session.user.user_metadata || {};
            const activeUser = {
              id: session.user.id,
              email: session.user.email,
              username: profile?.username || meta.username || session.user.email.split("@")[0],
              nama: profile?.nama || meta.nama || meta.full_name || session.user.email.split("@")[0],
              role: profile?.role || meta.role || "Perawat Pelaksana",
              nip: profile?.nip || meta.nip || "-",
              unit: profile?.unit || meta.unit || "Unit Pelayanan RSJ Tampan",
              profesi: profile?.profesi || profile?.role || meta.profesi || meta.role || "Tenaga Medis",
            };
            setCurrentUser(activeUser);
            localStorage.setItem("rsj_current_user", JSON.stringify(activeUser));
          }
        } catch (e) {
          console.warn("Gagal inisialisasi sesi Supabase Auth:", e);
        }
      }
    }

    syncSession();

    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const profile = await ambilProfilUserSupabase(session.user.id);
          const meta = session.user.user_metadata || {};
          const syncedUser = {
            id: session.user.id,
            email: session.user.email,
            username: profile?.username || meta.username || session.user.email.split("@")[0],
            nama: profile?.nama || meta.nama || meta.full_name || session.user.email.split("@")[0],
            role: profile?.role || meta.role || "Perawat Pelaksana",
            nip: profile?.nip || meta.nip || "-",
            unit: profile?.unit || meta.unit || "Unit Pelayanan RSJ Tampan",
            profesi: profile?.profesi || profile?.role || meta.profesi || meta.role || "Tenaga Medis",
          };
          setCurrentUser(syncedUser);
          localStorage.setItem("rsj_current_user", JSON.stringify(syncedUser));
        } else if (event === "SIGNED_OUT") {
          setCurrentUser(null);
          localStorage.removeItem("rsj_current_user");
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

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
  // KODE BARU (SUDAH DIPERBAIKI):
  useEffect(() => {
    async function loadDataFromSupabase() {
      if (isSupabaseConfigured()) {
        console.log("🔄 Menghubungkan ke database Supabase...");

        // Ambil data dari tabel 'employees'
        const dataEmployees = await ambilDataSupabase("employees");

        if (dataEmployees && dataEmployees.length > 0) {
          console.log("✅ Berhasil memuat data pegawai:", dataEmployees);
          setEmployees(dataEmployees);
          showToast(
            "Supabase Terhubung",
            `Berhasil memuat ${dataEmployees.length} data pegawai dari Supabase.`,
            "success"
          );
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
    // Sinkronisasi otomatis ke tabel 'employees' Supabase jika aktif
    if (isSupabaseConfigured()) {
      tambahDataSupabase("employees", newEmp);
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
    if (isSupabaseConfigured()) {
      tambahCutiSupabase(newLeave);
    }
  }, []);

  const handleApproveLeave = useCallback((leaveId) => {
    // 1. Pengecekan tegas username & role Admin / HRD
    const cleanUsername = (currentUser?.username || "").toLowerCase().trim().replace(/^@/, "");
    const cleanRole = (currentUser?.role || "").toLowerCase().trim();
    const isAuthorized =
      cleanUsername === "admin" ||
      cleanRole === "admin" ||
      cleanRole === "hrd" ||
      cleanRole.includes("admin") ||
      cleanRole.includes("hrd") ||
      cleanRole.includes("kepegawaian") ||
      cleanRole.includes("kasubbag");

    if (!isAuthorized) {
      alert("Akses Ditolak: Hanya Kasubbag Kepegawaian (@admin) yang berhak menyetujui cuti.");
      showToast("Akses Ditolak", "Hanya Kasubbag Kepegawaian (@admin) yang berhak menyetujui cuti.", "danger");
      return;
    }

    const targetLeave = leaveRequests.find((l) => l.id === leaveId);
    if (!targetLeave) return;

    // 2. Validasi pencegahan Self-Approval
    if (isLeaveApplicant(currentUser, targetLeave, employees)) {
      alert("Akses Ditolak: Anda tidak dapat menyetujui pengajuan cuti Anda sendiri. Wajib melalui atasan/pimpinan.");
      showToast(
        "Akses Ditolak",
        "Anda tidak dapat menyetujui permohonan cuti Anda sendiri. Wajib melalui atasan/pimpinan.",
        "warning"
      );
      return;
    }

    const approverTitle = `${currentUser?.nama || "Agus Pratondo, S.Sos"} (${currentUser?.role || "Kasubbag Kepegawaian"})`;
    const updatedNote = "Disetujui oleh Kepala Subbagian Kepegawaian & SDM RSJ Tampan.";

    setLeaveRequests((prev) =>
      prev.map((leave) =>
        leave.id === leaveId
          ? {
              ...leave,
              status: "Disetujui",
              disetujuiOleh: approverTitle,
              catatan: updatedNote,
            }
          : leave
      )
    );

    // Sinkronkan ke Supabase jika aktif
    if (isSupabaseConfigured()) {
      updateStatusCutiSupabase({
        leaveId,
        status: "Disetujui",
        disetujuiOleh: approverTitle,
        catatan: updatedNote,
        currentUser,
        targetLeave,
      });
    }
  }, [currentUser, leaveRequests, employees, showToast]);

  const handleRejectLeave = useCallback((leaveId, customReason = "") => {
    // 1. Pengecekan tegas username & role Admin / HRD
    const cleanUsername = (currentUser?.username || "").toLowerCase().trim().replace(/^@/, "");
    const cleanRole = (currentUser?.role || "").toLowerCase().trim();
    const isAuthorized =
      cleanUsername === "admin" ||
      cleanRole === "admin" ||
      cleanRole === "hrd" ||
      cleanRole.includes("admin") ||
      cleanRole.includes("hrd") ||
      cleanRole.includes("kepegawaian") ||
      cleanRole.includes("kasubbag");

    if (!isAuthorized) {
      alert("Akses Ditolak: Hanya Kasubbag Kepegawaian (@admin) yang berhak menyetujui cuti.");
      showToast("Akses Ditolak", "Hanya Kasubbag Kepegawaian (@admin) yang berhak menyetujui cuti.", "danger");
      return;
    }

    const targetLeave = leaveRequests.find((l) => l.id === leaveId);
    if (!targetLeave) return;

    // 2. Validasi pencegahan Self-Approval
    if (isLeaveApplicant(currentUser, targetLeave, employees)) {
      alert("Akses Ditolak: Anda tidak dapat mengubah status permohonan cuti Anda sendiri.");
      showToast(
        "Akses Ditolak",
        "Anda tidak dapat mengubah status permohonan cuti Anda sendiri.",
        "warning"
      );
      return;
    }

    const approverTitle = `${currentUser?.nama || "Agus Pratondo, S.Sos"} (${currentUser?.role || "Kasubbag Kepegawaian"})`;
    const updatedNote = customReason || "Penyesuaian kuota shift jaga bangsal.";

    setLeaveRequests((prev) =>
      prev.map((leave) =>
        leave.id === leaveId
          ? {
              ...leave,
              status: "Ditolak",
              disetujuiOleh: approverTitle,
              catatan: updatedNote,
            }
          : leave
      )
    );

    // Sinkronkan ke Supabase jika aktif
    if (isSupabaseConfigured()) {
      updateStatusCutiSupabase({
        leaveId,
        status: "Ditolak",
        disetujuiOleh: approverTitle,
        catatan: updatedNote,
        currentUser,
        targetLeave,
      });
    }
  }, [currentUser, leaveRequests, employees, showToast]);

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

  // KONFIRMASI KEMBALI KE PORTAL UTAMA / GUEST DARI ADMIN
  const handleRequestBackToPortal = useCallback(() => {
    if (currentView === "admin") {
      setIsConfirmPortalOpen(true);
    } else {
      setCurrentView("guest");
    }
  }, [currentView]);

  const handleConfirmBackToPortal = useCallback(() => {
    setIsConfirmPortalOpen(false);
    setCurrentView("guest");
    showToast("Portal Publik", "Anda telah kembali ke tampilan Portal Informasi SDM Publik.", "info");
  }, [showToast]);

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
          if (action.view === "guest" && currentView === "admin") {
            setIsConfirmPortalOpen(true);
          } else {
            setCurrentView(action.view);
          }
          break;
        case "toggle_theme":
          toggleTheme();
          break;
        case "logout":
          setIsConfirmLogoutOpen(true);
          break;
        default:
          break;
      }
    },
    [currentView, currentUser, toggleTheme]
  );

  // AUTH HANDLERS
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    const loginIdentifier = (authInput.username || authInput.email || "").trim();
    const loginPassword = authInput.password;

    if (!loginIdentifier || !loginPassword) {
      setAuthError("Mohon masukkan Email/Username dan Password.");
      return;
    }

    // 1. Coba login melalui Supabase Auth
    if (isSupabaseConfigured()) {
      const res = await loginUserSupabase({
        usernameOrEmail: loginIdentifier,
        password: loginPassword,
      });

      if (res.success && res.user) {
        setCurrentUser(res.user);
        localStorage.setItem("rsj_current_user", JSON.stringify(res.user));

        // Layout Terpadu (Unified Layout):
        // Seluruh user yang login (Admin maupun Pegawai/Nakes) masuk ke Dashboard Terpadu dengan Sidebar Lengkap
        setCurrentView("admin");
        setActiveTab("direktori");

        setAuthInput({
          nama: "",
          nip: "",
          role: "Perawat Pelaksana",
          unit: "Bangsal Kampar (Akut Pria)",
          username: "",
          email: "",
          password: "",
        });
        showToast("Login Berhasil", `Selamat bertugas di SIM-SDM, ${res.user.nama}!`, "success");
        return;
      } else if (res.error && !res.localOnly) {
        // Cek apakah ada akun lokal demo yang cocok jika password demo dimasukkan
        const foundLocal = users.find(
          (u) =>
            (u.username?.toLowerCase() === loginIdentifier.toLowerCase() ||
             u.email?.toLowerCase() === loginIdentifier.toLowerCase()) &&
            u.password === loginPassword
        );

        if (foundLocal) {
          setCurrentUser(foundLocal);
          localStorage.setItem("rsj_current_user", JSON.stringify(foundLocal));
          setCurrentView("admin");
          setActiveTab("direktori");
          showToast("Login Berhasil (Akun Demo)", `Selamat bertugas di SIM-SDM, ${foundLocal.nama}!`, "success");
          return;
        }

        setAuthError(res.error.message || "Gagal masuk. Periksa kembali username/email dan password.");
        return;
      }
    }

    // 2. Fallback untuk akun lokal / demo offline
    const foundUser = users.find(
      (u) =>
        (u.username?.toLowerCase() === loginIdentifier.toLowerCase() ||
         u.email?.toLowerCase() === loginIdentifier.toLowerCase()) &&
        u.password === loginPassword
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      localStorage.setItem("rsj_current_user", JSON.stringify(foundUser));
      setCurrentView("admin");
      setActiveTab("direktori");
      setAuthInput({
        nama: "",
        nip: "",
        role: "Perawat Pelaksana",
        unit: "Bangsal Kampar (Akut Pria)",
        username: "",
        email: "",
        password: "",
      });
      showToast("Login Berhasil", `Selamat bertugas di SIM-SDM, ${foundUser.nama}!`, "success");
    } else {
      setAuthError("Email/Username atau Password tidak sesuai. Silakan periksa kembali atau gunakan akun demo terdaftar.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    const cleanNama = (authInput.nama || "").trim();
    const cleanNip = (authInput.nip || "").trim();
    const cleanRole = authInput.role || "Perawat Pelaksana";
    const cleanUnit = authInput.unit || "Bangsal Kampar (Akut Pria)";
    const cleanUsername = (authInput.username || "").trim().toLowerCase();
    const cleanEmail = (authInput.email || "").trim().toLowerCase() || `${cleanUsername}@rsjtampan.riau.go.id`;
    const cleanPassword = authInput.password;

    if (!cleanNama || !cleanUsername || !cleanPassword) {
      setAuthError("Mohon lengkapi seluruh kolom formulir registrasi.");
      return;
    }

    if (cleanPassword.length < 6) {
      setAuthError("Password minimal 6 karakter demi keamanan akun.");
      return;
    }

    // 1. Eksekusi Registrasi ke Supabase Auth + Profil Database
    const res = await registerUserSupabase({
      email: cleanEmail,
      password: cleanPassword,
      nama: cleanNama,
      role: cleanRole,
      nip: cleanNip,
      unit: cleanUnit,
      username: cleanUsername,
    });

    if (!res.success) {
      setAuthError(res.error?.message || "Gagal melakukan registrasi akun.");
      return;
    }

    // 2. Simpan juga ke state & localStorage lokal sebagai fallback instan
    const newUser = {
      id: res.user?.id || `usr-${Date.now()}`,
      nama: cleanNama,
      nip: cleanNip,
      role: cleanRole,
      unit: cleanUnit,
      username: cleanUsername,
      email: cleanEmail,
      password: cleanPassword,
    };

    const updatedUsers = [...users.filter((u) => u.username !== cleanUsername), newUser];
    setUsers(updatedUsers);
    localStorage.setItem("rsj_users", JSON.stringify(updatedUsers));

    const successMsg = res.requiresEmailConfirmation
      ? "Pendaftaran akun berhasil! Silakan periksa email Anda untuk konfirmasi, lalu Login."
      : "Pendaftaran akun petugas berhasil dan data profil tersimpan! Mengalihkan ke halaman Login...";

    setAuthSuccess(successMsg);
    showToast("Registrasi Berhasil", `Akun ${cleanNama} telah terdaftar.`, "success");

    setTimeout(() => {
      setCurrentView("login");
      setAuthSuccess("");
    }, 1800);
  };

  // KONFIRMASI LOGOUT DARI ADMIN / SISTEM
  const handleRequestLogout = useCallback(() => {
    setIsConfirmLogoutOpen(true);
  }, []);

  const handleConfirmLogout = useCallback(async () => {
    setIsConfirmLogoutOpen(false);
    await logoutUserSupabase();
    setCurrentUser(null);
    localStorage.removeItem("rsj_current_user");
    setCurrentView("guest");
    showToast("Logout Berhasil", "Anda telah keluar dari sesi SIM-SDM dan kembali ke Portal Utama.", "info");
  }, [showToast]);

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
      {/* 1. UNIFIED PORTAL & DASHBOARD VIEW (2-COLUMN LAYOUT)     */}
      {/* ======================================================== */}
      {currentView === "admin" || currentView === "cuti_pegawai" ? (
        <div className="d-flex w-100 min-vh-100">
          {/* SIDEBAR NAVIGASI KIRI LENGKAP */}
          <Sidebar
            activeTab={currentView === "cuti_pegawai" ? "cuti" : activeTab}
            setActiveTab={(tab) => {
              if (currentView === "cuti_pegawai") {
                setCurrentView("admin");
              }
              setActiveTab(tab);
            }}
            currentUser={currentUser}
            darkMode={darkMode}
            toggleTheme={toggleTheme}
            handleLogout={handleRequestLogout}
            setCurrentView={setCurrentView}
            onBackToPortal={handleRequestBackToPortal}
            employeeCount={employees.length}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />

          {/* MAIN CONTENT DI SISI KANAN */}
          <main className="flex-grow-1 w-100 d-flex flex-column min-vh-100 overflow-auto">
            <div className="flex-grow-1 px-3 px-md-4 py-3">
              <AdminPage
                activeTab={currentView === "cuti_pegawai" ? "cuti" : activeTab}
                setActiveTab={setActiveTab}
                employees={employees}
                shiftRoster={shiftRoster}
                leaveRequests={leaveRequests}
                trainings={trainings}
                currentUser={currentUser}
                setCurrentView={setCurrentView}
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
                onBackToPortal={handleRequestBackToPortal}
              />
            </div>
            <Footer isAdmin={true} darkMode={darkMode} />
          </main>
        </div>
      ) : (
        /* ======================================================== */
        /* 3. GUEST / PUBLIC VIEW                                  */
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
                activePortalTab={activePortalTab}
                setActivePortalTab={setActivePortalTab}
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

      {/* MODAL KONFIRMASI KEMBALI KE PORTAL PUBLIK */}
      <ConfirmPortalModal
        isOpen={isConfirmPortalOpen}
        onClose={() => setIsConfirmPortalOpen(false)}
        onConfirm={handleConfirmBackToPortal}
        darkMode={darkMode}
      />

      {/* MODAL KONFIRMASI LOGOUT DARI ADMIN */}
      <ConfirmLogoutModal
        isOpen={isConfirmLogoutOpen}
        onClose={() => setIsConfirmLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
        currentUser={currentUser}
        darkMode={darkMode}
      />
    </div>
  );
}

export default App;