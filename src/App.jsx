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
import { getSavedUserPhoto, saveUserPhoto } from "./utils/imageHelpers";

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

  // STATE TOAST NOTIFIKASI (dideklarasikan di awal agar tersedia untuk semua hook/efek)
  const [toast, setToast] = useState(null);

  const showToast = useCallback((title, message, type = "success") => {
    setToast({ title, message, type });
  }, []);

  // STATE THEMA (DARK / LIGHT MODE)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("rsj_theme") === "dark";
    } catch {
      return false;
    }
  });

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => {
      const newMode = !prev;
      try {
        localStorage.setItem("rsj_theme", newMode ? "dark" : "light");
      } catch {}
      return newMode;
    });
  }, []);

  // STATE COMMAND PALETTE (CTRL+K)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // STATE MODAL KONFIRMASI KEMBALI KE PORTAL GUEST
  const [isConfirmPortalOpen, setIsConfirmPortalOpen] = useState(false);

  // STATE MODAL KONFIRMASI LOGOUT DARI ADMIN
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);

  // STATE USER & SESI (SESSIONSTORAGE)
  const [currentUser, setCurrentUser] = useState(() => {
    // 1. Bersihkan sisa legacy localStorage agar tidak persisten saat browser ditutup
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("rsj_current_user");
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith("sb-") || key.includes("supabase.auth.token"))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      }
    } catch (e) {
      console.warn("Storage cleanup error:", e);
    }

    // 2. Ambil sesi user hanya dari sessionStorage (otomatis hilang saat browser diclose)
    try {
      if (typeof window !== "undefined") {
        const savedUser = sessionStorage.getItem("rsj_current_user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          try {
            const savedPhotos = JSON.parse(localStorage.getItem("rsj_saved_photos") || "{}");
            const photoKey = (parsed.nip || "").replace(/\s+/g, "") || parsed.id || parsed.username?.toLowerCase();
            if (savedPhotos[photoKey]) {
              parsed.foto = savedPhotos[photoKey];
            }
          } catch {}
          return parsed;
        }
      }
    } catch (e) {
      console.error("Gagal membaca session user dari sessionStorage:", e);
    }
    return null;
  });

  // Sinkronisasi Sesi User ke SessionStorage (bukan localStorage)
  useEffect(() => {
    try {
      if (currentUser) {
        sessionStorage.setItem("rsj_current_user", JSON.stringify(currentUser));
      } else {
        sessionStorage.removeItem("rsj_current_user");
      }
      // Pastikan localStorage selalu bersih dari kredensial aktif
      localStorage.removeItem("rsj_current_user");
    } catch (e) {
      console.warn("Gagal sinkronisasi sessionStorage user:", e);
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

  // SINKRONISASI BROWSER BACK / FORWARD (POPSTATE) -> STATE & AUTO-LOGOUT DI PORTAL
  useEffect(() => {
    const handlePopState = async () => {
      const state = getStateFromPath(window.location.pathname);
      // Jika user menekan tombol Back browser ke portal publik ('guest'), otomatis logout akun
      if (state.view === "guest" && currentUser) {
        try {
          await logoutUserSupabase();
        } catch (e) {}
        setCurrentUser(null);
        try {
          sessionStorage.removeItem("rsj_current_user");
          localStorage.removeItem("rsj_current_user");
        } catch {}
        showToast("Logout Otomatis", "Sesi profil Anda telah keluar secara otomatis karena kembali ke Portal Publik.", "info");
      }
      setCurrentView(state.view);
      if (state.adminTab) setActiveTab(state.adminTab);
      if (state.portalTab) setActivePortalTab(state.portalTab);
      if (state.pegawaiTab) setActivePegawaiTab(state.pegawaiTab);
      document.title = getTitleForState(state.view, state.adminTab, state.portalTab, state.pegawaiTab);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentUser, showToast]);

  // ROLE & AUTH ACCESS GUARD UNTUK HALAMAN ADMIN & PEGAWAI
  useEffect(() => {
    if (currentView === "admin") {
      if (!currentUser) {
        setCurrentView("login");
        showToast(
          "Akses Terbatas",
          "Silakan login dengan akun Administrator Kepegawaian untuk mengakses Panel Admin.",
          "warning"
        );
      } else if (!isAdminOrHrd(currentUser)) {
        setCurrentView("pegawai");
        setActivePegawaiTab("profil");
        showToast(
          "Akses Terbatas",
          "Halaman Panel Admin hanya untuk Kasubbag Kepegawaian & HRD. Anda dialihkan ke Portal Mandiri Pegawai.",
          "warning"
        );
      }
    } else if (currentView === "pegawai" || currentView === "cuti_pegawai") {
      if (!currentUser) {
        setCurrentView("login");
        showToast(
          "Login Diperlukan",
          "Silakan masuk ke akun SIM-SDM untuk mengakses Portal Mandiri Pegawai.",
          "warning"
        );
      }
    }
  }, [currentView, currentUser, showToast]);

  // SINKRONISASI LOGOUT OTOMATIS SAAT BERADA DI HALAMAN PORTAL PUBLIK (GUEST)
  useEffect(() => {
    if (currentView === "guest" && currentUser) {
      logoutUserSupabase().catch(() => {});
      setCurrentUser(null);
      try {
        sessionStorage.removeItem("rsj_current_user");
        localStorage.removeItem("rsj_current_user");
      } catch {}
      showToast("Logout Otomatis", "Sesi profil Anda telah keluar secara otomatis saat kembali ke Portal Publik.", "info");
    }
  }, [currentView, currentUser, showToast]);

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
            let userPhoto = profile?.avatar_url || profile?.foto || meta.avatar_url || null;
            try {
              const savedPhotos = JSON.parse(localStorage.getItem("rsj_saved_photos") || "{}");
              const photoKey = (profile?.nip || meta.nip || "").replace(/\s+/g, "") || session.user.id || profile?.username;
              if (savedPhotos[photoKey]) {
                userPhoto = savedPhotos[photoKey];
              }
            } catch {}

            const activeUser = {
              id: session.user.id,
              email: session.user.email,
              username: profile?.username || meta.username || session.user.email.split("@")[0],
              nama: profile?.nama || meta.nama || meta.full_name || session.user.email.split("@")[0],
              role: profile?.role || meta.role || "Perawat Pelaksana",
              nip: profile?.nip || meta.nip || "-",
              unit: profile?.unit || meta.unit || "Unit Pelayanan RSJ Tampan",
              profesi: profile?.profesi || profile?.role || meta.profesi || meta.role || "Tenaga Medis",
              foto: userPhoto,
            };
            setCurrentUser(activeUser);
            sessionStorage.setItem("rsj_current_user", JSON.stringify(activeUser));
            localStorage.removeItem("rsj_current_user");
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
          let userPhoto = profile?.avatar_url || profile?.foto || meta.avatar_url || null;
          try {
            const savedPhotos = JSON.parse(localStorage.getItem("rsj_saved_photos") || "{}");
            const photoKey = (profile?.nip || meta.nip || "").replace(/\s+/g, "") || session.user.id || profile?.username;
            if (savedPhotos[photoKey]) {
              userPhoto = savedPhotos[photoKey];
            }
          } catch {}

          const syncedUser = {
            id: session.user.id,
            email: session.user.email,
            username: profile?.username || meta.username || session.user.email.split("@")[0],
            nama: profile?.nama || meta.nama || meta.full_name || session.user.email.split("@")[0],
            role: profile?.role || meta.role || "Perawat Pelaksana",
            nip: profile?.nip || meta.nip || "-",
            unit: profile?.unit || meta.unit || "Unit Pelayanan RSJ Tampan",
            profesi: profile?.profesi || profile?.role || meta.profesi || meta.role || "Tenaga Medis",
            foto: userPhoto,
          };
          setCurrentUser(syncedUser);
          sessionStorage.setItem("rsj_current_user", JSON.stringify(syncedUser));
          localStorage.removeItem("rsj_current_user");
        } else if (event === "SIGNED_OUT") {
          setCurrentUser(null);
          sessionStorage.removeItem("rsj_current_user");
          localStorage.removeItem("rsj_current_user");
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // STATE SDM & KEPEGAWAIAN NAKES
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("rsj_employees");
    let list = saved ? JSON.parse(saved) : initialEmployees;
    try {
      const savedPhotos = JSON.parse(localStorage.getItem("rsj_saved_photos") || "{}");
      list = list.map((emp) => {
        const key = (emp.nip || "").replace(/\s+/g, "") || emp.id || emp.username?.toLowerCase();
        if (savedPhotos[key]) {
          return { ...emp, foto: savedPhotos[key] };
        }
        return emp;
      });
    } catch {}
    return list;
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

            let savedPhotos = {};
            try {
              savedPhotos = JSON.parse(localStorage.getItem("rsj_saved_photos") || "{}");
            } catch {}

            // Merge data remote dengan mempertahankan foto atau pembaruan lokal terbaru
            const merged = dataEmployees.map((remoteEmp) => {
              const matchedLocal = localList.find(
                (l) => l.id === remoteEmp.id || (l.nip && l.nip === remoteEmp.nip)
              );
              const photoKey = (remoteEmp.nip || "").replace(/\s+/g, "") || remoteEmp.id;
              const persistentPhoto = savedPhotos[photoKey];

              if (matchedLocal) {
                return {
                  ...remoteEmp,
                  ...matchedLocal,
                  foto: persistentPhoto || matchedLocal.foto || remoteEmp.foto,
                };
              }
              if (persistentPhoto) {
                return { ...remoteEmp, foto: persistentPhoto };
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

  // SINKRONISASI FOTO PERSISTEN KE CURRENTUSER
  useEffect(() => {
    if (currentUser) {
      const persistentPhoto = getSavedUserPhoto(currentUser);
      if (persistentPhoto && currentUser.foto !== persistentPhoto) {
        setCurrentUser((prev) => {
          if (!prev) return prev;
          const updated = {
            ...prev,
            foto: persistentPhoto,
          };
          sessionStorage.setItem("rsj_current_user", JSON.stringify(updated));
          return updated;
        });
      }
    }
  }, [currentUser]);

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
    // 0. Simpan foto ke cache persisten rsj_saved_photos
    if (updatedEmp.foto) {
      saveUserPhoto(updatedEmp.foto, currentUser, updatedEmp);
    }

    // 1. Simpan ke master state employees & LocalStorage
    setEmployees((prev) => {
      const cleanTargetNip = (updatedEmp.nip || "").replace(/\s+/g, "");
      const cleanTargetNama = (updatedEmp.nama || "").toLowerCase().trim();
      const idx = prev.findIndex(
        (emp) =>
          (updatedEmp.id && emp.id === updatedEmp.id) ||
          (cleanTargetNip && emp.nip && emp.nip.replace(/\s+/g, "") === cleanTargetNip) ||
          (cleanTargetNama && emp.nama && emp.nama.toLowerCase().trim() === cleanTargetNama)
      );

      let updated;
      if (idx !== -1) {
        updated = [...prev];
        updated[idx] = { ...updated[idx], ...updatedEmp };
      } else {
        updated = [updatedEmp, ...prev];
      }

      try {
        localStorage.setItem("rsj_employees", JSON.stringify(updated));
      } catch (e) {
        console.error("Gagal simpan employees ke LocalStorage:", e);
      }
      return updated;
    });

    // 2. Simpan juga ke master users agar saat logout & login kembali fotonya tetap terhubung
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((u) => {
        const isMatch =
          (updatedEmp.username && u.username?.toLowerCase() === updatedEmp.username.toLowerCase()) ||
          (updatedEmp.nip && u.nip?.replace(/\s+/g, "") === updatedEmp.nip.replace(/\s+/g, "")) ||
          (updatedEmp.email && u.email?.toLowerCase() === updatedEmp.email.toLowerCase()) ||
          (updatedEmp.nama && u.nama?.toLowerCase().trim() === updatedEmp.nama.toLowerCase().trim());
        if (isMatch) {
          return { ...u, foto: updatedEmp.foto || u.foto };
        }
        return u;
      });
      try {
        localStorage.setItem("rsj_users", JSON.stringify(updatedUsers));
      } catch (e) {
        console.warn("Gagal simpan rsj_users:", e);
      }
      return updatedUsers;
    });

    // 3. Simpan juga langsung ke currentUser & SessionStorage agar sesi user aktif tidak ter-reset
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
          sessionStorage.setItem("rsj_current_user", JSON.stringify(newCurrentUser));
          localStorage.removeItem("rsj_current_user");
        } catch (e) {
          console.error("Gagal simpan current_user ke SessionStorage:", e);
        }
        return newCurrentUser;
      }
      return prevUser;
    });

    // 4. Sinkronkan pembaruan ke tabel 'employees' & 'profiles' Supabase jika aktif
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

  // KONFIRMASI KEMBALI KE PORTAL UTAMA / GUEST & LOGOUT
  const handleRequestBackToPortal = useCallback(() => {
    if (currentUser && (currentView === "admin" || currentView === "pegawai" || currentView === "cuti_pegawai")) {
      setIsConfirmPortalOpen(true);
    } else {
      setCurrentView("guest");
    }
  }, [currentView, currentUser]);

  const handleConfirmBackToPortal = useCallback(async () => {
    setIsConfirmPortalOpen(false);
    await logoutUserSupabase();
    setCurrentUser(null);
    sessionStorage.removeItem("rsj_current_user");
    localStorage.removeItem("rsj_current_user");
    setCurrentView("guest");
    showToast("Logout Otomatis", "Sesi profil Anda telah keluar secara otomatis dan kembali ke Portal Publik.", "info");
  }, [showToast]);

  // COMMAND PALETTE ACTIONS
  const handleCommandAction = useCallback(
    (action) => {
      switch (action.type) {
        case "navigate_admin":
          if (currentUser && isAdminOrHrd(currentUser)) {
            setCurrentView("admin");
            setActiveTab(action.tab);
          } else {
            setCurrentView("login");
            showToast("Login Diperlukan", "Silakan login sebagai Administrator Kepegawaian terlebih dahulu.", "warning");
          }
          break;
        case "navigate_pegawai":
          if (currentUser) {
            setCurrentView("pegawai");
            setActivePegawaiTab(action.tab);
          } else {
            setCurrentView("login");
            showToast("Login Diperlukan", "Silakan login ke akun pegawai terlebih dahulu.", "warning");
          }
          break;
        case "navigate_view":
          if (action.view === "guest" && (currentView === "admin" || currentView === "pegawai" || currentUser)) {
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
    [currentView, currentUser, toggleTheme, showToast]
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
        sessionStorage.setItem("rsj_current_user", JSON.stringify(loggedUser));
        localStorage.removeItem("rsj_current_user");

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
          try {
            const savedPhotos = JSON.parse(localStorage.getItem("rsj_saved_photos") || "{}");
            const photoKey = (foundLocal.nip || "").replace(/\s+/g, "") || foundLocal.username?.toLowerCase();
            if (savedPhotos[photoKey]) {
              foundLocal.foto = savedPhotos[photoKey];
            }
          } catch {}

          setCurrentUser(foundLocal);
          sessionStorage.setItem("rsj_current_user", JSON.stringify(foundLocal));
          localStorage.removeItem("rsj_current_user");
          if (isAdminOrHrd(foundLocal)) {
            setCurrentView("admin");
            setActiveTab("direktori");
          } else {
            setCurrentView("pegawai");
            setActivePegawaiTab("profil");
          }
          showToast("Login Berhasil", `Selamat bertugas di SIM-SDM, ${foundLocal.nama}!`, "success");
          return;
        }

        setAuthError(res.error.message || "Gagal masuk. Periksa kembali username/email dan password.");
        return;
      }
    }

    // 2. Fallback untuk akun lokal
    const foundUser = users.find(
      (u) =>
        (u.username?.toLowerCase() === loginIdentifier.toLowerCase() ||
         u.email?.toLowerCase() === loginIdentifier.toLowerCase()) &&
        u.password === loginPassword
    );

    if (foundUser) {
      try {
        const savedPhotos = JSON.parse(localStorage.getItem("rsj_saved_photos") || "{}");
        const photoKey = (foundUser.nip || "").replace(/\s+/g, "") || foundUser.username?.toLowerCase();
        if (savedPhotos[photoKey]) {
          foundUser.foto = savedPhotos[photoKey];
        }
      } catch {}

      setCurrentUser(foundUser);
      sessionStorage.setItem("rsj_current_user", JSON.stringify(foundUser));
      localStorage.removeItem("rsj_current_user");

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
      setAuthError("Email/Username atau Password tidak sesuai. Silakan periksa kembali.");
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

    // 3. Tambahkan ke master pegawai (employees) agar profil terhubung utuh
    const newEmp = {
      id: res.user?.id || `EMP-${Date.now().toString().slice(-4)}`,
      nip: cleanNip || "19900101 202001 1 001",
      nama: cleanNama,
      gelarDepan: "",
      gelarBelakang: "",
      profesi: cleanRole,
      kategori: cleanRole.toLowerCase().includes("dokter") ? "Medis" : "Keperawatan",
      jabatan: cleanRole,
      unitPenempatan: cleanUnit,
      statusKepegawaian: "PNS",
      golongan: "Penata Muda (III/a)",
      pendidikan: "Profesi",
      email: cleanEmail,
      noHp: "0812-0000-0000",
      alamat: "Pekanbaru, Riau",
      tanggalBergabung: new Date().toISOString().split("T")[0],
      sisaCuti: 12,
      skpSkor: 92.0,
      statusAktif: "Aktif",
      foto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
    };
    setEmployees((prev) => {
      const updated = [newEmp, ...prev.filter((e) => e.nip !== cleanNip && e.id !== newEmp.id)];
      try {
        localStorage.setItem("rsj_employees", JSON.stringify(updated));
      } catch {}
      return updated;
    });

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
    sessionStorage.removeItem("rsj_current_user");
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
              onBackToPortal={handleRequestBackToPortal}
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
        currentUser={currentUser}
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