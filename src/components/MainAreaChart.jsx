import React, { useState } from "react";
import { chart30DaysData } from "../data/analyticsData";

export default function MainAreaChart({
  darkMode,
  timeRange = "30d",
  setTimeRange = () => {},
}) {
  const [hoverIndex, setHoverIndex] = useState(null);

  // Data slicing based on timeRange
  const data =
    timeRange === "7d"
      ? chart30DaysData.slice(-7)
      : timeRange === "90d"
      ? chart30DaysData
      : chart30DaysData;

  const width = 900;
  const height = 320;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  // Nilai Max Y: 140k
  const maxY = 140;

  // Hitung koordinat titik data
  const pointsSeries1 = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1 || 1)) * chartW;
    const y = paddingTop + chartH - (d.series1 / maxY) * chartH;
    return { x, y, val: d.series1, date: d.date };
  });

  const pointsSeries2 = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1 || 1)) * chartW;
    const y = paddingTop + chartH - (d.series2 / maxY) * chartH;
    return { x, y, val: d.series2, date: d.date };
  });

  // Buat kurva Bézier halus untuk Series 1
  let pathD1 = `M ${pointsSeries1[0]?.x || 0} ${pointsSeries1[0]?.y || 0}`;
  for (let i = 0; i < pointsSeries1.length - 1; i++) {
    const p0 = pointsSeries1[i];
    const p1 = pointsSeries1[i + 1];
    const midX = (p0.x + p1.x) / 2;
    pathD1 += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  const areaD1 = `${pathD1} L ${
    pointsSeries1[pointsSeries1.length - 1]?.x || 0
  } ${paddingTop + chartH} L ${paddingLeft} ${paddingTop + chartH} Z`;

  // Buat kurva Bézier halus untuk Series 2
  let pathD2 = `M ${pointsSeries2[0]?.x || 0} ${pointsSeries2[0]?.y || 0}`;
  for (let i = 0; i < pointsSeries2.length - 1; i++) {
    const p0 = pointsSeries2[i];
    const p1 = pointsSeries2[i + 1];
    const midX = (p0.x + p1.x) / 2;
    pathD2 += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  const areaD2 = `${pathD2} L ${
    pointsSeries2[pointsSeries2.length - 1]?.x || 0
  } ${paddingTop + chartH} L ${paddingLeft} ${paddingTop + chartH} Z`;

  const yTicks = [140, 105, 70, 35];

  const hoveredData = hoverIndex !== null ? data[hoverIndex] : null;
  const hoveredPoint1 = hoverIndex !== null ? pointsSeries1[hoverIndex] : null;
  const hoveredPoint2 = hoverIndex !== null ? pointsSeries2[hoverIndex] : null;

  return (
    <div
      className="p-4 rounded-4 shadow-sm mb-4 position-relative"
      style={{
        backgroundColor: darkMode ? "#0c101a" : "#ffffff",
        border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
        color: darkMode ? "#ffffff" : "#0f172a",
      }}
    >
      {/* HEADER GRAFIK */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h5
              className="fw-bold mb-0"
              style={{
                letterSpacing: "-0.02em",
                color: darkMode ? "#ffffff" : "#0f172a",
              }}
            >
              Tren Distribusi Obat & Pelayanan Pasien
            </h5>
            <span className="badge badge-soft-success small">Real-time</span>
          </div>
          <span
            className="small"
            style={{ color: darkMode ? "#8e94a4" : "#64748b" }}
          >
            Periode: 23 Jul &ndash; 21 Agu 2026 • Terintegrasi SIM-RS Farmasi
          </span>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-3">
          {/* TIME RANGE SELECTOR PILLS */}
          <div
            className="d-flex p-1 rounded-pill"
            style={{
              backgroundColor: darkMode ? "#141828" : "#f1f5f9",
              border: darkMode ? "1px solid #20273a" : "1px solid #e2e8f0",
            }}
          >
            {["7d", "30d", "90d"].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`btn btn-sm rounded-pill px-3 py-0 border-0 ${
                  timeRange === r
                    ? "bg-success text-white fw-semibold shadow-sm"
                    : "text-muted bg-transparent"
                }`}
                style={{ fontSize: "0.75rem" }}
              >
                {r === "7d" ? "7 Hari" : r === "30d" ? "30 Hari" : "90 Hari"}
              </button>
            ))}
          </div>

          {/* LEGENDA WARNA */}
          <div className="d-flex align-items-center gap-3 small">
            <span className="d-flex align-items-center gap-1">
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#d9f99d",
                  display: "inline-block",
                }}
              ></span>
              <span className="opacity-75">Kebutuhan Pelayanan</span>
            </span>
            <span className="d-flex align-items-center gap-1">
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#f59e0b",
                  display: "inline-block",
                }}
              ></span>
              <span className="opacity-75">Distribusi Obat</span>
            </span>
          </div>
        </div>
      </div>

      {/* CHART SVG CONTAINER */}
      <div style={{ width: "100%", overflowX: "auto", position: "relative" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{
            width: "100%",
            height: "auto",
            minWidth: "600px",
            display: "block",
          }}
          onMouseLeave={() => setHoverIndex(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = ((e.clientX - rect.left) / rect.width) * width;
            if (mouseX >= paddingLeft && mouseX <= paddingLeft + chartW) {
              const fraction = (mouseX - paddingLeft) / chartW;
              const idx = Math.round(fraction * (data.length - 1));
              setHoverIndex(Math.max(0, Math.min(data.length - 1, idx)));
            }
          }}
        >
          <defs>
            {/* Gradient untuk Series 1 */}
            <linearGradient id="main-grad-series1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d9f99d" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#a3e635" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#65a30d" stopOpacity="0.0" />
            </linearGradient>

            {/* Gradient untuk Series 2 */}
            <linearGradient id="main-grad-series2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#d97706" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* GARIS GRID & LABEL SUMBU Y */}
          {yTicks.map((val) => {
            const yPos = paddingTop + chartH - (val / maxY) * chartH;
            return (
              <g key={val}>
                <text
                  x={paddingLeft - 12}
                  y={yPos + 4}
                  textAnchor="end"
                  fill={darkMode ? "#62687a" : "#94a3b8"}
                  fontSize="11"
                  fontWeight="500"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {val}k
                </text>
                <line
                  x1={paddingLeft}
                  y1={yPos}
                  x2={paddingLeft + chartW}
                  y2={yPos}
                  stroke={darkMode ? "#181d2c" : "#f1f5f9"}
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* BASELINE BAWAH */}
          <line
            x1={paddingLeft}
            y1={paddingTop + chartH}
            x2={paddingLeft + chartW}
            y2={paddingTop + chartH}
            stroke={darkMode ? "#242a3a" : "#e2e8f0"}
            strokeWidth="1.2"
          />

          {/* AREA 1 (KUNING-LIME) */}
          <path d={areaD1} fill="url(#main-grad-series1)" />

          {/* AREA 2 (ORANYE-AMBER) */}
          <path d={areaD2} fill="url(#main-grad-series2)" />

          {/* LINE 1 */}
          <path
            d={pathD1}
            fill="none"
            stroke="#a3e635"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* LINE 2 */}
          <path
            d={pathD2}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* HOVER VERTICAL GUIDE & POINTER DOTS */}
          {hoverIndex !== null && hoveredPoint1 && hoveredPoint2 && (
            <g>
              <line
                x1={hoveredPoint1.x}
                y1={paddingTop}
                x2={hoveredPoint1.x}
                y2={paddingTop + chartH}
                stroke={darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />

              {/* Dot Series 1 */}
              <circle
                cx={hoveredPoint1.x}
                cy={hoveredPoint1.y}
                r="5"
                fill="#a3e635"
                stroke="#0c101a"
                strokeWidth="2"
              />

              {/* Dot Series 2 */}
              <circle
                cx={hoveredPoint2.x}
                cy={hoveredPoint2.y}
                r="5"
                fill="#f59e0b"
                stroke="#0c101a"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* INTERACTIVE TOOLTIP */}
        {hoverIndex !== null && hoveredData && hoveredPoint1 && (
          <div
            style={{
              position: "absolute",
              left: `${(hoveredPoint1.x / width) * 100}%`,
              top: "15%",
              transform: "translate(-50%, -100%)",
              backgroundColor: darkMode ? "#161b2c" : "#ffffff",
              color: darkMode ? "#ffffff" : "#0f172a",
              padding: "8px 12px",
              borderRadius: "8px",
              border: darkMode ? "1px solid #2d3652" : "1px solid #cbd5e1",
              boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
              pointerEvents: "none",
              fontSize: "0.78rem",
              zIndex: 10,
              minWidth: "160px",
            }}
          >
            <div className="fw-bold mb-1 border-bottom pb-1 opacity-75">
              📅 {hoveredData.date} 2026
            </div>
            <div className="d-flex justify-content-between gap-2 text-warning mb-1">
              <span>Distribusi Obat:</span>
              <b>{hoveredData.series2}k Unit</b>
            </div>
            <div
              className="d-flex justify-content-between gap-2"
              style={{ color: "#a3e635" }}
            >
              <span>Total Pelayanan:</span>
              <b>{hoveredData.series1}k</b>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
