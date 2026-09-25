import React, { useState, useEffect, useRef } from "react";

export default function SdmEmployeeModal({
  isOpen,
  mode = "view", // "view" | "add" | "edit"
  employee = null,
  onClose,
  onSave,
  darkMode,
}) {
  const adminPhotoInputRef = useRef(null);

  const [formData, setFormData] = useState({
    id: "",
    nip: "",
    nama: "",
    profesi: "Perawat Jiwa",
    kategori: "Keperawatan",
    jabatan: "",
    unitPenempatan: "Bangsal Kampar (Akut Pria)",
    statusKepegawaian: "PNS",
    golongan: "Penata (III/c)",
    pendidikan: "Profesi Ners",
    email: "",
    noHp: "",
    alamat: "",
    foto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
    tanggalBergabung: new Date().toISOString().split("T")[0],
    strNomor: "",
    strMasaBerlaku: "",
    strStatus: "Aktif",
    sipNomor: "",
    sipMasaBerlaku: "",
    sipStatus: "Aktif",
    sisaCuti: 12,
    skpSkor: 90.0,
    statusAktif: "Aktif",
  });

  useEffect(() => {
    if (employee && (mode === "edit" || mode === "view")) {
      setFormData({
        id: employee.id || "",
        nip: employee.nip || "",
        nama: employee.nama || "",
        profesi: employee.profesi || "Perawat Jiwa",
        kategori: employee.kategori || "Keperawatan",
        jabatan: employee.jabatan || "",
        unitPenempatan: employee.unitPenempatan || "",
        statusKepegawaian: employee.statusKepegawaian || "PNS",
        golongan: employee.golongan || "Penata (III/c)",
        pendidikan: employee.pendidikan || "",
        email: employee.email || "",
        noHp: employee.noHp || "",
        alamat: employee.alamat || "",
        foto: employee.foto || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
        tanggalBergabung: employee.tanggalBergabung || "",
        strNomor: employee.str?.nomor || "",
        strMasaBerlaku: employee.str?.masaBerlaku || "",
        strStatus: employee.str?.status || "Aktif",
        sipNomor: employee.sip?.nomor || "",
        sipMasaBerlaku: employee.sip?.masaBerlaku || "",
        sipStatus: employee.sip?.status || "Aktif",
        sisaCuti: employee.sisaCuti ?? 12,
        skpSkor: employee.skpSkor ?? 90.0,
        statusAktif: employee.statusAktif || "Aktif",
      });
    } else if (mode === "add") {
      setFormData({
        id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
        nip: "",
        nama: "",
        profesi: "Perawat Jiwa",
        kategori: "Keperawatan",
        jabatan: "",
        unitPenempatan: "Bangsal Kampar (Akut Pria)",
        statusKepegawaian: "PPPK",
        golongan: "Golongan X",
        pendidikan: "Profesi Ners",
        email: "",
        noHp: "",
        alamat: "Pekanbaru, Riau",
        foto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
        tanggalBergabung: new Date().toISOString().split("T")[0],
        strNomor: "STR-PPNI-14-" + Math.floor(1000 + Math.random() * 9000),
        strMasaBerlaku: "2028-12-31",
        strStatus: "Aktif",
        sipNomor: "SIPP-1471-" + Math.floor(1000 + Math.random() * 9000),
        sipMasaBerlaku: "2028-12-31",
        sipStatus: "Aktif",
        sisaCuti: 12,
        skpSkor: 90.0,
        statusAktif: "Aktif",
      });
    }
  }, [employee, mode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUploadFromFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Mohon pilih file gambar (JPG, PNG, WEBP, atau GIF).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran foto maksimal 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result;
      if (base64Url) {
        setFormData((prev) => ({ ...prev, foto: base64Url }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.nip) {
      alert("Mohon lengkapi Nama Pegawai dan NIP/NRK.");
      return;
    }

    const payload = {
      ...employee,
      id: formData.id,
      nip: formData.nip,
      nama: formData.nama,
      profesi: formData.profesi,
      kategori: formData.kategori,
      jabatan: formData.jabatan,
      unitPenempatan: formData.unitPenempatan,
      statusKepegawaian: formData.statusKepegawaian,
      golongan: formData.golongan,
      pendidikan: formData.pendidikan,
      email: formData.email,
      noHp: formData.noHp,
      alamat: formData.alamat,
      tanggalBergabung: formData.tanggalBergabung,
      str: {
        nomor: formData.strNomor || "-",
        masaBerlaku: formData.strMasaBerlaku || "-",
        status: formData.strStatus || "Aktif",
      },
      sip: {
        nomor: formData.sipNomor || "-",
        masaBerlaku: formData.sipMasaBerlaku || "-",
        status: formData.sipStatus || "Aktif",
      },
      sisaCuti: Number(formData.sisaCuti),
      skpSkor: Number(formData.skpSkor),
      statusAktif: formData.statusAktif,
      foto: formData.foto || employee?.foto || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
    };

    onSave(payload, mode);
    onClose();
  };

  const modalBg = darkMode ? "#111624" : "#ffffff";
  const modalText = darkMode ? "#ffffff" : "#0f172a";
  const inputBg = darkMode ? "#181d2e" : "#f8fafc";
  const inputBorder = darkMode ? "#26304d" : "#cbd5e1";
  const labelColor = darkMode ? "#94a3b8" : "#475569";

  return (
    <div
      className="modal-backdrop-custom d-flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(6px)",
        zIndex: 1060,
        padding: "1rem",
      }}
    >
      <div
        className="rounded-4 shadow-lg animate-scale-up"
        style={{
          backgroundColor: modalBg,
          color: modalText,
          width: "100%",
          maxWidth: "850px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          border: darkMode ? "1px solid #1e293b" : "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <div
          className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom"
          style={{ borderColor: darkMode ? "#1e293b" : "#e2e8f0" }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fs-5"
              style={{
                width: "42px",
                height: "42px",
                backgroundColor:
                  mode === "add"
                    ? "rgba(16, 185, 129, 0.15)"
                    : mode === "edit"
                    ? "rgba(59, 130, 246, 0.15)"
                    : "rgba(139, 92, 246, 0.15)",
                color:
                  mode === "add"
                    ? "#10b981"
                    : mode === "edit"
                    ? "#3b82f6"
                    : "#8b5cf6",
              }}
            >
              {mode === "add" ? "➕" : mode === "edit" ? "✏️" : "👤"}
            </div>
            <div>
              <h5 className="mb-0 fw-bold" style={{ fontSize: "1.1rem" }}>
                {mode === "add"
                  ? "Tambah Data Pegawai / Nakes Baru"
                  : mode === "edit"
                  ? `Edit Profil Pegawai: ${formData.nama}`
                  : `Detail Profil Pegawai: ${formData.nama}`}
              </h5>
              <small style={{ color: labelColor, fontSize: "0.8rem" }}>
                SIM-SDM Kepegawaian RS Jiwa Tampan Provinsi Riau
              </small>
            </div>
          </div>
          <button
            type="button"
            className="btn-close"
            style={{ filter: darkMode ? "invert(1)" : "none" }}
            onClick={onClose}
          />
        </div>

        {/* BODY */}
        <div className="p-4 overflow-y-auto" style={{ flex: 1 }}>
          {mode === "view" ? (
            /* VIEW MODE DETAIL */
            <div className="d-flex flex-column gap-4">
              <div
                className="d-flex flex-wrap align-items-center gap-4 p-3 rounded-3"
                style={{
                  backgroundColor: darkMode ? "#181f33" : "#f1f5f9",
                  border: darkMode ? "1px solid #232c45" : "1px solid #e2e8f0",
                }}
              >
                <img
                  src={employee?.foto || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150"}
                  alt={employee?.nama}
                  className="rounded-circle shadow-sm"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    border: "3px solid #10b981",
                  }}
                />
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                    <h5 className="fw-bold mb-0">{employee?.nama}</h5>
                    <span className="badge bg-primary rounded-pill px-2 py-1" style={{ fontSize: "0.72rem" }}>
                      {employee?.statusKepegawaian}
                    </span>
                    <span
                      className={`badge rounded-pill px-2 py-1 ${
                        employee?.statusAktif === "Aktif" ? "bg-success" : "bg-warning text-dark"
                      }`}
                    >
                      {employee?.statusAktif}
                    </span>
                  </div>
                  <p className="mb-0 small" style={{ color: labelColor }}>
                    NIP: {employee?.nip} &bull; {employee?.profesi} ({employee?.golongan})
                  </p>
                  <small className="d-block text-success fw-semibold mt-1">
                    📍 {employee?.unitPenempatan} &bull; {employee?.jabatan}
                  </small>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <div
                    className="p-3 rounded-3 h-100"
                    style={{
                      backgroundColor: darkMode ? "#141a29" : "#f8fafc",
                      border: darkMode ? "1px solid #1f273d" : "1px solid #e2e8f0",
                    }}
                  >
                    <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                      <span>🏥</span> Kualifikasi & Penempatan
                    </h6>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-2" style={{ fontSize: "0.85rem" }}>
                      <li>
                        <strong>Profesi:</strong> {employee?.profesi}
                      </li>
                      <li>
                        <strong>Kategori SDM:</strong> {employee?.kategori}
                      </li>
                      <li>
                        <strong>Pendidikan:</strong> {employee?.pendidikan}
                      </li>
                      <li>
                        <strong>TMT Bergabung:</strong> {employee?.tanggalBergabung}
                      </li>
                      <li>
                        <strong>Skor SKP Kinerja:</strong>{" "}
                        <span className="badge bg-info text-dark">{employee?.skpSkor} / 100</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="p-3 rounded-3 h-100"
                    style={{
                      backgroundColor: darkMode ? "#141a29" : "#f8fafc",
                      border: darkMode ? "1px solid #1f273d" : "1px solid #e2e8f0",
                    }}
                  >
                    <h6 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
                      <span>📜</span> Legalitas Medis (STR & SIP)
                    </h6>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-2" style={{ fontSize: "0.85rem" }}>
                      <li>
                        <strong>No. STR:</strong> {employee?.str?.nomor}
                      </li>
                      <li>
                        <strong>Masa Berlaku STR:</strong> {employee?.str?.masaBerlaku}{" "}
                        <span
                          className={`badge ms-1 ${
                            employee?.str?.status === "Aktif"
                              ? "bg-success"
                              : employee?.str?.status === "Mendekati Expired"
                              ? "bg-warning text-dark"
                              : "bg-danger"
                          }`}
                        >
                          {employee?.str?.status}
                        </span>
                      </li>
                      <li>
                        <strong>No. SIP / SIPP:</strong> {employee?.sip?.nomor}
                      </li>
                      <li>
                        <strong>Masa Berlaku SIP:</strong> {employee?.sip?.masaBerlaku}{" "}
                        <span
                          className={`badge ms-1 ${
                            employee?.sip?.status === "Aktif"
                              ? "bg-success"
                              : employee?.sip?.status === "Mendekati Expired"
                              ? "bg-warning text-dark"
                              : "bg-danger"
                          }`}
                        >
                          {employee?.sip?.status}
                        </span>
                      </li>
                      <li>
                        <strong>Sisa Kuota Cuti:</strong>{" "}
                        <span className="badge bg-secondary">{employee?.sisaCuti} Hari</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-12">
                  <div
                    className="p-3 rounded-3"
                    style={{
                      backgroundColor: darkMode ? "#141a29" : "#f8fafc",
                      border: darkMode ? "1px solid #1f273d" : "1px solid #e2e8f0",
                    }}
                  >
                    <h6 className="fw-bold text-info mb-3 d-flex align-items-center gap-2">
                      <span>📞</span> Kontak & Alamat Domisili
                    </h6>
                    <div className="row g-2" style={{ fontSize: "0.85rem" }}>
                      <div className="col-md-6">
                        <strong>Email Kedinasan:</strong> {employee?.email}
                      </div>
                      <div className="col-md-6">
                        <strong>No. WhatsApp/HP:</strong> {employee?.noHp}
                      </div>
                      <div className="col-12 mt-2">
                        <strong>Alamat Lengkap:</strong> {employee?.alamat}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* FORM ADD / EDIT */
            <form id="sdmEmployeeForm" onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              {/* UPLOAD FOTO PROFIL DARI FILE PERANGKAT */}
              <div
                className="p-3 rounded-3 border d-flex flex-wrap align-items-center justify-content-between gap-3"
                style={{
                  backgroundColor: darkMode ? "#181f33" : "#f1f5f9",
                  borderColor: inputBorder,
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={formData.foto}
                    alt="Preview Foto"
                    className="rounded-circle shadow-sm border border-2 border-success"
                    style={{ width: "65px", height: "65px", objectFit: "cover" }}
                  />
                  <div>
                    <strong className="d-block small" style={{ color: modalText }}>
                      Foto Profil Pegawai
                    </strong>
                    <small style={{ color: labelColor, fontSize: "0.75rem" }}>
                      Pilih file gambar dari komputer/HP (JPG, PNG, WEBP maks. 5MB)
                    </small>
                  </div>
                </div>

                <div>
                  <input
                    type="file"
                    ref={adminPhotoInputRef}
                    onChange={handlePhotoUploadFromFile}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 hover-lift fw-semibold"
                    onClick={() => adminPhotoInputRef.current?.click()}
                  >
                    <span>📁</span>
                    <span>Pilih Foto dari File</span>
                  </button>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Nama Lengkap & Gelar *
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: dr. Faisal Anwar, Sp.KJ"
                    className="form-control"
                    style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    NIP / NRK / NIK Pegawai *
                  </label>
                  <input
                    type="text"
                    name="nip"
                    value={formData.nip}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: 19850412 201001 1 002"
                    className="form-control"
                    style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Profesi Medis / Jabatan
                  </label>
                  <select
                    name="profesi"
                    value={formData.profesi}
                    onChange={handleChange}
                    className="form-select"
                    style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
                  >
                    <option value="Dokter Spesialis Jiwa">Dokter Spesialis Jiwa (Sp.KJ)</option>
                    <option value="Psikolog Klinis">Psikolog Klinis</option>
                    <option value="Perawat Spesialis Jiwa">Perawat Spesialis Jiwa (Sp.Kep.J)</option>
                    <option value="Perawat Jiwa">Perawat Jiwa (Ners / Pelaksana)</option>
                    <option value="Apoteker Farmasi Jiwa">Apoteker Farmasi Jiwa</option>
                    <option value="Perekam Medis">Perekam Medis (RMIK)</option>
                    <option value="Tenaga Administrasi & Kepegawaian">Tenaga Administrasi / HRD</option>
                    <option value="Security Khusus / Tim Pengamanan Krisis Jiwa">Security / Tim Respon Krisis</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Status Kepegawaian
                  </label>
                  <select
                    name="statusKepegawaian"
                    value={formData.statusKepegawaian}
                    onChange={handleChange}
                    className="form-select"
                    style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
                  >
                    <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                    <option value="PPPK">PPPK (P3K Tenaga Kesehatan)</option>
                    <option value="Kontrak BLUD">Pegawai Kontrak BLUD</option>
                    <option value="Mitra Klinis">Mitra Klinis / Dokter Tamu</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Golongan / Ruang
                  </label>
                  <input
                    type="text"
                    name="golongan"
                    value={formData.golongan}
                    onChange={handleChange}
                    placeholder="Contoh: Penata Tk. I (III/d)"
                    className="form-control"
                    style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Unit Penempatan Bangsal / Poli
                  </label>
                  <select
                    name="unitPenempatan"
                    value={formData.unitPenempatan}
                    onChange={handleChange}
                    className="form-select"
                    style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
                  >
                    <option value="Bangsal Kampar (Akut Pria)">Bangsal Kampar (Akut Pria)</option>
                    <option value="Bangsal Siak (Wanita)">Bangsal Siak (Wanita)</option>
                    <option value="Bangsal Rokan (Rehabilitasi NAPZA)">Bangsal Rokan (NAPZA)</option>
                    <option value="IGD Jiwa & Krisis 24 Jam">IGD Jiwa & Krisis 24 Jam</option>
                    <option value="Poliklinik Jiwa Dewasa & Lansia">Poliklinik Jiwa Dewasa & Lansia</option>
                    <option value="Klinik Psikologi & Visum Jiwa">Klinik Psikologi & Visum Jiwa</option>
                    <option value="Instalasi Farmasi Jiwa">Instalasi Farmasi Jiwa</option>
                    <option value="Subbag Kepegawaian & SDM">Subbag Kepegawaian & SDM</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Jabatan Struktural / Fungsional
                  </label>
                  <input
                    type="text"
                    name="jabatan"
                    value={formData.jabatan}
                    onChange={handleChange}
                    placeholder="Contoh: Kepala Ruangan Bangsal Kampar"
                    className="form-control"
                    style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Pendidikan Terakhir
                  </label>
                  <input
                    type="text"
                    name="pendidikan"
                    value={formData.pendidikan}
                    onChange={handleChange}
                    placeholder="Contoh: S1 Keperawatan + Profesi Ners"
                    className="form-control"
                    style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    TMT Tanggal Bergabung
                  </label>
                  <input
                    type="date"
                    name="tanggalBergabung"
                    value={formData.tanggalBergabung}
                    onChange={handleChange}
                    className="form-control"
                    style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    No. WhatsApp / HP Aktif
                  </label>
                  <input
                    type="text"
                    name="noHp"
                    value={formData.noHp}
                    onChange={handleChange}
                    placeholder="0812-xxxx-xxxx"
                    className="form-control"
                    style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Email Resmi Pegawai
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@rsjtampan.riau.go.id"
                    className="form-control"
                    style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
                  />
                </div>

                {/* STR & SIP FIELDS */}
                <div className="col-12 mt-3 pt-3 border-top" style={{ borderColor: darkMode ? "#1f273d" : "#e2e8f0" }}>
                  <h6 className="fw-bold text-success mb-2 small">📜 LEGALITAS STR & SIP IZIN PRAKTIK</h6>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Nomor STR
                  </label>
                  <input
                    type="text"
                    name="strNomor"
                    value={formData.strNomor}
                    onChange={handleChange}
                    placeholder="STR-KKI / STR-PPNI..."
                    className="form-control"
                    style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Masa Berlaku STR
                  </label>
                  <input
                    type="date"
                    name="strMasaBerlaku"
                    value={formData.strMasaBerlaku}
                    onChange={handleChange}
                    className="form-control"
                    style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Nomor SIP / SIPP
                  </label>
                  <input
                    type="text"
                    name="sipNomor"
                    value={formData.sipNomor}
                    onChange={handleChange}
                    placeholder="SIP.446/DS/RSJ-TPN/2024..."
                    className="form-control"
                    style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Masa Berlaku SIP
                  </label>
                  <input
                    type="date"
                    name="sipMasaBerlaku"
                    value={formData.sipMasaBerlaku}
                    onChange={handleChange}
                    className="form-control"
                    style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Alamat Lengkap Domisili
                  </label>
                  <textarea
                    rows={2}
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    placeholder="Alamat tempat tinggal pegawai di Pekanbaru..."
                    className="form-control"
                    style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        {/* FOOTER */}
        <div
          className="d-flex align-items-center justify-content-end gap-2 px-4 py-3 border-top"
          style={{ borderColor: darkMode ? "#1e293b" : "#e2e8f0" }}
        >
          <button type="button" className="btn btn-outline-secondary px-3" onClick={onClose}>
            {mode === "view" ? "Tutup" : "Batal"}
          </button>
          {mode !== "view" && (
            <button
              type="submit"
              form="sdmEmployeeForm"
              className="btn btn-success px-4 fw-bold shadow-sm hover-lift"
            >
              {mode === "add" ? "💾 Simpan Pegawai Baru" : "💾 Simpan Perubahan Profil"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
