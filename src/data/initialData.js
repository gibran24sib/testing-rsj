export const initialUsers = [
  {
    nama: "Admin Utama",
    username: "admin",
    password: "123",
    role: "Super Admin",
  },
];

export const initialInventory = [
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
];

export const initialMutations = [
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
];

export const categoryOptions = [
  "Alat Medis",
  "Obat Farmasi",
  "ATK",
  "Bahan Habis Pakai",
];

export const distributionDestinationOptions = [
  "Bangsal Psychiatric Akut",
  "Poliklinik Jiwa Child & Adolescent",
  "Apotek & Farmasi RSJ",
  "Instalasi Gawat Darurat (IGD)",
  "Afkir / Disposisi Barang Rusak",
];
