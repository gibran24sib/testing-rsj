import React, { useEffect } from "react";

export default function ToastNotification({ toast, onClose, darkMode }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const getToastStyle = () => {
    switch (toast.type) {
      case "success":
        return {
          icon: "✅",
          border: "#10b981",
          bg: darkMode ? "#0c1514" : "#f0fdf4",
          color: "#10b981",
        };
      case "danger":
        return {
          icon: "⚠️",
          border: "#f43f5e",
          bg: darkMode ? "#190e14" : "#fff1f2",
          color: "#f43f5e",
        };
      default:
        return {
          icon: "ℹ️",
          border: "#3b82f6",
          bg: darkMode ? "#0e1422" : "#eff6ff",
          color: "#3b82f6",
        };
    }
  };

  const style = getToastStyle();

  return (
    <div
      className="position-fixed bottom-0 end-0 m-4 p-3 rounded-4 shadow-lg d-flex align-items-center gap-3 animate-fade-in"
      style={{
        zIndex: 9999,
        minWidth: "280px",
        maxWidth: "400px",
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      }}
    >
      <span className="fs-4">{style.icon}</span>
      <div className="flex-grow-1">
        <strong className="d-block small" style={{ color: style.color }}>
          {toast.title || "Pemberitahuan Sistem"}
        </strong>
        <span
          className="small opacity-75 d-block"
          style={{ color: darkMode ? "#f8fafc" : "#1e293b", fontSize: "0.78rem" }}
        >
          {toast.message}
        </span>
      </div>
      <button
        type="button"
        className="btn-close btn-sm opacity-50"
        style={{ fontSize: "0.7rem" }}
        onClick={onClose}
      ></button>
    </div>
  );
}
