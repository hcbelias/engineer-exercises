"use client";

import { useEffect, useRef } from "react";

interface Props {
  title: string;
  data: number[];
  labels: string[];
  color: string;
}

// This component simulates a heavy charting library (like Chart.js or Recharts).
// It uses browser-only APIs (canvas, ResizeObserver) so it CANNOT be a Server Component.
//
// The expensive part: in a real chart library, the import alone adds 200–500KB to your bundle.
// When you lazy-load this via next/dynamic with ssr:false, that weight is moved to a
// separate chunk that loads only when the chart is needed.

export function ChartWrapper({ title, data, labels, color }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Simulate expensive draw operation
    const max = Math.max(...data);
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / data.length - 8;

    ctx.clearRect(0, 0, width, height);

    data.forEach((value, i) => {
      const barHeight = (value / max) * (height - 40);
      const x = i * (barWidth + 8) + 4;
      const y = height - barHeight - 20;

      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = "#374151";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(labels[i] ?? "", x + barWidth / 2, height - 4);
    });
  }, [data, labels, color]);

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 16,
        background: "#fff",
      }}
    >
      <h3 style={{ margin: "0 0 12px", fontSize: 14, color: "#374151" }}>{title}</h3>
      <canvas ref={canvasRef} width={600} height={200} style={{ width: "100%", height: 200 }} />
    </div>
  );
}
