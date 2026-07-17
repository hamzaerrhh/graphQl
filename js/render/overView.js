import { formatXP } from "../utils/formaData.js";

export const renderOverView = (xps, levels, audits) => {
  
  const overview = document.getElementById("overview");
  if (!overview) return;

  // Clear previous content if necessary
  overview.innerHTML = "";

  const dashboard = document.createElement("div");
  dashboard.className = "dashboard-container";

  const total = audits.up + audits.down;
  const ratio = audits.ratio 
  const dash = 2 * Math.PI * 54; // circle circumference

  dashboard.innerHTML = `
    <!-- LEVEL CARD -->
    <div class="card metric-card big-metric">
      <div class="card-title">Level</div>
      <div class="metric-value big-value">${levels}</div>
    </div>

    <!-- TOTAL XP CARD -->
    <div class="card metric-card big-metric">
      <div class="card-title">Total XP</div>
      <div class="metric-value ">${formatXP(xps)}</div>
    </div>

    <!-- AUDIT CHART CARD -->
    <div class="card metric-card chart-metric">
      <div class="card-title">Audit Ratio</div>
      
      <div class="chart-wrapper">
        <svg width="140" height="140" viewBox="0 0 120 120">
          <!-- Background circle -->
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="#1e2538"
            stroke-width="10"
            fill="none"
          />

          <!-- DOWN (magenta base) -->
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="var(--accent-magenta)"
            stroke-width="10"
            fill="none"
            stroke-dasharray="${dash}"
            stroke-dashoffset="0"
          >
            <title>Down: ${formatXP(audits.down)}</title>
          </circle>

          <!-- UP (teal progress) -->
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="var(--accent-teal)"
            stroke-width="10"
            fill="none"
            stroke-dasharray="${dash}"
            stroke-dashoffset="${dash * (1 - ratio)}"
            stroke-linecap="round"
            transform="rotate(-90 60 60)"
          >
            <title>Up: ${formatXP(audits.up)}</title>
          </circle>

          <!-- Center Text Label -->
          <text x="60" y="55" text-anchor="middle" class="svg-label">Ratio</text>
          <!-- Center Text Value -->
          <text x="60" y="76" text-anchor="middle" class="svg-value">
            ${ratio.toFixed(1)}
          </text>
        </svg>
      </div>

      <div class="metric-trend">
        <span class="trend-up"><span class="dot">●</span> Up: ${formatXP(audits.up)}</span>
        <span class="trend-down"><span class="dot">●</span> Down: ${formatXP(audits.down)}</span>
      </div>
    </div>
  `;

  overview.appendChild(dashboard);
};