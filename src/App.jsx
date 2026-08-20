import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("guest");
  const [currentUser, setCurrentUser] = useState(null);

  // STATE THEMA (DARK / LIGHT MODE)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("rsj_theme") === "dark";
  });

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("rsj_theme", newMode ? "dark" : "light");
  };

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
    return savedUsers
      ? JSON.parse(savedUsers)
      : [
          {
            nama: "Admin Utama",
            username: "admin",
            password: "123",
            role: "Super Admin",
          },
        ];
  });

  useEffect(() => {
    localStorage.getItem("rsj_users") ||
      localStorage.setItem("rsj_users", JSON.stringify(users));
  }, [users]);

  const [activeTab, setActiveTab] = useState("inventaris");
  const [searchQuery, setSearchQuery] = useState("");
  const [conditionFilter, setConditionFilter] = useState("semua");

  // STATE INVENTARIS
  const [inventory, setInventory] = useState([
    {
      id: "B001",
      nama: "Suntikan 3ml",
      kategori: "Alat Medis",
      stok: 150,
      satuan: "Pcs",
      kondisi: "Bagus",
    },
    {
      id: "B002",
      nama: "Haloperidol 5mg",
      kategori: "Obat Farmasi",
      stok: 300,
      satuan: "Tablet",
      kondisi: "Bagus",
    },
    {
      id: "B003",
      nama: "Kursi Roda Bangsal C",
      kategori: "Alat Medis",
      stok: 5,
      satuan: "Unit",
      kondisi: "Rusak",
    },
    {
      id: "B004",
      nama: "Kertas A4 Bangsal",
      kategori: "ATK",
      stok: 30,
      satuan: "Rim",
      kondisi: "Bagus",
    },
  ]);

  // STATE LAPORAN MUTASI
  const [mutations, setMutations] = useState([
    {
      id: 1,
      tanggal: "2026-08-20",
      kode: "B003",
      nama: "Kursi Roda Bangsal C",
      jenis: "Keluar",
      jumlah: 1,
      satuan: "Unit",
      asalTujuan: "Afkir / Rusak",
      kondisi: "Rusak",
      petugas: "Siti, A.Md.Kep",
    },
    {
      id: 2,
      tanggal: "2026-08-19",
      kode: "B001",
      nama: "Suntikan 3ml",
      jenis: "Masuk",
      jumlah: 200,
      satuan: "Pcs",
      asalTujuan: "Dinas Kesehatan Riau",
      kondisi: "Bagus",
      petugas: "Admin Utama",
    },
  ]);

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
    tujuan: "Bangsal Psychiatric",
  });

  // AUTH HANDLERS
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError("");
    const foundUser = users.find(
      (u) =>
        u.username.toLowerCase() === authInput.username.trim().toLowerCase() &&
        u.password === authInput.password,
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
    } else {
      setAuthError("Username atau Password salah! (Default: admin / 123)");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    const isExist = users.some(
      (u) =>
        u.username.toLowerCase() === authInput.username.trim().toLowerCase(),
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
  };

  const handleOpenOutModal = (item) => {
    setOutItem({ item: item, jumlahOut: "", tujuan: "Bangsal Psychiatric" });
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
      }),
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
  };

  const handleOpenEdit = (item) => {
    setEditingItem({ ...item });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setInventory(
      inventory.map((item) =>
        item.id === editingItem.id ? editingItem : item,
      ),
    );
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleDelete = (id, nama) => {
    if (window.confirm(`Hapus ${nama} dari inventaris?`)) {
      setInventory(inventory.filter((item) => item.id !== id));
    }
  };

  // FILTERING
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
    (item) => item.kondisi === "Bagus",
  ).length;
  const barangRusakCount = inventory.filter(
    (item) => item.kondisi === "Rusak",
  ).length;

  const totalBarangMasukLaporan = mutations
    .filter((m) => m.jenis === "Masuk")
    .reduce((acc, m) => acc + m.jumlah, 0);
  const totalBarangKeluarLaporan = mutations
    .filter((m) => m.jenis === "Keluar")
    .reduce((acc, m) => acc + m.jumlah, 0);

  // CLASS TEMA DYNAMIC
  const themeBg = darkMode ? "bg-dark text-light" : "bg-light text-dark";
  const cardBg = darkMode
    ? "bg-secondary text-white border-dark"
    : "bg-white text-dark border";
  const navBg = darkMode
    ? "bg-dark navbar-dark border-bottom border-secondary"
    : "bg-white navbar-light shadow-sm";
  const tableTheme = darkMode ? "table-dark" : "table-light";

  return (
    <div
      className={`min-vh-100 d-flex flex-column justify-content-between ${themeBg}`}
    >
      <div>
        {/* NAVBAR UTAMA */}
        <nav
          className={`navbar navbar-expand-lg px-4 py-3 sticky-top ${navBg}`}
        >
          <div className="container-fluid">
            <div
              className="d-flex align-items-center gap-3"
              style={{ cursor: "pointer" }}
              onClick={() => setCurrentView("guest")}
            >
              <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary fs-4">
                🏥
              </div>
              <div>
                <h5
                  className="mb-0 fw-bold"
                  style={{ letterSpacing: "-0.3px" }}
                >
                  RSJ TAMPAN
                </h5>
                <small
                  className={darkMode ? "text-light opacity-75" : "text-muted"}
                  style={{ fontSize: "0.75rem" }}
                >
                  PROVINSI RIAU - PEKANBARU
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              {/* TOMBOL TOGGLE DARK MODE */}
              <button
                className={`btn btn-sm rounded-circle p-2 ${darkMode ? "btn-outline-warning" : "btn-outline-dark"}`}
                onClick={toggleTheme}
                title="Ganti Tema Dark/Light"
                style={{ width: "38px", height: "38px" }}
              >
                {darkMode ? "☀️" : "🌙"}
              </button>

              {currentView === "admin" ? (
                <>
                  <div className="d-flex gap-2 me-3">
                    <button
                      className={`btn btn-sm ${activeTab === "inventaris" ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setActiveTab("inventaris")}
                    >
                      📦 Inventaris
                    </button>
                    <button
                      className={`btn btn-sm ${activeTab === "laporan" ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setActiveTab("laporan")}
                    >
                      📊 Laporan
                    </button>
                  </div>
                  <div className="d-flex align-items-center gap-2 border-start ps-3">
                    <span className="small">
                      Halo, <b>{currentUser?.nama}</b> ({currentUser?.role})
                    </span>
                    <button
                      className="btn btn-sm btn-outline-danger fw-semibold"
                      onClick={handleLogout}
                    >
                      Logout 🚪
                    </button>
                  </div>
                </>
              ) : (
                <div className="d-flex gap-2">
                  <button
                    className={`btn btn-sm rounded-pill px-3 fw-semibold ${currentView === "guest" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setCurrentView("guest")}
                  >
                    🌐 Beranda
                  </button>
                  <button
                    className={`btn btn-sm rounded-pill px-3 fw-semibold ${currentView === "login" || currentView === "register" ? "btn-success" : "btn-outline-success"}`}
                    onClick={() => setCurrentView("login")}
                  >
                    🔑 Portal Petugas
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="rsj-banner-sub py-2 px-4 shadow-sm text-center fs-6 text-white bg-success">
          {currentView === "admin"
            ? "SISTEM INFORMASI MANAJEMEN INVENTARIS LOGISTIK MEDIS & UMUM"
            : "PORTAL RESMI LAYANAN KESEHATAN JIWA & UMUM TERPADU PROVINSI RIAU"}
        </div>

        {/* ==================== GUEST VIEW ==================== */}
        {currentView === "guest" && (
          <div className="pb-5">
            {/* HERO BANNER SECTION */}
            <div
              className={`py-5 px-4 mb-4 border-bottom ${darkMode ? "bg-black text-light" : "bg-white text-dark"}`}
            >
              <div className="container">
                <div className="row align-items-center g-4">
                  <div className="col-lg-7">
                    <span className="badge bg-success bg-opacity-25 text-success fw-bold px-3 py-2 rounded-pill mb-3">
                      ✨ Terakreditasi Paripurna KARS
                    </span>
                    <h1
                      className={`display-5 mb-3 fw-bold ${darkMode ? "text-white" : "text-dark"}`}
                      style={{ lineHeight: "1.2" }}
                    >
                      Melayani Sepenuh Hati untuk Kesehatan Jiwa & Raga Anda
                    </h1>
                    <p
                      className={`lead mb-4 ${darkMode ? "text-light opacity-75" : "text-muted"}`}
                    >
                      Rumah Sakit Jiwa Tampan Pekanbaru menyediakan fasilitas
                      medis modern, konseling psikologi, rehabilitasi terpadu,
                      dan Unit Gawat Darurat 24 Jam.
                    </p>
                    <div className="d-flex flex-wrap gap-3">
                      <button
                        className="btn btn-success btn-lg px-4 fw-bold shadow-sm"
                        onClick={() =>
                          alert(
                            "📞 Layanan Call Center IGD RSJ Tampan: (0761) 63238",
                          )
                        }
                      >
                        🚨 Emergency IGD 24 Jam
                      </button>
                      <button
                        className="btn btn-outline-primary btn-lg px-4 fw-bold"
                        onClick={() => setCurrentView("login")}
                      >
                        🔐 Portal SIM-RS Inventaris
                      </button>
                    </div>
                  </div>
                  <div className="col-lg-5 text-center">
                    <div
                      className={`p-4 rounded-4 border shadow-sm ${darkMode ? "bg-dark border-secondary" : "bg-primary bg-opacity-10 border-primary"}`}
                    >
                      <div className="fs-1 mb-2">🏥🩺🧠</div>
                      <h5 className="fw-bold text-primary mb-1">
                        Pusat Rujukan Utama Riau
                      </h5>
                      <p className="small opacity-75 mb-3">
                        Pekanbaru - Riau, Indonesia
                      </p>
                      <hr />
                      <div className="row text-start g-2">
                        <div className="col-6">
                          <small className="opacity-75 d-block">
                            Jam Pelayanan:
                          </small>
                          <b>24 Jam (IGD)</b>
                        </div>
                        <div className="col-6">
                          <small className="opacity-75 d-block">
                            Poli Rawat Jalan:
                          </small>
                          <b>Senin - Sabtu</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="container">
              {/* STATISTIK KEUNGGULAN */}
              <div className="row g-3 mb-5">
                <div className="col-md-3 col-6">
                  <div
                    className={`p-3 rounded-3 shadow-sm text-center ${cardBg}`}
                  >
                    <h3 className="fw-bold text-success mb-0">250+</h3>
                    <small className="fw-semibold">
                      Kapasitas Tempat Tidur
                    </small>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div
                    className={`p-3 rounded-3 shadow-sm text-center ${cardBg}`}
                  >
                    <h3 className="fw-bold text-primary mb-0">18+</h3>
                    <small className="fw-semibold">
                      Dokter Spesialis & Sub
                    </small>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div
                    className={`p-3 rounded-3 shadow-sm text-center ${cardBg}`}
                  >
                    <h3 className="fw-bold text-warning mb-0">24/7</h3>
                    <small className="fw-semibold">
                      Layanan Darurat & Labor
                    </small>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div
                    className={`p-3 rounded-3 shadow-sm text-center ${cardBg}`}
                  >
                    <h3 className="fw-bold text-info mb-0">100%</h3>
                    <small className="fw-semibold">Standar Alur Logistik</small>
                  </div>
                </div>
              </div>

              {/* GRID LAYANAN UNGGULAN */}
              <div className="mb-5">
                <div className="text-center mb-4">
                  <span className="text-success fw-bold text-uppercase small">
                    Pelayanan Medis
                  </span>
                  <h3 className="fw-bold">Layanan Unggulan RSJ Tampan</h3>
                </div>

                <div className="row g-4">
                  <div className="col-md-4">
                    <div
                      className={`card h-100 shadow-sm p-3 rounded-3 ${cardBg}`}
                    >
                      <div className="fs-2 mb-2 text-primary">🧠</div>
                      <h5 className="fw-bold">Psikiatri & Psikiatri Anak</h5>
                      <p className="small opacity-75">
                        Konsultasi masalah kesehatan jiwa dewasa, remaja,
                        gangguan kecemasan, depresi, hingga konsultasi tumbuh
                        kembang anak.
                      </p>
                      <button className="btn btn-sm btn-link text-decoration-none fw-bold p-0 text-start text-primary">
                        Lihat Jadwal Dokter →
                      </button>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div
                      className={`card h-100 shadow-sm p-3 rounded-3 ${cardBg}`}
                    >
                      <div className="fs-2 mb-2 text-success">🗣️</div>
                      <h5 className="fw-bold">Klinik Psikologi & Konseling</h5>
                      <p className="small opacity-75">
                        Pemeriksaan psikotes, konseling pernikahan, karir, bakat
                        minat, serta terapi psikologis oleh psikolog klinis
                        berpengalaman.
                      </p>
                      <button className="btn btn-sm btn-link text-decoration-none fw-bold p-0 text-start text-success">
                        Info Layanan Psikotes →
                      </button>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div
                      className={`card h-100 shadow-sm p-3 rounded-3 ${cardBg}`}
                    >
                      <div className="fs-2 mb-2 text-danger">🚑</div>
                      <h5 className="fw-bold">Rehabilitasi NAPZA</h5>
                      <p className="small opacity-75">
                        Program medis dan sosial terpadu pemulihan
                        ketergantungan obat & zat adiktif dengan pendampingan
                        medikolegal.
                      </p>
                      <button className="btn btn-sm btn-link text-decoration-none fw-bold p-0 text-start text-danger">
                        Info Alur Rehabilitasi →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* BERITA & MAPS */}
              <div className="row g-4 mb-5">
                <div className="col-lg-8">
                  <div className={`p-4 rounded-3 shadow-sm h-100 ${cardBg}`}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold mb-0">
                        📰 Edukasi & Pengumuman RSJ Tampan
                      </h5>
                      <span className="badge bg-primary">Agustus 2026</span>
                    </div>

                    <div className="border-bottom pb-3 mb-3">
                      <span className="badge bg-primary mb-1">
                        Edukasi Kesehatan
                      </span>
                      <h6 className="fw-bold">
                        Pentingnya Mencegah *Burnout* dan Menjaga Mental Hygiene
                        di Tempat Kerja
                      </h6>
                      <p className="small opacity-75 mb-1">
                        Ciri-ciri kelelahan mental serta langkah praktis
                        konsultasi ke psikolog RSJ Tampan Pekanbaru...
                      </p>
                      <small className="text-secondary">
                        20 Agustus 2026 • Tim Promkes RSJ
                      </small>
                    </div>

                    <div>
                      <span className="badge bg-success mb-1">
                        Inovasi Layanan
                      </span>
                      <h6 className="fw-bold">
                        Penerapan SIM-RS Logistik Baru Terintegrasi Laporan
                        Mutasi Stok
                      </h6>
                      <p className="small opacity-75 mb-1">
                        Sistem pencatatan barang masuk dan keluar kini dapat
                        dipantau langsung oleh petugas logistik...
                      </p>
                      <small className="text-secondary">
                        18 Agustus 2026 • Humas RSJ Tampan
                      </small>
                    </div>
                  </div>
                </div>

                {/* MAPS SECTION */}
                <div className="col-lg-4">
                  <div className={`p-4 rounded-3 shadow-sm h-100 ${cardBg}`}>
                    <h5 className="fw-bold mb-3">📍 Lokasi & Kontak</h5>
                    <p className="small opacity-75 mb-2">
                      <b>RSJ Tampan Provinsi Riau</b>
                      <br />
                      Jl. HR. Soebrantas Km. 12.5, Panam, Pekanbaru, Riau.
                    </p>

                    <div
                      className="rounded-3 overflow-hidden border mb-3 shadow-sm"
                      style={{ height: "200px" }}
                    >
                      <iframe
                        title="Lokasi Presisi RSJ Tampan Pekanbaru"
                        src="https://maps.google.com/maps?q=0.470439,101.378942&hl=id&z=16&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                      ></iframe>
                    </div>

                    <div className="mb-2">
                      <small className="opacity-75 d-block">
                        ☎️ Panggilan Darurat / IGD:
                      </small>
                      <span className="fw-bold text-danger">(0761) 63238</span>
                    </div>
                    <div className="mb-3">
                      <small className="opacity-75 d-block">
                        ✉️ Email Resmi:
                      </small>
                      <span className="fw-bold">rsjtampan@riau.go.id</span>
                    </div>

                    <a
                      href="https://maps.google.com/?q=RSJ+Tampan+Pekanbaru"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn w-100 btn-sm fw-semibold ${darkMode ? "btn-outline-light" : "btn-outline-dark"}`}
                    >
                      🗺️ Buka Peta Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOGIN VIEW */}
        {currentView === "login" && (
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-md-5">
                <div className={`p-4 shadow-lg rounded-3 ${cardBg}`}>
                  <div className="text-center mb-4">
                    <div className="fs-1">🔒</div>
                    <h4 className="fw-bold">Login Petugas RSJ</h4>
                  </div>
                  {authError && (
                    <div className="alert alert-danger py-2 small">
                      {authError}
                    </div>
                  )}
                  {authSuccess && (
                    <div className="alert alert-success py-2 small">
                      {authSuccess}
                    </div>
                  )}
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">
                        Username
                      </label>
                      <input
                        type="text"
                        className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                        required
                        value={authInput.username}
                        onChange={(e) =>
                          setAuthInput({
                            ...authInput,
                            username: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">
                        Password
                      </label>
                      <input
                        type="password"
                        className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                        required
                        value={authInput.password}
                        onChange={(e) =>
                          setAuthInput({
                            ...authInput,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-success w-100 fw-bold py-2 mb-3"
                    >
                      Masuk ke Sistem
                    </button>
                  </form>
                  <div className="text-center border-top pt-3">
                    <button
                      className="btn btn-link btn-sm p-0 fw-bold text-decoration-none text-primary"
                      onClick={() => setCurrentView("register")}
                    >
                      Daftar Akun Baru
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REGISTER VIEW */}
        {currentView === "register" && (
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-md-5">
                <div className={`p-4 shadow-lg rounded-3 ${cardBg}`}>
                  <div className="text-center mb-4">
                    <div className="fs-1">📝</div>
                    <h4 className="fw-bold">Registrasi Petugas Baru</h4>
                  </div>
                  {authError && (
                    <div className="alert alert-danger py-2 small">
                      {authError}
                    </div>
                  )}
                  {authSuccess && (
                    <div className="alert alert-success py-2 small">
                      {authSuccess}
                    </div>
                  )}
                  <form onSubmit={handleRegister}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                        required
                        value={authInput.nama}
                        onChange={(e) =>
                          setAuthInput({ ...authInput, nama: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">
                        Role
                      </label>
                      <select
                        className={`form-select ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                        value={authInput.role}
                        onChange={(e) =>
                          setAuthInput({ ...authInput, role: e.target.value })
                        }
                      >
                        <option value="Petugas Bangsal">Petugas Bangsal</option>
                        <option value="Petugas Apotek/Farmasi">
                          Petugas Apotek / Farmasi
                        </option>
                        <option value="Admin Logistik">
                          Admin Logistik Gudang
                        </option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">
                        Username Baru
                      </label>
                      <input
                        type="text"
                        className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                        required
                        value={authInput.username}
                        onChange={(e) =>
                          setAuthInput({
                            ...authInput,
                            username: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">
                        Password
                      </label>
                      <input
                        type="password"
                        className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                        required
                        value={authInput.password}
                        onChange={(e) =>
                          setAuthInput({
                            ...authInput,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100 fw-bold py-2 mb-3"
                    >
                      Daftarkan Petugas
                    </button>
                  </form>
                  <div className="text-center border-top pt-3">
                    <button
                      className="btn btn-link btn-sm p-0 fw-bold text-decoration-none text-primary"
                      onClick={() => setCurrentView("login")}
                    >
                      Kembali ke Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN VIEW */}
        {currentView === "admin" && (
          <div className="container py-4">
            {/* TAB INVENTARIS */}
            {activeTab === "inventaris" && (
              <>
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div
                      className={`p-3 d-flex align-items-center gap-3 rounded-3 ${cardBg}`}
                    >
                      <div className="p-3 bg-primary bg-opacity-25 text-primary rounded-3 fs-3">
                        📦
                      </div>
                      <div>
                        <span className="small fw-semibold opacity-75">
                          Total Jenis Barang
                        </span>
                        <h3 className="mb-0 fw-bold">
                          {totalJenisBarang}{" "}
                          <span className="fs-6 fw-normal">Item</span>
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div
                      className={`p-3 d-flex align-items-center gap-3 rounded-3 ${cardBg}`}
                    >
                      <div className="p-3 bg-success bg-opacity-25 text-success rounded-3 fs-3">
                        ✅
                      </div>
                      <div>
                        <span className="small fw-semibold opacity-75">
                          Kondisi Layak (Bagus)
                        </span>
                        <h3 className="mb-0 fw-bold text-success">
                          {barangBagusCount}{" "}
                          <span className="fs-6 fw-normal">Item</span>
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div
                      className={`p-3 d-flex align-items-center gap-3 rounded-3 ${cardBg}`}
                    >
                      <div className="p-3 bg-danger bg-opacity-25 text-danger rounded-3 fs-3">
                        ❌
                      </div>
                      <div>
                        <span className="small fw-semibold opacity-75">
                          Barang Rusak / Afkir
                        </span>
                        <h3 className="mb-0 fw-bold text-danger">
                          {barangRusakCount}{" "}
                          <span className="fs-6 fw-normal">Item</span>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="mb-0 fw-bold">Daftar Inventaris Barang</h6>
                    <span className="badge bg-secondary rounded-pill">
                      {filteredInventory.length} Data
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <select
                      className={`form-select form-select-sm ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      value={conditionFilter}
                      onChange={(e) => setConditionFilter(e.target.value)}
                    >
                      <option value="semua">🔍 Semua Kondisi</option>
                      <option value="Bagus">✅ Kondisi Bagus</option>
                      <option value="Rusak">❌ Barang Rusak</option>
                    </select>

                    <input
                      type="text"
                      className={`form-control form-control-sm ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      placeholder="Cari barang..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ minWidth: "180px" }}
                    />
                    <button
                      className="btn btn-sm btn-success fw-semibold px-3"
                      onClick={() => setShowAddModal(true)}
                    >
                      + Tambah Barang
                    </button>
                  </div>
                </div>

                <div className="table-responsive rounded-3 shadow-sm border mb-5">
                  <table className={`table ${tableTheme} align-middle mb-0`}>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Kode ID</th>
                        <th>Nama Barang</th>
                        <th>Kategori</th>
                        <th>Jumlah Stok</th>
                        <th>Kondisi Barang</th>
                        <th className="text-end pe-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInventory.length > 0 ? (
                        filteredInventory.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>
                              <code>{item.id}</code>
                            </td>
                            <td className="fw-bold">{item.nama}</td>
                            <td>
                              <span className="badge bg-secondary">
                                {item.kategori}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge ${item.stok < 50 ? "bg-warning text-dark" : "bg-info text-dark"}`}
                              >
                                {item.stok} {item.satuan}
                              </span>
                            </td>
                            <td>
                              {item.kondisi === "Bagus" ? (
                                <span className="badge bg-success">
                                  ✅ Bagus
                                </span>
                              ) : (
                                <span className="badge bg-danger">
                                  ❌ Rusak
                                </span>
                              )}
                            </td>
                            <td className="text-end pe-4">
                              <button
                                className="btn btn-sm btn-warning text-dark me-2"
                                onClick={() => handleOpenOutModal(item)}
                              >
                                📤 Keluar
                              </button>
                              <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => handleOpenEdit(item)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(item.id, item.nama)}
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="text-center py-4 opacity-75"
                          >
                            Data barang tidak ditemukan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* TAB LAPORAN */}
            {activeTab === "laporan" && (
              <div className="mb-5">
                <div
                  className={`p-3 mb-4 rounded-3 d-flex flex-wrap align-items-center justify-content-between gap-3 ${cardBg}`}
                >
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="mb-0 fw-bold">📅 Periode Laporan:</h6>
                    <input
                      type="date"
                      className={`form-control form-control-sm ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      defaultValue="2026-08-01"
                    />
                    <span className="small opacity-75">s/d</span>
                    <input
                      type="date"
                      className={`form-control form-control-sm ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      defaultValue="2026-08-20"
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary fw-semibold"
                      onClick={() => window.print()}
                    >
                      🖨️ Cetak PDF
                    </button>
                    <button
                      className="btn btn-sm btn-success fw-semibold"
                      onClick={() =>
                        alert("Laporan berhasil di-export ke Excel!")
                      }
                    >
                      📥 Export Excel
                    </button>
                  </div>
                </div>

                <div className="table-responsive rounded-3 shadow-sm border">
                  <table className={`table ${tableTheme} align-middle mb-0`}>
                    <thead>
                      <tr>
                        <th>Tanggal</th>
                        <th>Kode Barang</th>
                        <th>Nama Barang</th>
                        <th>Jenis Mutasi</th>
                        <th>Jumlah</th>
                        <th>Tujuan / Asal Pengadaan</th>
                        <th>Petugas Input</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mutations.map((item) => (
                        <tr key={item.id}>
                          <td className="small opacity-75">{item.tanggal}</td>
                          <td>
                            <code>{item.kode}</code>
                          </td>
                          <td className="fw-bold">{item.nama}</td>
                          <td>
                            {item.jenis === "Masuk" ? (
                              <span className="badge bg-success">Masuk</span>
                            ) : (
                              <span className="badge bg-danger">Keluar</span>
                            )}
                          </td>
                          <td
                            className={`fw-bold ${item.jenis === "Masuk" ? "text-success" : "text-danger"}`}
                          >
                            {item.jenis === "Masuk" ? "+" : "-"} {item.jumlah}{" "}
                            {item.satuan}
                          </td>
                          <td>
                            <span className="small opacity-75">
                              {item.asalTujuan}
                            </span>
                          </td>
                          <td>
                            <small className="fw-semibold opacity-75">
                              {item.petugas}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: TAMBAH BARANG */}
      {showAddModal && (
        <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`modal-content border-0 shadow-lg rounded-3 ${cardBg}`}
            >
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  Tambah Inventaris / Barang Masuk
                </h5>
                <button
                  type="button"
                  className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="modal-body py-3">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Nama Barang / Obat
                    </label>
                    <input
                      type="text"
                      className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      required
                      value={newItem.nama}
                      onChange={(e) =>
                        setNewItem({ ...newItem, nama: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Kategori Barang
                    </label>
                    <select
                      className={`form-select ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      value={newItem.kategori}
                      onChange={(e) =>
                        setNewItem({ ...newItem, kategori: e.target.value })
                      }
                    >
                      <option value="Alat Medis">Alat Medis</option>
                      <option value="Obat Farmasi">Obat Farmasi</option>
                      <option value="ATK">ATK</option>
                      <option value="Bahan Habis Pakai">
                        Bahan Habis Pakai
                      </option>
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-semibold">
                        Jumlah Stok Awal
                      </label>
                      <input
                        type="number"
                        className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                        required
                        value={newItem.stok}
                        onChange={(e) =>
                          setNewItem({ ...newItem, stok: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-semibold">
                        Satuan Unit
                      </label>
                      <input
                        type="text"
                        className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                        value={newItem.satuan}
                        onChange={(e) =>
                          setNewItem({ ...newItem, satuan: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Kondisi Barang
                    </label>
                    <select
                      className={`form-select ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      value={newItem.kondisi}
                      onChange={(e) =>
                        setNewItem({ ...newItem, kondisi: e.target.value })
                      }
                    >
                      <option value="Bagus">✅ Bagus (Siap Pakai)</option>
                      <option value="Rusak">
                        ❌ Rusak (Tidak Bisa Dipakai)
                      </option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-success px-4">
                    Simpan Data
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: KELUAR BARANG */}
      {showOutModal && outItem.item && (
        <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`modal-content border-0 shadow-lg rounded-3 ${cardBg}`}
            >
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-danger">
                  📤 Catat Barang Keluar
                </h5>
                <button
                  type="button"
                  className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
                  onClick={() => setShowOutModal(false)}
                ></button>
              </div>
              <form onSubmit={handleOutSubmit}>
                <div className="modal-body py-3">
                  <div
                    className={`p-2 rounded mb-3 border ${darkMode ? "bg-dark border-secondary" : "bg-light"}`}
                  >
                    <small className="opacity-75 d-block">
                      Barang terpilih:
                    </small>
                    <strong>
                      {outItem.item.nama} ({outItem.item.id})
                    </strong>
                    <div className="small opacity-75 mt-1">
                      Sisa stok saat ini:{" "}
                      <b>
                        {outItem.item.stok} {outItem.item.satuan}
                      </b>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Jumlah Barang Keluar
                    </label>
                    <input
                      type="number"
                      className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      min="1"
                      max={outItem.item.stok}
                      required
                      value={outItem.jumlahOut}
                      onChange={(e) =>
                        setOutItem({ ...outItem, jumlahOut: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Tujuan Distribusi
                    </label>
                    <select
                      className={`form-select ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      value={outItem.tujuan}
                      onChange={(e) =>
                        setOutItem({ ...outItem, tujuan: e.target.value })
                      }
                    >
                      <option value="Bangsal Psychiatric Akut">
                        Bangsal Psychiatric Akut
                      </option>
                      <option value="Poliklinik Jiwa Child & Adolescent">
                        Poliklinik Jiwa Child & Adolescent
                      </option>
                      <option value="Apotek & Farmasi RSJ">
                        Apotek & Farmasi RSJ
                      </option>
                      <option value="Instalasi Gawat Darurat (IGD)">
                        Instalasi Gawat Darurat (IGD)
                      </option>
                      <option value="Afkir / Disposisi Barang Rusak">
                        Afkir / Disposisi Barang Rusak
                      </option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowOutModal(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning fw-bold px-4"
                  >
                    Proses Keluar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT BARANG */}
      {showEditModal && editingItem && (
        <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`modal-content border-0 shadow-lg rounded-3 ${cardBg}`}
            >
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  Edit Data Barang ({editingItem.id})
                </h5>
                <button
                  type="button"
                  className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body py-3">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Nama Barang / Obat
                    </label>
                    <input
                      type="text"
                      className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      required
                      value={editingItem.nama}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, nama: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Kategori Barang
                    </label>
                    <select
                      className={`form-select ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      value={editingItem.kategori}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          kategori: e.target.value,
                        })
                      }
                    >
                      <option value="Alat Medis">Alat Medis</option>
                      <option value="Obat Farmasi">Obat Farmasi</option>
                      <option value="ATK">ATK</option>
                      <option value="Bahan Habis Pakai">
                        Bahan Habis Pakai
                      </option>
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-semibold">
                        Jumlah Stok
                      </label>
                      <input
                        type="number"
                        className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                        required
                        value={editingItem.stok}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            stok: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-semibold">
                        Satuan Unit
                      </label>
                      <input
                        type="text"
                        className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                        value={editingItem.satuan}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            satuan: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Kondisi Barang
                    </label>
                    <select
                      className={`form-select ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      value={editingItem.kondisi}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          kondisi: e.target.value,
                        })
                      }
                    >
                      <option value="Bagus">✅ Bagus (Siap Pakai)</option>
                      <option value="Rusak">
                        ❌ Rusak (Tidak Bisa Dipakai)
                      </option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer
        className={`text-center py-4 border-top fs-7 mt-auto ${darkMode ? "bg-black text-light border-secondary" : "bg-white text-muted"}`}
      >
        <div className="container">
          <p className="mb-1">
            <b>Rumah Sakit Jiwa Tampan Provinsi Riau</b>
          </p>
          <small>
            © 2026 RSJ Tampan Pekanbaru Riau | SIM-RS Logistik Inventaris
            Terpadu
          </small>
        </div>
      </footer>
    </div>
  );
}

export default App;
