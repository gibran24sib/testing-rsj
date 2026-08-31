import React, { useId } from "react";

export default function SparklineChart({ data = [], color = "#f59e0b", height = 48 }) {
  const reactId = useId();
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;
  const width = 180;
  const padding = 4;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1 || 1)) * width;
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return { x, y };
  });

  // Buat kurva Bézier halus
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midX = (p0.x + p1.x) / 2;
    pathD += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  // Path area dengan penutupan ke bawah
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;
  const gradientId = `spark-grad-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div style={{ width: "100%", height: `${height}px`, overflow: "hidden" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: "100%", display: "block" }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.45" />
            <stop offset="60%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Fill Area Gradient */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Stroke Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
