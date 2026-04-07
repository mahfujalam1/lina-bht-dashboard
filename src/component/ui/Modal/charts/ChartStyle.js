const STYLE_ID = "growth-charts-style";

export function injectChartStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .growth-charts-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    @media (max-width: 1024px) {
      .growth-charts-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 640px) {
      .growth-charts-grid {
        grid-template-columns: 1fr;
      }
    }
    .growth-chart-card {
      background: #fff;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      padding: 20px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      min-width: 0;
    }
    .growth-chart-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .growth-chart-title {
      font-weight: 600;
      font-size: 15px;
      color: #111827;
    }
    .growth-chart-select {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 4px 10px;
      font-size: 13px;
      color: #374151;
      background: #fff;
      cursor: pointer;
      outline: none;
    }
    .growth-chart-canvas-wrap {
      height: 220px;
      position: relative;
    }
    @media (max-width: 640px) {
      .growth-chart-canvas-wrap {
        height: 180px;
      }
    }
    .growth-chart-legend {
      margin-top: 10px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
    .growth-charts-wrapper {
      font-family: 'DM Sans', sans-serif;
      padding: 24px;
      background: #f9fafb;
      min-height: 100vh;
      box-sizing: border-box;
    }
    @media (max-width: 640px) {
      .growth-charts-wrapper {
        padding: 16px;
      }
    }
  `;
  document.head.appendChild(style);
}
