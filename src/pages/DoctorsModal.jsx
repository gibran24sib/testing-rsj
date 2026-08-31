import React from "react";
import { doctorsList } from "../data/doctorsData";

export default function DoctorsModal({ show, onClose, darkMode, cardBg }) {
  if (!show) return null;

  return (
    <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className={`modal-content border-0 shadow-lg rounded-3 ${cardBg}`}>
          <div className="modal-header border-0 pb-0">
            <div>
              <span className="badge badge-soft-success mb-1">
                Poliklinik Rawat Jalan RSJ Tampan
              </span>
              <h5 className="modal-title fw-bold">
                👨‍⚕️ Jadwal Dokter Spesialis Kejiwaan (Sp.KJ) & Psikolog
              </h5>
            </div>
            <button
              type="button"
              className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body py-3">
            <div className="row g-3">
              {doctorsList.map((doc) => (
                <div key={doc.id} className="col-md-6">
                  <div
                    className={`p-3 rounded-3 border h-100 ${
                      darkMode ? "bg-dark border-secondary" : "bg-light"
                    }`}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className="fw-bold text-primary mb-0">{doc.nama}</h6>
                      <span className="badge badge-soft-success small">
                        {doc.status}
                      </span>
                    </div>
                    <span className="badge badge-soft-secondary mb-2">
                      {doc.spesialisasi}
                    </span>
                    <p className="small mb-1 opacity-75">
                      <b>Ruangan:</b> {doc.ruangan}
                    </p>
                    <p className="small mb-2 fw-semibold text-success">
                      🕒 <b>Jadwal:</b> {doc.jadwal}
                    </p>
                    <small className="opacity-50 d-block font-monospace">
                      {doc.sip}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
            >
              Tutup
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm fw-semibold"
              onClick={() => {
                alert("Pendaftaran Poliklinik Rawat Jalan dapat dilakukan langsung di Loket RSJ Tampan atau via WhatsApp SIM-RS: 0812-3456-7890");
                onClose();
              }}
            >
              📋 Daftar Antrean Pasien
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
