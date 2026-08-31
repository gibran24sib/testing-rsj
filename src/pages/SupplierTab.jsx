import React, { useState } from "react";
import { supplierList } from "../data/supplierData";

export default function SupplierTab({ darkMode, cardBg, tableTheme }) {
  const [search, setSearch] = useState("");

  const filteredSuppliers = supplierList.filter(
    (s) =>
      s.namaPerusahaan.toLowerCase().includes(search.toLowerCase()) ||
      s.kategori.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mb-5 animate-fade-in">
      {/* HEADER & PENCARIAN */}
      <div
        className="p-3 rounded-4 mb-3 d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-sm"
        style={{
          backgroundColor: darkMode ? "#0c101a" : "#ffffff",
          border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
        }}
      >
        <div>
          <h6 className="fw-bold mb-0">Direktori Rekanan Vendor PBF & Alkes</h6>
          <small className="opacity-75">
            Daftar distributor resmi penyedia pasokan farmasi & alat kesehatan RSJ Tampan
          </small>
        </div>

        <div className="d-flex gap-2">
          <input
            type="text"
            className={`form-control form-control-sm ${
              darkMode ? "bg-dark text-white border-secondary" : ""
            }`}
            placeholder="Cari vendor / pasokan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: "220px" }}
          />
          <button
            className="btn btn-sm btn-success fw-medium"
            onClick={() => alert("Form pengajuan rekanan vendor PBF baru.")}
          >
            + Tambah Rekanan
          </button>
        </div>
      </div>

      {/* TABEL SUPPLIER */}
      <div
        className="table-responsive rounded-4 shadow-sm"
        style={{
          border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
          backgroundColor: darkMode ? "#0c101a" : "#ffffff",
        }}
      >
        <table className={`table ${tableTheme} align-middle mb-0`}>
          <thead>
            <tr>
              <th style={{ width: "45px" }}>No</th>
              <th>Nama Perusahaan / PBF</th>
              <th>Kategori Pasokan</th>
              <th>Kontak Penanggung Jawab</th>
              <th>Alamat</th>
              <th>Status</th>
              <th className="text-end pe-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier, idx) => (
                <tr key={supplier.id}>
                  <td className="opacity-75">{idx + 1}</td>
                  <td>
                    <div className="fw-semibold">{supplier.namaPerusahaan}</div>
                    <small className="opacity-50">{supplier.email}</small>
                  </td>
                  <td>
                    <span className="badge badge-soft-secondary">
                      {supplier.kategori}
                    </span>
                  </td>
                  <td>
                    <span className="small">{supplier.kontakSales}</span>
                  </td>
                  <td className="small opacity-75">{supplier.alamat}</td>
                  <td>
                    <span className="badge badge-soft-success">
                      {supplier.statusKerjasama}
                    </span>
                  </td>
                  <td className="text-end pe-3">
                    <button
                      className="btn btn-sm btn-outline-primary py-1 px-2"
                      style={{ fontSize: "0.78rem" }}
                      onClick={() =>
                        alert(
                          `Hubungi ${supplier.namaPerusahaan}:\nEmail: ${supplier.email}\nKontak: ${supplier.kontakSales}`
                        )
                      }
                    >
                      Hubungi
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 opacity-50">
                  Vendor tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
