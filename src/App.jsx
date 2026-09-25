import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

// Layouts
import Navbar from "./layouts/Navbar";
import Sidebar from "./layouts/Sidebar";
import SidebarPegawai from "./layouts/SidebarPegawai";
import BannerSub from "./layouts/BannerSub";
import Footer from "./layouts/Footer";

// Pages
import GuestPage from "./pages/GuestPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import PegawaiPage from "./pages/PegawaiPage";

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
import { isAdminOrHrd, isLeaveApplicant, getEmployeeForUser } from "./utils/authHelpers";

// Data
import { initialUsers } from "./data/initialData";
import {
  initialEmployees,
  initialShiftRoster,
  initialLeaveRequests,
  initialTrainings,
  initialDossiers,
} from "./data/sdmData";

// Supabase Integration
import {
  supabase,
  isSupabaseConfigured,
  ambilDataSupabase,
  tambahDataSupabase,
  updateDataSupabase,
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
  const [activePegawaiTab, setActivePegawaiTab] = useState(initialRoute.pegawaiTab || "profil");

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
    // Jika user mengakses rute /cuti atau /pegawai langsung dan belum login, pasang sesi demo nakes perawat
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
    const targetPath = getPathForState(currentView, activeTab, activePortalTab, activePegawaiTab);
    const targetTitle = getTitleForState(currentView, activeTab, activePortalTab, activePegawaiTab);

    if (window.location.pathname !== targetPath) {
      window.history.pushState(
        { view: currentView, adminTab: activeTab, portalTab: activePortalTab, pegawaiTab: activePegawaiTab },
        "",
        targetPath
      );
    }
    document.title = targetTitle;
  }, [currentView, activeTab, activePortalTab, activePegawaiTab]);

  // SINKRONISASI BROWSER BACK / FORWARD (POPSTATE) -> STATE
  useEffect(() => {
    const handlePopState = () => {
      const state = getStateFromPath(window.location.pathname);
      setCurrentView(state.view);
      if (state.adminTab) setActiveTab(state.adminTab);
      if (state.portalTab) setActivePortalTab(state.portalTab);
      if (state.pegawaiTab) setActivePegawaiTab(state.pegawaiTab);
      document.title = getTitleForState(state.view, state.adminTab, state.portalTab, state.pegawaiTab);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // ROLE ACCESS GUARD UNTUK HALAMAN ADMIN
  useEffect(() => {
    if (currentView === "admin") {
      if (currentUser && !isAdminOrHrd(currentUser)) {
        setCurrentView("pegawai");
        setActivePegawaiTab("profil");
        showToast(
          "Akses Terbatas",
          "Halaman Panel Admin hanya untuk Kasubbag Kepegawaian & HRD. Anda dialihkan ke Portal Mandiri Pegawai.",
          "warning"
        );
      }
    }
  }, [currentView, currentUser]);

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

  const [dossiersList, setDossiersList] = useState(() => {
    try {
      const saved = localStorage.getItem("rsj_dossiers");
      return saved ? JSON.parse(saved) : initialDossiers;
    } catch {
      return initialDossiers;
    }
  });

  // PENGAMBILAN DATA DARI SUPABASE DENGAN MERGE CERDAS (MENCEGAH OVERWRITE FOTO LOKAL)
  useEffect(() => {
    async function loadDataFromSupabase() {
      if (isSupabaseConfigured()) {
        const dataEmployees = await ambilDataSupabase("employees");
        if (dataEmployees && dataEmployees.length > 0) {
          setEmployees((prevLocal) => {
            const savedLocal = localStorage.getItem("rsj_employees");
            const localList = savedLocal ? JSON.parse(savedLocal) : prevLocal;

            // Merge data remote dengan mempertahankan foto atau pembaruan lokal terbaru
            const merged = dataEmployees.map((remoteEmp) => {
              const matchedLocal = localList.find(
                (l) => l.id === remoteEmp.id || (l.nip && l.nip === remoteEmp.nip)
              );
              if (matchedLocal) {
                return {
                  ...remoteEmp,
                  ...matchedLocal,
                  foto: matchedLocal.foto || remoteEmp.foto,
                };
              }
              return remoteEmp;
            });

            localList.forEach((localEmp) => {
              if (!merged.some((m) => m.id === localEmp.id)) {
                merged.push(localEmp);
              }
            });

            try {
              localStorage.setItem("rsj_employees", JSON.stringify(merged));
            } catch (e) {
              console.error("Gagal simpan merged employees:", e);
            }
            return merged;
          });
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

  // SINKRONISASI FOTO & BIODATA ANTARA EMPLOYEES & CURRENTUSER (AGAR TETAP STAY SAAT REFRESH)
  useEffect(() => {
    if (currentUser && employees.length > 0) {
      const matched = getEmployeeForUser(currentUser, employees);
      if (matched && matched.foto && matched.foto !== currentUser.foto) {
        setCurrentUser((prev) => {
          const updated = {
            ...prev,
            foto: matched.foto,
          };
          localStorage.setItem("rsj_current_user", JSON.stringify(updated));
          return updated;
        });
      }
    }
  }, [employees, currentUser]);

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

  useEffect(() => {
    localStorage.setItem("rsj_dossiers", JSON.stringify(dossiersList));
  }, [dossiersList]);

  // SDM & DOSSIER HANDLERS
  const handleSaveDossier = useCallback((updatedDossier) => {
    setDossiersList((prev) => {
      const idx = prev.findIndex((d) => d.employeeId === updatedDossier.employeeId);
      let updated;
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = updatedDossier;
      } else {
        updated = [updatedDossier, ...prev];
      }
      try {
        localStorage.setItem("rsj_dossiers", JSON.stringify(updated));
      } catch (e) {
        console.error("Gagal simpan dossiers:", e);
      }
      return updated;
    });
  }, []);

  const handleAddEmployee = useCallback((newEmp) => {
    setEmployees((prev) => {
      const updated = [newEmp, ...prev];
      try {
        localStorage.setItem("rsj_employees", JSON.stringify(updated));
      } catch (e) {
        console.error("Gagal simpan add employee:", e);
      }
      return updated;
    });
    if (isSupabaseConfigured()) {
      tambahDataSupabase("employees", newEmp);
    }
  }, []);

  const handleUpdateEmployee = useCallback((updatedEmp) => {
    // 1. Simpan ke master state employees & LocalStorage
    setEmployees((prev) => {
      const updated = prev.map((emp) => (emp.id === updatedEmp.id ? updatedEmp : emp));
      try {
        localStorage.setItem("rsj_employees", JSON.stringify(updated));
      } catch (e) {
        console.error("Gagal simpan employees ke LocalStorage:", e);
      }
      return updated;
    });

    // 2. Simpan juga langsung ke currentUser & LocalStorage agar sesi user aktif tidak ter-reset
    setCurrentUser((prevUser) => {
      if (!prevUser) return prevUser;
      const isCurrent =
        (prevUser.employeeId && (prevUser.employeeId === updatedEmp.id || prevUser.employeeId === updatedEmp.employeeId)) ||
        (prevUser.id && prevUser.id === updatedEmp.id) ||
        (prevUser.nip && updatedEmp.nip && prevUser.nip.replace(/\s+/g, "") === updatedEmp.nip.replace(/\s+/g, "")) ||
        (prevUser.nama && updatedEmp.nama && prevUser.nama.toLowerCase().trim() === updatedEmp.nama.toLowerCase().trim()) ||
        (prevUser.username && updatedEmp.username && prevUser.username.toLowerCase() === updatedEmp.username.toLowerCase());

      if (isCurrent) {
        const newCurrentUser = {
          ...prevUser,
          ...updatedEmp,
          foto: updatedEmp.foto || prevUser.foto,
        };
        try {
          localStorage.setItem("rsj_current_user", JSON.stringify(newCurrentUser));
        } catch (e) {
          console.error("Gagal simpan current_user ke LocalStorage:", e);
        }
        return newCurrentUser;
      }
      return prevUser;
    });

    // 3. Sinkronkan pembaruan ke tabel 'employees' Supabase jika aktif
    if (isSupabaseConfigured()) {
      updateDataSupabase("employees", updatedEmp, "id");
    }
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

    if (isLeaveApplicant(currentUser, targetLeave, employees)) {
      alert("Akses Ditolak: Anda tidak dapat menyetujui permohonan cuti Anda sendiri. Wajib melalui atasan/pimpinan.");
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

  // KONFIRMASI KEMBALI KE PORTAL UTAMA / GUEST
  const handleRequestBackToPortal = useCallback(() => {
    if (currentView === "admin" || currentView === "pegawai") {
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
        case "navigate_admin":
          if (currentView !== "admin") {
            setCurrentView("admin");
            if (!currentUser || !isAdminOrHrd(currentUser)) {
              setCurrentUser({
                nama: "Agus Pratondo, S.Sos",
                role: "Kasubbag Kepegawaian & SDM",
                username: "admin",
              });
            }
          }
          setActiveTab(action.tab);
          break;
        case "navigate_pegawai":
          if (currentView !== "pegawai") {
            setCurrentView("pegawai");
            if (!currentUser) {
              setCurrentUser({
                nama: "Ns. Budi Setiawan, S.Kep",
                role: "Perawat Pelaksana IGD Jiwa",
                username: "budi",
                nip: "19920817 201902 1 004",
                employeeId: "EMP-006",
              });
            }
          }
          setActivePegawaiTab(action.tab);
          break;
        case "navigate_view":
          if ((action.view === "guest") && (currentView === "admin" || currentView === "pegawai")) {
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
        const loggedUser = res.user;
        setCurrentUser(loggedUser);
        localStorage.setItem("rsj_current_user", JSON.stringify(loggedUser));

        setAuthInput({
          nama: "",
          nip: "",
          role: "Perawat Pelaksana",
          unit: "Bangsal Kampar (Akut Pria)",
          username: "",
          email: "",
          password: "",
        });

        // Pisahkan tampilan: Admin vs Pegawai
        if (isAdminOrHrd(loggedUser)) {
          setCurrentView("admin");
          setActiveTab("direktori");
          showToast("Login Berhasil", `Selamat datang di Panel Admin SIM-SDM, ${loggedUser.nama}!`, "success");
        } else {
          setCurrentView("pegawai");
          setActivePegawaiTab("profil");
          showToast("Login Berhasil", `Selamat bertugas di Portal SIM-SDM, ${loggedUser.nama}!`, "success");
        }
        return;
      } else if (res.error && !res.localOnly) {
        const foundLocal = users.find(
          (u) =>
            (u.username?.toLowerCase() === loginIdentifier.toLowerCase() ||
             u.email?.toLowerCase() === loginIdentifier.toLowerCase()) &&
            u.password === loginPassword
        );

        if (foundLocal) {
          setCurrentUser(foundLocal);
          localStorage.setItem("rsj_current_user", JSON.stringify(foundLocal));
          if (isAdminOrHrd(foundLocal)) {
            setCurrentView("admin");
            setActiveTab("direktori");
          } else {
            setCurrentView("pegawai");
            setActivePegawaiTab("profil");
          }
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

      setAuthInput({
        nama: "",
        nip: "",
        role: "Perawat Pelaksana",
        unit: "Bangsal Kampar (Akut Pria)",
        username: "",
        email: "",
        password: "",
      });

      if (isAdminOrHrd(foundUser)) {
        setCurrentView("admin");
        setActiveTab("direktori");
        showToast("Login Berhasil", `Selamat datang di Panel Admin SIM-SDM, ${foundUser.nama}!`, "success");
      } else {
        setCurrentView("pegawai");
        setActivePegawaiTab("profil");
        showToast("Login Berhasil", `Selamat bertugas di Portal SIM-SDM, ${foundUser.nama}!`, "success");
      }
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
      {/* 1. ADMIN DASHBOARD VIEW (KHUSUS ADMINISTRATOR SDM)       */}
      {/* ======================================================== */}
      {currentView === "admin" ? (
        <div className="d-flex flex-column flex-md-row w-100 min-vh-100 app-layout-wrapper">
          {/* SIDEBAR ADMIN LENGKAP */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
            darkMode={darkMode}
            toggleTheme={toggleTheme}
            handleLogout={handleRequestLogout}
            setCurrentView={setCurrentView}
            onBackToPortal={handleRequestBackToPortal}
            employeeCount={employees.length}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />

          {/* MAIN CONTENT ADMIN */}
          <main className="flex-grow-1 w-100 d-flex flex-column min-vh-100 overflow-auto main-content-pane">
            <div className="flex-grow-1 px-3 px-md-4 py-3">
              <AdminPage
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                employees={employees}
                shiftRoster={shiftRoster}
                leaveRequests={leaveRequests}
                trainings={trainings}
                dossiersList={dossiersList}
                onSaveDossier={handleSaveDossier}
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
      ) : currentView === "pegawai" || currentView === "cuti_pegawai" ? (
        /* ======================================================== */
        /* 2. PEGAWAI PORTAL VIEW (KHUSUS LAYANAN MANDIRI PEGAWAI) */
        /* ======================================================== */
        <div className="d-flex flex-column flex-md-row w-100 min-vh-100 app-layout-wrapper">
          {/* SIDEBAR PEGAWAI MANDIRI */}
          <SidebarPegawai
            activeTab={activePegawaiTab}
            setActiveTab={setActivePegawaiTab}
            currentUser={currentUser}
            darkMode={darkMode}
            toggleTheme={toggleTheme}
            handleLogout={handleRequestLogout}
            setCurrentView={setCurrentView}
            onBackToPortal={handleRequestBackToPortal}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            dossierCount={
              dossiersList.find((d) => d.employeeId === (currentUser?.employeeId || currentUser?.id))?.dokumen?.length || 0
            }
          />

          {/* MAIN CONTENT PEGAWAI */}
          <main className="flex-grow-1 w-100 d-flex flex-column min-vh-100 overflow-auto main-content-pane">
            <div className="flex-grow-1 px-3 px-md-4 py-3">
              <PegawaiPage
                activeTab={activePegawaiTab}
                setActiveTab={setActivePegawaiTab}
                currentUser={currentUser}
                employees={employees}
                shiftRoster={shiftRoster}
                leaveRequests={leaveRequests}
                trainings={trainings}
                dossiersList={dossiersList}
                onSaveDossier={handleSaveDossier}
                onUpdateEmployee={handleUpdateEmployee}
                onSubmitLeave={handleSubmitLeave}
                darkMode={darkMode}
                showToast={showToast}
                onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
                onBackToPortal={handleRequestBackToPortal}
              />
            </div>
            <Footer isAdmin={false} darkMode={darkMode} />
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
              currentUser={currentUser}
              darkMode={darkMode}
              toggleTheme={toggleTheme}
              navBg={navBg}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              onOpenLogoutModal={handleRequestLogout}
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

      {/* MODAL KONFIRMASI LOGOUT */}
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