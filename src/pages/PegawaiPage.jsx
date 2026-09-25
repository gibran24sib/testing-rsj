import React, { useState, useMemo, useRef, useEffect } from "react";
import { getEmployeeForUser } from "../utils/authHelpers";
import SdmLeaveLetterModal from "../components/SdmLeaveLetterModal";
import SdmIdCardModal from "../components/SdmIdCardModal";
import SdmShiftSwapModal from "../components/SdmShiftSwapModal";
import SdmCertificateModal from "../components/SdmCertificateModal";
import SdmLiveCameraPresensiModal from "../components/SdmLiveCameraPresensiModal";

export default function PegawaiPage({
  activeTab = "profil",
  setActiveTab,
  currentUser,
  employees = [],
  shiftRoster = [],
  leaveRequests = [],
  trainings = [],
  dossiersList = [],
  onSaveDossier,
  onUpdateEmployee,
  onSubmitLeave,
  darkMode,
  showToast,
  onOpenCommandPalette,
  onBackToPortal,
}) {
  // Hubungkan user saat ini dengan data master pegawai
  const matchedEmp = useMemo(() => {
    return getEmployeeForUser(currentUser, employees);
  }, [currentUser, employees]);

  // Data identitas pegawai aktif
  const employeeName = matchedEmp?.nama || currentUser?.nama || "Pegawai RSJ Tampan";
  const employeeNip = matchedEmp?.nip || currentUser?.nip || "19920817 201902 1 004";
  const employeeProfesi = matchedEmp?.profesi || currentUser?.role || "Perawat Pelaksana";
  const employeeJabatan = matchedEmp?.jabatan || matchedEmp?.profesi || currentUser?.role || "Staf Pelayanan RSJ Tampan";
  const employeeUnit = matchedEmp?.unitPenempatan || currentUser?.unit || "Bangsal Kampar (Akut Pria)";
  const employeeId = matchedEmp?.id || currentUser?.employeeId || "EMP-006";
  const employeeEmail = matchedEmp?.email || currentUser?.email || "pegawai@rsjtampan.riau.go.id";
  const employeeNoHp = matchedEmp?.noHp || "0812-7654-3210";
  const employeeAlamat = matchedEmp?.alamat || "Jl. HR Soebrantas Km. 12.5, Tampan, Pekanbaru";
  const employeePendidikan = matchedEmp?.pendidikan || "Profesi Ners (S.Kep., Ns)";
  const employeeStatusKepegawaian = matchedEmp?.statusKepegawaian || "PNS";
  const employeeGolongan = matchedEmp?.golongan || "Penata Muda (III/a)";
  const employeeTanggalBergabung = matchedEmp?.tanggalBergabung || "2019-02-01";
  const employeeSkpSkor = matchedEmp?.skpSkor || 94.2;
  const employeeFoto = matchedEmp?.foto || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80";
  const sisaCuti = matchedEmp?.sisaCuti !== undefined ? matchedEmp.sisaCuti : 12;

  // DOSSIER STATE PEGAWAI AKTIF
  const myDossier = useMemo(() => {
    const existing = dossiersList.find(
      (d) =>
        d.employeeId?.toLowerCase() === employeeId.toLowerCase() ||
        (d.nama && d.nama.toLowerCase().trim() === employeeName.toLowerCase().trim())
    );
    if (existing) return existing;
    return {
      employeeId: employeeId,
      nama: employeeName,
      persentaseLengkap: 60,
      dokumen: [
        { id: `DOC-${Date.now()}-1`, nama: "SK Pengangkatan Pegawai", tipe: "PDF", ukuran: "1.2 MB", tanggalUpload: "2024-01-10", status: "Terverifikasi" },
        { id: `DOC-${Date.now()}-2`, nama: "Ijazah & Transkrip Nilai Terakhir", tipe: "PDF", ukuran: "2.0 MB", tanggalUpload: "2024-01-10", status: "Terverifikasi" },
        { id: `DOC-${Date.now()}-3`, nama: "STR & SIP Tenaga Kesehatan", tipe: "PDF", ukuran: "850 KB", tanggalUpload: "2024-03-12", status: "Terverifikasi" },
      ],
    };
  }, [dossiersList, employeeId, employeeName]);

  const [myDocList, setMyDocList] = useState(myDossier.dokumen || []);
  useEffect(() => {
    if (myDossier.dokumen) {
      setMyDocList(myDossier.dokumen);
    }
  }, [myDossier]);

  // FORM UPLOAD BERKAS BARU
  const [docCategory, setDocCategory] = useState("SK Pengangkatan");
  const [docCustomTitle, setDocCustomTitle] = useState("");
  const [selectedUploadFile, setSelectedUploadFile] = useState(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const uploadFileInputRef = useRef(null);

  // REFS & STATES UNTUK UPLOAD FOTO PROFIL DARI FILE PERANGKAT
  const avatarDirectInputRef = useRef(null);
  const formPhotoInputRef = useRef(null);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  // FORM EDIT BIODATA MANDIRI
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    nama: employeeName,
    gelarDepan: matchedEmp?.gelarDepan || "",
    gelarBelakang: matchedEmp?.gelarBelakang || "",
    noHp: employeeNoHp,
    email: employeeEmail,
    alamat: employeeAlamat,
    pendidikan: employeePendidikan,
    foto: employeeFoto,
  });

  useEffect(() => {
    setProfileFormData({
      nama: employeeName,
      gelarDepan: matchedEmp?.gelarDepan || "",
      gelarBelakang: matchedEmp?.gelarBelakang || "",
      noHp: employeeNoHp,
      email: employeeEmail,
      alamat: employeeAlamat,
      pendidikan: employeePendidikan,
      foto: employeeFoto,
    });
  }, [employeeName, employeeNoHp, employeeEmail, employeeAlamat, employeePendidikan, employeeFoto, matchedEmp]);

  // UPLOAD FOTO PROFIL LANGSUNG DARI FILE KOMPUTER/HP (BASE64)
  const handleDirectAvatarUpload = (e) => {
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

    setIsPhotoUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result;
      if (base64Url) {
        setProfileFormData((prev) => ({ ...prev, foto: base64Url }));
        const updatedEmp = {
          ...(matchedEmp || {}),
          id: employeeId,
          nip: employeeNip,
          nama: profileFormData.nama || employeeName,
          foto: base64Url,
          profesi: employeeProfesi,
          jabatan: employeeJabatan,
          unitPenempatan: employeeUnit,
          statusKepegawaian: employeeStatusKepegawaian,
          golongan: employeeGolongan,
          email: profileFormData.email || employeeEmail,
          noHp: profileFormData.noHp || employeeNoHp,
          alamat: profileFormData.alamat || employeeAlamat,
          pendidikan: profileFormData.pendidikan || employeePendidikan,
          sisaCuti: sisaCuti,
          skpSkor: employeeSkpSkor,
          statusAktif: "Aktif",
        };
        onUpdateEmployee?.(updatedEmp);
        showToast?.("Foto Profil Diperbarui", "Foto profil Anda berhasil diunggah dari file perangkat.", "success");
      }
      setIsPhotoUploading(false);
    };
    reader.onerror = () => {
      alert("Gagal membaca file gambar.");
      setIsPhotoUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFormPhotoFileSelect = (e) => {
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
        setProfileFormData((prev) => ({ ...prev, foto: base64Url }));
        showToast?.("Foto Terpilih", "Foto profil baru siap disimpan bersama biodata.", "info");
      }
    };
    reader.readAsDataURL(file);
  };

  // FORM PENGAJUAN CUTI MANDIRI
  const [leaveFormData, setLeaveFormData] = useState({
    jenisCuti: "Cuti Tahunan",
    tanggalMulai: "",
    tanggalSelesai: "",
    jumlahHari: 1,
    alasan: "",
    petugasPengganti: "",
    catatanTambahan: "",
  });
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);

  // FORM PERPANJANGAN STR / SIP
  const [isRenewingLicense, setIsRenewingLicense] = useState(false);
  const [licenseFormData, setLicenseFormData] = useState({
    strNomor: matchedEmp?.str?.nomor || "STR-PPNI-1401-2023-0089",
    strMasaBerlaku: matchedEmp?.str?.masaBerlaku || "2027-12-31",
    sipNomor: matchedEmp?.sip?.nomor || "SIP.446/NRS/RSJ-TPN/2024",
    sipMasaBerlaku: matchedEmp?.sip?.masaBerlaku || "2027-12-31",
  });

  // MODALS STATE
  const [isLeaveLetterOpen, setIsLeaveLetterOpen] = useState(false);
  const [selectedLeaveForLetter, setSelectedLeaveForLetter] = useState(null);
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);
  const [isShiftSwapOpen, setIsShiftSwapOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [selectedTrainingForCert, setSelectedTrainingForCert] = useState(null);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [cameraPresensiType, setCameraPresensiType] = useState("Masuk");
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState(null);

  // PRESENSI MANDIRI STATE
  const [currentTimeStr, setCurrentTimeStr] = useState("");
  const [gpsStatus, setGpsStatus] = useState("Mendeteksi Lokasi GPS...");
  const [isPresensiDoneToday, setIsPresensiDoneToday] = useState(false);
  const [myAttendanceLogs, setMyAttendanceLogs] = useState([
    {
      id: "LOG-001",
      tanggal: new Date().toISOString().split("T")[0],
      shift: "Pagi (07:30 - 14:30 WIB)",
      jamMasuk: "07:22 WIB",
      jamPulang: "14:35 WIB",
      status: "Hadir Tepat Waktu",
      lokasi: "Radius 15m RSJ Tampan (Valid)",
      metode: "Kamera Langsung & GPS Live",
      fotoPresensi: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: "LOG-002",
      tanggal: "2026-09-24",
      shift: "Pagi (07:30 - 14:30 WIB)",
      jamMasuk: "07:18 WIB",
      jamPulang: "14:30 WIB",
      status: "Hadir Tepat Waktu",
      lokasi: "Radius 18m RSJ Tampan (Valid)",
      metode: "Kamera Langsung & GPS Live",
      fotoPresensi: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80",
    },
  ]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " WIB"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGpsStatus("Dalam Radius RSJ Tampan (18 Meter) • Sinyal Akurat");
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter Riwayat Cuti HANYA milik pegawai login
  const myLeaveRequests = useMemo(() => {
    const userNipClean = employeeNip.replace(/\s+/g, "");
    const userNameClean = employeeName.toLowerCase().trim();
    const userEmpIdClean = employeeId.toLowerCase().trim();

    return leaveRequests.filter((leave) => {
      if (leave.employeeId && leave.employeeId.toLowerCase() === userEmpIdClean) return true;
      if (leave.nip && leave.nip.replace(/\s+/g, "") === userNipClean) return true;
      if (leave.nama && leave.nama.toLowerCase().trim() === userNameClean) return true;
      if (currentUser?.username && leave.username === currentUser.username) return true;
      return false;
    });
  }, [leaveRequests, employeeNip, employeeName, employeeId, currentUser]);

  // Statistik Cuti
  const leaveStats = useMemo(() => {
    const approvedDays = myLeaveRequests
      .filter((l) => l.status === "Disetujui")
      .reduce((sum, l) => sum + (Number(l.jumlahHari) || 0), 0);
    const pendingCount = myLeaveRequests.filter((l) => l.status === "Menunggu Persetujuan").length;
    const approvedCount = myLeaveRequests.filter((l) => l.status === "Disetujui").length;
    const rejectedCount = myLeaveRequests.filter((l) => l.status === "Ditolak").length;

    return {
      totalHakCuti: 12,
      sisaCuti: sisaCuti,
      cutiTerpakai: approvedDays,
      pendingCount,
      approvedCount,
      rejectedCount,
      totalPengajuan: myLeaveRequests.length,
    };
  }, [myLeaveRequests, sisaCuti]);

  // =========================================================================
  // HANDLERS: E-BERKAS UPLOAD MANDIRI
  // =========================================================================
  const handleUploadFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedUploadFile(file);
      if (!docCustomTitle) {
        setDocCustomTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleExecuteUploadDoc = (e) => {
    e.preventDefault();
    if (!selectedUploadFile) {
      alert("Silakan pilih berkas dokumen dari perangkat Anda terlebih dahulu.");
      return;
    }

    setIsUploadingDoc(true);

    const sizeInKb = selectedUploadFile.size / 1024;
    const formattedSize =
      sizeInKb < 1024
        ? `${sizeInKb.toFixed(1)} KB`
        : `${(sizeInKb / 1024).toFixed(1)} MB`;

    const extension = selectedUploadFile.name.split(".").pop().toUpperCase() || "PDF";
    const displayName = docCustomTitle.trim() || `${docCategory} - ${selectedUploadFile.name}`;
    const fileBlobUrl = URL.createObjectURL(selectedUploadFile);

    const newDoc = {
      id: `DOC-${Date.now()}`,
      nama: displayName,
      kategori: docCategory,
      tipe: extension,
      ukuran: formattedSize,
      tanggalUpload: new Date().toISOString().split("T")[0],
      status: "Terverifikasi",
      fileUrl: fileBlobUrl,
      realFileName: selectedUploadFile.name,
    };

    const updatedDocs = [newDoc, ...myDocList];
    setMyDocList(updatedDocs);

    const newCompleteness = Math.min(100, Math.round((updatedDocs.length / 5) * 100));

    const updatedDossier = {
      ...myDossier,
      persentaseLengkap: newCompleteness,
      dokumen: updatedDocs,
    };

    onSaveDossier?.(updatedDossier);

    setSelectedUploadFile(null);
    setDocCustomTitle("");
    if (uploadFileInputRef.current) uploadFileInputRef.current.value = "";
    setIsUploadingDoc(false);

    showToast?.(
      "Berkas Terunggah",
      `Dokumen "${displayName}" berhasil ditambahkan ke e-Berkas Anda.`,
      "success"
    );
  };

  const handleDeleteMyDoc = (docIndex) => {
    if (window.confirm("Hapus dokumen ini dari arsip digital Anda?")) {
      const updatedDocs = myDocList.filter((_, idx) => idx !== docIndex);
      setMyDocList(updatedDocs);
      const newCompleteness = Math.min(100, Math.round((updatedDocs.length / 5) * 100));

      const updatedDossier = {
        ...myDossier,
        persentaseLengkap: newCompleteness,
        dokumen: updatedDocs,
      };

      onSaveDossier?.(updatedDossier);
      showToast?.("Berkas Dihapus", "Dokumen berhasil dihapus dari arsip Anda.", "info");
    }
  };

  const handleDownloadMyDoc = (doc) => {
    if (doc.fileUrl) {
      const a = document.createElement("a");
      a.href = doc.fileUrl;
      a.download = doc.realFileName || `${doc.nama}.${doc.tipe.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const dummyContent = `Dokumen Resmi Kepegawaian RSJ Tampan Riau\nNama Berkas: ${doc.nama}\nPegawai: ${employeeName}\nNIP: ${employeeNip}\nTgl Upload: ${doc.tanggalUpload}\nStatus: ${doc.status}`;
      const blob = new Blob([dummyContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.nama.replace(/[^a-zA-Z0-9_-]/g, "_")}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // =========================================================================
  // HANDLERS: DATA DIRI UPDATE
  // =========================================================================
  const handleSaveProfileData = (e) => {
    e.preventDefault();
    if (!profileFormData.nama.trim()) {
      alert("Nama lengkap tidak boleh kosong.");
      return;
    }

    const updatedEmp = {
      ...(matchedEmp || {}),
      id: employeeId,
      nip: employeeNip,
      nama: profileFormData.nama,
      gelarDepan: profileFormData.gelarDepan,
      gelarBelakang: profileFormData.gelarBelakang,
      noHp: profileFormData.noHp,
      email: profileFormData.email,
      alamat: profileFormData.alamat,
      pendidikan: profileFormData.pendidikan,
      foto: profileFormData.foto || employeeFoto,
      profesi: employeeProfesi,
      jabatan: employeeJabatan,
      unitPenempatan: employeeUnit,
      statusKepegawaian: employeeStatusKepegawaian,
      golongan: employeeGolongan,
      sisaCuti: sisaCuti,
      skpSkor: employeeSkpSkor,
      statusAktif: "Aktif",
    };

    onUpdateEmployee?.(updatedEmp);
    setIsEditingProfile(false);
    showToast?.("Data Diri Tersimpan", "Perubahan data diri Anda telah berhasil diperbarui.", "success");
  };

  // =========================================================================
  // HANDLERS: PENGAJUAN CUTI
  // =========================================================================
  const handleLeaveInputChange = (e) => {
    const { name, value } = e.target;
    setLeaveFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "tanggalMulai" || name === "tanggalSelesai") {
        if (updated.tanggalMulai && updated.tanggalSelesai) {
          const d1 = new Date(updated.tanggalMulai);
          const d2 = new Date(updated.tanggalSelesai);
          if (d2 >= d1) {
            const diffTime = Math.abs(d2 - d1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            updated.jumlahHari = isNaN(diffDays) || diffDays < 1 ? 1 : diffDays;
          } else {
            updated.jumlahHari = 1;
          }
        }
      }
      return updated;
    });
  };

  const handleExecuteSubmitLeave = (e) => {
    e.preventDefault();
    if (!leaveFormData.tanggalMulai || !leaveFormData.tanggalSelesai || !leaveFormData.alasan.trim()) {
      alert("Mohon lengkapi Tanggal Mulai, Selesai, dan Alasan Pengajuan.");
      return;
    }

    if (new Date(leaveFormData.tanggalSelesai) < new Date(leaveFormData.tanggalMulai)) {
      alert("Tanggal selesai cuti tidak boleh mendahului tanggal mulai.");
      return;
    }

    if (leaveFormData.jenisCuti === "Cuti Tahunan" && leaveFormData.jumlahHari > sisaCuti) {
      const confirmExceed = window.confirm(
        `Perhatian: Cuti yang diajukan (${leaveFormData.jumlahHari} hari) melebihi sisa cuti tahunan Anda (${sisaCuti} hari). Ajukan tetap?`
      );
      if (!confirmExceed) return;
    }

    setIsSubmittingLeave(true);

    const newLeave = {
      id: `CUTI-${Date.now().toString().slice(-4)}`,
      employeeId: employeeId,
      nip: employeeNip,
      nama: employeeName,
      unit: employeeUnit,
      profesi: employeeProfesi,
      jenisCuti: leaveFormData.jenisCuti,
      tanggalMulai: leaveFormData.tanggalMulai,
      tanggalSelesai: leaveFormData.tanggalSelesai,
      jumlahHari: Number(leaveFormData.jumlahHari) || 1,
      alasan: leaveFormData.alasan,
      petugasPengganti: leaveFormData.petugasPengganti || "Perawat Jaga Sejawat Bangsal",
      status: "Menunggu Persetujuan",
      tanggalPengajuan: new Date().toISOString().split("T")[0],
      disetujuiOleh: "-",
      catatan: "Menunggu verifikasi Kasubbag Kepegawaian & SDM.",
      nomorSurat: null,
    };

    onSubmitLeave?.(newLeave);

    setLeaveFormData({
      jenisCuti: "Cuti Tahunan",
      tanggalMulai: "",
      tanggalSelesai: "",
      jumlahHari: 1,
      alasan: "",
      petugasPengganti: "",
      catatanTambahan: "",
    });

    setIsSubmittingLeave(false);
    showToast?.("Pengajuan Terkirim", "Permohonan cuti Anda berhasil diajukan ke Subbag Kepegawaian.", "success");
  };

  // =========================================================================
  // HANDLERS: PRESENSI MANDIRI VIA KAMERA DEVICE LANGSUNG
  // =========================================================================
  const handleOpenLiveCamera = (jenis = "Masuk") => {
    setCameraPresensiType(jenis);
    setIsLiveCameraOpen(true);
  };

  const handleConfirmLiveAttendance = (attendanceRecord, tipe) => {
    setMyAttendanceLogs((prev) => [attendanceRecord, ...prev]);
    setIsPresensiDoneToday(true);
    showToast?.(
      "Presensi Berhasil",
      `Presensi ${tipe} dinas atas nama ${employeeName} dengan Swafoto Kamera Device & GPS Live berhasil direkam!`,
      "success"
    );
  };

  // =========================================================================
  // HANDLERS: RENEW STR / SIP
  // =========================================================================
  const handleSaveLicenseData = (e) => {
    e.preventDefault();
    const updatedEmp = {
      ...(matchedEmp || {}),
      id: employeeId,
      str: {
        nomor: licenseFormData.strNomor,
        masaBerlaku: licenseFormData.strMasaBerlaku,
        status: "Aktif",
      },
      sip: {
        nomor: licenseFormData.sipNomor,
        masaBerlaku: licenseFormData.sipMasaBerlaku,
        status: "Aktif",
      },
    };
    onUpdateEmployee?.(updatedEmp);
    setIsRenewingLicense(false);
    showToast?.("Izin Praktik Diperbarui", "Data masa berlaku STR & SIP berhasil diperbarui.", "success");
  };

  // UI THEME HELPERS
  const cardBg = darkMode ? "#111624" : "#ffffff";
  const cardBorder = darkMode ? "#1d253b" : "#e2e8f0";
  const textMuted = darkMode ? "#94a3b8" : "#64748b";
  const tableHeaderBg = darkMode ? "#161c2d" : "#f1f5f9";

  return (
    <div className="d-flex flex-column gap-4 animate-fade-in py-2">
      {/* 1. TOP HEADER GLASS PANEL */}
      <div
        className={`p-3 p-md-4 rounded-4 ${
          darkMode ? "glass-panel-dark" : "glass-panel"
        }`}
        style={{
          border: `1px solid ${cardBorder}`,
          backgroundColor: cardBg,
        }}
      >
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="position-relative">
              <img
                src={profileFormData.foto || employeeFoto}
                alt={employeeName}
                className="rounded-circle shadow-sm border border-2 border-success"
                style={{ width: "65px", height: "65px", objectFit: "cover" }}
              />
              <button
                type="button"
                onClick={() => avatarDirectInputRef.current?.click()}
                className="btn btn-sm btn-success rounded-circle position-absolute bottom-0 end-0 p-0 d-flex align-items-center justify-content-center hover-lift shadow"
                style={{ width: "24px", height: "24px", fontSize: "0.7rem", border: "2px solid #fff" }}
                title="Ganti foto profil langsung dari file"
              >
                📷
              </button>
            </div>

            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h4 className="fw-bold mb-0" style={{ letterSpacing: "-0.02em" }}>
                  {employeeName}
                </h4>
                <span className="badge rounded-pill bg-success" style={{ fontSize: "0.68rem" }}>
                  {employeeStatusKepegawaian}
                </span>
                <span className="badge rounded-pill badge-soft-primary" style={{ fontSize: "0.68rem" }}>
                  {employeeUnit}
                </span>
              </div>
              <small className="d-block" style={{ color: textMuted }}>
                NIP. {employeeNip} &bull; {employeeProfesi}
              </small>
            </div>
          </div>

          {/* QUICK ACTION BUTTONS */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button
              className="btn btn-sm btn-outline-success d-flex align-items-center gap-1 px-3 py-2 rounded-3 hover-lift"
              onClick={() => setIsIdCardOpen(true)}
              title="Lihat & Cetak ID Card Pegawai"
            >
              <span>🪪</span>
              <span>Cetak ID Card</span>
            </button>
            <button
              className="btn btn-sm btn-success d-flex align-items-center gap-1 px-3 py-2 rounded-3 hover-lift shadow-sm"
              onClick={() => setActiveTab("berkas")}
              title="Unggah Dokumen ke e-Berkas"
            >
              <span>📤</span>
              <span>Upload Berkas</span>
            </button>
            {onBackToPortal && (
              <button
                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 px-3 py-2 rounded-3 hover-lift"
                onClick={onBackToPortal}
                title="Kembali ke Portal Publik"
              >
                <span>🏥</span>
                <span className="d-none d-sm-inline">Portal Publik</span>
              </button>
            )}
          </div>
        </div>

        {/* QUICK STATS ROW */}
        <div className="row g-2 mt-3 pt-3 border-top" style={{ borderColor: cardBorder }}>
          <div className="col-6 col-md-3">
            <div className="p-2 rounded-3" style={{ backgroundColor: darkMode ? "#182035" : "#f1f5f9" }}>
              <small className="d-block text-muted" style={{ fontSize: "0.7rem" }}>Sisa Cuti Tahunan</small>
              <strong className="text-success fs-6">{sisaCuti} Hari</strong>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-2 rounded-3" style={{ backgroundColor: darkMode ? "#182035" : "#f1f5f9" }}>
              <small className="d-block text-muted" style={{ fontSize: "0.7rem" }}>Kelengkapan Berkas</small>
              <strong className="text-primary fs-6">{myDossier.persentaseLengkap || 85}% Lengkap</strong>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-2 rounded-3" style={{ backgroundColor: darkMode ? "#182035" : "#f1f5f9" }}>
              <small className="d-block text-muted" style={{ fontSize: "0.7rem" }}>Evaluasi SKP Kinerja</small>
              <strong className="text-purple fs-6" style={{ color: "#8b5cf6" }}>{employeeSkpSkor} (Sangat Baik)</strong>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-2 rounded-3" style={{ backgroundColor: darkMode ? "#182035" : "#f1f5f9" }}>
              <small className="d-block text-muted" style={{ fontSize: "0.7rem" }}>Legalitas STR & SIP</small>
              <strong className="text-success fs-6">Aktif s/d 2027</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DATA DIRI & PROFIL PEGAWAI                                         */}
      {/* ========================================================================= */}
      {activeTab === "profil" && (
        <div className="row g-4 animate-fade-in">
          {/* KOLOM KIRI: KARTU IDENTITAS VISUAL */}
          <div className="col-lg-5">
            <div
              className={`p-4 rounded-4 h-100 shadow-sm ${
                darkMode ? "glass-panel-dark" : "glass-panel"
              }`}
              style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <div className="text-center pb-3 border-bottom mb-3" style={{ borderColor: cardBorder }}>
                {/* AVATAR WITH DIRECT UPLOAD OVERLAY */}
                <div className="position-relative d-inline-block mb-3">
                  <img
                    src={profileFormData.foto || employeeFoto}
                    alt={employeeName}
                    className="rounded-circle shadow-md border border-3 border-success"
                    style={{ width: "115px", height: "115px", objectFit: "cover" }}
                  />
                  <input
                    type="file"
                    ref={avatarDirectInputRef}
                    onChange={handleDirectAvatarUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    onClick={() => avatarDirectInputRef.current?.click()}
                    className="btn btn-sm btn-success rounded-circle position-absolute bottom-0 end-0 p-1 shadow-sm hover-lift d-flex align-items-center justify-content-center"
                    style={{ width: "34px", height: "34px", border: "2px solid #fff" }}
                    title="Unggah Foto Profil dari File Perangkat"
                  >
                    {isPhotoUploading ? "⏳" : "📷"}
                  </button>
                </div>

                <h5 className="fw-bold mb-1">{employeeName}</h5>
                <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill mb-2">
                  {employeeProfesi}
                </span>
                <p className="small text-muted mb-0">{employeeJabatan}</p>

                <div className="mt-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-success p-0 text-decoration-none small fw-semibold"
                    onClick={() => avatarDirectInputRef.current?.click()}
                  >
                    📷 Ganti Foto Profil dari File
                  </button>
                </div>
              </div>

              <div className="d-flex flex-column gap-2 small">
                <div className="d-flex justify-content-between py-1 border-bottom" style={{ borderColor: cardBorder }}>
                  <span className="text-muted">Nomor Induk Pegawai (NIP)</span>
                  <strong className="text-end">{employeeNip}</strong>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom" style={{ borderColor: cardBorder }}>
                  <span className="text-muted">Unit Penempatan</span>
                  <strong className="text-end">{employeeUnit}</strong>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom" style={{ borderColor: cardBorder }}>
                  <span className="text-muted">Status Kepegawaian</span>
                  <strong className="text-end">{employeeStatusKepegawaian} ({employeeGolongan})</strong>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom" style={{ borderColor: cardBorder }}>
                  <span className="text-muted">Pendidikan Terakhir</span>
                  <strong className="text-end">{employeePendidikan}</strong>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom" style={{ borderColor: cardBorder }}>
                  <span className="text-muted">No. WhatsApp / HP</span>
                  <strong className="text-end text-success">{employeeNoHp}</strong>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom" style={{ borderColor: cardBorder }}>
                  <span className="text-muted">Email Resmi</span>
                  <strong className="text-end">{employeeEmail}</strong>
                </div>
                <div className="d-flex justify-content-between py-1" style={{ borderColor: cardBorder }}>
                  <span className="text-muted">Alamat Domisili</span>
                  <strong className="text-end">{employeeAlamat}</strong>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top d-flex gap-2" style={{ borderColor: cardBorder }}>
                <button
                  className="btn btn-outline-success w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 hover-lift"
                  onClick={() => setIsEditingProfile((prev) => !prev)}
                >
                  <span>✏️</span>
                  <span>{isEditingProfile ? "Tutup Form Edit" : "Edit Data Diri"}</span>
                </button>
                <button
                  className="btn btn-success w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 hover-lift"
                  onClick={() => setIsIdCardOpen(true)}
                >
                  <span>🪪</span>
                  <span>ID Card</span>
                </button>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: FORM EDIT DATA DIRI ATAU RINGKASAN AKTIVITAS */}
          <div className="col-lg-7">
            {isEditingProfile ? (
              <div
                className={`p-4 rounded-4 shadow-sm ${
                  darkMode ? "glass-panel-dark" : "glass-panel"
                }`}
                style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="fw-bold mb-0">✏️ Formulir Perbaruan Biodata Mandiri</h5>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    Batal
                  </button>
                </div>
                <p className="small text-muted mb-4">
                  Pastikan nomor telepon/WA, email, alamat domisili, dan foto profil resmi selalu diperbarui untuk kelengkapan administrasi SIM-SDM.
                </p>

                <form onSubmit={handleSaveProfileData} className="row g-3">
                  {/* UPLOAD FOTO PROFIL SECTION */}
                  <div className="col-md-12">
                    <label className="form-label small fw-semibold d-block">Foto Profil Pegawai</label>
                    <div
                      className="p-3 rounded-3 border d-flex flex-wrap align-items-center justify-content-between gap-3"
                      style={{
                        backgroundColor: darkMode ? "#182035" : "#f8fafc",
                        borderColor: cardBorder,
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={profileFormData.foto || employeeFoto}
                          alt="Preview Foto Profil"
                          className="rounded-circle border border-2 border-success shadow-sm"
                          style={{ width: "65px", height: "65px", objectFit: "cover" }}
                        />
                        <div>
                          <strong className="d-block small">Foto Profil Saat Ini</strong>
                          <small className="text-muted" style={{ fontSize: "0.72rem" }}>
                            Format file: JPG, PNG, WEBP (Maksimal 5 MB)
                          </small>
                        </div>
                      </div>

                      <div>
                        <input
                          type="file"
                          ref={formPhotoInputRef}
                          onChange={handleFormPhotoFileSelect}
                          accept="image/*"
                          style={{ display: "none" }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-success btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 hover-lift fw-semibold"
                          onClick={() => formPhotoInputRef.current?.click()}
                        >
                          <span>📁</span>
                          <span>Pilih Foto dari Perangkat</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label small fw-semibold">Nama Lengkap</label>
                    <input
                      type="text"
                      className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      value={profileFormData.nama}
                      onChange={(e) => setProfileFormData({ ...profileFormData, nama: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Gelar Depan</label>
                    <input
                      type="text"
                      className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      placeholder="Contoh: dr. / Ns. / apt."
                      value={profileFormData.gelarDepan}
                      onChange={(e) => setProfileFormData({ ...profileFormData, gelarDepan: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Gelar Belakang</label>
                    <input
                      type="text"
                      className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      placeholder="Contoh: S.Kep / Sp.KJ / M.Kep"
                      value={profileFormData.gelarBelakang}
                      onChange={(e) => setProfileFormData({ ...profileFormData, gelarBelakang: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">No. HP / WhatsApp Aktif</label>
                    <input
                      type="text"
                      className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      value={profileFormData.noHp}
                      onChange={(e) => setProfileFormData({ ...profileFormData, noHp: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Email Resmi / Pribadi</label>
                    <input
                      type="email"
                      className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      value={profileFormData.email}
                      onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label small fw-semibold">Pendidikan Terakhir & Institusi</label>
                    <input
                      type="text"
                      className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      value={profileFormData.pendidikan}
                      onChange={(e) => setProfileFormData({ ...profileFormData, pendidikan: e.target.value })}
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label small fw-semibold">Alamat Lengkap Domisili</label>
                    <textarea
                      rows={2}
                      className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      value={profileFormData.alamat}
                      onChange={(e) => setProfileFormData({ ...profileFormData, alamat: e.target.value })}
                    />
                  </div>

                  <div className="col-12 mt-4 d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-3"
                      onClick={() => setIsEditingProfile(false)}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success px-4 fw-bold hover-lift shadow-sm"
                    >
                      💾 Simpan Perubahan Data Diri
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {/* STATUS KEPATUHAN & AUDIT DOKUMEN */}
                <div
                  className={`p-4 rounded-4 shadow-sm ${
                    darkMode ? "glass-panel-dark" : "glass-panel"
                  }`}
                  style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
                >
                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <span>📋</span>
                    <span>Status Dokumen & Kepatuhan Kepegawaian</span>
                  </h6>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <div className="p-3 rounded-3 border" style={{ borderColor: cardBorder }}>
                        <small className="text-muted d-block mb-1">Status Legalitas STR</small>
                        <div className="d-flex align-items-center justify-content-between">
                          <strong className="text-success">Aktif s/d 2027</strong>
                          <span className="badge bg-success">Valid</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="p-3 rounded-3 border" style={{ borderColor: cardBorder }}>
                        <small className="text-muted d-block mb-1">Status Legalitas SIP</small>
                        <div className="d-flex align-items-center justify-content-between">
                          <strong className="text-success">Aktif s/d 2027</strong>
                          <span className="badge bg-success">Valid</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="p-3 rounded-3 border" style={{ borderColor: cardBorder }}>
                        <small className="text-muted d-block mb-1">Kredensialing & SPK/RKK</small>
                        <div className="d-flex align-items-center justify-content-between">
                          <strong>Perawat Klinis II (PK II)</strong>
                          <span className="badge bg-info text-dark">KARS</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="p-3 rounded-3 border" style={{ borderColor: cardBorder }}>
                        <small className="text-muted d-block mb-1">Insentif / TPP Bulan Ini</small>
                        <div className="d-flex align-items-center justify-content-between">
                          <strong className="text-success">Penuh (100%)</strong>
                          <span className="badge bg-success">Disiplin</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SHORTCUTS */}
                <div
                  className={`p-4 rounded-4 shadow-sm ${
                    darkMode ? "glass-panel-dark" : "glass-panel"
                  }`}
                  style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
                >
                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <span>⚡</span>
                    <span>Aksi Cepat Layanan Mandiri</span>
                  </h6>
                  <div className="row g-2">
                    <div className="col-sm-4">
                      <button
                        className="btn btn-outline-success w-100 p-3 rounded-3 text-start hover-lift"
                        onClick={() => setActiveTab("berkas")}
                      >
                        <div className="fs-5 mb-1">📁</div>
                        <div className="fw-bold small">Unggah Berkas</div>
                        <small className="text-muted" style={{ fontSize: "0.68rem" }}>Upload SK, STR, Ijazah</small>
                      </button>
                    </div>
                    <div className="col-sm-4">
                      <button
                        className="btn btn-outline-warning w-100 p-3 rounded-3 text-start hover-lift"
                        onClick={() => setActiveTab("cuti")}
                      >
                        <div className="fs-5 mb-1">🏖️</div>
                        <div className="fw-bold small text-dark">Ajukan Cuti</div>
                        <small className="text-muted" style={{ fontSize: "0.68rem" }}>Sisa kuota: {sisaCuti} hari</small>
                      </button>
                    </div>
                    <div className="col-sm-4">
                      <button
                        className="btn btn-outline-primary w-100 p-3 rounded-3 text-start hover-lift"
                        onClick={() => setActiveTab("presensi")}
                      >
                        <div className="fs-5 mb-1">⏱️</div>
                        <div className="fw-bold small">E-Presensi</div>
                        <small className="text-muted" style={{ fontSize: "0.68rem" }}>Check-in shift dinas</small>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: E-BERKAS & UPLOAD DOKUMEN DIGITAL MANDIRI                          */}
      {/* ========================================================================= */}
      {activeTab === "berkas" && (
        <div className="d-flex flex-column gap-4 animate-fade-in">
          {/* HEADER PERSENTASE KELENGKAPAN DOSSIER */}
          <div
            className={`p-4 rounded-4 shadow-sm ${
              darkMode ? "glass-panel-dark" : "glass-panel"
            }`}
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
              <div>
                <h5 className="fw-bold mb-1">📁 Arsip Digital Dokumen Pegawai (e-Dossier)</h5>
                <p className="small text-muted mb-0">
                  Unggah berkas resmi kepegawaian Anda seperti SK CPNS/PNS, Ijazah, STR, SIP, KTP, KK, dan Sertifikat Pelatihan.
                </p>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success-subtle text-success px-3 py-2 fs-6 rounded-pill">
                  {myDossier.persentaseLengkap || 85}% Lengkap
                </span>
              </div>
            </div>

            <div className="progress" style={{ height: "10px", backgroundColor: darkMode ? "#1c2438" : "#e2e8f0" }}>
              <div
                className="progress-bar bg-success progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `${myDossier.persentaseLengkap || 85}%` }}
                aria-valuenow={myDossier.persentaseLengkap || 85}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>

          <div className="row g-4">
            {/* FORM UPLOAD BERKAS BARU */}
            <div className="col-lg-5">
              <div
                className={`p-4 rounded-4 shadow-sm h-100 ${
                  darkMode ? "glass-panel-dark" : "glass-panel"
                }`}
                style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
              >
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <span>📤</span>
                  <span>Unggah Berkas Dokumen Baru</span>
                </h6>

                <form onSubmit={handleExecuteUploadDoc} className="d-flex flex-column gap-3">
                  <div>
                    <label className="form-label small fw-semibold">Kategori Dokumen</label>
                    <select
                      className={`form-select ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      value={docCategory}
                      onChange={(e) => setDocCategory(e.target.value)}
                    >
                      <option value="SK Pengangkatan">SK Pengangkatan (CPNS/PNS/PPPK/BLUD)</option>
                      <option value="Ijazah & Transkrip">Ijazah & Transkrip Nilai Terakhir</option>
                      <option value="STR Nakes">Surat Tanda Registrasi (STR)</option>
                      <option value="SIP Praktik">Surat Izin Praktik (SIP)</option>
                      <option value="KTP & Kartu Keluarga">KTP / Kartu Keluarga</option>
                      <option value="Sertifikat BTCLS / Jiwa">Sertifikat BTCLS / Pelatihan Jiwa</option>
                      <option value="SPK & RKK Kredensialing">Surat Penugasan Klinis (SPK/RKK)</option>
                      <option value="Pas Foto Resmi">Pas Foto Resmi 4x6</option>
                      <option value="Curriculum Vitae (CV)">Curriculum Vitae (CV)</option>
                      <option value="Dokumen Lainnya">Dokumen Tambahan Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label small fw-semibold">Nama / Judul Dokumen (Kustom)</label>
                    <input
                      type="text"
                      className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      placeholder="Contoh: Ijazah Profesi Ners FK UNRI"
                      value={docCustomTitle}
                      onChange={(e) => setDocCustomTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="form-label small fw-semibold">Pilih File dari Perangkat</label>
                    <input
                      type="file"
                      ref={uploadFileInputRef}
                      onChange={handleUploadFileChange}
                      className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      required
                    />
                    <small className="text-muted d-block mt-1" style={{ fontSize: "0.72rem" }}>
                      Mendukung format PDF, PNG, JPG, DOCX (Maksimal 10 MB).
                    </small>
                  </div>

                  {selectedUploadFile && (
                    <div className="p-3 rounded-3 bg-success-subtle text-success small border border-success-subtle">
                      <div className="fw-bold">📄 Berkas Terpilih:</div>
                      <div>{selectedUploadFile.name} ({(selectedUploadFile.size / 1024).toFixed(1)} KB)</div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isUploadingDoc || !selectedUploadFile}
                    className="btn btn-success w-100 fw-bold py-2 mt-2 hover-lift shadow-sm d-flex align-items-center justify-content-center gap-2"
                  >
                    {isUploadingDoc ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Mengunggah Berkas...</span>
                      </>
                    ) : (
                      <>
                        <span>💾</span>
                        <span>Unggah ke Arsip Saya</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* DAFTAR DOKUMEN TERUNGGAH */}
            <div className="col-lg-7">
              <div
                className={`p-4 rounded-4 shadow-sm h-100 ${
                  darkMode ? "glass-panel-dark" : "glass-panel"
                }`}
                style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <span>📑</span>
                    <span>Dokumen Digital Saya ({myDocList.length} Berkas)</span>
                  </h6>
                  <span className="badge badge-soft-success">Tersinkronisasi</span>
                </div>

                {myDocList.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <span className="fs-1 d-block mb-2">📂</span>
                    <p className="mb-0">Belum ada dokumen yang diunggah.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {myDocList.map((doc, idx) => (
                      <div
                        key={doc.id || idx}
                        className="p-3 rounded-3 d-flex align-items-center justify-content-between border hover-lift"
                        style={{
                          backgroundColor: darkMode ? "#151b2d" : "#f8fafc",
                          borderColor: cardBorder,
                        }}
                      >
                        <div className="d-flex align-items-center gap-3 overflow-hidden">
                          <div
                            className="rounded-3 d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{
                              width: "42px",
                              height: "42px",
                              backgroundColor: doc.tipe === "PDF" ? "#ef4444" : "#3b82f6",
                              fontSize: "0.75rem",
                              flexShrink: 0,
                            }}
                          >
                            {doc.tipe || "PDF"}
                          </div>
                          <div className="overflow-hidden">
                            <h6 className="mb-0 fw-semibold text-truncate" style={{ fontSize: "0.88rem" }} title={doc.nama}>
                              {doc.nama}
                            </h6>
                            <small className="text-muted d-block" style={{ fontSize: "0.72rem" }}>
                              {doc.ukuran || "1.2 MB"} &bull; Diunggah: {doc.tanggalUpload} &bull;{" "}
                              <span className="text-success fw-semibold">{doc.status || "Terverifikasi"}</span>
                            </small>
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-1 flex-shrink-0">
                          <button
                            className="btn btn-sm btn-outline-success p-1 px-2 rounded-2 hover-lift"
                            onClick={() => handleDownloadMyDoc(doc)}
                            title="Unduh / Preview Berkas"
                          >
                            📥 Unduh
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger p-1 px-2 rounded-2 hover-lift"
                            onClick={() => handleDeleteMyDoc(idx)}
                            title="Hapus Berkas"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PENGAJUAN & RIWAYAT CUTI MANDIRI                                   */}
      {/* ========================================================================= */}
      {activeTab === "cuti" && (
        <div className="d-flex flex-column gap-4 animate-fade-in">
          {/* STATISTIK KUOTA CUTI */}
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <div
                className="p-3 rounded-4 shadow-sm text-center"
                style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
              >
                <small className="text-muted d-block mb-1">Total Hak Cuti</small>
                <h4 className="fw-bold mb-0 text-success">12 Hari</h4>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div
                className="p-3 rounded-4 shadow-sm text-center"
                style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
              >
                <small className="text-muted d-block mb-1">Sisa Kuota Cuti</small>
                <h4 className="fw-bold mb-0 text-primary">{leaveStats.sisaCuti} Hari</h4>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div
                className="p-3 rounded-4 shadow-sm text-center"
                style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
              >
                <small className="text-muted d-block mb-1">Cuti Terpakai</small>
                <h4 className="fw-bold mb-0 text-info">{leaveStats.cutiTerpakai} Hari</h4>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div
                className="p-3 rounded-4 shadow-sm text-center"
                style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
              >
                <small className="text-muted d-block mb-1">Menunggu Approval</small>
                <h4 className="fw-bold mb-0 text-warning">{leaveStats.pendingCount} Pengajuan</h4>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* FORM PENGAJUAN CUTI */}
            <div className="col-lg-5">
              <div
                className={`p-4 rounded-4 shadow-sm h-100 ${
                  darkMode ? "glass-panel-dark" : "glass-panel"
                }`}
                style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
              >
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <span>🏖️</span>
                  <span>Formulir Permohonan Cuti Mandiri</span>
                </h6>

                <form onSubmit={handleExecuteSubmitLeave} className="d-flex flex-column gap-3">
                  <div>
                    <label className="form-label small fw-semibold">Jenis Cuti</label>
                    <select
                      name="jenisCuti"
                      className={`form-select ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      value={leaveFormData.jenisCuti}
                      onChange={handleLeaveInputChange}
                    >
                      <option value="Cuti Tahunan">Cuti Tahunan</option>
                      <option value="Cuti Sakit">Cuti Sakit (Lampirkan Surat Dokter)</option>
                      <option value="Cuti Alasan Penting">Cuti Alasan Penting (Keluarga Sakit/Menikah)</option>
                      <option value="Cuti Melahirkan">Cuti Melahirkan</option>
                      <option value="Cuti Besar">Cuti Besar (Masa Kerja &gt; 5 Tahun)</option>
                      <option value="Cuti Tugas Belajar">Cuti Tugas Belajar / Ujian Profesi</option>
                    </select>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Tanggal Mulai</label>
                      <input
                        type="date"
                        name="tanggalMulai"
                        className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                        value={leaveFormData.tanggalMulai}
                        onChange={handleLeaveInputChange}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Tanggal Selesai</label>
                      <input
                        type="date"
                        name="tanggalSelesai"
                        className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                        value={leaveFormData.tanggalSelesai}
                        onChange={handleLeaveInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="p-2 rounded-3 bg-primary-subtle text-primary small d-flex justify-content-between align-items-center">
                    <span>Durasi Permohonan:</span>
                    <strong>{leaveFormData.jumlahHari} Hari Kerja</strong>
                  </div>

                  <div>
                    <label className="form-label small fw-semibold">Petugas Pengganti (Handover Shift)</label>
                    <input
                      type="text"
                      name="petugasPengganti"
                      className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      placeholder="Contoh: Ns. Siti Rahmawati, S.Kep"
                      value={leaveFormData.petugasPengganti}
                      onChange={handleLeaveInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label small fw-semibold">Alasan Lengkap Pengajuan Cuti</label>
                    <textarea
                      rows={2}
                      name="alasan"
                      className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      placeholder="Tuliskan keperluan cuti..."
                      value={leaveFormData.alasan}
                      onChange={handleLeaveInputChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingLeave}
                    className="btn btn-success w-100 fw-bold py-2 mt-2 hover-lift shadow-sm d-flex align-items-center justify-content-center gap-2"
                  >
                    {isSubmittingLeave ? (
                      <span>Mengirim Permohonan...</span>
                    ) : (
                      <>
                        <span>📤</span>
                        <span>Kirim Permohonan Cuti</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* TABEL RIWAYAT CUTI PRIBADI */}
            <div className="col-lg-7">
              <div
                className={`p-4 rounded-4 shadow-sm h-100 ${
                  darkMode ? "glass-panel-dark" : "glass-panel"
                }`}
                style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <span>📜</span>
                    <span>Riwayat Pengajuan Cuti Saya ({myLeaveRequests.length})</span>
                  </h6>
                </div>

                {myLeaveRequests.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <span className="fs-1 d-block mb-2">🏖️</span>
                    <p className="mb-0">Belum ada riwayat permohonan cuti.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {myLeaveRequests.map((leave) => (
                      <div
                        key={leave.id}
                        className="p-3 rounded-3 border hover-lift"
                        style={{
                          backgroundColor: darkMode ? "#151b2d" : "#f8fafc",
                          borderColor: cardBorder,
                        }}
                      >
                        <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                          <div>
                            <span className="badge bg-secondary-subtle text-secondary me-2">{leave.id}</span>
                            <strong style={{ fontSize: "0.9rem" }}>{leave.jenisCuti}</strong>
                          </div>
                          <span
                            className={`badge rounded-pill ${
                              leave.status === "Disetujui"
                                ? "bg-success"
                                : leave.status === "Ditolak"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {leave.status}
                          </span>
                        </div>

                        <div className="small text-muted mb-2">
                          📅 {leave.tanggalMulai} s/d {leave.tanggalSelesai} ({leave.jumlahHari} Hari) &bull; Pengganti: {leave.petugasPengganti || "-"}
                        </div>

                        <p className="small mb-2 p-2 rounded-2" style={{ backgroundColor: darkMode ? "#1a2238" : "#eef2f6" }}>
                          <em>&ldquo;{leave.alasan}&rdquo;</em>
                        </p>

                        {leave.catatan && (
                          <div className="small text-muted mb-2">
                            <strong>Catatan:</strong> {leave.catatan}
                          </div>
                        )}

                        {leave.status === "Disetujui" && (
                          <div className="text-end">
                            <button
                              className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1 hover-lift"
                              onClick={() => {
                                setSelectedLeaveForLetter(leave);
                                setIsLeaveLetterOpen(true);
                              }}
                            >
                              <span>📄</span>
                              <span>Cetak Surat Izin Cuti Resmi</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: JADWAL SHIFT BANGSAL SAYA                                          */}
      {/* ========================================================================= */}
      {activeTab === "roster" && (
        <div className="d-flex flex-column gap-4 animate-fade-in">
          <div
            className={`p-4 rounded-4 shadow-sm ${
              darkMode ? "glass-panel-dark" : "glass-panel"
            }`}
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
              <div>
                <h5 className="fw-bold mb-1">📅 Roster & Jadwal Shift Jaga 24/7</h5>
                <p className="small text-muted mb-0">
                  Jadwal dinas Anda di {employeeUnit} (Shift Pagi: 07:30 - 14:30 | Sore: 14:30 - 21:00 | Malam: 21:00 - 07:30 WIB).
                </p>
              </div>
              <button
                className="btn btn-outline-primary d-flex align-items-center gap-1 hover-lift"
                onClick={() => setIsShiftSwapOpen(true)}
              >
                <span>🔄</span>
                <span>Ajukan Tukar Shift</span>
              </button>
            </div>

            {/* ROSTER TABLE SAMPLE */}
            <div className="table-responsive rounded-3 border" style={{ borderColor: cardBorder }}>
              <table className={`table table-hover mb-0 ${darkMode ? "table-dark" : "table-light"}`}>
                <thead style={{ backgroundColor: tableHeaderBg }}>
                  <tr>
                    <th>Hari & Tanggal</th>
                    <th>Shift Dinas</th>
                    <th>Jam Jaga</th>
                    <th>Bangsal / Ruangan</th>
                    <th>Rekan Shift</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Hari Ini (25 Sep 2026)</strong></td>
                    <td><span className="badge bg-success">Pagi</span></td>
                    <td>07:30 - 14:30 WIB</td>
                    <td>{employeeUnit}</td>
                    <td>Ns. Siti Rahmawati & Ns. Nurul Hidayah</td>
                    <td><span className="badge bg-success-subtle text-success">Bertugas</span></td>
                  </tr>
                  <tr>
                    <td>Sabtu, 26 Sep 2026</td>
                    <td><span className="badge bg-warning text-dark">Sore</span></td>
                    <td>14:30 - 21:00 WIB</td>
                    <td>{employeeUnit}</td>
                    <td>Dedi Kurniawan, S.Kep</td>
                    <td><span className="badge bg-secondary-subtle text-secondary">Terjadwal</span></td>
                  </tr>
                  <tr>
                    <td>Minggu, 27 Sep 2026</td>
                    <td><span className="badge bg-primary">Malam</span></td>
                    <td>21:00 - 07:30 WIB</td>
                    <td>{employeeUnit}</td>
                    <td>Rahmat Hidayat (Keamanan)</td>
                    <td><span className="badge bg-secondary-subtle text-secondary">Terjadwal</span></td>
                  </tr>
                  <tr>
                    <td>Senin, 28 Sep 2026</td>
                    <td><span className="badge bg-secondary">Off / Libur Shift</span></td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td><span className="badge bg-info text-dark">Libur Pasca Malam</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: E-PRESENSI SHIFT GEOLOCATION                                       */}
      {/* ========================================================================= */}
      {activeTab === "presensi" && (
        <div className="row g-4 animate-fade-in">
          {/* PANEL CHECK-IN LIVE VIA KAMERA */}
          <div className="col-lg-5">
            <div
              className={`p-4 rounded-4 shadow-sm text-center ${
                darkMode ? "glass-panel-dark" : "glass-panel"
              }`}
              style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <div className="badge bg-success px-3 py-2 fs-6 rounded-pill mb-3">
                ⏱️ LIVE WIB REALTIME
              </div>
              <h2 className="fw-bold mb-1" style={{ letterSpacing: "-0.03em" }}>
                {currentTimeStr || "07:30:00 WIB"}
              </h2>
              <small className="text-muted d-block mb-3">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </small>

              {/* GPS RADIUS BADGE */}
              <div className="p-3 rounded-3 bg-success-subtle text-success small border border-success-subtle mb-3 text-start">
                <div className="fw-bold d-flex align-items-center gap-1">
                  <span>📍</span>
                  <span>Verifikasi Lokasi & Geofencing GPS:</span>
                </div>
                <div className="mt-1">{gpsStatus}</div>
                <small className="text-muted d-block mt-1" style={{ fontSize: "0.72rem" }}>
                  Radius valid RSJ Tampan: Max 50 Meter
                </small>
              </div>

              {/* INFO KAMERA LANGSUNG */}
              <div
                className="p-2 rounded-3 mb-4 text-center border"
                style={{
                  backgroundColor: darkMode ? "#182035" : "#f1f5f9",
                  borderColor: cardBorder,
                  fontSize: "0.75rem",
                }}
              >
                <span>📷 Dilengkapi <strong>Swafoto Wajah Langsung (Webcam/Device Camera)</strong> + Watermark Resmi Geolocation</span>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-success w-100 py-3 fw-bold rounded-3 shadow-sm hover-lift d-flex flex-column align-items-center justify-content-center gap-1"
                  onClick={() => handleOpenLiveCamera("Masuk")}
                >
                  <span className="fs-3">📷</span>
                  <span className="fs-6">Presensi Masuk Shift</span>
                  <small style={{ fontSize: "0.68rem", opacity: 0.9 }}>Buka Kamera Device</small>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger w-100 py-3 fw-bold rounded-3 shadow-sm hover-lift d-flex flex-column align-items-center justify-content-center gap-1"
                  onClick={() => handleOpenLiveCamera("Pulang")}
                >
                  <span className="fs-3">🚪</span>
                  <span className="fs-6">Presensi Pulang Shift</span>
                  <small style={{ fontSize: "0.68rem", opacity: 0.9 }}>Buka Kamera Device</small>
                </button>
              </div>
            </div>
          </div>

          {/* LOG KEHADIRAN PRIBADI DENGAN THUMBNAIL FOTO */}
          <div className="col-lg-7">
            <div
              className={`p-4 rounded-4 shadow-sm h-100 ${
                darkMode ? "glass-panel-dark" : "glass-panel"
              }`}
              style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <span>⏱️</span>
                  <span>Log Presensi Shift Terkini Saya ({myAttendanceLogs.length})</span>
                </h6>
                <span className="badge badge-soft-success">Real-time Cloud Log</span>
              </div>

              <div className="d-flex flex-column gap-2">
                {myAttendanceLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-3 border d-flex align-items-center justify-content-between hover-lift gap-3"
                    style={{
                      backgroundColor: darkMode ? "#151b2d" : "#f8fafc",
                      borderColor: cardBorder,
                    }}
                  >
                    <div className="d-flex align-items-center gap-3 overflow-hidden">
                      {/* FOTO PRESENSI THUMBNAIL */}
                      {log.fotoPresensi ? (
                        <div
                          className="position-relative cursor-pointer flex-shrink-0"
                          onClick={() => setSelectedPhotoPreview(log)}
                          title="Klik untuk memperbesar foto presensi"
                        >
                          <img
                            src={log.fotoPresensi}
                            alt="Foto Presensi"
                            className="rounded-3 border border-2 border-success shadow-sm"
                            style={{ width: "52px", height: "52px", objectFit: "cover" }}
                          />
                          <span
                            className="position-absolute bottom-0 end-0 bg-dark text-white rounded-circle p-0 d-flex align-items-center justify-content-center"
                            style={{ width: "16px", height: "16px", fontSize: "0.55rem" }}
                          >
                            🔍
                          </span>
                        </div>
                      ) : (
                        <div
                          className="rounded-3 bg-secondary d-flex align-items-center justify-content-center text-white flex-shrink-0"
                          style={{ width: "52px", height: "52px", fontSize: "1.2rem" }}
                        >
                          📷
                        </div>
                      )}

                      <div className="overflow-hidden">
                        <strong className="d-block text-truncate" style={{ fontSize: "0.88rem" }}>
                          {log.shift}
                        </strong>
                        <small className="text-muted d-block" style={{ fontSize: "0.72rem" }}>
                          📅 {log.tanggal} &bull; 📍 {log.lokasi || log.lokasiGps || "RSJ Tampan"}
                        </small>
                        <small className="text-success fw-semibold" style={{ fontSize: "0.7rem" }}>
                          Metode: {log.metode || "Kamera Langsung & GPS"}
                        </small>
                      </div>
                    </div>

                    <div className="text-end flex-shrink-0">
                      <span className="badge bg-success mb-1 d-block">{log.status || log.statusKehadiran}</span>
                      <small className="text-muted d-block" style={{ fontSize: "0.72rem" }}>
                        In: {log.jamMasuk} | Out: {log.jamPulang}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: LEGALITAS STR & SIP SAYA                                           */}
      {/* ========================================================================= */}
      {activeTab === "legalitas" && (
        <div className="row g-4 animate-fade-in">
          <div className="col-lg-6">
            <div
              className={`p-4 rounded-4 shadow-sm ${
                darkMode ? "glass-panel-dark" : "glass-panel"
              }`}
              style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0">📜 Surat Tanda Registrasi (STR)</h6>
                <span className="badge bg-success">Aktif</span>
              </div>
              <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: darkMode ? "#182035" : "#f1f5f9" }}>
                <small className="text-muted d-block">Nomor Registrasi STR</small>
                <strong className="fs-6">{licenseFormData.strNomor}</strong>
                <div className="mt-2 text-success small fw-semibold">
                  Masa Berlaku s/d: {licenseFormData.strMasaBerlaku} (Status: Valid)
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div
              className={`p-4 rounded-4 shadow-sm ${
                darkMode ? "glass-panel-dark" : "glass-panel"
              }`}
              style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0">📑 Surat Izin Praktik (SIP)</h6>
                <span className="badge bg-success">Aktif</span>
              </div>
              <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: darkMode ? "#182035" : "#f1f5f9" }}>
                <small className="text-muted d-block">Nomor Izin Praktik SIP</small>
                <strong className="fs-6">{licenseFormData.sipNomor}</strong>
                <div className="mt-2 text-success small fw-semibold">
                  Masa Berlaku s/d: {licenseFormData.sipMasaBerlaku} (Dinkes Riau)
                </div>
              </div>
            </div>
          </div>

          {/* FORM UPDATE STR / SIP */}
          <div className="col-12">
            <div
              className={`p-4 rounded-4 shadow-sm ${
                darkMode ? "glass-panel-dark" : "glass-panel"
              }`}
              style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <span>🔄</span>
                <span>Pembaruan / Perpanjangan STR & SIP Mandiri</span>
              </h6>
              <form onSubmit={handleSaveLicenseData} className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Nomor STR Baru</label>
                  <input
                    type="text"
                    className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                    value={licenseFormData.strNomor}
                    onChange={(e) => setLicenseFormData({ ...licenseFormData, strNomor: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Masa Berlaku STR Baru</label>
                  <input
                    type="date"
                    className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                    value={licenseFormData.strMasaBerlaku}
                    onChange={(e) => setLicenseFormData({ ...licenseFormData, strMasaBerlaku: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Nomor SIP Baru</label>
                  <input
                    type="text"
                    className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                    value={licenseFormData.sipNomor}
                    onChange={(e) => setLicenseFormData({ ...licenseFormData, sipNomor: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Masa Berlaku SIP Baru</label>
                  <input
                    type="date"
                    className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                    value={licenseFormData.sipMasaBerlaku}
                    onChange={(e) => setLicenseFormData({ ...licenseFormData, sipNomor: e.target.value })}
                  />
                </div>
                <div className="col-12 text-end">
                  <button type="submit" className="btn btn-success px-4 fw-bold hover-lift">
                    💾 Simpan Perubahan STR / SIP
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: PELATIHAN & SERTIFIKAT JIWA SAYA                                   */}
      {/* ========================================================================= */}
      {activeTab === "diklat" && (
        <div className="d-flex flex-column gap-4 animate-fade-in">
          <div
            className={`p-4 rounded-4 shadow-sm ${
              darkMode ? "glass-panel-dark" : "glass-panel"
            }`}
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <h5 className="fw-bold mb-1">🎓 Sertifikat & Pelatihan Khusus Jiwa</h5>
            <p className="small text-muted mb-4">
              Daftar sertifikasi kompetensi penanganan kegawatdaruratan psikiatri, de-eskalasi agresi, dan restrain fisik aman berstandar KARS.
            </p>

            <div className="row g-3">
              {(trainings.length > 0 ? trainings : [
                {
                  id: "TRN-001",
                  judul: "Pelatihan Refreshment De-eskalasi Agresi & Manajemen Gaduh Gelisah",
                  tanggal: "15-18 Agustus 2026",
                  skp: 4,
                  penyelenggara: "Komite Keperawatan & Diklat RSJ Tampan",
                  status: "Lulus / Terbit Sertifikat",
                },
                {
                  id: "TRN-002",
                  judul: "Sertifikasi BTCLS Keperawatan Jiwa Akut & BHD",
                  tanggal: "10-14 Juni 2026",
                  skp: 5,
                  penyelenggara: "HIPGABI Riau & Kemenkes RI",
                  status: "Lulus / Terbit Sertifikat",
                },
                {
                  id: "TRN-003",
                  judul: "Workshop Asuhan Keperawatan Pasien Skizofrenia Fase Akut",
                  tanggal: "12-14 Mei 2026",
                  skp: 3,
                  penyelenggara: "IPKJI Riau",
                  status: "Lulus / Terbit Sertifikat",
                },
              ]).map((trn) => (
                <div key={trn.id} className="col-md-6">
                  <div
                    className="p-3 rounded-3 border h-100 d-flex flex-column justify-content-between hover-lift"
                    style={{
                      backgroundColor: darkMode ? "#151b2d" : "#f8fafc",
                      borderColor: cardBorder,
                    }}
                  >
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="badge bg-success">{trn.skp || 4} SKP Kemenkes</span>
                        <span className="badge bg-info text-dark">KARS Terakreditasi</span>
                      </div>
                      <h6 className="fw-bold mb-1">{trn.judul || trn.namaPelatihan}</h6>
                      <small className="text-muted d-block mb-2">
                        📅 {trn.tanggal || trn.periode} &bull; 🏛️ {trn.penyelenggara || "Diklat RSJ Tampan"}
                      </small>
                    </div>

                    <div className="mt-3 pt-2 border-top text-end" style={{ borderColor: cardBorder }}>
                      <button
                        className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1 hover-lift"
                        onClick={() => {
                          setSelectedTrainingForCert(trn);
                          setIsCertModalOpen(true);
                        }}
                      >
                        <span>📜</span>
                        <span>Lihat & Cetak e-Sertifikat</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS UNTUK FITUR PEGAWAI                                                */}
      {/* ========================================================================= */}
      <SdmLeaveLetterModal
        isOpen={isLeaveLetterOpen}
        onClose={() => setIsLeaveLetterOpen(false)}
        leave={selectedLeaveForLetter}
        darkMode={darkMode}
      />

      <SdmIdCardModal
        isOpen={isIdCardOpen}
        onClose={() => setIsIdCardOpen(false)}
        employee={matchedEmp || {
          id: employeeId,
          nip: employeeNip,
          nama: employeeName,
          profesi: employeeProfesi,
          unitPenempatan: employeeUnit,
          foto: profileFormData.foto || employeeFoto,
        }}
        darkMode={darkMode}
      />

      <SdmShiftSwapModal
        isOpen={isShiftSwapOpen}
        onClose={() => setIsShiftSwapOpen(false)}
        employees={employees}
        onSubmitSwap={(swap) => {
          showToast?.("Pengajuan Terkirim", "Permohonan tukar shift telah diajukan ke Kepala Ruangan.", "success");
        }}
        darkMode={darkMode}
      />

      <SdmCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        training={selectedTrainingForCert}
        employeeName={employeeName}
        darkMode={darkMode}
      />

      {/* MODAL KAMERA LANGSUNG DEVICE DENGAN GPS WATERMARK */}
      <SdmLiveCameraPresensiModal
        isOpen={isLiveCameraOpen}
        onClose={() => setIsLiveCameraOpen(false)}
        employeeName={employeeName}
        employeeUnit={employeeUnit}
        employeeProfesi={employeeProfesi}
        employeeId={employeeId}
        shift="Pagi (07:30 - 14:30 WIB)"
        tipe={cameraPresensiType}
        onConfirmAttendance={handleConfirmLiveAttendance}
        darkMode={darkMode}
      />

      {/* MODAL PREVIEW FOTO PRESENSI LENGKAP */}
      {selectedPhotoPreview && (
        <div
          className="modal-backdrop-custom d-flex align-items-center justify-content-center animate-fade-in"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 1100,
            padding: "1rem",
          }}
          onClick={() => setSelectedPhotoPreview(null)}
        >
          <div
            className="rounded-4 overflow-hidden shadow-2xl animate-scale-up"
            style={{
              maxWidth: "600px",
              width: "100%",
              backgroundColor: darkMode ? "#0c101a" : "#ffffff",
              border: `1px solid ${cardBorder}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between p-3 border-bottom" style={{ borderColor: cardBorder }}>
              <div className="d-flex align-items-center gap-2">
                <span>📸</span>
                <strong>Bukti Swafoto Presensi &bull; {selectedPhotoPreview.shift}</strong>
              </div>
              <button
                type="button"
                className="btn-close"
                style={{ filter: darkMode ? "invert(1)" : "none" }}
                onClick={() => setSelectedPhotoPreview(null)}
              />
            </div>
            <div className="p-3 text-center bg-black">
              <img
                src={selectedPhotoPreview.fotoPresensi}
                alt="Bukti Swafoto Presensi"
                className="img-fluid rounded-3 shadow"
                style={{ maxHeight: "70vh", objectFit: "contain" }}
              />
            </div>
            <div className="p-3 small border-top d-flex justify-content-between align-items-center" style={{ borderColor: cardBorder }}>
              <div>
                <span className="text-muted">Tanggal & Jam: </span>
                <strong>{selectedPhotoPreview.tanggal} &bull; {selectedPhotoPreview.jamMasuk}</strong>
              </div>
              <span className="badge bg-success">{selectedPhotoPreview.status || selectedPhotoPreview.statusKehadiran}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
