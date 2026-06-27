import { formatXP } from "../utils/formaData.js";
export const renderOverView = (xps, levels, audits) => {
const overview = document.getElementById("overview");

const dashboard = document.createElement("div");
dashboard.className = "dashboard-container";

  const total = audits.up + audits.down;
  const ratio = audits.up / total;
  const dash = 2 * Math.PI * 54; // circle length

  dashboard.innerHTML = `
    <!-- LEVEL -->
 <div class="card metric-card big-metric">
  <div class="card-title">Level</div>
  <div class="metric-value big-value">${levels}</div>
</div>

<div class="card metric-card big-metric">
  <div class="card-title">Total XP</div>
  <div class="metric-value big-value">${formatXP(xps)}</div>
</div>


    <!-- AUDIT CHART -->
    <div class="card metric-card">

      <svg width="180" height="180" viewBox="0 0 120 120">
        <!-- background circle -->
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="#1e2538"
          stroke-width="10"
          fill="none"
        />

     <!-- DOWN (red base) -->
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

<!-- UP (green progress) -->
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

        <text
          x="60"
          y="63"
          text-anchor="middle"
          font-size="14"
          fill="white"
          font-weight="600"
        >
         Ratio

          ${audits.ration.toFixed(2)}
        </text>
      </svg>

      <div class="metric-trend">
        <span class="trend-up">● Up: ${formatXP(audits.up)}</span><br/>
        <span class="trend-down">● Down: ${formatXP(audits.down)}</span>
      </div>
    </div>
  `;

  overview.appendChild(dashboard);
};