import React, { useState } from "react";

export default function MentalHealthScreening({ darkMode, cardBg, onConsultClick }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = [
    {
      id: "q1",
      question: "Apakah Anda sering merasa cemas, gelisah, atau tegang dalam 2 minggu terakhir?",
      category: "Kecemasan",
      icon: "⚡",
    },
    {
      id: "q2",
      question: "Apakah Anda mengalami kesulitan tidur (insomnia) atau terbangun di tengah malam dengan rasa resah?",
      category: "Kualitas Tidur",
      icon: "🌙",
    },
    {
      id: "q3",
      question: "Apakah Anda kehilangan minat atau kesenangan pada aktivitas yang biasanya Anda nikmati?",
      category: "Suasana Hati",
      icon: "🎯",
    },
    {
      id: "q4",
      question: "Apakah Anda mudah lelah atau merasa kekurangan energi meski tidak melakukan aktivitas berat?",
      category: "Vitalitas",
      icon: "🔋",
    },
    {
      id: "q5",
      question: "Apakah Anda merasa sulit berkonsentrasi saat bekerja, belajar, atau mengambil keputusan?",
      category: "Kognitif & Fokus",
      icon: "🧩",
    },
    {
      id: "q6",
      question: "Apakah Anda merasa kewalahan dengan beban pikiran hingga mempengaruhi interaksi sosial?",
      category: "Beban Emosional",
      icon: "🛡️",
    },
  ];

  const scoreOptions = [
    { label: "Tidak Pernah", value: 0, desc: "0 hari" },
    { label: "Beberapa Hari", value: 1, desc: "1-5 hari" },
    { label: "Lebih dari Separuh Waktu", value: 2, desc: "6-10 hari" },
    { label: "Hampir Setiap Hari", value: 3, desc: "11-14 hari" },
  ];

  const handleSelectAnswer = (value) => {
    const nextAnswers = { ...answers, [questions[currentStep].id]: value };
    setAnswers(nextAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsCompleted(false);
  };

  // Kalkulasi Skor Total (0 - 18)
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

  const getResultAnalysis = (score) => {
    if (score <= 4) {
      return {
        level: "Kondisi Mental Stabil & Sehat",
        badgeClass: "badge-soft-success",
        color: "#10b981",
        icon: "🌿",
        description:
          "Hasil menunjukkan tingkat stres dan kecemasan Anda berada pada rentang yang sangat baik dan terkontrol. Tetap pertahankan pola tidur teratur, olahraga, dan interaksi positif.",
        recommendation: "Pertahankan gaya hidup seimbang dan lakukan skrining berkala.",
      };
    } else if (score <= 9) {
      return {
        level: "Gejala Stres Ringan - Sedang",
        badgeClass: "badge-soft-warning",
        color: "#f59e0b",
        icon: "⛅",
        description:
          "Anda mengalami beberapa tekanan psikologis yang cukup mengganggu rutinitas harian. Hal ini wajar terjadi saat beban kerja atau masalah meningkat.",
        recommendation:
          "Disarankan meluangkan waktu relaksasi, bercerita dengan orang terdekat, atau konseling ringan bersama Psikolog Klinis RSJ Tampan.",
      };
    } else {
      return {
        level: "Perlu Pendampingan Profesional",
        badgeClass: "badge-soft-danger",
        color: "#f43f5e",
        icon: "🩺",
        description:
          "Hasil menunjukkan beban emosional dan kecemasan Anda memerlukan perhatian medis khusus. Jangan ragu untuk mencari bantuan ahli demi kenyamanan jiwa Anda.",
        recommendation:
          "Sangat dianjurkan untuk berkonsultasi dengan Dokter Spesialis Kedokteran Jiwa (Sp.KJ) atau Psikolog Klinis di Poliklinik RSJ Tampan.",
      };
    }
  };

  const result = getResultAnalysis(totalScore);
  const progressPercent = ((currentStep + (isCompleted ? 1 : 0)) / questions.length) * 100;

  return (
    <div
      className={`p-4 rounded-4 shadow-sm border ${
        darkMode ? "bg-dark-card border-secondary border-opacity-25" : "bg-white"
      }`}
    >
      {/* HEADER SKRINING */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-opacity-10">
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center fs-4"
            style={{
              width: "46px",
              height: "46px",
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              color: "#10b981",
            }}
          >
            🧠
          </div>
          <div>
            <h5 className="fw-bold mb-0">Skrining Mandiri Kesehatan Jiwa</h5>
            <small className="opacity-75">
              Instrumen evaluasi mandiri cepat & rahasia standar SIM-RS Tampan
            </small>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge badge-soft-info">
            {isCompleted ? "Hasil Siap" : `Langkah ${currentStep + 1} dari ${questions.length}`}
          </span>
          <span className="badge badge-soft-secondary">100% Rahasia</span>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="mb-4">
        <div
          className="progress"
          style={{ height: "6px", backgroundColor: darkMode ? "#1c2233" : "#e2e8f0" }}
        >
          <div
            className="progress-bar bg-success transition-all"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {!isCompleted ? (
        /* STEP-BY-STEP QUESTION VIEW */
        <div className="animate-fade-in py-2">
          <div className="mb-3">
            <span
              className="badge mb-2"
              style={{
                backgroundColor: darkMode ? "rgba(99, 102, 241, 0.15)" : "#eef2ff",
                color: "#6366f1",
              }}
            >
              {questions[currentStep].icon} Kategori: {questions[currentStep].category}
            </span>
            <h4
              className="fw-bold mb-4"
              style={{ lineHeight: "1.4", color: darkMode ? "#ffffff" : "#0f172a" }}
            >
              "{questions[currentStep].question}"
            </h4>
          </div>

          {/* OPSI PILIHAN JAWABAN */}
          <div className="row g-3 mb-4">
            {scoreOptions.map((opt) => (
              <div key={opt.value} className="col-md-6">
                <button
                  type="button"
                  onClick={() => handleSelectAnswer(opt.value)}
                  className="btn w-100 p-3 text-start d-flex align-items-center justify-content-between border rounded-3 transition-all"
                  style={{
                    backgroundColor: darkMode ? "#141824" : "#f8fafc",
                    borderColor: darkMode ? "#232a3d" : "#e2e8f0",
                    color: darkMode ? "#f8fafc" : "#1e293b",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#10b981";
                    e.currentTarget.style.backgroundColor = darkMode ? "#172033" : "#ecfdf5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = darkMode ? "#232a3d" : "#e2e8f0";
                    e.currentTarget.style.backgroundColor = darkMode ? "#141824" : "#f8fafc";
                  }}
                >
                  <div>
                    <span className="fw-semibold d-block">{opt.label}</span>
                    <small className="opacity-50">{opt.desc}</small>
                  </div>
                  <span className="badge badge-soft-secondary font-monospace">+{opt.value}</span>
                </button>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            >
              &larr; Pertanyaan Sebelumnya
            </button>
            <small className="opacity-50">Pertanyaan {currentStep + 1} / {questions.length}</small>
          </div>
        </div>
      ) : (
        /* HASIL SKRINING COMPLETED */
        <div className="animate-fade-in py-3">
          <div
            className="p-4 rounded-4 text-center mb-4"
            style={{
              backgroundColor: darkMode ? "#131724" : "#f8fafc",
              border: `1px solid ${result.color}33`,
            }}
          >
            <div className="fs-1 mb-2">{result.icon}</div>
            <span className={`badge ${result.badgeClass} px-3 py-2 fs-6 rounded-pill mb-2`}>
              {result.level}
            </span>
            <h3 className="fw-bold my-2">
              Skor Evaluasi: <span style={{ color: result.color }}>{totalScore}</span> / 18
            </h3>
            <p className="opacity-75 max-w-2xl mx-auto mb-3" style={{ maxWidth: "600px" }}>
              {result.description}
            </p>

            <div
              className="p-3 rounded-3 text-start mx-auto d-inline-block"
              style={{
                backgroundColor: darkMode ? "#1c2236" : "#ffffff",
                border: darkMode ? "1px solid #28314a" : "1px solid #e2e8f0",
                maxWidth: "650px",
              }}
            >
              <div className="d-flex align-items-start gap-2">
                <span className="fs-5">💡</span>
                <div>
                  <strong className="d-block small">Rekomendasi Tim Medis RSJ Tampan:</strong>
                  <span className="small opacity-75">{result.recommendation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AKSI SETELAH SKRINING */}
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-3">
            <button
              type="button"
              className="btn btn-outline-secondary px-4 py-2"
              onClick={handleReset}
            >
              🔄 Ulangi Skrining
            </button>
            <button
              type="button"
              className="btn btn-success px-4 py-2 fw-semibold shadow-sm"
              onClick={onConsultClick}
            >
              👨‍⚕️ Buat Jadwal Konsultasi Dokter &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
